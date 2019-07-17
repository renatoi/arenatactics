import { call, put } from "redux-saga/effects";
import { tftDataLoaded } from "./actions";

export function* championsSaga() {
  yield call(loadChampionsData);
}

function* loadChampionsData() {
  const url = "/data/tft-en_us.json";

  const response = yield call(fetch, url);
  const json = yield call([response, response.json]);

  yield put(tftDataLoaded(json));
}
