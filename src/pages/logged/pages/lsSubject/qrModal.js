import React from 'react';
import QRCode from 'react-native-qrcode-svg';

import {
  Dimensions,
  Modal, 
  Text, 
  TouchableHighlight, 
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';

qrModal = (self) => {
  return(
    <Modal
      animationType="fade"
      transparent={false}
      visible={self.state.modalVisible}
      onRequestClose={() => {
        self.setModalVisible(!self.state.modalVisible);
    }}>
    <StatusBar hidden />
    <View style={{flex: 1,backgroundColor: 'black', alignItems: 'center', justifyContent: 'center'}}>
      <View>
        <View style={{padding: 5, alignSelf: 'flex-start', backgroundColor: 'white'}}>
          <QRCode
            value={self.state.qrContent}
            size={Dimensions.get('window').width * .8}
          />
        </View>
        <TouchableHighlight
          style={styles.backItem}
          onPress={() => {
            self.setModalVisible(!self.state.modalVisible);
          }}>
          <Text style={styles.backItemButton}>Voltar</Text>
        </TouchableHighlight>
      </View>
    </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backItem: {
    padding: 10,
    marginTop: 20,
  },
  backItemButton: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
});

export default qrModal;