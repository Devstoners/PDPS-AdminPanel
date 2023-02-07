import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_NEWS, ADD_NEW_NEWS , DELETE_NEWS, UPDATE_NEWS } from "./actionTypes"

import {
  getNewsSuccess,
  getNewsFail,
  addNewsFail,
  addNewsSuccess,
  updateNewsSuccess,
  updateNewsFail,
  deleteNewsSuccess,
  deleteNewsFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getNews, addNewNews, updateNews ,deleteNews } from "../../helpers/fakebackend_helper"

function* fetchNews() {
  try {
    const response = yield call(getNews)
    yield put(getNewsSuccess(response))
  } catch (error) {
    yield put(getNewsFail(error))
  }
}


function* onUpdateNews({ payload: news }) {
  try {
    const response = yield call(updateNews, news)
    yield put(updateNewsSuccess(response))
  } catch (error) {
    yield put(updateNewsFail(error))
  }
}

function* onDeleteNews({ payload: news }) {
  try {
    const response = yield call(deleteNews, news)
    yield put(deleteNewsSuccess(response))
  } catch (error) {
    yield put(deleteNewsFail(error))
  }
}

function* onAddNewNews({ payload: news }) {

  try {
    const response = yield call(addNewNews, news)

    yield put(addNewsSuccess(response))
  } catch (error) {

    yield put(addNewsFail(error))
  }
}

function* newsSaga() {
  yield takeEvery(GET_NEWS, fetchNews)
  yield takeEvery(ADD_NEW_NEWS, onAddNewNews)
  yield takeEvery(UPDATE_NEWS, onUpdateNews)
  yield takeEvery(DELETE_NEWS, onDeleteNews)
}

export default newsSaga;
