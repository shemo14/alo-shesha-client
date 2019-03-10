import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

console.log(reactotronRedux);

Reactotron.configure({ host : '5.5.5.12', port: 9090 }).useReactNative().connect();

// then add it to the plugin list
// - Reactotron
// const reactotron = Reactotron
// 	.configure({ name: 'React Native Demo' })
// 	.use(reactotronRedux()) //  <- here i am!
// 	.connect() //Don't forget about me!
//
// export default reactotron

