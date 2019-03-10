import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import {Container, Button, Content, Form, Item, Input, Icon, Toast, Right, Body, Left, Header} from 'native-base';
import { Spinner } from '../common'
import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'
import { Permissions, Notifications } from 'expo';
import colors from '../consts/colors'



class Login extends Component{
    constructor(props){
        super(props);
        this.state= {
          phone: '',
          // password: '',
          // passwordError: '',
          token: '',
          phoneError: '',
          showToast: false,
          userId: null
        };
    }


    onLoginPressed() {
		// alert(this.state.token);

        const err = this.validate();
        if (!err){
            this.setState({ loader: true });
            const {phone, token} = this.state;
            this.props.userLogin({ phone, token });
        }

    }


    componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		if (this.state.routeName === 'home'){
			BackHandler.exitApp();
			return true
		}else
			this.goBack();
	};

	goBack(){
		this.props.navigation.goBack();
	}


	async componentWillMount() {

		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;

		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			return;
		}

		let token = await Notifications.getExpoPushTokenAsync();
		this.setState({ token, userId: null })

		// alert(token);
	}

	componentWillReceiveProps(newProps){
        if (newProps.auth !== null && newProps.auth.value === "1"){


            if (this.state.userId === null){
				this.setState({ userId: newProps.auth.data.id });
				this.props.profile(newProps.auth.data.id);
            }

			this.props.navigation.navigate('drawerNavigation');
        }
        
        if (newProps.auth.value == 0) {
			Toast.show({
				text: newProps.auth.msg,
				type: "danger",
				duration: 3000
			});
        }

		this.setState({ loader: false });
    }

    validate = () => {
        let isError = false;
        const errors = {
            phoneError: "",
            // passwordError: ""
        };

        // if (this.state.password.length <= 0) {
        //     isError = true;
        //     errors.passwordError = 'كلمة المرور اقل من 6 احرف';
        // }

        if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
            isError = true;
            errors.phoneError = 'الرجاء ادخال رقم الهاتف الصحيح';
        }

        this.setState({
            ...this.state,
            ...errors
        });

        console.log(isError);
        return isError;
    };


    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }

        return (
            <Button block style={{ position: 'absolute', backgroundColor: colors.red, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 7, justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 1, }} onPress={() => { this.onLoginPressed()  }} primary>
                <Text style={{color: colors.wight, fontSize: 17, textAlign: 'center'}}>دخول</Text>
            </Button>
        );
    }


    render(){
        return(
            <Container style={{ backgroundColor: colors.wight }}>
				<Header style={{ height: 70, backgroundColor: colors.wight, paddingTop: 15 }}>
					<Right style={{ flex: 0 }}>
						<Image resizeMode='center' style={{ width: 100, height: 100, marginTop: 10 }} source={require('../../assets/images/logo_.png')}/>
					</Right>
					<Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }} />
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: colors.gray, marginTop: 10 }} />
						</Button>
					</Left>
				</Header>
                <Content contentContainerStyle={{flexGrow: 1}} style={{ padding: 20 }}>
                    <KeyboardAvoidingView behavior="position">
                        <Text style={{ color: colors.gray, fontSize: 18, marginVertical: 30, fontFamily: 'din_text' }}>تسجيل الدخول</Text>
                        <Form>
                            <View style={{flex: 2}}>
								<Text style={{ color: colors.gray }}>رقم الهاتف</Text>
                                <Item bordered={true} style={{
                                    borderWidth: 1,
                                    borderColor: this.state.phoneError === '' ? colors.lightgray : colors.red,
                                    padding: 3,
                                    alignSelf: 'flex-start',
									backgroundColor: colors.lightgray,
									height: 45,
									marginTop: 10,
									borderRadius: 5
                                }}>
                                    <Input keyboardType='phone-pad' autoCapitalize='none' placeholderStyle={{ textAlign: 'right' }} onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: '#277c19' }} placeholder='رقم الهاتف' value={this.state.phone}/>
                                </Item>
                                <Text style={{
                                    color: '#ff0000',
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>{this.state.phoneError}</Text>

								<View style={{ marginTop: 40 }}>
									{ this.renderLoading() }
								</View>

								<View style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
                                    <Text onPress={() => this.props.navigation.navigate('forgetPassword')} style={{ color: '#8c8c8c', marginBottom: 10, textDecorationLine: "underline" }}>هل نسيت كلمة المرور ؟</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('signUp')}>
                                        <Text style={{ color: '#8c8c8c', textDecorationLine: "underline" }}> ليس لديك حساب ؟ <Text onPress={() => this.props.navigation.navigate('signUp')} style={{ color: colors.red }}>انشاء حساب</Text></Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </Form>
                    </KeyboardAvoidingView>
                </Content>
            </Container>
        )
    }
}



const mapStateToProps = ({ auth, profile }) => {
    return {
        loading: auth.loading,
        auth: auth.user,
        user: profile.user
    };
};
export default connect(mapStateToProps, { userLogin, profile })(Login);