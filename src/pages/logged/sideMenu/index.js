import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions,StackActions} from 'react-navigation';
import {AsyncStorage} from 'react-native';

import styles from './styles';
import {
  ScrollView,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import OctIcon from 'react-native-vector-icons/Octicons';
import IonIcon from 'react-native-vector-icons/Ionicons';

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  navigateToStart = (route) => () => {
    AsyncStorage.removeItem('@MyAppJWT:token').then(value => {
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      AsyncStorage.getAllKeys().then(keyArray => {
        AsyncStorage.multiRemove(keyArray);
      });
      this.props.navigation.dispatch(navigateAction);
    });
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Toki
            </Text>
            <View style={styles.navSectionStyle}>

              <TouchableOpacity style={styles.navRowStyle}
                onPress={()=>{
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'ToHome' }),
                    ],
                  });
                  this.props.navigation.dispatch(resetAction);
                }}
              >
                <MCIcon style={styles.navIconStyle} name="qrcode-scan" size={30} color="white" />
                <Text style={styles.navItemStyle}>
                  Validar Presença
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navRowStyle}
                onPress={this.navigateToScreen('myAbsencePage')}
              >
                <OctIcon style={styles.navIconStyle} name="note" size={30} color="white" />
                <Text style={styles.navItemStyle}>
                  Minhas Faltas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navRowStyle}
                onPress={this.navigateToScreen('subjectPage')}
              >
                <MCIcon style={styles.navIconStyle} name="check-all" size={30} color="white" />
                <Text style={styles.navItemStyle}>
                  Realizar Chamada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navRowStyle}
                onPress={this.navigateToScreen('createSubject')}
              >
                <IonIcon style={styles.navIconStyle} name="md-create" size={30} color="white" />
                <Text style={styles.navItemStyle}>
                  Cadastrar Disciplina
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navRowStyle}
                onPress={() => Alert.alert(
                  'Confirmação de saida',
                  'Ao sair todos os dados incluindo os não sincronizados serão apagados',
                  [
                    {text: 'Não', onPress: () => {}, style: 'cancel'},
                    {text: 'Sim', onPress: this.navigateToStart('ToHome')}
                  ], { cancelable: false }
                )}
              >
                <MCIcon style={styles.navIconStyle} name="exit-to-app" size={30} color="white" />
                <Text style={styles.navItemStyle}>
                  Sair
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={styles.footerStyle}>{'Desenvolvido por: \nLuis Eduardo Soares 2018-19'}</Text>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;