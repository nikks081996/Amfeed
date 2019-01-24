import { combineReducers } from 'redux';
import UserDetailsReducers from '../components/screens/home/UserDetailsReducers';
import CurrentUserDetailsReducers from '../components/screens/user/CurrentUserDetailsReducers';

export default combineReducers({
  user: UserDetailsReducers,
  currentUser: CurrentUserDetailsReducers
});
