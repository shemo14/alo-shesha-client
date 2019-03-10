import React from 'react';
import { StyleSheet, View, Platform, I18nManager } from 'react-native';
import Route from './src/routes';
import './ReactotronConfig';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import { Root } from "native-base";
import { Font } from 'expo';



export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.loadFontAsync();
		this.state = {
			fontLoaded: false
		};
	}

	async loadFontAsync () {
		try {
			await Font.loadAsync({ din_text: require('./assets/fonts/Cairo/Cairo-Bold.ttf') });
			this.setState({ fontLoaded: true });
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		if (!this.state.fontLoaded) {
			return <View />;
		}

		return (
			<Provider store={store}>
				<PersistGate persistor={persistedStore}>
					<Root>
						<Route/>
					</Root>
				</PersistGate>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
