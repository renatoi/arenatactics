import { all, call, put, takeEvery } from "redux-saga/effects";
import {
  Actions,
  gameDataLoaded,
  IGameDataFetch,
  ILocalizedStringsFetch,
  localizedStringsLoaded
} from "./actions";

export function* localizedStringsSaga() {
  yield takeEvery(Actions.LocalizedStringsFetch, localizedStringsFetch);
}
function* localizedStringsFetch(action: ILocalizedStringsFetch) {
  const response = yield call(fetch, `/i18n/${action.locale}.json`);
  const json = yield call([response, response.json]);
  yield put(localizedStringsLoaded(json));
}

export function* gameDataSaga() {
  yield takeEvery(Actions.GameDataFetch, gameDataFetch);
}
function* gameDataFetch(action: IGameDataFetch) {
  const response = yield call(fetch, `/data/tft-${action.locale}.json`);
  const json = yield call([response, response.json]);
  yield put(gameDataLoaded(json));
}

export default function* rootSaga() {
  yield all([localizedStringsSaga(), gameDataSaga()]);
}
