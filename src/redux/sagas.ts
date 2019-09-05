import { all, call, put, takeEvery } from "redux-saga/effects";
import { Actions, gameDataLoaded, IGameDataFetch } from "./actions";

export function* gameDataSaga() {
  yield takeEvery(Actions.GameDataFetch, gameDataFetch);
}
function* gameDataFetch(action: IGameDataFetch) {
  const response = yield call(fetch, `/data/tft-${action.locale}.json`);
  const json = yield call([response, response.json]);
  yield put(gameDataLoaded(json));
}

export default function* rootSaga() {
  yield all([gameDataSaga()]);
}
