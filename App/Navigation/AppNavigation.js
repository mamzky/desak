import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import LaunchScreen from '../Containers/LaunchScreen'
import Home from '../Containers/Screen/Home'
import Form from '../Containers/Screen/Form'
import styles from './Styles/NavigationStyles'
import Maps from '../Containers/Screen/Maps';

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  Home: { screen: Home },
  Form: { screen: Form },
  Maps: { screen: Maps }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(PrimaryNav)
