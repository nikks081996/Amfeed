import { combineReducers } from 'redux';
import UserDetailsReducers from './UserDetailsReducers';

export default combineReducers({
  user: UserDetailsReducers
});
