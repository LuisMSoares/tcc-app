import IOSIcon from "react-native-vector-icons/Ionicons";
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import GeneralStatusBarColor from './statusBar';

customHeader = (func,pageName,back=false) => {
  return(
    <View style={{backgroundColor:'#FC6663'}}>

      <GeneralStatusBarColor backgroundColor="#FC6663" barStyle="light-content"/>
      <View style={{flexDirection: 'row', alignItems:'center'}}>
        {back === false &&
          <TouchableOpacity onPress={() => func()}>
            <IOSIcon name="ios-menu" size={40} style={{ marginLeft: 15,
                                                        marginTop: 5,
                                                        marginBottom: 5,
                                                        color: '#FFF' }} />
          </TouchableOpacity>
        }
        {back === true &&
          <TouchableOpacity onPress={() => func()}>
            <IOSIcon name="md-arrow-round-back" size={40} style={{ marginLeft: 15,
                                                                    marginTop: 5,
                                                                    marginBottom: 5,
                                                                    color: '#FFF' }} />
          </TouchableOpacity>
        }

        <Text style={{ flex: 1, 
          marginLeft: 15, 
          fontSize: 25, 
          fontWeight: 'bold',
          color: 'white', 
          textAlign: 'left'}}
        >
          {pageName}
        </Text>
      </View>
    </View>
  );
};

export default customHeader;