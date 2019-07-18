import customHeader from '../customHeader';
import api from '../../../../services/api';

import React, {Component} from 'react';
import { View, Text, AsyncStorage, StyleSheet } from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
LocaleConfig.locales['br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Aug.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sabado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.']
};
LocaleConfig.defaultLocale = 'br';

class detailsAbsence extends Component{
  static navigationOptions = {
    header: null,
  };

  state = {
    dMarks: {},
    current: '',
    error: false
  };
  
  componentWillMount(){
    this._getDates();
  }

  _getDates = async () => {
    let presence = await this.props.navigation.getParam('presence', -1);
    const subjId = await this.props.navigation.getParam('subjId', 0);
    const userId = await this.props.navigation.getParam('userId', 0);
    let datesResult, datesAbsence;
    try {
      datesResult = await api.get(`/absence/dates/${subjId}`);
      datesResult = datesResult.data
      datesAbsence = await api.get(`/absence/one/subjectId=${subjId}&userid=${userId}`);
      datesAbsence = datesAbsence.data

      AsyncStorage.setItem(`@MyApp:subPresence${subjId}`, JSON.stringify(datesResult));
      AsyncStorage.setItem(`@MyApp:subuAbsence${subjId}`, JSON.stringify(datesAbsence));

    } catch(_err) {
      datesResult = await AsyncStorage.getItem(`@MyApp:subPresence${subjId}`);
      datesResult = JSON.parse(datesResult)
      datesAbsence = await AsyncStorage.getItem(`@MyApp:subuAbsence${subjId}`);
      datesAbsence = JSON.parse(datesAbsence)
    }
    if (datesResult !== null && datesAbsence !== null){
      presence = datesResult.dates;
      const myPresence = datesAbsence.dates;
      const currentDate = datesAbsence.current;

      let dateMarks = {};
      for (let date of presence) {
        if(myPresence.includes(date)){
          dateMarks[date] = {disabled: true, startingDay: true, endingDay: true, color: '#a7e0a3', textColor: 'black'};
        }else{
          dateMarks[date] = {disabled: true, startingDay: true, endingDay: true, color: '#ff6746', textColor: 'white'};
        }
      }
      this.setState({dMarks: dateMarks});
      this.setState({current: currentDate});
    } else {
      this.setState({error: true});
    }
  };

  render(){
    return(
      <View style={{ flex: 0, }}>
        {customHeader(this.props.navigation.goBack,"Calendario de Faltas", true)}
        { this.state.error === true && 
          <Text style={styles.errorMessage}>
            {'Nenhuma informação anterior foi encontrada para esta disciplina.'}
          </Text>
        }
        { this.state.current !== '' &&
          <CalendarList
            // Callback which gets executed when visible months change in scroll view. Default = undefined
            onVisibleMonthsChange={(months) => {}}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={50}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={50}
            // Enable or disable scrolling of calendar list
            scrollEnabled={true}
            // Enable or disable vertical scroll indicator. Default = false
            showScrollIndicator={true}
            theme={{arrowColor: 'white'}}
            markedDates={this.state.dMarks}
            current={this.state.current}
            markingType={'period'}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    textAlign: 'center',
    color: '#ce2029',
    fontSize: 20,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 10,
  }
});

export default detailsAbsence;