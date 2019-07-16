import { TFTReducer } from "./reducer";
import { championsSaga } from "./saga";
import { TFTState } from "../types";
import { ISagaModule } from "redux-dynamic-modules-saga";

export const TFTModule: ISagaModule<TFTState> = {
  id: "tft",
  reducerMap: {
    TFT: TFTReducer
  } as any,
  sagas: [championsSaga]
};
