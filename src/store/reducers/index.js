import {combineReducers} from 'redux';
import {formReducer} from '../reducers/fromValues';

export const reducer = combineReducers({
  formValues: formReducer
})