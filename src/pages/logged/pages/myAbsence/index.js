import customHeader from '../customHeader';
import api from '../../../../services/api';
import MCmIcon from "react-native-vector-icons/MaterialCommunityIcons";

import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';

class myAbsence extends Component {
  static navigationOptions = {
    header: null,
  };

  componentWillMount(){
    AsyncStorage.getItem('@MyApp:myAnsence').then(data => {
      this.setState({scrollData: JSON.parse(data)});
    });
    this._onRefresh(false);
  }

  state = {
    qrContent: '',
    subjectID: 0,
    refreshing: false,
    scrollData: null,
  };

  _DimensionsWidth(percentage=0){
    let value = Dimensions.get('window').width * percentage;
    return Dimensions.get('window').width - value;
  }

  _encryptData(data) {
    var CryptoJS = require("crypto-js");
    var ciphertext = CryptoJS.AES.encrypt(data, '%8#7@e20&4').toString();
    return ciphertext;
  }

  setQrContent(value) {
    this.setState({qrContent: value});
  }

  setSubjectID(value) {
    this.setState({subjectID: value});
  }

  _onRefresh = async (refreshicon=true) => {
    if(refreshicon){
      this.setState({refreshing: true});
    }
    try {
      const response = await api.get('/subject/enrolled/all');
      if (response.status === 200) {
        this.setState({presence: response.data.dates});
        const data = response.data.values;
        this.setState({scrollData: data});
        AsyncStorage.setItem('@MyApp:myAnsence', JSON.stringify(data));
      }
      if (response.status === 404) {
        this.setState({scrollData: null});
        try {
          AsyncStorage.removeItem('@MyApp:myAnsence');
        } catch(e) {}
      }
    } catch(_err) {}
    if(refreshicon){
      this.setState({refreshing: false});
    }
  }

  removeSubject(suid){
    Alert.alert(
      'Confirmação de remoção',
      'Todas as suas faltas e presenças permanecerão no sistema após a confirmação!',
      [
        {text: 'Não', onPress: () => {}, style: 'cancel'},
        {text: 'Sim', onPress: () => {this._disable(suid)}}
      ], { cancelable: false }
    )
  }

  async _disable(suid){
    const response = await api.put('/subject/association/disable',{suid: suid});
    if (response.status === 200){
      this._onRefresh(false);
    }
  }

  ListSubject() {
    if (this.state.scrollData !== null) {
      if(this.state.scrollData.lenght !== 0){
        return this.state.scrollData.map((data) => {
          return (
            <View style={{marginTop: 5, marginBotton: 5}}>
    
              <TouchableOpacity style={styles.RowList}
                onPress={() => {this.props.navigation.navigate('detailsAbsence',{
                  subjId: data.subid,
                  userId: data.userid
                });}}
              >
                <View style={{ margin: 14, width: this._DimensionsWidth(0.3) }}>
                  <Text style={styles.RowText}>
                    {(data.subname +' - '+ data.subgroup).substring(0,50)}
                  </Text>
                </View>
                <View style={styles.RowAbsence}>
                  <Text style={styles.RowAbsenceText}>
                    {'F: '+data.absence+'\nP: '+data.presence}
                  </Text>
                </View>
                <TouchableOpacity style={styles.RowButton} onPress={() => {this.removeSubject(data.suid);}}>
                  <MCmIcon name="table-row-remove" size={35}  color="white"/>
                </TouchableOpacity>
              </TouchableOpacity>
    
            </View>
          );
        })
      }
    }
    return(
      <Text style={{
        paddingTop: 20,
        textAlign: 'center', 
        fontSize: 18,
        color: '#FC6663',
      }}>Nenhum resultado encontrado!</Text>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {customHeader(this.props.navigation.toggleDrawer,"Minhas Faltas")}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >



          {this.ListSubject()}



        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  zeroContainer: {
    height: 0,
    flex: 0,
  },

  Button: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#FC6663',
    alignSelf: 'stretch',
    margin: 15,
    marginHorizontal: 20,
  },

  ButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  RowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  RowAbsence: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  RowAbsenceText: {
    color: 'white',
    fontWeight: 'bold'
  },
  RowText: {
    color: 'white',
    fontSize: 16
  },
  RowList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFA09E'
  }
});


export default myAbsence;