import {
  GET_COMPLAIN,
  GET_COMPLAIN_FAIL,
  GET_COMPLAIN_SUCCESS,
  ADD_NEW_COMPLAIN,
  ADD_COMPLAIN_SUCCESS,
  ADD_COMPLAIN_FAIL,
  UPDATE_COMPLAIN,
  UPDATE_COMPLAIN_SUCCESS,
  UPDATE_COMPLAIN_FAIL,
  DELETE_COMPLAIN,
  DELETE_COMPLAIN_SUCCESS,
  DELETE_COMPLAIN_FAIL,
} from "./actionTypes"

export const getComplain = () => ({
  type: GET_COMPLAIN,
})

export const getComplainSuccess = complain => ({
  type: GET_COMPLAIN_SUCCESS,
  payload: complain,
})

export const addNewComplain = complain => ({
  type: ADD_NEW_COMPLAIN,
  payload: complain,
})

export const addComplainSuccess = complain => ({
  type: ADD_COMPLAIN_SUCCESS,
  payload: complain,
})

export const addComplainFail = error => ({
  type: ADD_COMPLAIN_FAIL,
  payload: error,
})

export const getComplainFail = error => ({
  type: GET_COMPLAIN_FAIL,
  payload: error,
})



export const updateComplain = complain => ({
  type: UPDATE_COMPLAIN,
  payload: complain,
})

export const updateComplainSuccess = complain => ({
  type: UPDATE_COMPLAIN_SUCCESS,
  payload: complain,
})

export const updateComplainFail = error => ({
  type: UPDATE_COMPLAIN_FAIL,
  payload: error,
})

export const deleteComplain = complain => ({
  type: DELETE_COMPLAIN,
  payload: complain,
})

export const deleteComplainSuccess = complain => ({
  type: DELETE_COMPLAIN_SUCCESS,
  payload: complain,
})

export const deleteComplainFail = error => ({
  type: DELETE_COMPLAIN_FAIL,
  payload: error,
})
