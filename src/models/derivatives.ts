export interface IDerivative {
  readonly id?: number;
  readonly date?: string;
  readonly username: string;
  readonly floorBroker?: string;
  readonly wex: string;
  readonly fileName?: string;
  readonly totalCount?: number;
  readonly totalCharge?: number;
  readonly matchedCount: number;
  readonly matchSumCharge?: number;
  readonly unmatchedCount: number;
  readonly unmatchedGroupCount?: number;
  readonly unmatchedSumCharge?: number;
  readonly unmatchedSumPercentage?: number;
  readonly matchedSumPercentage?: number;
  readonly unresolved: string;
}
