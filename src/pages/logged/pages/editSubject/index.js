import customHeader from '../customHeader';
import api from '../../../../services/api';

import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity, 
} from 'react-native';

class editSubject extends Component {
  static navigationOptions = {
    header: null,
  };
  
  componentDidMount(){
    const { navigation } = this.props;
    this.setState({ subjectId: navigation.getParam('subID') });
    this.setState({ subjectName: navigation.getParam('subName') });
    this.setState({ subjectGroup: navigation.getParam('subGroup') });
  }

  state = {
    subjectId: 0,
    subjectName: '',
    subjectGroup: '',
    upassword: '',
    error: '',
    success: '',
  };

  handleSubjectChange = (subjectName) => {
    this.setState({ subjectName });
  };

  handleSubjectGroupChange = (subjectGroup) => {
    this.setState({ subjectGroup });
  };

  handleUserPasswordChange = (upassword) => {
    this.setState({ upassword });
  };

  edtSubject = async () => {
    if (this.state.subjectName.length === 0 || this.state.subjectGroup.length === 0){
      this.setState({ error: 'Preencha todos os campos para continuar!' });
    } else {
      try {
        const data = {
          sid: this.state.subjectId,
          sname: this.state.subjectName,
          sgroup: this.state.subjectGroup,
          upass: this.state.upassword
        };
        const response = await api.post('/subject/edit', data);
        if (response.status === 200) {
          this.setState({ error: '' });
          this.setState({ success: response.data.Success });
          await setTimeout(() => {this.props.navigation.navigate('lsSubject');}, 1500);
        } else if (response.status === 500) {
          this.setState({ success: '' });
          this.setState({ error: 'Ocorreu algum erro interno.' });
        } else {
          this.setState({ success: '' });
          this.setState({ error: response.data.Error });          
        }
      } catch(_err) {
        this.setState({ success: '' });
        this.setState({ error: 'Houve um problema ao confirmar a edição, verifique sua conexão com a internet!' });
      }
    }
  };

  deleteSubject = async () => {
    try {
      const data = {
        upass: this.state.upassword
      };
      const response = await api.post('/subject/delete/'+this.state.subjectId, data);
      if (response.status === 200) {
        this.setState({ error: '' });
        this.setState({ success: response.data.Success });
        await setTimeout(() => {this.props.navigation.navigate('lsSubject');}, 1500);
      } else if (response.status === 500) {
        this.setState({ success: '' });
        this.setState({ error: 'Ocorreu algum erro interno.' });
      } else {
        this.setState({ success: '' });
        this.setState({ error: response.data.Error });          
      }
    } catch(_err){
      console.warn(_err);
      this.setState({ success: '' });
      this.setState({ error: 'Houve um problema ao confirmar a edição, verifique sua conexão com a internet!' });
    }
  };

  render () {
    return (
      <View  style={{flex: 1,backgroundColor: '#F5F5F5'}}>
        {customHeader(this.props.navigation.goBack,"Editar Disciplina", true)}
        <View style={{
          paddingTop: 20,
          alignItems: 'center',
          flex: 0,
          justifyContent: 'center',
        }}>

          {this.state.success.length !== 0 && <Text style={styles.successMessage}>{this.state.success}</Text>}

          <TextInput style={styles.input}
            placeholder="Nome da Disciplina"
            value={this.state.subjectName}
            onChangeText={this.handleSubjectChange}
            autoCapitalize="words"
            autoCorrect={true}
          />

          <TextInput style={styles.input}
            placeholder="Turma da disciplina"
            value={this.state.subjectGroup}
            onChangeText={this.handleSubjectGroupChange}
            autoCapitalize="words"
            autoCorrect={true}
          />

          <TextInput style={styles.input}
            placeholder="Senha de usuário"
            value={this.state.upassword}
            onChangeText={this.handleUserPasswordChange}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {this.state.error.length !== 0 && <Text style={styles.errorMessage}>{this.state.error}</Text>}

          <TouchableOpacity
            onPress={() => {this.edtSubject()}}
            style={styles.Button}
          >
            <Text style={styles.ButtonText}>Confirmar Edição</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert(
              'Confirmação de exclusão',
              'Todos os dados referente a esta disciplina sera excluido permanentemente!',
              [
                {text: 'Não', onPress: () => {}, style: 'cancel'},
                {text: 'Sim', onPress: () => {this.deleteSubject()}}
              ], { cancelable: false }
            )}
            style={styles.ButtonBlank}
          >
            <Text style={styles.ButtonTextBlank}>Excluir Permanentemente</Text>
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
  ButtonBlank: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF1818',
    alignSelf: 'stretch',
    margin: 5,
    marginHorizontal: 20,
  },
  ButtonTextBlank: {
    color: '#FF1818',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default editSubject;