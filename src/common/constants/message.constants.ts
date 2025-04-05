export enum ApiMessageKey {
  GET_DATA_COUNTRY = 'GET_DATA_COUNTRY',
  GET_DATA_COUNTRIES = 'GET_DATA_COUNTRIES',
  GET_DATA_STATES = 'GET_DATA_STATES',
  GET_DATA_CITIES = 'GET_DATA_CITIES'
}

export const apiMessage: { [key in ApiMessageKey]: string } = {
  [ApiMessageKey.GET_DATA_COUNTRY]: 'Get data country success.',
  [ApiMessageKey.GET_DATA_COUNTRIES]: 'Get data countries success.',
  [ApiMessageKey.GET_DATA_STATES]: 'Get data states success.',
  [ApiMessageKey.GET_DATA_CITIES]: 'Get data cities success.'
};
