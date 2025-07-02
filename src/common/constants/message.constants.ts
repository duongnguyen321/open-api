export enum ApiMessageKey {
  GET_DATA_COUNTRY = 'GET_DATA_COUNTRY',
  GET_DATA_COUNTRIES = 'GET_DATA_COUNTRIES',
  GET_DATA_STATES = 'GET_DATA_STATES',
  GET_DATA_CITIES = 'GET_DATA_CITIES',
  OTP_CREATED = 'OTP_CREATED',
  OTP_VERIFIED = 'OTP_VERIFIED',
  GET_ALL_EMAILS = 'GET_ALL_EMAILS',
}

export const apiMessage: { [key in ApiMessageKey]: string } = {
  [ApiMessageKey.GET_DATA_COUNTRY]: 'Get data country success.',
  [ApiMessageKey.GET_DATA_COUNTRIES]: 'Get data countries success.',
  [ApiMessageKey.GET_DATA_STATES]: 'Get data states success.',
  [ApiMessageKey.GET_DATA_CITIES]: 'Get data cities success.',
  [ApiMessageKey.OTP_CREATED]: 'OTP created successfully. Please check your email.',
  [ApiMessageKey.OTP_VERIFIED]: 'OTP is valid. You can proceed with the next steps.',
  [ApiMessageKey.GET_ALL_EMAILS]: 'Get all emails successfully.',
};
