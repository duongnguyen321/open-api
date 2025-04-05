export enum ErrorCode {
  GET_DATA_FAILED = 'GET_DATA_FAILED'
}

export const errorMessage: { [key in ErrorCode]: string } = {
  [ErrorCode.GET_DATA_FAILED]: 'Get data failed, have some error.'
};
