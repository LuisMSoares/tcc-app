import customHeader from '../customHeader';
import QRCodeScanner from 'react-native-qrcode-scanner';
import DeviceInfo from 'react-native-device-info';
import api from '../../../../services/api';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Dimensions,
} from 'react-native';

class vPresence extends Component {
  static navigationOptions = {
    header: null,
  };
  
  state = {
    sincStatus: 'Aguardando Leitura',
    sincNow: false,
  };

  _decryptData(data) {
    let CryptoJS = require("crypto-js");
    let bytes  = CryptoJS.AES.decrypt(data, '%8#7@e20&4');
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  componentDidMount() {
    this._sincPendentData();
  }

  _qrMarkerSize(value=0.3, maxSize=250){
    const w = Dimensions.get('window').width;
    const size = w - w * value;
    if(size > maxSize)
      return maxSize;
    else
      return size;
  }

  _sincPendentData = async () => {
    const pendentData = JSON.parse( await AsyncStorage.getItem('@MyAppJWT:abPendent') );
    if (pendentData !== null) {
      const pdata = pendentData.values;
      const errData = [];
      let errStatus = false;
      for (let i=0; i < pdata.length; i+=1) {
        try { 
          const response = await api.post('/absence/validate',{
            subjid: pdata[i].subjectId,
            vdate: pdata[i].vDate,
            dvcid: pdata[i].deviceId,
          });
        } catch(_err) {
          errData.push(pdata[i]);
          errStatus = true;
        }
      }
      if( errStatus === true) {
        this.setSincButton(true);
        this.setSincNotification('Erro de sincronização, \nverifique sua conexão com a internet.');
        AsyncStorage.setItem('@MyAppJWT:abPendent', JSON.stringify({values: errData,}));
      } else {
        this.setSincNotification('Validações pendentes \nsincronizadas com sucesso!');
        AsyncStorage.removeItem('@MyAppJWT:abPendent');
        this.setSincButton(false);
      }
    }
  };

  _storePendentData = async (data) => {
    const pendentData = JSON.parse( await AsyncStorage.getItem('@MyAppJWT:abPendent') );
    if (pendentData !== null) {
      pendentData.values.push(data);
      await AsyncStorage.setItem('@MyAppJWT:abPendent', JSON.stringify(pendentData));
    } else {
      await AsyncStorage.setItem('@MyAppJWT:abPendent', JSON.stringify({values: [data],}));
    }

  };

  _sincData = async (sid, todayDate) => {
    const requestData = {
      subjid: sid,
      vdate: todayDate,
      dvcid: DeviceInfo.getUniqueID(),
    };
    try{
      const response = await api.post('/absence/validate', requestData);
      
      const data = response.data;
      if (response.status === 201) {
        this.setSincNotification(data.success);
      }
      if (response.status === 200) {
        this.setSincNotification(data.success);
      }
    } catch(_err) {
      console.log(_err);
      this.setSincButton(true);
      this.setSincNotification('Erro de sincronização, \nverifique sua conexão com a internet.');
      this._storePendentData({ subjectId: requestData.subjid, 
                               vDate: requestData.vdate,
                               deviceId: requestData.dvcid,
                            });
    }
  };

  setSincNotification(status) {
    this.setState({sincStatus: status});
  }
  setSincButton(status) {
    this.setState({sincNow: status});
  }

  _getFormatDate(){
    const dateObj = new Date();
    //                                         GSM -3:00 Brasilia Brasil
    const timestamp = dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000);
    const date = new Date( timestamp ).toISOString().slice(0,10);
    return date;
  }

  onSuccess(value) {
    try {
      let data = JSON.parse(this._decryptData(value.data));
      let myt = new Date().getTime();
      if (myt >= data.it && myt <= data.ft ) {
        let todayDate = this._getFormatDate();
        this._sincData(data.sid, todayDate);
      } else {
        this.setSincNotification('Codigo QR expirado!');
      }
    } catch(_err) {
      console.log(_err);
      this.setSincNotification('Codigo QR Invalido!');
    }
  }

  render () {
    return (
      <View style={styles.Container}>
        {customHeader(this.props.navigation.toggleDrawer,"Validar Presença")}
        <QRCodeScanner
          cameraStyle={styles.QrView}
          cameraProps={{captureAudio: false}}
          vibrate={false}
          reactivate={true}
          reactivateTimeout={3000}
          onRead={this.onSuccess.bind(this)}
          showMarker={true}
          customMarker={
            <Image
              style={{height: this._qrMarkerSize(), width: this._qrMarkerSize(),
                      marginBottom: Dimensions.get('window').height / 6,
                    }}
              source={require('../../../../images/qrMarker.png')}
            />
          }
        />
        <View style={styles.BottomContainer}>
          <Text style={styles.Notification}>{this.state.sincStatus}</Text>
          {this.state.sincNow === true && 
            <TouchableOpacity
              style={styles.Button}
              onPress={this._sincPendentData}
            >
              <Text style={styles.ButtonText}>Sincroizar Agora</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  QrView: {
    height: Dimensions.get('window').height,
  },
  BottomContainer: {
    marginBottom: 20,
  },
  Notification: {
    flex: 0,
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: 'center', 
    fontSize: 22,
    color: 'white',
  },
  Button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    alignSelf: 'stretch',
    margin: 15,
    marginHorizontal: 20,
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default vPresence;