import PostTypes from '../types/postTypes'

export const postReducer = (state = [], action) => {
  switch (action.type) {
    case PostTypes.FETCH_ALL:
      return action.payload

    case PostTypes.CREATE_POST:
      return [...state, action.payload]
    case PostTypes.UPDATE_POST:
      return state.map((post) =>
        post._id === action.payload._id ? action.payload : post
      )
    case PostTypes.DELETE_POST:
      return state.filter((post) => post._id !== action.payload)
    case PostTypes.LIKE_UPDATE:
      return state.map((post) =>
        post._id === action.payload._id ? action.payload : post
      )

    default:
      return state
  }
}
