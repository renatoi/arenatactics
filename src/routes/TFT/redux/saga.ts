import { call, put } from "redux-saga/effects";
import { championsLoaded } from "./actions";

export function* championsSaga() {
  yield call(loadChampionsData);
}

function* loadChampionsData() {
  const url = "/data/tft-champions.json";

  const response = yield call(fetch, url);
  const json = yield call([response, response.json]);

  yield put(championsLoaded(json));
}
