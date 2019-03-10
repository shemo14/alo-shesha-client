import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Permissions } from 'expo'
import {AsyncStorage, BackHandler} from "react-native";


class InitScreen extends Component{
    constructor(props){
        super(props);
    }


    componentWillMount = async () => {
        // AsyncStorage.clear();
        if (this.props.user !== null && this.props.auth.value !== '0')
            this.props.navigation.navigate('drawerNavigation');
        else
            this.props.navigation.navigate('loginOrRegister');

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

    };

    render(){
        return false;
    }
}



const mapStateToProps = ({ auth, profile }) => {
    return {
        message: auth.message,
        loading: auth.loading,
        auth: auth.user,
        user: profile.user
    };
};
export default connect(mapStateToProps)(InitScreen);