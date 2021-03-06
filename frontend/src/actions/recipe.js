import * as types from '../actions/ActionTypes'
import API_HOST from '../config'

export const changeServing = serving => ({
  type: types.CHANGE_SERVING,
  payload: serving,
})

export const getRecipe = id => {
  return dispatch => {
    dispatch({
      type: types.GET_RECIPE_REQUEST,
    })
    fetch(`${API_HOST}/recipe/search/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${window
          .localStorage.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: types.GET_RECIPE_SUCCESS,
          payload: data,
        })
      })
      .catch(error => {
        dispatch({
          type: types.GET_RECIPE_FAILED,
        })
        console.log('getRecipe error')
      })
  }
}

export const getRecipeSearch = searchText => {
  return dispatch => {
    fetch(
      `${API_HOST}/recipe/search?name=${searchText}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${window
            .localStorage.token}`,
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: types.GET_RECIPE_SEARCH_SUCCESS,
          payload: data,
        })
      })
      .catch(error => {
        console.log('getRecipeSearch error')
      })
  }
}
