import {
  GET_NEWS_SUCCESS,
  GET_NEWS_FAIL,
  ADD_NEWS_SUCCESS,
  ADD_NEWS_FAIL,
  UPDATE_NEWS_SUCCESS,
  UPDATE_NEWS_FAIL,
  DELETE_NEWS_SUCCESS,
  DELETE_NEWS_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  news: [],
  error: {},
}

const news = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NEWS_SUCCESS:
      return {
        ...state,
        news: action.payload,
      }

    case GET_NEWS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_NEWS_SUCCESS:

      return {
        ...state,
        news: [...state.news, action.payload],
      }

    case ADD_NEWS_FAIL:
      return {
        ...state,
        error: action.payload,
      }


      case UPDATE_NEWS_SUCCESS:
        return {
          ...state,
          news: state.news.map(news =>
            news.id.toString() === action.payload.id.toString()
              ? { news, ...action.payload }
              : news
          ),
        }
  
      case UPDATE_NEWS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_NEWS_SUCCESS:
        return {
          ...state,
          news: state.news.filter(
            news => news.id.toString() !== action.payload.id.toString()
          ),
        }
  
      case DELETE_NEWS_FAIL:
        return {
          ...state,
          error: action.payload,
        }

    default:
      return state
  }
}

export default news
