import rawCountryData from '@/common/initial/country/countries.json';
import { FilterCityDto } from '@/country/dto/filter-city.dto';
import { FilterCountryDto } from '@/country/dto/filter-country.dto';
import { FilterStateDto } from '@/country/dto/filter-state.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import type { ICountry } from '@/types/country.types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// @ts-ignore
const countryData: ICountry[] = Array.isArray(rawCountryData) ? rawCountryData : Object.values(rawCountryData);

@Injectable()
export class CountryService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {
  }

  async importData() {
    try {
      console.log('Starting data import process...');
      console.log(`Found ${countryData.length} countries to import`);

      let totalStates = 0;
      let totalCities = 0;
      const errors: string[] = [];

      // Use transaction for data integrity
      await this.prisma.$transaction(async (tx) => {
        // Clear existing data
        await tx.city.deleteMany({});
        await tx.state.deleteMany({});
        await tx.timezone.deleteMany({});
        await tx.translation.deleteMany({});
        await tx.country.deleteMany({});
        console.log('Existing data cleared');

        for (const country of countryData) {
          try {
            // Create country
            console.log(`Importing country: ${country.name}`);
            const createdCountry = await tx.country.create({
              data: {
                name: country.name,
                iso3: country.iso3,
                iso2: country.iso2,
                numeric_code: country.numeric_code,
                phonecode: country.phonecode,
                capital: country.capital,
                currency: country.currency,
                currency_name: country.currency_name,
                currency_symbol: country.currency_symbol,
                tld: country.tld,
                native: country.native,
                region: country.region,
                region_id: country.region_id,
                subregion: country.subregion,
                subregion_id: country.subregion_id,
                nationality: country.nationality,
                latitude: country.latitude,
                longitude: country.longitude,
                emoji: country.emoji,
                emojiU: country.emojiU,
              },
            });

            // Cache country data in Redis
            await this.redis.set(`country:${createdCountry.id}`, JSON.stringify(createdCountry), '1 month');

            // Create timezones
            if (country.timezones?.length) {
              console.log(`Creating ${country.timezones.length} timezones for country: ${country.name}`);
              await tx.timezone.createMany({
                data: country.timezones.map(tz => ({
                  zoneName: tz.zoneName,
                  gmtOffset: tz.gmtOffset,
                  gmtOffsetName: tz.gmtOffsetName,
                  abbreviation: tz.abbreviation,
                  tzName: tz.tzName,
                  countryId: createdCountry.id,
                })),
              });

              // Cache timezones in Redis
              await this.redis.set(`country:${createdCountry.id}:timezones`, JSON.stringify(country.timezones), '1 month');
            }

            // Create translation
            if (country.translations) {
              console.log(`Creating translations for country: ${country.name}`);
              await tx.translation.create({
                data: {
                  ko: country.translations.ko,
                  ptBR: country.translations['pt-BR'],
                  pt: country.translations.pt,
                  nl: country.translations.nl,
                  hr: country.translations.hr,
                  fa: country.translations.fa,
                  de: country.translations.de,
                  es: country.translations.es,
                  fr: country.translations.fr,
                  ja: country.translations.ja,
                  it: country.translations.it,
                  zhCN: country.translations['zh-CN'],
                  tr: country.translations.tr,
                  ru: country.translations.ru,
                  uk: country.translations.uk,
                  pl: country.translations.pl,
                  countryId: createdCountry.id,
                },
              });

              // Cache translations in Redis
              await this.redis.set(`country:${createdCountry.id}:translations`, JSON.stringify(country.translations), '1 month');
            }

            // Create states and cities
            if (country.states?.length) {
              console.log(`Creating ${country.states.length} states for country: ${country.name}`);
              for (const state of country.states) {
                const createdState = await tx.state.create({
                  data: {
                    name: state.name,
                    state_code: state.state_code,
                    latitude: state.latitude,
                    longitude: state.longitude,
                    type: state.type,
                    countryId: createdCountry.id,
                  },
                });

                totalStates++;

                // Cache state data in Redis
                await this.redis.set(`state:${createdState.id}`, JSON.stringify(createdState), '1 month');

                // Create cities for this state
                if (state.cities?.length) {
                  console.log(`Creating ${state.cities.length} cities for state: ${state.name}`);
                  await tx.city.createMany({
                    data: state.cities.map(city => ({
                      name: city.name,
                      latitude: city.latitude,
                      longitude: city.longitude,
                      stateId: createdState.id,
                    })),
                  });

                  totalCities += state.cities.length;

                  // Cache cities for this state in Redis
                  await this.redis.set(`state:${createdState.id}:cities`, JSON.stringify(state.cities), '1 month');
                }
              }
            }
          } catch (error) {
            errors.push(`Error importing ${country.name}: ${error.message}`);
            console.error(`Error importing ${country.name}:`, error);
          }
        }
      }, {
        timeout: 120000000, // Increase to 30 seconds or higher as needed
        maxWait: 120000, // Maximum amount of time to wait to acquire transaction
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // Choose appropriate isolation level
      });

      // Invalidate general Redis cache
      console.log('Invalidating general Redis cache...');
      await this.redis.del('all_countries');
      await this.redis.del('countries_list');
      console.log('Data import process complete');

      return {
        countries: countryData.length,
        states: totalStates,
        cities: totalCities,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error('Fatal error during data import:', error.message);
      throw error;
    }
  }
// Function to get countries with filtering
  async getCountries(filterDto: FilterCountryDto) {
    const { name, iso3, iso2, currency, capital, region, subregion, nationality, q, page, limit } = filterDto;

    // Generate cache key based on query parameters
    const cacheKey = `countries:${JSON.stringify(filterDto)}`;

    return this.redis.cached(cacheKey, '1 month', async () => {
      // Build WHERE conditions
      const where: any = {};

      // Handle specific field filters
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (iso3) where.iso3 = iso3.toUpperCase();
      if (iso2) where.iso2 = iso2.toUpperCase();
      if (currency) where.currency = { contains: currency, mode: 'insensitive' };
      if (capital) where.capital = { contains: capital, mode: 'insensitive' };
      if (region) where.region = { contains: region, mode: 'insensitive' };
      if (subregion) where.subregion = { contains: subregion, mode: 'insensitive' };
      if (nationality) where.nationality = { contains: nationality, mode: 'insensitive' };

      // Handle general search query
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { iso3: { contains: q, mode: 'insensitive' } },
          { iso2: { contains: q, mode: 'insensitive' } },
          { capital: { contains: q, mode: 'insensitive' } },
          { currency: { contains: q, mode: 'insensitive' } },
          { currency_name: { contains: q, mode: 'insensitive' } },
          { region: { contains: q, mode: 'insensitive' } },
          { subregion: { contains: q, mode: 'insensitive' } },
          { nationality: { contains: q, mode: 'insensitive' } },
        ];
      }

      // Get total count for pagination
      const total = await this.prisma.country.count({ where });

      // Get countries with pagination
      const data = await this.prisma.country.findMany({
        where,
        skip: page * limit,
        take: limit,
        orderBy: { name: 'asc' },
      });

      return {
        data,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
      };
    });
  }

  // Function to get states with filtering
  async getStates(filterDto: FilterStateDto) {
    const { name, state_code, type, countryId, q, page, limit } = filterDto;

    // Generate cache key based on query parameters
    const cacheKey = `states:${JSON.stringify(filterDto)}`;

    return this.redis.cached(cacheKey, '1 month', async () => {
      // Build WHERE conditions
      const where: any = {};

      // Handle specific field filters
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (state_code) where.state_code = { contains: state_code, mode: 'insensitive' };
      if (type) where.type = { contains: type, mode: 'insensitive' };
      if (countryId) where.countryId = parseInt(countryId);

      // Handle general search query
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { state_code: { contains: q, mode: 'insensitive' } },
          { type: { contains: q, mode: 'insensitive' } },
        ];
      }

      // Get total count for pagination
      const total = await this.prisma.state.count({ where });

      // Get states with pagination
      const data = await this.prisma.state.findMany({
        where,
        skip: page * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          country: {
            select: {
              id: true,
              name: true,
              iso3: true,
              iso2: true,
            }
          }
        }
      });

      return {
        data,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
      };
    });
  }

  // Function to get cities with filtering
  async getCities(filterDto: FilterCityDto) {
    const { name, stateId, q, page, limit } = filterDto;

    // Generate cache key based on query parameters
    const cacheKey = `cities:${JSON.stringify(filterDto)}`;

    return this.redis.cached(cacheKey, '1 month', async () => {
      // Build WHERE conditions
      const where: any = {};

      // Handle specific field filters
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (stateId) where.stateId = parseInt(stateId);

      // Handle general search query
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
        ];
      }

      // Get total count for pagination
      const total = await this.prisma.city.count({ where });

      // Get cities with pagination
      const data = await this.prisma.city.findMany({
        where,
        skip: page * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          state: {
            select: {
              id: true,
              name: true,
              state_code: true,
              country: {
                select: {
                  id: true,
                  name: true,
                  iso3: true,
                  iso2: true,
                }
              }
            }
          }
        }
      });

      return {
        data,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
      };
    });
  }

  // Get a specific country by id with its states and cities
  async getCountryWithDetails(id: number) {
    const cacheKey = `country:${id}:details`;

    return this.redis.cached(cacheKey, '1 month', async () => {
      return this.prisma.country.findUnique({
        where: { id },
        include: {
          states: {
            include: {
              cities: true
            }
          },
          timezones: true,
          translations: true
        }
      });
    });
  }
}
