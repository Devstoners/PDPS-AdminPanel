import {
  GET_COMPLAIN_SUCCESS,
  GET_COMPLAIN_FAIL,
  ADD_COMPLAIN_SUCCESS,
  ADD_COMPLAIN_FAIL,
  UPDATE_COMPLAIN_SUCCESS,
  UPDATE_COMPLAIN_FAIL,
  DELETE_COMPLAIN_SUCCESS,
  DELETE_COMPLAIN_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  complain: [],
  error: {},
}

const complain = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COMPLAIN_SUCCESS:
      return {
        ...state,
        complain: action.payload,
      }

    case GET_COMPLAIN_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_COMPLAIN_SUCCESS:

      return {
        ...state,
        complain: [...state.complain, action.payload],
      }

    case ADD_COMPLAIN_FAIL:
      return {
        ...state,
        error: action.payload,
      }


      case UPDATE_COMPLAIN_SUCCESS:
        return {
          ...state,
          complain: state.complain.map(complain =>
            complain.id.toString() === action.payload.id.toString()
              ? { complain, ...action.payload }
              : complain
          ),
        }
  
      case UPDATE_COMPLAIN_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_COMPLAIN_SUCCESS:
        return {
          ...state,
          complain: state.complain.filter(
            complain => complain.id.toString() !== action.payload.id.toString()
          ),
        }
  
      case DELETE_COMPLAIN_FAIL:
        return {
          ...state,
          error: action.payload,
        }

    default:
      return state
  }
}

export default complain
