import * as types from './ActionTypes'
import { SERVER_HOSTNAME } from '../config'

export const getRegretFromDB = date => {
  return dispatch => {
    dispatch({
      type: types.GET_REGRET_REQUEST,
    })
    fetch(
      `${SERVER_HOSTNAME}/regret?date=${date}`,
      {
        method: 'GET',
        header: {
          Authorization: `Bearer ${window
            .localStorage.token}`,
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: types.GET_REGRET_SUCCESS,
          payload: [...data],
        })
      })
      .catch(error => {
        dispatch({
          type: types.GET_REQUEST_FAILED,
        })
      })
  }
}

export const postRegretToDB = requestBody => {
  return dispatch => {
    return fetch(`${SERVER_HOSTNAME}/regret`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
      .then(res => res.json())
      .then(result => {
        console.log(result)
        dispatch({
          type: types.POST_REGRET_TO_DATABASE,
          payload: result,
        })
      })
      .catch(res => {
        console.log(res)
      })
  }
}

export const getCommentFromDB = date => {
  return dispatch => {
    dispatch({
      type: types.GET_COMMENT_REQUEST,
    })
    fetch(
      `${SERVER_HOSTNAME}/comment?date=${date}`,
      {
        method: 'GET',
        header: {
          Authorization: `Bearer ${window
            .localStorage.token}`,
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: types.GET_COMMENT_SUCCESS,
          payload: [...data],
        })
      })
      .catch(error => {
        dispatch({
          type: types.GET_REQUEST_FAILED,
        })
      })
  }
}

export const postCommentToDB = requestBody => {
  return dispatch => {
    return fetch(`${SERVER_HOSTNAME}/comment`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
      .then(res => res.json())
      .then(result => {
        console.log(result)
        dispatch({
          type: types.POST_COMMENT_TO_DATABASE,
          payload: result,
        })
      })
      .catch(res => {
        console.log(res)
      })
  }
}