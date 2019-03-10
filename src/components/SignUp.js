import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Icon, Header, Body, List, ListItem, Toast, Right, Left, Picker } from 'native-base';
import { Spinner } from '../common'
import Modal from "react-native-modal"
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader'
import { MapView, Location, Permissions, Notifications } from 'expo'
import { userLogin, profile } from '../actions'
import { connect } from 'react-redux';
import colors from "../consts/colors";

const height = Dimensions.get('window').height;
class SignUp extends Component{
    constructor(props){
        super(props);
        this.state= {
            name: '',
            phone: '',
            email: null,
            password: '',
            lat: '',
            lng: '',
            city: '',
            confirmPassword: '',
            visibleModal: null,
            roles: '',
            mapModal: null,
            query: '',
            searchResult: null,
            selectedLocation: null,
            userLocation: [],
            initMap: true,
            loader: false,
			showToast: false,
            token: '',
			userId: null,
			country: ''
        };
    }

    async locationPermission(){
		await Permissions.askAsync(Permissions.LOCATION);

		const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
		const userLocation = { latitude, longitude };
		this.setState({  initMap: false, userLocation });
        console.log(this.state.userLocation.longitude + ' - ' + this.state.userLocation.longitude);

		await this.setState({mapModal: 1});
    }

    componentWillMount = async () => {
        axios.post(CONST.url + 'condition').then(response => {
            this.setState({ roles: response.data.data })
        })

		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			alert('صلاحيات تحديد موقعك الحالي ملغاه');
		}else {
			const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
			const userLocation = { latitude, longitude };
			this.setState({  initMap: false, userLocation });

        }


		let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
		getCity += this.state.userLocation.latitude + ',' + this.state.userLocation.longitude;
		getCity += '&key=AIzaSyBPftOQyR7e_2mv9MRu-TeNoW2qaOEK0fw&language=ar&sensor=true';


		try {
			const { data } = await axios.get(getCity);
			this.setState({ city: data.results[0].formatted_address });

		} catch (e) {
			console.log(e);
		}

		const formattedItem = {
			name: this.state.city,
			address: this.state.city,
			latitude: this.state.userLocation.latitude,
			longitude: this.state.userLocation.longitude
		};

		this.setState({ selectedLocation: formattedItem });

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
    }



    setModalVisible() {
        this.locationPermission();
    }


    renderLoading(){
        if (this.state.loader){
            return(<Spinner />);
        }
        
        if (this.state.name === '' || this.state.phone === '' || this.state.selectedLocation === null || this.state.password === '' || this.state.confirmPassword === ''){
			return (
				<Button block disabled style={{ width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', backgroundColor: colors.red }} light>
					<Text style={{color: colors.wight, fontSize: 17, textAlign: 'center' }}>التسجيل</Text>
				</Button>
			);
        }

        return (
            <Button block style={{ backgroundColor: colors.red, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.signUp()  }}>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center' }}>التسجيل</Text>
            </Button>
        );
    }

    async componentDidMount(){
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude, longitude };
        this.setState({  initMap: false, userLocation });

    }

    search = async () => {

        let endPoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
        endPoint += this.state.query;
        endPoint += '&key=AIzaSyBPftOQyR7e_2mv9MRu-TeNoW2qaOEK0fw&language=ar';

        try {
            const { data } = await axios.get(endPoint);
            this.setState({ searchResult: data.results });
            console.log(this.state.searchResult)
        } catch (e) {
            console.log(e);
        }
    };

    toggleSearchResult() {
        if (!this.state.searchResult) return;

        return (
            <ScrollView style={{ backgroundColor: '#fff', maxHeight: 200, marginBottom: 20, position: 'absolute', width: '88%', top: 35, left: 40, zIndex: 99999999999 }}>
                <List containerStyle={{ marginHorizontal: 15 }}>
                    {
                        this.state.searchResult.map((item, i) => (
                            <ListItem
                                style={{ paddingHorizontal: 5 }}
                                key={i}
                                onPress={this.setSelectedLocation.bind(this, item)}
                            >
                                <Icon style={{ color: '#ddd', fontSize: 22, marginRight: 5, marginTop: 5 }} type={'Entypo'} name={'location-pin'}/>
                                <Body>
                                <Text>{item.name}</Text>
                                <Text style={{ color: '#999' }}>{item.formatted_address}</Text>
                                </Body>
                            </ListItem>
                        ))
                    }
                </List>
            </ScrollView>
        );
    }

    setSelectedLocation(item) {
        const { geometry: { location } } = item;

        const formattedItem = {
            name: item.formatted_address,
            address: item.formatted_address,
            latitude: location.lat,
            longitude: location.lng
        };

        this.setState({ searchResult: null, selectedLocation: formattedItem, btnDisabled: false });

        this.map.animateToRegion(
            {
                latitude: formattedItem.latitude,
                longitude: formattedItem.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            350
        );
    }

    showMapMarker() {
        if (!this.state.selectedLocation){
						const { latitude, longitude } = this.state.userLocation;
            return (
                <MapView.Marker
                    title={'موقعك الحالي'}
                    image={require('../../assets/images/maps-and-flags.png')}
                    coordinate={{ latitude, longitude }}
                />
            );
        }

        const { latitude, longitude, name } = this.state.selectedLocation;
        return (
            <MapView.Marker
                title={name}
                image={require('../../assets/images/maps-and-flags.png')}
                coordinate={{ latitude, longitude }}
            />
        );
    }


    renderLoader(){
        if (this.state.initMap){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
                    <DoubleBounce size={20} color="#437c1a" />
                </View>
            );
        }

        return (
            <MapView
                ref={map => this.map = map}
                style={{ flex: 1 }}
                initialRegion={{
					latitude: this.state.userLocation.latitude,
					longitude: this.state.userLocation.longitude,
                    latitudeDelta: 0.422,
                    longitudeDelta: 0.121,
                }}
            >
                { this.showMapMarker() }
            </MapView>
        );
    }

    renderLocationSetter(){
        if (this.state.selectedLocation === [] || this.state.selectedLocation === null){
            return(
                <Button block style={{marginTop: 10, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 5}} onPress={() => this.setState({ mapModal: null }) }>
                    <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>اغلاق</Text>
                </Button>
            );
        }

        return (
            <Button block style={{marginTop: 10, backgroundColor: colors.red, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 5}} onPress={() => this.setState({ mapModal: null }) } primary>
                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
            </Button>
        );
    }

    signUp(){
		let msg = '';
    	if (this.state.password.length < 6) {
    		msg = 'كلمة المرور اقل من ٦ احرف';
		}else if ( this.state.email !== '' && this.state.email !== null && this.state.email.indexOf("@") === -1){
			msg = 'البريد الالكتروني غير صحيح' ;
		}else if ( this.state.phone.length <= 0 || this.state.phone.length !== 10){
			msg = 'الرجاء ادخال رقم الهاتف الصحيح' ;
		}else if (this.state.password !== this.state.confirmPassword){
			msg = 'كلمة المرور و تأكيد كلمة المرور غير متطابق' ;
		}

    	if (msg !== ''){
			Toast.show({
				text: msg,
				type: "danger",
				duration: 3000
			});

			return <View/>
		}

    	// alert(this.state.token);

		this.setState({ loader: true });
        axios.post(CONST.url + 'register' ,{
            name: this.state.name,
            phone: this.state.phone,
            password: this.state.password,
            city: this.state.selectedLocation.name,
            lat: this.state.selectedLocation.latitude,
            lng: this.state.selectedLocation.longitude,
            email: this.state.email,
            device_id: Expo.Constants.deviceId
        }).then(response => {
			this.setState({ loader: false });

			if (response.data.key === '1'){
				const {phone, password, token} = this.state;
				this.props.userLogin({ phone, password, token });
			}

			Toast.show({
				text: response.data.massage,
				type: response.data.key === "1" ? "success" : "danger",
				duration: 3000
			});
		}).catch(e => {
			this.setState({ loader: false });
			Toast.show({
				text: 'يوجد خطأ ما الرجاء المحاولة مرة اخري',
				type: "danger",
				duration: 3000
			});
		})
    }

	componentWillReceiveProps(newProps){
		if (newProps.auth !== null && newProps.auth.key === "1"){

			if (this.state.userId === null){
				this.setState({ userId: newProps.auth.data.id });
				this.props.profile(newProps.auth.data.id);
			}

			this.props.navigation.navigate('drawerNavigation');
		}

		if (this.props.profile !== null) {
			Toast.show({
				text: newProps.auth.massage,
				type: newProps.auth.key === "1" ? "success" : "danger",
				duration: 3000
			});
		}

		this.setState({ loader: false });
	}

    render(){

        return(
            <Container style={{ backgroundColor: '#fff' }}>
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
                <Content contentContainerStyle={{flexGrow: 1, padding: 20}}>
					<Text style={{ color: colors.gray, fontSize: 18, marginVertical: 15, fontFamily: 'din_text', fontWeight: 'bold' }}>انشاء حساب جديد</Text>
                        <Form>
							<KeyboardAvoidingView behavior="position">
								<View style={{flex: 2}}>
									<View>
										<Text style={{ color: colors.gray, fontSize: 16 }}>اسم المستخدم</Text>
										<Item style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10 }} regular>
											<Input autoCapitalize='none' placeholderTextColor='#d4d4d4' onChangeText={(name) => this.setState({name})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: colors.gray, height: 32, fontSize: 14 }} placeholder='اسم المستخدم' value={this.state.name}/>
										</Item>
									</View>

									<View>
										<Text style={{ color: colors.gray, fontSize: 16 }}>رقم الهاتف</Text>
										<Item style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10 }} regular>
											<Input keyboardType='phone-pad' autoCapitalize='none' placeholderTextColor='#d4d4d4' onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: colors.gray, height: 32, fontSize: 14 }} placeholder='رقم الهاتف' value={this.state.phone}/>
										</Item>
									</View>

									<View>
										<Text style={{ color: colors.gray, fontSize: 16 }}>الخريطة</Text>
										<Item onPress={() => this.setModalVisible()} style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10 }} regular>
											<Input disabled autoCapitalize='none' placeholderTextColor='#d4d4d4' onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: colors.gray, height: 32, fontSize: 14 }} placeholder='الخريطة' value={ this.state.selectedLocation !== null && this.state.selectedLocation !== [] ? this.state.selectedLocation.name : ''}/>
											<Icon style={{color: colors.gray, fontSize: 20 }} name={'location'} type={'Entypo'}/>
										</Item>
									</View>

									<View>
										<Text style={{ color: colors.gray, fontSize: 16 }}>الدولة</Text>
										<Item style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10 }} regular>
											<Picker
												mode="dropdown"
												iosIcon={<Icon name="ios-arrow-down-outline" />}
												style={{ width: undefined }}
												placeholder="الدولة"
												placeholderStyle={{ color: "#bfc6ea" }}
												placeholderIconColor="#007aff"
												selectedValue={this.state.country}
												onValueChange={(country) => this.setState({ country })}
											>
												<Picker.Item label="مصر" value="key0" />
												<Picker.Item label="المملكة العربية السعودية" value="key1" />
												<Picker.Item label="الامارات" value="key2" />
												<Picker.Item label="الولايات المتحده الامريكية" value="key3" />
												<Picker.Item label="الصين" value="key4" />
											</Picker>
										</Item>
									</View>

									<View>
										<Text style={{ color: colors.gray, fontSize: 16 }}>المدينة</Text>
										<Item style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10 }} regular>
											<Picker
												mode="dropdown"
												iosIcon={<Icon name="ios-arrow-down-outline" />}
												style={{ width: undefined }}
												placeholder="الدولة"
												placeholderStyle={{ color: "#bfc6ea" }}
												placeholderIconColor="#007aff"
												selectedValue={this.state.country}
												onValueChange={(country) => this.setState({ country })}
											>
												<Picker.Item label="القاهره" value="key0" />
												<Picker.Item label="اسكندرية" value="key1" />
												<Picker.Item label="اسيوط" value="key2" />
												<Picker.Item label="المنصوره" value="key3" />
												<Picker.Item label="الغردقة" value="key4" />
											</Picker>
										</Item>
									</View>

									<View>
										<Text style={{ color: colors.gray, fontSize: 16 }}>كلمة المرور</Text>
										<Item style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10 }} regular>
											<Input keyboardType='phone-pad' autoCapitalize='none' placeholderTextColor='#d4d4d4' onChangeText={(password) => this.setState({password})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: colors.gray, height: 32, fontSize: 14 }} placeholder='كلمة المرور' />
										</Item>
									</View>

									<View>
										<Text style={{ color: colors.gray, fontSize: 16 }}>تأكيد كلمة المرور</Text>
										<Item style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10 }} regular>
											<Input keyboardType='phone-pad' autoCapitalize='none' placeholderTextColor='#d4d4d4' onChangeText={(phone) => this.setState({phone})} style={{ alignSelf: 'flex-end', textAlign: 'right', color: colors.gray, height: 32, fontSize: 14 }} placeholder='تأكيد كلمة المرور'/>
										</Item>
									</View>
								</View>
							</KeyboardAvoidingView>

							<View style={{ marginVertical: 10 }}>
								{ this.renderLoading() }
							</View>

							<View style={{justifyContent: 'center', alignItems: 'center', margin: 10}}>
								<TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
									<Text style={{ color: '#8c8c8c', textDecorationLine: "underline" }}> هل تمتلك حساب بالفعل ؟ <Text onPress={() => this.props.navigation.navigate('login')} style={{ color: colors.red }}>تسجيل دخول</Text></Text>
								</TouchableOpacity>
							</View>
                        </Form>

                    <Modal isVisible={this.state.mapModal === 1} onBackdropPress={() => this.setState({ mapModal: null })}>
                        <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: (80/100)*height , borderColor: 'rgba(0, 0, 0, 0.1)', }}>
                            <Header style={{ backgroundColor: colors.blue, alignItems: 'center', width: '100%', height: 40, top: -8, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                                <Body style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20 }}>تحديد الموقع</Text>
                                </Body>
                            </Header>
                            <Content style={{ padding: 10 }}>
                                <View style={{ flex: 1, marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                        <Text style={{ color: '#747474', marginTop: 5, fontSize: 17 }}>موقعك : </Text>
                                        <View style={{ flexDirection: 'row', backgroundColor: '#f4f4f4', borderWidth: 1, height: 35,borderColor: '#ededed', borderRadius: 5, width: '80%' }}>
                                            <Icon style={{ color: '#4a862f', fontSize: 22, marginRight: 5, marginTop: 5 }} type={'Entypo'} name={'location-pin'}/>
                                            <Input value={this.state.city} onChangeText={(query) => this.setState({ query })} onSubmitEditing={() => this.search()} style={{ width: '100%', paddingBottom: 20 }} placeholderStyle={{ color: '#d4d4d4' }} placeholder='حدد موقعك'/>
                                        </View>
                                        { this.toggleSearchResult() }

                                    </View>
                                    <View style={{ borderColor: '#71a768', borderWidth: 1, width: '100%', height: (54/100)*height }}>
                                        { this.renderLoader() }
                                    </View>
                                </View>
                            </Content>

                            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '50%', bottom: 10, paddingTop: 10 }}>
                                { this.renderLocationSetter() }
                            </View>
                        </View>
                    </Modal>
                </Content>
            </Container>
        )
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
export default connect(mapStateToProps, { userLogin, profile })(SignUp);