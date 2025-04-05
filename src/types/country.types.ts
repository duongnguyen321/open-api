import type { City, Country, State, Timezone, Translation } from '@prisma/client';

export interface ICity extends Omit<City, 'countryId'|'stateId'> {
  countryId?: number;
  stateId?: number;
}

export interface IState extends Omit<State, 'countryId'> {
  cities?: ICity[];
  countryId?: number;
}

export interface ICountry extends Country {
  states?: IState[];
  translations?: Translation;
  timezones?: Timezone[];
}
