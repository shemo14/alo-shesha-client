import React, { Component } from 'react';
import {View, Text, Image, Animated, TouchableOpacity, BackHandler, Dimensions, Modal} from 'react-native';
import { Button, Icon, Container, Header, Right, Body, Content, Footer, FooterTab, Left, Card, CardItem, List, ListItem, Radio, Badge } from 'native-base';
import { MapView, Location, Permissions, Notifications } from 'expo'
import { DoubleBounce } from 'react-native-loader';
import CONST from "../consts";
import axios from "axios/index";
import {connect} from "react-redux";
import colors from "../consts/colors";


const height = Dimensions.get('window').height;
class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            products: [],
			routeName: this.props.navigation.state.routeName,
			filterModalVisible: false,
			sortModalVisible: false,
			key: null,
			types: [],
			selectedType: null,
			sortedBy: null,
        }
    }

    static navigationOptions = () => ({
        drawerLabel: 'الرئيسية',
        drawerIcon: ( <Icon style={{ fontSize: 25, color: colors.yellow }} type={'FontAwesome'} name={'home'}/> )
    });


	renderLoader(){
        if (this.state.key === null){
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 500 }}>
                    <DoubleBounce size={20} color={colors.red} />
                </View>
            );
        }
    }

   	componentWillMount (){
		axios.get(CONST.url + 'allProducts').then(response => {
			this.setState({ products: response.data.data, key: response.data.value })
		});

		axios.get(CONST.url + 'alltypes').then(response => {
			this.setState({ types: response.data.data })
		})
	}



    componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

		// Notifications.addListener(this.handleNotification);
    }

	// handleNotification = (notification) => {
	// 	console.log(notification);
	//
	// 	if (notification && notification.origin !== 'received') {
	// 		const { data } = notification;
	// 		const orderId = data.id;
	//
	// 		if (data.type && data.type === 'order') {
	// 			this.props.navigation.navigate('newOrder', { orderId });
	// 		}else if(data.type && data.type === 'offer'){
	// 			console.log('this is order id', orderId);
	// 			this.props.navigation.navigate('finishOrder', { orderId });
	// 		}
	// 	}
	// }


	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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

	setFilterModalVisible(visible) {
		this.setState({filterModalVisible: visible});
	}

	setSortModalVisible(visible) {
		this.setState({sortModalVisible: visible});
	}

	setFilter(){
		this.setState({ key: null, filterModalVisible: false, sortModalVisible: false })
		axios.post(CONST.url + 'productsSortWithFilter', {type_id: this.state.selectedType, sort_by: this.sortedBy}).then(response => {
			this.setState({ products: response.data.data, key: response.data.value })
		})
	}

	addToCart(id){
		axios.post(CONST.url + 'addToCart', { product_id: id, user_id: this.props.user.id, quantity: 1 }).then(response => {
			this.props.navigation.navigate('cart')
		});
	}

    render(){
        return(
            <Container>
				<Header style={{ height: 70, backgroundColor: colors.wight, paddingTop: 15 }}>
					<Right style={{ flex: 0 }}>
						<Button transparent onPress={() => this.props.navigation.openDrawer()}>
							<Icon name='menu' style={{ color: colors.gray, fontSize: 30, marginTop: 8, left: -10 }} />
						</Button>
					</Right>
					<Body style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>
					<Text style={{ color: colors.gray, textAlign: 'center', marginRight: 20, fontSize: 18, fontFamily: 'din_text' }}>الرئيسية</Text>
					</Body>
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name={'ios-notifications'} type='Ionicons' style={{ color: colors.gray }} />
						</Button>
					</Left>
				</Header>
                { this.renderLoader() }
                <Content style={{ paddingHorizontal: 10 }}>
					<View style={{ flexDirection: 'row' }}>
						<Button transparent onPress={() => this.setFilterModalVisible(!this.state.filterModalVisible)}>
							<Icon name='filter-variant' type='MaterialCommunityIcons' style={{ color: colors.gray, fontSize: 30, marginTop: 8, left: -10 }} />
						</Button>

						<Button transparent onPress={() => this.setSortModalVisible(!this.state.sortModalVisible)}>
							<Icon name='sort' type='FontAwesome' style={{ color: colors.gray, fontSize: 30, marginTop: 8, left: -10 }} />
						</Button>
					</View>

					<View>
						{
							this.state.products.map((product, i) => (
								<Card key={i}>
									<CardItem>
										<Body onPress={() => this.props.navigation.navigate('product', {id: product.id})}>
											<TouchableOpacity onPress={() => this.props.navigation.navigate('product', {id: product.id})}>
												<Image source={{ uri: product.logo }} resizeMode='center' style={{ width: 100, height: 100 }}/>
											</TouchableOpacity>
										</Body>
										<Body style={{ flex: 2, marginLeft: 20 }}>
										<View>
											<Text onPress={() => this.props.navigation.navigate('product', {id: product.id})} style={{ fontSize: 16, fontWeight: '400', color: colors.gray, fontFamily: 'din_text'  }}>{ product.name }</Text>
											<Text style={{ color: colors.gray }}>بواسطة { product.provider } </Text>
											<Text style={{ color: colors.gray }}>{ product.price } ريال</Text>
											<Button onPress={() => this.addToCart(product.id)} style={{ backgroundColor: colors.red, borderRadius: 5, width: 90, height: 30, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
												<Text style={{ color: colors.wight }}>اضف الي السلة</Text>
											</Button>
										</View>
										</Body>
									</CardItem>
								</Card>
							))
						}
					</View>

					{/* Filter Modal */}
					<Modal
						animationType="slide"
						transparent={false}
						onRequestClose={() => console.log('')}
						visible={this.state.filterModalVisible}>
						<View style={{marginTop: 22}}>
							<Text style={{ fontSize: 19, color: colors.gray, marginLeft: 10 }}>تصفيات المنتجات</Text>
							<View>
								<List style={{ padding: 10 }}>
									{
										this.state.types.map((type, i) => (
											<ListItem onPress={() => this.setState({ selectedType: type.id })} key={i} style={{ flex: 1, marginLeft: 0, margin: 5, height: 40 }}>
												<Left style={{ flex: 1 }}>
													<Text style={{ fontSize: 16, marginLeft: 4, marginRight: 4 }}>{ type.name }</Text>
												</Left>
												<Right style={{ flex: 1 }}>
													<Radio onPress={() => this.setState({ selectedType: type.id })} color={colors.red} selectedColor={colors.red} selected={this.state.selectedType == type.id ? true : false} style={{ top: -10 }} />
												</Right>
											</ListItem>
										))
									}
									<ListItem onPress={() => this.setState({ selectedType: null })} style={{ flex: 1, marginLeft: 0, margin: 5, height: 40 }}>
										<Left style={{ flex: 1 }}>
											<Text style={{ fontSize: 16, marginLeft: 4, marginRight: 4 }}>الكل</Text>
										</Left>
										<Right style={{ flex: 1 }}>
											<Radio color={colors.red} onPress={() => this.setState({ selectedType: null })} selectedColor={colors.red} selected={this.state.selectedType === null ? true : false} style={{ top: -10 }} />
										</Right>
									</ListItem>
								</List>
							</View>
							<View style={{ padding: 10 }}>
								<Button onPress={() => this.setFilter() } block style={{ backgroundColor: colors.red }}>
									<Text style={{ color: colors.wight, fontSize: 16 }}>تصفيه</Text>
								</Button>
								<Button transparent block onPress={() => {
									this.setFilterModalVisible(!this.state.filterModalVisible);
								}}>
									<Text style={{ color: colors.gray, fontSize: 16 }}>الغاء</Text>
								</Button>
							</View>
						</View>
					</Modal>

					{/* Sort Modal */}
					<Modal
						animationType="slide"
						transparent={false}
						onRequestClose={() => console.log('')}
						visible={this.state.sortModalVisible}>
						<View style={{marginTop: 22}}>
							<Text style={{ fontSize: 19, color: colors.gray, marginLeft: 10 }}>الترتيب</Text>
							<View>
								<List style={{ padding: 10 }}>
									<ListItem onPress={() => this.setState({ sortedBy: 1 })} style={{ flex: 1, marginLeft: 0, margin: 5, height: 40 }}>
										<Left style={{ flex: 1 }}>
											<Text style={{ fontSize: 16, marginLeft: 4, marginRight: 4 }}>اعلي سعر</Text>
										</Left>
										<Right style={{ flex: 1 }}>
											<Radio onPress={() => this.setState({ sortedBy: 1 })} color={colors.red} selectedColor={colors.red} selected={this.state.sortedBy === 1 ? true : false} style={{ top: -10 }} />
										</Right>
									</ListItem>

									<ListItem onPress={() => this.setState({ sortedBy: 2 })} style={{ flex: 1, marginLeft: 0, margin: 5, height: 40 }}>
										<Left style={{ flex: 1 }}>
											<Text style={{ fontSize: 16, marginLeft: 4, marginRight: 4 }}>اقل سعر</Text>
										</Left>
										<Right style={{ flex: 1 }}>
											<Radio onPress={() => this.setState({ sortedBy: 2 })} color={colors.red} selectedColor={colors.red} selected={this.state.sortedBy === 2 ? true : false} style={{ top: -10 }} />
										</Right>
									</ListItem>

									<ListItem onPress={() => this.setState({ sortedBy: 3 })} style={{ flex: 1, marginLeft: 0, margin: 5, height: 40 }}>
										<Left style={{ flex: 1 }}>
											<Text style={{ fontSize: 16, marginLeft: 4, marginRight: 4 }}>الاكثر مبيعا</Text>
										</Left>
										<Right style={{ flex: 1 }}>
											<Radio onPress={() => this.setState({ sortedBy: 3 })} color={colors.red} selectedColor={colors.red} selected={this.state.sortedBy === 3 ? true : false} style={{ top: -10 }} />
										</Right>
									</ListItem>

									<ListItem onPress={() => this.setState({ sortedBy: 4 })} style={{ flex: 1, marginLeft: 0, margin: 5, height: 40 }}>
										<Left style={{ flex: 1 }}>
											<Text style={{ fontSize: 16, marginLeft: 4, marginRight: 4 }}>العروض</Text>
										</Left>
										<Right style={{ flex: 1 }}>
											<Radio onPress={() => this.setState({ sortedBy: 4 })} color={colors.red} selectedColor={colors.red} selected={this.state.sortedBy === 4 ? true : false} style={{ top: -10 }} />
										</Right>
									</ListItem>

									<ListItem onPress={() => this.setState({ sortedBy: null })} style={{ flex: 1, marginLeft: 0, margin: 5, height: 40 }}>
										<Left style={{ flex: 1 }}>
											<Text style={{ fontSize: 16, marginLeft: 4, marginRight: 4 }}>الكل</Text>
										</Left>
										<Right style={{ flex: 1 }}>
											<Radio onPress={() => this.setState({ sortedBy: null })} color={colors.red} selectedColor={colors.red} selected={this.state.sortedBy === null ? true : false} style={{ top: -10 }} />
										</Right>
									</ListItem>
								</List>
							</View>
							<View style={{ padding: 10 }}>
								<Button onPress={() => this.setFilter()} block style={{ backgroundColor: colors.red }}>
									<Text style={{ color: colors.wight, fontSize: 16 }}>تصفيه</Text>
								</Button>
								<Button transparent block onPress={() => {
									this.setSortModalVisible(!this.state.sortModalVisible);
								}}>
									<Text style={{ color: colors.gray, fontSize: 16 }}>الغاء</Text>
								</Button>
							</View>
						</View>
					</Modal>

				</Content>
				<Footer>
					<FooterTab style={{ backgroundColor: colors.wight }}>
						<Button vertical style={{ backgroundColor: colors.lightgray }}>
							<Icon name="home" type='FontAwesome' style={{ color: colors.yellow }}/>
							<Text style={{ color: colors.yellow }}>الرئيسية</Text>
						</Button>
						<Button vertical onPress={() => this.props.navigation.navigate('orders')}>
							<Icon name="shop" type='Entypo' style={{ color: colors.gray }}/>
							<Text style={{ color: colors.gray }}>طلباتي</Text>
						</Button>
						<Button badge vertical onPress={() => this.props.navigation.navigate('cart')}>
							<Badge style={{ width: 17, color: colors.red, left: -10, paddingTop: 0 }}><Text style={{ color: colors.wight, textAlign: 'center' }}>{ this.props.count }</Text></Badge>
							<Icon type='Entypo' name="shopping-cart" style={{ color: colors.gray }} />
							<Text style={{ color: colors.gray }}>السلة</Text>
						</Button>
						<Button vertical onPress={() => this.props.navigation.navigate('profile')}>
							<Icon name="person" type='MaterialIcons' style={{ color: colors.gray }} />
							<Text style={{ color: colors.gray }}>حسابي</Text>
						</Button>
					</FooterTab>
				</Footer>
            </Container>
        )
    }

}

const mapStateToProps = ({ auth, profile, cart }) => {
    return {
        auth: auth.user,
		user: profile.user,
		count: cart.count
    };
};


export default connect(mapStateToProps)(Home);