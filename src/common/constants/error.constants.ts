export enum ErrorCode {
  GET_DATA_FAILED = 'GET_DATA_FAILED',
  CAN_NOT_FIND_DATA = 'CAN_NOT_FIND_DATA',
  CREATE_OTP_FAILED = 'CREATE_OTP_FAILED',
  INVALID_OTP = 'INVALID_OTP',
}

export const errorMessage: { [key in ErrorCode]: string } = {
  [ErrorCode.GET_DATA_FAILED]: 'Get data failed, have some error.',
  [ErrorCode.CAN_NOT_FIND_DATA]: 'Can not find data, please try again later.',
  [ErrorCode.CREATE_OTP_FAILED]: 'Create OTP failed, please try again later.',
  [ErrorCode.INVALID_OTP]: 'Invalid or expired OTP, please try again.',
};
