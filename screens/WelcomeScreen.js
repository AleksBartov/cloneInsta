import React, { Component } from 'react';
import { View, Button } from 'react-native';

export default class WelcomeScreen extends Component {
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button title='вход' onPress={()=>{ this.props.navigation.navigate('Dashboard') }} />
          <Button title='регистрация' onPress={()=>{}} />
        </View>
      );
    }
  }
  