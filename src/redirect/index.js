import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, StatusBar, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import api from '../services/api'

export default class ToHome extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
    }).isRequired,
  };

  _preLoadApp = async () => {
    const response = await api.get('/subject/createdby/all');
    if (response.status === 200) {
      const data = response.data.values;
      this.setState({scrollData: data});
      AsyncStorage.setItem('@MyApp:Subject', JSON.stringify(data));
    }
  };

  componentDidMount() {
    try {
      AsyncStorage.getItem('@MyAppJWT:token').then(value => {
        if (value !== null) {
          this._preLoadApp();
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'drawernav' }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'SignIn' }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        }
      }).catch(erro => {
        console.warn.log(erro);
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'SignIn' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      });
    } catch (_err) {}
  }

  render() {
    return(
      <View>
        <StatusBar hidden />
      </View>
    );
  }
}