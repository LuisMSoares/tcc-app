import IOSIcon from "react-native-vector-icons/Ionicons";
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';

import ToHome from './redirect';
import drawernav from './pages/logged';

import SignIn from './pages/signIn';
import SignUp from './pages/signUp';

const RouteStack = createStackNavigator({
  ToHome,
  SignIn,
  SignUp,
  drawernav: {
    screen: drawernav,
    navigationOptions: ({navigation}) => ({
      header: null,
      headerLeft:(<TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <IOSIcon name="ios-menu" size={50}
                    style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
      ),
      title: "Main"
    })
	}
});

const Routes = createAppContainer(RouteStack);

export default Routes;
