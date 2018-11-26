import { combineReducers } from 'redux';
import UserDetailsReducers from './UserDetailsReducers';
import CurrentUserDetailsReducers from './CurrentUserDetailsReducers';

export default combineReducers({
  user: UserDetailsReducers,
  currentUser: CurrentUserDetailsReducers
});
