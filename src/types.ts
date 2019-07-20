import { TFTState } from "./routes/TFT/types";

export interface AppState {
  readonly TFT: TFTState;
}

export interface ICollectionLookup<T> {
  readonly byKey: { [key: string]: string };
  readonly byId: { [key: string]: T };
}
