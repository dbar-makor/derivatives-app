import { IDerivative } from "./derivatives";
import { IServerResponseData } from "./shared/response";

export interface IGetDerivativesResponse extends IServerResponseData {
  readonly data?: Pick<
    IDerivative,
    | "id"
    | "date"
    | "username"
    | "wex"
    | "matchedCount"
    | "matchedSumPercentage"
    | "unmatchedCount"
    | "unresolved"
  >[];
}

export interface IGetDerivativeResponse extends IServerResponseData {
  readonly data?: Pick<
    IDerivative,
    | "wex"
    | "fileName"
    | "username"
    | "totalCount"
    | "totalCharge"
    | "matchedCount"
    | "matchSumCharge"
    | "matchedSumPercentage"
    | "unmatchedCount"
    | "unmatchedGroupCount"
    | "unmatchedSumCharge"
    | "unmatchedSumPercentage"
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
