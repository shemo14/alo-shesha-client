import { combineReducers } from 'redux';
import AuthReducer  from './AuthReducer';
import ProfileReducer  from './ProfileReducer';
import CartReducer from './CartReducer';

export default combineReducers({
    auth: AuthReducer,
    profile: ProfileReducer,
    cart: CartReducer,
});