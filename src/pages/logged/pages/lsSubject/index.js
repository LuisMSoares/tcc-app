import customHeader from '../customHeader';
import qrModal from './qrModal';
import api from '../../../../services/api';

import React, {Component} from 'react';
import AnDIcon from "react-native-vector-icons/AntDesign";
import KeepAwake from 'react-native-keep-awake';

import {
  Text, 
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  AsyncStorage,
  StyleSheet,
  Dimensions,
} from 'react-native';

class lsSubject extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount(){
    this.reloadElement();
    AsyncStorage.getItem('@MyApp:Subject').then(data => {
      this.setState({scrollData: JSON.parse(data)});
    });
    this._onRefresh(false);
  }

  state = {
    modalVisible: false,
    qrContent: '',
    subjectID: 0,
    refreshing: false,
    scrollData: null,
  };

  _DimensionsWidth(percentage=0){
    let value = Dimensions.get('window').width * percentage;
    return Dimensions.get('window').width - value;
  }

  reloadElement() {
    setInterval(() => {
      if( this.state.modalVisible ){
        data = {
          sid: this.state.subjectID,
          it: new Date().getTime(),
          ft: new Date().getTime()+15000,
        }
        this.setQrContent(this._encryptData(JSON.stringify(data)));
      }
    }, 10000);
  }

  _encryptData(data) {
    var CryptoJS = require("crypto-js");
    var ciphertext = CryptoJS.AES.encrypt(data, '%8#7@e20&4').toString();
    return ciphertext;
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    this.changeKeepAwake(visible);
  }

  setQrContent(value) {
    this.setState({qrContent: value});
  }

  setSubjectID(value) {
    this.setState({subjectID: value});
  }

  changeKeepAwake(shouldBeAwake) {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }

  changeQrCode(num, modal) {
    this.setSubjectID(num);
    data = {
      sid: num,
      it: new Date().getTime(),
      ft: new Date().getTime()+15000,
    }
    this.setQrContent(this._encryptData(JSON.stringify(data)));
    this.setModalVisible(modal);
  }

  _onRefresh = async (refreshicon=true) => {
    if(refreshicon){
      this.setState({refreshing: true});
    }
    try {
      const response = await api.get('/subject/createdby/all');
      if (response.status === 200) {
        const data = response.data.values;
        this.setState({scrollData: data});
        AsyncStorage.setItem('@MyApp:Subject', JSON.stringify(data));
      }
    } catch(_err) {
      console.log(_err);
    }
    if(refreshicon){
      this.setState({refreshing: false});
    }
  }

  ListSubject() {
    if (this.state.scrollData !== null) {
      if(this.state.scrollData.lenght !== 0){
        return this.state.scrollData.map((data) => {
          return (
            <View style={{marginTop: 5, marginBotton: 5}}>
    
              <View style={styles.RowList}>
                <View style={{ margin: 14, width: this._DimensionsWidth(0.35)}}>
                  <Text style={styles.RowText}>
                    {(data.subname +' - '+ data.subgroup).substring(0,50)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.RowButton} onPress={() => {
                  this.props.navigation.navigate('subjInfo',{
                    subID: data.id, 
                    subName: data.subname, 
                    subGroup: data.subgroup,
                  });}
                }>
                  <AnDIcon name="plussquareo" size={38} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.RowButton}
                  onPress={() => {this.changeQrCode(data.id, true);}}
                >
                  <AnDIcon name="qrcode" size={38} color="white"/>
                </TouchableOpacity>
              </View>
    
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
      <View  style={{flex: 1,backgroundColor: '#F5F5F5'}}>
        {customHeader(this.props.navigation.toggleDrawer,"Realizar Chamada")}
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
        <TouchableOpacity
          onPress={() => {this.props.navigation.navigate('createSubject');}}
          style={styles.Button}
        >
          <Text style={styles.ButtonText}>Cadastrar Disciplina</Text>
        </TouchableOpacity>
        {qrModal(this)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  zeroContainer: {
    height: 0,
    flex: 0
  },

  Button: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#FC6663',
    alignSelf: 'stretch',
    margin: 15,
    marginHorizontal: 20
  },

  ButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },

  RowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  RowText: {
    fontSize: 16,
    color: 'white'
  },
  RowList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFA09E'
  }
});


export default lsSubject;