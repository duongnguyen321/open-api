import { ApiResponseDto } from '@/common/classes/response.dto';
import { ApiMessageKey } from '@/common/constants/message.constants';
import { CountryService } from '@/country/country.service';
import { FilterCityDto } from '@/country/dto/filter-city.dto';
import { FilterCountryDto } from '@/country/dto/filter-country.dto';
import { FilterStateDto } from '@/country/dto/filter-state.dto';
import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {
  }

  // @Public()
  // @Get('init')
  // @ApiOperation({
  //   summary: 'Login google callback',
  // })
  // @ApiOkResponse({type: ApiResponseDto<ICountry>})
  // @ApiOperation({summary: 'Handle Google OAuth callback'})
  // async init() {
  //   try {
  //     const data = await this.countryService.importData();
  //     return new ApiResponseDto<ICountry>({
  //       statusCode: HttpStatus.OK,
  //       data: data,
  //       message: ApiMessageKey.GET_DATA_COUNTRY,
  //       pagination: null,
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  @Get('')
  @ApiOperation({ summary: 'Get all countries with filtering options' })
  @ApiResponse({ status: 200, description: 'List of countries with pagination metadata' })
  async getCountries(@Query() filterDto: FilterCountryDto) {
    const data = await this.countryService.getCountries(filterDto);
    return new ApiResponseDto<string>({
      statusCode: HttpStatus.OK,
      data: data.data,
      message: ApiMessageKey.GET_DATA_COUNTRIES,
      pagination: {
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      },
    });
  }

  @Get('states')
    @ApiOperation({ summary: 'Get all states with filtering options' })
  @ApiResponse({ status: 200, description: 'List of states with pagination metadata' })
  async getStates(@Query() filterDto: FilterStateDto) {
    const data = await this.countryService.getStates(filterDto);
    return new ApiResponseDto<string>({
      statusCode: HttpStatus.OK,
      data: data.data,
      message: ApiMessageKey.GET_DATA_STATES,
      pagination: {
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      },
    });
  }

  @Get('cities')
    @ApiOperation({ summary: 'Get all cities with filtering options' })
  @ApiResponse({ status: 200, description: 'List of cities with pagination metadata' })
  async getCities(@Query() filterDto: FilterCityDto) {
    const data = await this.countryService.getCities(filterDto);
    return new ApiResponseDto<string>({
      statusCode: HttpStatus.OK,
      data: data.data,
      message: ApiMessageKey.GET_DATA_CITIES,
      pagination: {
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
      },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get data detail countries' })
  @ApiResponse({ status: 200, description: 'Detail one country' })
  async getCountryWithDetails(@Param('id', ParseIntPipe) id: number) {
    const data = await this.countryService.getCountryWithDetails(id);
    return new ApiResponseDto<string>({
      statusCode: HttpStatus.OK,
      data: data,
      message: ApiMessageKey.GET_DATA_COUNTRY,
      pagination: null,
    });
  }
}
