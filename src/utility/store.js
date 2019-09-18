import {createStore} from 'redux';
const initialState = {}
const reducer = (state = initialState, action) => {
  state = initialState
  return action;
}

var store = createStore(reducer);
export default store;
