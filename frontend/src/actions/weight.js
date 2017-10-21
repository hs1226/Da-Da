import * as types from '../actions/ActionTypes'
import rootApi from '../config'

// 1. db 값 받는 action
export const fetchWeightFromDB = () => {
  return dispatch => {
    fetch(`${rootApi}/diary/kg`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${window
          .localStorage.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: types.FETCHED_WEIGHT_SUCCESS,
          payload: data,
        })
      })
      .catch(error => {
        console.log('fetchWeightLogsToDB error')
      })
  }
}

// 2. input에서 받은 값을 db로 보내는 action(post)
export const postWeightToDB = payload => {
  return dispatch => {
    // console.log(payload)
    fetch(`${rootApi}/diary/kg`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${window
          .localStorage.token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (res.ok) {
          return fetch(`${rootApi}/diary/kg`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${window
                .localStorage.token}`,
            },
          })
            .then(res => res.json())
            .then(data => {
              dispatch({
                type:
                  types.POST_AND_GET_WEIGHT_SUCCESS,
                payload: data,
              })
            })
            .catch(error => {
              console.log(
                'POSTandGETWeightLogsToDB error',
              )
            })
        }
      })
      .catch(error => {
        console.log('postWeightToDB error')
      })
  }
}
