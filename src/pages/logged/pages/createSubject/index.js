import customHeader from '../customHeader';
import api from '../../../../services/api';

import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

class createSubject extends Component {
  static navigationOptions = {
    header: null,
  };
  
  state = {
    subjectName: '',
    subjectGroup: '',
    error: '',
    success: '',
  };

  handleSubjectChange = (subjectName) => {
    this.setState({ subjectName });
  };

  handleSubjectGroupChange = (subjectGroup) => {
    this.setState({ subjectGroup });
  };

  newSubject = async () => {
    if (this.state.subjectName.length === 0 || this.state.subjectGroup.length === 0){
      this.setState({ error: 'Preencha todos os campos para continuar!' });
    } else {
      try {
        const response = await api.post('/subject',{
          sname: this.state.subjectName,
          sgroup: this.state.subjectGroup,
        });
        if (response.status === 500) {
          this.setState({ error: response.data.Error });
        } else {
          this.setState({ error: '' });
          this.setState({ success: response.data.Success });
  
          await setTimeout(() => {this.props.navigation.navigate('lsSubject');}, 2500);
          
        }
      } catch(_err) {
        this.setState({ error: 'Houve um problema com o cadastro, verifique sua conexão com a internet!' });
      }
    }
  };

  render () {
    return (
      <View style={{flex: 1,backgroundColor: '#F5F5F5'}}>
        {customHeader(this.props.navigation.toggleDrawer,"Cadastrar Disciplina")}
        <View style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}>

          {this.state.success.length !== 0 && <Text style={styles.successMessage}>{this.state.success}</Text>}

          <TextInput style={styles.input}
            placeholder="Nome da Disciplina"
            value={this.state.subjectName}
            onChangeText={this.handleSubjectChange}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput style={styles.input}
            placeholder="Turma da disciplina"
            value={this.state.subjectGroup}
            onChangeText={this.handleSubjectGroupChange}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {this.state.error.length !== 0 && <Text style={styles.errorMessage}>{this.state.error}</Text>}

          <TouchableOpacity
            onPress={() => {this.newSubject()}}
            style={styles.Button}
          >
            <Text style={styles.ButtonText}>Cadastrar Disciplina</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: '#FFF',
    alignSelf: 'stretch',
    marginBottom: 15,
    marginHorizontal: 20,
    fontSize: 16,
  },
  errorMessage: {
    textAlign: 'center',
    color: '#ce2029',
    fontSize: 16,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  successMessage: {
    textAlign: 'center',
    color: '#08a092',
    fontSize: 16,
    marginBottom: 15,
    marginHorizontal: 20,
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
});

export default createSubject;