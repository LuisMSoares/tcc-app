import customHeader from '../customHeader';

import React, { Component } from 'react';
import {
  RefreshControl,
  Dimensions,
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Text,
} from 'react-native';
import { Table, Row } from 'react-native-table-component';

import api from '../../../../services/api'
 
class subjInfo extends Component {
  static navigationOptions = {
    header: null,
  };
  
  componentDidMount(){
    const { navigation } = this.props;
    this.setState({ subjectId: navigation.getParam('subID') });
    this.setState({ subjectName: navigation.getParam('subName') });
    this.setState({ subjectGroup: navigation.getParam('subGroup') });

    this._getTableData();
  }

  constructor(props) {
    super(props);
  }
 
  state = {
    tableData: [],
    refreshing: false,
    width: Dimensions.get('window').width,

    subjectId: 0,
    subjectName: '',
    subjectGroup: '',
    presence: []
  };

  _getTableData = async () => {
    const { navigation } = this.props;
    const subId = navigation.getParam('subID');
    try{
      const response = await api.get('/absence/all/'+subId);
      if (response.status == 200) {
        this.setState({presence: response.data.dates});
        const data = response.data.values;

        const listData = [];
        for (let i=0; i < data.length; i+=1) {
          let listvalue = data[i];
          listData.push([listvalue.userid, listvalue.username, listvalue.faltas, listvalue.presencas ]);
        }
        this.setState({tableData: listData});
      } else {
        this.setState({tableData: []});
      }
    }catch(_err){}
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this._getTableData();
    this.setState({refreshing: false});
  }

  listContentTable(widthArr,tableHead){
    if(this.state.tableData.length === 0){
      return(
        <Text style={styles.errorMessage}>Esta disciplina não contem dados a serem exibidos!</Text>
      );
    } else {
      return(

        <View>
          <Table borderStyle={{borderColor: '#C1C0B9'}}>
            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader}/>
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderColor: '#F7F6E7'}}>
              {
                this.state.tableData.map((rowData, index) => (
                  <TouchableOpacity
                    onPress={() => {this.props.navigation.navigate('detailsAbsence',{
                      presence: this.state.presence,
                      subjId: this.state.subjectId,
                      userId: rowData[0]
                    });}}
                  >
                    <Row 
                      key={index}
                      data={rowData.slice(1,4)}
                      widthArr={widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#FFCCA7'}]}
                      borderStyle={{borderColor: '#F7F6E7'}}
                      textStyle={styles.text}
                    />
                  </TouchableOpacity>
                ))
              }
            </Table>
          </ScrollView>
        </View>
      );
    }
  }

  render() {
    const state = this.state;
 
    const tableHead = ['Aluno', 'F', 'P'];
    const widthArr = [state.width * .70, state.width * .12, state.width * .12];

    return (
      <View style={{flex: 1,backgroundColor: '#F5F5F5'}}>
        {customHeader(this.props.navigation.goBack,"Relatorio de Faltas", true)}
        <ScrollView horizontal={false} vertical={false} style={{ margin: state.width * .03, flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {this.listContentTable(widthArr,tableHead)}
        </ScrollView>
        


        <TouchableOpacity
          onPress={() => {this.props.navigation.navigate('editSubject',{
            subID: this.state.subjectId, 
            subName: this.state.subjectName, 
            subGroup: this.state.subjectGroup,
          });}}
          style={styles.Button}
        >
          <Text style={styles.ButtonText}>Editar / Excluir</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  header: { 
    height: 50, 
    backgroundColor: '#FFA09E',
  },
  text: { 
    textAlign: 'center', 
    fontWeight: '100', 
    fontSize: 16,
  },
  textHeader: { 
    textAlign: 'center', 
    fontWeight: '100',
    color: '#FFF', 
    fontSize: 20,
  },
  dataWrapper: { 
    marginTop: -1 
  },
  errorMessage: {
    textAlign: 'center',
    color: '#ce2029',
    fontSize: 16,
    margin: 20,
  },
  row: { 
    height: 40, 
    backgroundColor: '#FFD9A7' 
  },
  Button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF1818',
    alignSelf: 'stretch',
    margin: 15,
    marginHorizontal: 20,
  },
  ButtonText: {
    color: '#FF1818',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default subjInfo;