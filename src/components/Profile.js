import React, { Component } from 'react';
import {View, Text, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Left, List, ListItem, Input, Form, Label, Item, Picker, FooterTab, Footer, Badge } from 'native-base';
import CONST from "../consts";
import axios from "axios/index";
import { DoubleBounce } from 'react-native-loader';
import {connect} from "react-redux";
import {Spinner} from "../common";
import { ImagePicker } from 'expo';
import Modal from "react-native-modal"
import { MapView, Location } from 'expo'
import { updateProfile } from '../actions/ProfileAction'
import colors from "../consts/colors";



const height = Dimensions.get('window').height;
class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.profile.name,
			country: this.props.profile.country_id,
            city: this.props.profile.city_id,
            email: 'mo7amed.shams3477@gmail.com',
            phone: this.props.profile.phone,
            password: null,
            confirmPassword: null,
            loader: false,
			userImage: null,
			mapModal: null,
			query: '',
			searchResult: null,
			selectedLocation: null,
			userLocation: [],
			initMap: true,
			showToast: false,
            base64: null,
			lat: this.props.profile.lat,
			lng: this.props.profile.lng,
			countries: [],
			cities: [],
        }
    }

	static navigationOptions = () => ({
		drawerLabel: 'الاعدادات',
		drawerIcon: ( <Icon style={{ fontSize: 25, color: colors.yellow }} type={'Entypo'} name={'cog'}/> )
	});

	_pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3],
			base64: true,
		});

		if (!result.cancelled) {
			this.setState({ userImage: result.uri, base64: result.base64 });
		}
	};

	renderLoading(){
		if (this.state.loader){
			return(<Spinner />);
		}

		if (this.state.name === '' || this.state.phone === '' || this.state.city === '' ){
			return (
				<Button block disabled style={{marginTop: 20, marginBottom: 20, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} light>
					<Text style={{color: '#999', fontSize: 17, textAlign: 'center' }}>تعديل</Text>
				</Button>
			);
		}

		return (
			<Button block style={{marginTop: 20, marginBottom: 20, backgroundColor: colors.red, width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center'}} onPress={() => { this.signUp()  }}>
				<Text style={{color: '#fff', fontSize: 17, textAlign: 'center' }}>تعديل</Text>
			</Button>
		);
	}

	async componentDidMount(){
		const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
		const userLocation = { latitude, longitude };
		this.setState({  initMap: false, userLocation });

		console.log(this.state.userLocation.latitude, this.state.userLocation.longitude);
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
			name: item.name,
			address: item.formatted_address,
			latitude: location.lat,
			longitude: location.lng
		};

		this.setState({ searchResult: null, selectedLocation: formattedItem, btnDisabled: false, city: formattedItem.name, lat: formattedItem.latitude, lng: formattedItem.longitude  });

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
			<Button block style={{marginTop: 10, backgroundColor: '#eebc47', width: '100%', height: 40 ,alignSelf: 'center', borderRadius: 0, justifyContent: 'center', bottom: 5}} onPress={() => this.setState({ mapModal: null }) } primary>
				<Text style={{color: '#fff', fontSize: 17, textAlign: 'center'}}>تأكيد</Text>
			</Button>
		);
	}

	// signUp(){
	// 	let msg = '';
	// 	if (this.state.password !== null && this.state.password.length < 6) {
	// 		msg = 'كلمة المرور اقل من ٦ احرف';
	// 	}else if ( this.state.email !== '' && this.state.email !== null && this.state.email.indexOf("@") === -1){
	// 		msg = 'البريد الالكتروني غير صحيح' ;
	// 	}else if (this.state.password !== this.state.confirmPassword){
	// 		msg = 'كلمة المرور و تأكيد كلمة المرور غير متطابق' ;
	// 	}
	//
	// 	if (msg !== ''){
	// 		Toast.show({
	// 			text: msg,
	// 			type: "danger",
	// 			duration: 3000
	// 		});
	//
	// 		return <View/>
	// 	}
	//
	// 	const data = {
	// 		id: this.props.profile.id,
	// 		name: this.state.name,
	// 		phone: this.state.phone === this.props.profile.phone ? null : this.state.phone,
	// 		password: this.state.password,
	// 		city: this.state.city,
	// 		lat: this.state.lat,
	// 		lng: this.state.lng,
	// 		image: this.state.base64,
	// 		email: this.state.email === this.props.profile.email ? null : this.state.email,
	// 		device_id: null,
	// 		mob_maintenance: this.state.mob_maintenance,
	// 		mob_seller: this.state.mob_seller,
	// 		accessories_seller: this.state.accessories_seller,
	// 		sim_card: this.state.sim_card
	// 	};
	//
	// 	this.setState({ loader: true });
	// 	this.props.updateProfile(data);
	//
	// }
	//
	// componentWillReceiveProps(newProps){
	// 	this.setState({ loader: false });
	// }

	componentWillMount() {
		axios.get(CONST.url + 'countries').then(response => {
			this.setState({ countries: response.data.data, key: response.data.value })
		});

		this.getCities(this.state.country);
	}

	getCities(country){
		this.setState({ country });

		axios.post(CONST.url + 'countryCities', { country_id: country }).then(response => {
			this.setState({ cities: response.data.data })
		});
	}

	render(){
        const data = this.props.profile;
		let { userImage } = this.state;

        return(
            <Container>
				<Header style={{ height: 70, backgroundColor: colors.wight, paddingTop: 15 }}>
					<Right style={{ flex: 0 }}>
						<Button transparent onPress={() => this.props.navigation.openDrawer()}>
							<Icon name='menu' style={{ color: colors.gray, fontSize: 30, marginTop: 8, left: -10 }} />
						</Button>
					</Right>
					<Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
					<Text style={{ color: colors.gray, textAlign: 'center', marginRight: 20, fontSize: 18 }}>الملف الشخصي</Text>
					</Body>
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name={'ios-arrow-back'} type='Ionicons' style={{ color: colors.gray, marginTop: 8 }} />
						</Button>
					</Left>
				</Header>
                <Content style={{ padding: 20 }}>
                    <View>
						<TouchableOpacity onPress={this._pickImage} style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 55, padding: 3, width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}>
							{userImage != null ? <Image source={{ uri: userImage }} style={{ width: 100, height: 100, marginTop: 20, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4', marginBottom: 20 }} /> : <Image onPress={this._pickImage} source={{ uri: data.avatar }} style={{ height: 100, width: 100, alignSelf: 'center' ,marginTop: 20, borderRadius: 80, borderWidth: 1, borderColor: '#f4f4f4', marginBottom: 20 }}/> }
						</TouchableOpacity>

                        <View>
                            <Form>
                                <View style={{ marginBottom: 10 }}>
                                    <Label style={{ color: colors.gray, marginBottom: 5, fontSize: 16 }}>الاسم</Label>
                                    <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
										<Icon type='MaterialCommunityIcons' name='pencil-circle' style={{ color: colors.yellow, position: 'absolute', right: -15, fontSize: 30, zIndex: 999 }} />
                                        <Input onChangeText={(name) => this.setState({name})} value={this.state.name} style={{ borderRadius: 6, borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                    </View>
                                </View>

								<View>
									<Text style={{ color: colors.gray, fontSize: 16 }}>الدولة</Text>
									<Item style={{ borderWidth: 1, borderColor: colors.lightgray, height: 35, marginTop: 5, borderRadius: 6, flexDirection: 'row', marginHorizontal: 15, marginLeft: 15 }} regular>
										<Icon type='MaterialCommunityIcons' name='pencil-circle' style={{ color: colors.yellow, position: 'absolute', right: -25, fontSize: 30, zIndex: 999 }} />
										<Picker
											mode="dropdown"
											iosIcon={<Icon name="ios-arrow-down-outline" />}
											style={{ width: undefined }}
											placeholder="الدولة"
											placeholderStyle={{ color: "#bfc6ea" }}
											placeholderIconColor="#007aff"
											selectedValue={this.state.country}
											onValueChange={(country) => this.getCities(country)}
										>
											{
												this.state.countries.map((country, i) => (
													<Picker.Item label={country.name} value={JSON.stringify(country.id)} key={i} />
												))
											}
										</Picker>
									</Item>
								</View>

								<View>
									<Text style={{ color: colors.gray, fontSize: 16 }}>المدينة</Text>
									<Item style={{ borderWidth: 1, padding: 3, borderColor: colors.lightgray, alignSelf: 'flex-start', height: 35, marginTop: 5, borderRadius: 5, marginBottom: 10, flexDirection: 'row', marginHorizontal: 15, marginLeft: 15 }} regular>
										<Icon type='MaterialCommunityIcons' name='pencil-circle' style={{ color: colors.yellow, position: 'absolute', right: -25, fontSize: 30, zIndex: 999 }} />
										<Picker
											mode="dropdown"
											iosIcon={<Icon name="ios-arrow-down-outline" />}
											style={{ width: undefined }}
											placeholder="المدينة"
											placeholderStyle={{ color: "#bfc6ea" }}
											placeholderIconColor="#007aff"
											selectedValue={this.state.city}
											onValueChange={(city) => this.setState({ city })}
										>
											{
												this.state.cities.map((city, i) => (
													<Picker.Item label={ city.name } value={ city.id } key={i} />
												))
											}
										</Picker>
									</Item>
								</View>

                                <View style={{ marginBottom: 10 }} >
									<Label style={{ color: colors.gray, marginBottom: 5, fontSize: 16 }}>الموقع</Label>
									<TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15 }} onPress={() => this.setState({ mapModal: 1 })}>
										<Icon type='MaterialCommunityIcons' name='pencil-circle' style={{ color: colors.yellow, position: 'absolute', right: -15, fontSize: 30, zIndex: 999 }} />
										<Input disabled onChangeText={(city) => this.setState({city})} value={this.state.city} style={{ borderWidth: 1, borderRadius: 6, borderColor: '#eeeeef', textAlign: 'center', height: 35, width: '100%' }}/>
									</TouchableOpacity>
                                </View>

								<View style={{ marginBottom: 10 }}>
									<Label style={{ color: colors.gray, marginBottom: 5, fontSize: 16 }}>الهاتف</Label>
                                    <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
										<Icon type='MaterialCommunityIcons' name='pencil-circle' style={{ color: colors.yellow, position: 'absolute', right: -15, fontSize: 30, zIndex: 999 }} />
										<Input onChangeText={(phone) => this.setState({phone})} value={this.state.phone} style={{ borderRadius: 6, borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                    </View>
								</View>

                                <View style={{ marginBottom: 10 }}>
									<Label style={{ color: colors.gray, marginBottom: 5, fontSize: 16 }}>كلمة المرور</Label>
                                    <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
										<Icon type='MaterialCommunityIcons' name='pencil-circle' style={{ color: colors.yellow, position: 'absolute', right: -15, fontSize: 30, zIndex: 999 }} />
										<Input secureTextEntry onChangeText={(password) => this.setState({password})} style={{ borderRadius: 6, borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                    </View>
                                </View>

                                <View style={{ marginBottom: 10 }}>
									<Label style={{ color: colors.gray, marginBottom: 5, fontSize: 16 }}>تأكيد كلمة المرور</Label>
                                    <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
										<Icon type='MaterialCommunityIcons' name='pencil-circle' style={{ color: colors.yellow, position: 'absolute', right: -15, fontSize: 30, zIndex: 999 }} />
                                        <Input secureTextEntry onChangeText={(confirmPassword) => this.setState({confirmPassword})} style={{ borderRadius: 6, borderWidth: 1, borderColor: '#eeeeef', textAlign: 'center', height: 35, flex: 4 }}/>
                                    </View>
                                </View>
                            </Form>

							<View style={{ marginBottom: 20 }}>
								{ this.renderLoading() }
							</View>
                        </View>

						<Modal isVisible={this.state.mapModal === 1} onBackdropPress={() => this.setState({ mapModal: null })}>
							<View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: (80/100)*height , borderColor: 'rgba(0, 0, 0, 0.1)', }}>
								<Header style={{ backgroundColor: '#437c1a', alignItems: 'center', width: '100%', height: 40, top: -8, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
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
												<Input onChangeText={(query) => this.setState({ query })} onSubmitEditing={() => this.search()} style={{ width: '100%', paddingBottom: 20 }} placeholderStyle={{ color: '#d4d4d4' }} placeholder='حدد موقعك'/>
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
                    </View>
                </Content>
				<Footer>
					<FooterTab style={{ backgroundColor: colors.wight }}>
						<Button vertical onPress={() => this.props.navigation.navigate('home')}>
							<Icon name="home" type='FontAwesome' style={{ color: colors.gray }}/>
							<Text style={{ color: colors.gray }}>الرئيسية</Text>
						</Button>
						<Button vertical onPress={() => this.props.navigation.navigate('orders')}>
							<Icon name="shop" type='Entypo' style={{ color: colors.gray }}/>
							<Text style={{ color: colors.gray }}>طلباتي</Text>
						</Button>
						<Button vertical onPress={() => this.props.navigation.navigate('cart')}>
							<Badge style={{ width: 17, color: colors.red, left: -10, paddingTop: 0 }}><Text style={{ color: colors.wight, textAlign: 'center' }}>{ this.props.count }</Text></Badge>
							<Icon type='Entypo' name="shopping-cart" style={{ color: colors.gray }} />
							<Text style={{ color: colors.gray }}>السلة</Text>
						</Button>
						<Button vertical style={{ backgroundColor: colors.lightgray }} onPress={() => this.props.navigation.navigate('profile')}>
							<Icon name="person" type='MaterialIcons' style={{ color: colors.yellow }} />
							<Text style={{ color: colors.yellow }}>حسابي</Text>
						</Button>
					</FooterTab>
				</Footer>
            </Container>
        )
    }
}


const mapStateToProps = ({ profile, cart }) => {
    return {
		profile: profile.user,
		count: cart.count
    };
};

export default connect(mapStateToProps, { updateProfile })(Profile);