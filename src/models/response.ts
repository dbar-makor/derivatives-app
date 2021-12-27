import { IDerivative } from "./derivatives";
import { IServerResponseData } from "./shared/response";

export interface IGetDerivativesResponse extends IServerResponseData {
  readonly data?: Pick<
    IDerivative,
    | "id"
    | "date"
    | "username"
    | "wex"
    | "drv"
    | "matched"
    | "unmatched"
    | "complete"
    | "unresolved"
  >[];
}

export interface IGetDerivativeResponse extends IServerResponseData {
  readonly data?: Pick<
    IDerivative,
    | "date"
    | "username"
    | "wex"
    | "drv"
    | "matched"
    | "unmatched"
    | "complete"
    | "unresolved"
  >;
}

export interface ILoginResponse extends IServerResponseData {
  readonly data?: Readonly<{
    token: string;
    username: string;
  }>;
}

export interface IGetFloorBrokersResponse {
  readonly id: number;
  readonly name: string;
  readonly company: string;
}
