import {
  GET_NEWS,
  GET_NEWS_FAIL,
  GET_NEWS_SUCCESS,
  ADD_NEW_NEWS,
  ADD_NEWS_SUCCESS,
  ADD_NEWS_FAIL,
  UPDATE_NEWS,
  UPDATE_NEWS_SUCCESS,
  UPDATE_NEWS_FAIL,
  DELETE_NEWS,
  DELETE_NEWS_SUCCESS,
  DELETE_NEWS_FAIL,
} from "./actionTypes"

export const getNews = () => ({
  type: GET_NEWS,
})

export const getNewsSuccess = news => ({
  type: GET_NEWS_SUCCESS,
  payload: news,
})

export const addNewNews = news => ({
  type: ADD_NEW_NEWS,
  payload: news,
})

export const addNewsSuccess = news => ({
  type: ADD_NEWS_SUCCESS,
  payload: news,
})

export const addNewsFail = error => ({
  type: ADD_NEWS_FAIL,
  payload: error,
})

export const getNewsFail = error => ({
  type: GET_NEWS_FAIL,
  payload: error,
})



export const updateNews = news => ({
  type: UPDATE_NEWS,
  payload: news,
})

export const updateNewsSuccess = news => ({
  type: UPDATE_NEWS_SUCCESS,
  payload: news,
})

export const updateNewsFail = error => ({
  type: UPDATE_NEWS_FAIL,
  payload: error,
})

export const deleteNews = news => ({
  type: DELETE_NEWS,
  payload: news,
})

export const deleteNewsSuccess = news => ({
  type: DELETE_NEWS_SUCCESS,
  payload: news,
})

export const deleteNewsFail = error => ({
  type: DELETE_NEWS_FAIL,
  payload: error,
})
