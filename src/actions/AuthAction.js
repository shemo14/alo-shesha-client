import axios from 'axios';
import { AsyncStorage } from 'react-native';
import CONST from '../consts';

export const userLogin = ({phone, token}) => {
    return (dispatch) => {
        dispatch({type: 'user_login'});

        axios.post( CONST.url + 'customer_login', {phone, device_id: token})
            .then(response => handelLogin(dispatch, response.data))
            .catch(error => console.warn(error.data));
    };
};


export const userLogout = ({ user_id }) => {
	return (dispatch) => {
		dispatch({type: 'user_logout'});

		axios.post( CONST.url + 'logout', { user_id })
			.then(() => {
				AsyncStorage.clear();
			})
			.catch(error => console.warn(error.data));
	};
};


const handelLogin = (dispatch, data) => {
    if (data.value === "0"){
        loginFailed(dispatch, data)
    }else{
        loginSuccess(dispatch, data)
    }
};


const loginSuccess = (dispatch, data) => {
    AsyncStorage.setItem('user_id', JSON.stringify(data.data.id))
        .then(() => dispatch({type: 'login_success', data }));

    dispatch({type: 'login_success', data});
};

const loginFailed = (dispatch, error) => {
    dispatch({type: 'login_failed', error});
};