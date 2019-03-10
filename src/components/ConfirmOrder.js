import React, { Component } from 'react';import { View, Text, Image, TouchableOpacity } from 'react-native';import { Container, Button, Content, Form, Item, Input, Icon } from 'native-base';import colors from '../consts/colors'class ConfirmOrder extends Component{	render(){		return(			<Container style={{ backgroundColor: '#fff' }}>				<Content contentContainerStyle={{flexGrow: 1}}>					<View style={{ alignItems: 'center', marginTop: 150, padding: 15 }}>						<Image resizeMode={'center'} style={{ width: 200, height: 200, marginTop: 30 }} source={require('../../assets/images/congrat.png')}/>						<Text style={{ textAlign: 'center', fontSize: 25, color: colors.gray, marginTop: 20 }}>تهانينا !</Text>						<Text style={{ textAlign: 'center', fontSize: 20, color: colors.gray }}>لقد تمت عملية الشراء بنجاح</Text>						<Button style={{ backgroundColor: '#ea5454', marginTop: 20, borderRadius: 8 }} onPress={() => this.props.navigation.navigate('home')} block>							<Text style={{ color: '#fff' }}>عوده الي الرئيسية</Text>						</Button>					</View>				</Content>			</Container>		)	}}export default ConfirmOrder;