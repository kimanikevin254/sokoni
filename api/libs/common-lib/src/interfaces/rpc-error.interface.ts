export interface RpcError {
  statusCode: number;
  message: string | string[] | object;
}
