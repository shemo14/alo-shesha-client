import React from 'react';
import { Platform } from 'react-native'
import { Icon } from 'native-base'
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import Home from '../components/Home'
import InitScreen from '../components/InitScreen'
import Profile from '../components/Profile'
import DrawerTabs from '../components/DrawerTabs'
import LoginOrRegister from '../components/LoginOrRegister'
import DrawerCustomization from './DrawerCustomization'
import colors from '../consts/colors'
import Product from "../components/Product";
import Cart from "../components/Cart";
import Location from "../components/Location";
import ConfirmOrder from "../components/ConfirmOrder";
import OrderProducts from "../components/OrderProducts";
import Orders from "../components/Orders";
import ContactUs from "../components/ContactUs";
import AboutApp from "../components/AboutApp";

const CustomDrawerContentComponent = (props) => (<DrawerCustomization { ...props }/>);
const drawerNavigation = createDrawerNavigator({
   home: Home ,
   profile: Profile,
   product: Product,
   cart: Cart,
   location: Location,
   orderProducts: OrderProducts,
   orders: Orders,
   contactUs: ContactUs,
   aboutApp: AboutApp,

   logout: {
       screen: DrawerTabs,
       navigationOptions: {
           drawerLabel: 'تسجيل الخروج',
           drawerIcon: ( <Icon style={{ fontSize: 25, color: colors.yellow }} type={'MaterialCommunityIcons'} name={'logout'}/> )
       }
   },
},
    {
        initialRouteName: 'home',
        drawerPosition: Platform.OS === 'android' ? 'right' : '',
        contentComponent: CustomDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        gesturesEnabled: false,
        drawerToggleRoute: 'DrawerToggle'
    });


const AppStack = createStackNavigator({
	initScreen: {
        screen: InitScreen,
        navigationOptions: {
            header: null
        }
    },
	loginOrRegister: {
		screen: LoginOrRegister,
		navigationOptions: {
			header: null
		}
	},
	login: {
		screen: Login,
		navigationOptions: {
			header: null
		}
	},
    drawerNavigation:{
        screen: drawerNavigation,
        navigationOptions: {
            header: null,
        }
    },
	home: {
		screen: Home,
	},
	signUp: {
		screen: SignUp,
		navigationOptions: {
			header: null
		}
	},
	profile: {
		screen: Profile,
		navigationOptions: {
			header: null
		}
	},
	product: {
		screen: Product,
		navigationOptions: {
			header: null
		}
	},
	cart: {
		screen: Cart,
		navigationOptions: {
			header: null
		}
	},
	location: {
		screen: Location,
		navigationOptions: {
			header: null
		}
	},
	confirmOrder: {
		screen: ConfirmOrder,
		navigationOptions: {
			header: null
		}
	},
	orderProducts: {
		screen: OrderProducts,
		navigationOptions: {
			header: null
		}
	},
	contactUs: {
		screen: ContactUs,
		navigationOptions: {
			header: null
		}
	},
	aboutApp: {
		screen: AboutApp,
		navigationOptions: {
			header: null
		}
	},
}, {
    navigationOptions: {
        headerStyle: { backgroundColor: '#437c1a' },
		backBehavior: 'none',
		header: null
    }
});


export default AppStack;