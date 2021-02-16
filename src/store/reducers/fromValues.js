export const formReducer = (formState = {}, action) => {
  if (action.type === 'ADD_VALUES') {
    formState = {...action.payload }
    return formState
  } else {
    return formState
  }
}