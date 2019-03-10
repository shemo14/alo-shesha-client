import React, { Component } from 'react';
import {Image, View, Text, TouchableOpacity, ImageBackground, AsyncStorage, Linking } from 'react-native';
import {Container, Footer, Content, Body } from 'native-base';
import { DrawerItems } from 'react-navigation';
import {connect} from "react-redux";
import axios from 'axios';
import CONST from "../consts";
import colors from "../consts/colors";


class DrawerCustomization extends Component {
    constructor(props){
        super(props);
        this.state={
            user: [],
            lang: 'en',
			site_social: []
        }

        console.log('this fuck cons');
    }

	async logout(){
        console.log('opss');

		axios.post( CONST.url + 'logOut', { user_id: this.props.user.id })
			.catch(error => console.warn(error.data));

		this.props.navigation.navigate('login');
		AsyncStorage.clear();
    }


    // componentWillMount() {
    //     axios.get(CONST.url + 'contact_info').then(response => {
    //         this.setState({ site_social: response.data.data.site_social })
    //     })
	// }


	render(){
        // let { user } = this.props;
        // if (user === null)
        //     user = this.props.auth.data;

        return(
            <Container style={{ overflow: 'visible' }}>
                <View style={{ paddingRight: 10, paddingLeft: 10, marginBottom: 30 }}>
                    <View style={styles.drawerHeader}>
                        <Body style={{ alignItems: 'center' }}>
                            <View style={styles.profileContainer}>
                                <Image style={styles.profileImage} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkuvhFdjtvic1gLSJWvYVEe6facQNox0tL82QWp5c10FZuTz0H' }} />
                                <TouchableOpacity style={styles.authContainer} onPress={() => this.props.navigation.navigate('profile')}>
                                    <Text onPress={() => this.props.navigation.navigate('profile')} style={styles.usernameText}>محمد شمس</Text>
                                </TouchableOpacity>
                            </View>
                        </Body>
                    </View>
                </View>
                <Content>
                    <DrawerItems {...this.props} labelStyle={{color: colors.gray, margin: 10, right: 15}} onItemPress={
                            (route, focused) => {
                                if (route.route.key === 'logout') {
                                    this.logout()
                                }else {
                                    this.props.navigation.navigate(route.route.key);
                                }
                            }
                        }
						// items={this.props.auth !== null && user.provider == 1 ? this.props.items.filter((item) => item.routeName !== 'joinToProvider') : this.props.items.filter((item) => item.routeName !== 'newOrders' && item.routeName !== 'commission')  }
                    />

                </Content>
            </Container>
        );
    }
}


const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerHeader: {
        height: 125,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 60,
    },
    drawerImage: {
        height: 200,
        width: 550,
        position: 'relative',
        left: -10,
    },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    usernameText:{
        color: colors.gray,
        fontWeight: 'bold',
        fontSize: 20,
        height: 25,
        textAlign: 'center'
    },
    authContainer:{
        flexDirection:'row',
        marginTop: 10,
        alignItems: 'center'
    },
    logout:{
        color: '#fff',
    },
    logoutImage: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    logoutContainer:{
        flex: 1,
        flexDirection:'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-end'
    },
};

const mapStateToProps = ({ auth, profile }) => {
    return {
        auth: auth.user,
        user: profile.user
    };
};

export default connect(mapStateToProps)(DrawerCustomization);