import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_COMPLAIN, ADD_NEW_COMPLAIN , DELETE_COMPLAIN, UPDATE_COMPLAIN } from "./actionTypes"

import {
  getComplainSuccess,
  getComplainFail,
  addComplainFail,
  addComplainSuccess,
  updateComplainSuccess,
  updateComplainFail,
  deleteComplainSuccess,
  deleteComplainFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getComplain, addNewComplain, updateComplain ,deleteComplain } from "../../helpers/fakebackend_helper"

function* fetchComplain() {
  try {
    const response = yield call(getComplain)
    yield put(getComplainSuccess(response))
  } catch (error) {
    yield put(getComplainFail(error))
  }
}


function* onUpdateComplain({ payload: complain }) {
  try {
    const response = yield call(updateComplain, complain)
    yield put(updateComplainSuccess(response))
  } catch (error) {
    yield put(updateComplainFail(error))
  }
}

function* onDeleteComplain({ payload: complain }) {
  try {
    const response = yield call(deleteComplain, complain)
    yield put(deleteComplainSuccess(response))
  } catch (error) {
    yield put(deleteComplainFail(error))
  }
}

function* onAddNewComplain({ payload: complain }) {

  try {
    const response = yield call(addNewComplain, complain)

    yield put(addComplainSuccess(response))
  } catch (error) {

    yield put(addComplainFail(error))
  }
}

function* complainSaga() {
  yield takeEvery(GET_COMPLAIN, fetchComplain)
  yield takeEvery(ADD_NEW_COMPLAIN, onAddNewComplain)
  yield takeEvery(UPDATE_COMPLAIN, onUpdateComplain)
  yield takeEvery(DELETE_COMPLAIN, onDeleteComplain)
}

export default complainSaga;
