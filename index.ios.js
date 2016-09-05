import React, { Component } from 'react';
import { 
  AppRegistry, 
  Text,
  StyleSheet, 
  ActivityIndicator,
  TextInput,
  TouchableHighlight, 
  View, 
  AsyncStorage, Image} from 'react-native';
var idClient;
var styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
    buttonText: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'firebrick',
    borderColor: 'firebrick',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'firebrick',
    borderRadius: 8,
    color: 'firebrick'
  },
  description: {
    marginBottom: 12,
    marginTop: 44,
    fontSize: 16,
    textAlign: 'center',
    color: 'darkgrey'
  },
  helpme: {
    marginBottom: 5,
    fontSize: 14,
    textAlign: 'center',
    color: 'crimson'
  },
  waitString: {
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
    color: 'firebrick'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  image: {
  width: 212,
  height: 59
}
});


class Dima_Project extends Component {

constructor(props) {
  super(props);
  this.state = {
     isLoading: false,
     message: '',
     phoneNunmber: '+7 920 004 77 79'
  };
}

_handleResponse(response) {
	  this.setState({ isLoading: false , message: 'Запрос отправлен!' });
	}

  _handleOnSocket(data_socket){
  console.log(data_socket);
  this.setState({ isLoading: false , message: 'Ответ получен' });

  switch(data_socket.status) {
  case 'new': 
   this.setState({message: 'Специалист получил заявку...' });
   break;
  case 'calling': 
   this.setState({message: 'Специалист набирает Ваш номер...' });
   break;
   case 'talking': 
   this.setState({message: 'Идет консультация...' });
   break;
   case 'end': 
   this.setState({message: 'Консультация завершена' });
   break;
  }
}

onSearchPressed() {

  
  AsyncStorage.setItem('phNunm', this.state.phoneNunmber);
	var urlAPI = 'http://606ep.ru:1773/create_task?id='+idClient;
	this.setState({ isLoading: true, message: 'Запрос отправлен!' });
	
   fetch(urlAPI)
    .then(response => this._handleResponse(response));
  }

onCancelPressed() {
  
  this.setState({ isLoading: false, message: ''});
}


render() {
var spinner = this.state.isLoading ?
  ( <ActivityIndicator
      size='large'/> ) :
  ( <View/>);

 if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

// This must be below your `window.navigator` hack above
// const io = require('socket.io-client/socket.io');
// const socket = io('ws://606ep.ru:1773', {
//   jsonp: false,
//   transports: ['websocket'] // you need to explicitly tell it to use websockets
// });

// 	socket.on('connect', function(){
//        console.log('COnnected!!!');
//     });
//     socket.on('login', function(data){
//         console.info('login', data);
//         console.info(data.id);
//         idClient = data.id;
//     });
//     socket.on('disconnect', function(){
//         console.log('disconnected');
//     });

//     socket.on('task_status', data => this._handleOnSocket(data)
//     )

var ws = new WebSocket('ws://606ep.ru:1773');
ws.onmessage = (e) => {  // a message was received
 console.log(e.data);
};



    return (
   <View style={styles.container}>
    <Text style={styles.helpme}>
          Система оперативной поддержки
        </Text>
   <Image source={require('./Resources/helpme.png')} style={styles.image}/>
        <Text style={styles.description}>
          Специалист в течение 30 секунд перезвонит по Вашему телефону:
        </Text>
        <View style={styles.flowRight}>
            <TextInput
             style={styles.searchInput} onChangeText={(phoneNunmber) => this.setState({phoneNunmber})}
        value={this.state.phoneNunmber}
       placeholder='Укажите номер телефона...'/>
  <TouchableHighlight style={styles.button}
         underlayColor='lavenderblush' 
         onPress={this.onSearchPressed.bind(this)}
         >
    <Text style={styles.buttonText}>Вызвать</Text>
  </TouchableHighlight>
</View>
<TouchableHighlight style={styles.button}
    underlayColor='lavenderblush'
    onPress={this.onCancelPressed.bind(this)}
    >
  <Text style={styles.buttonText}>Отмена</Text>
</TouchableHighlight>
{spinner}
<Text style={styles.waitString}>{this.state.message}</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('Dima_Project', () => Dima_Project);
