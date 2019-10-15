import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import { FeedStack } from './screens/Feed/FeedStack';
import Profile from './screens/Profile/Profile';
import Settings from './screens/Settings/Settings';


export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}


const DashboardTabNavigator = createBottomTabNavigator({
  FeedStack,
  Profile,
  Settings
},{
  navigationOptions: ({navigation}) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return {
      header: null,
      headerTitle: routeName
    }
  }
});

const DashboardStackNavigator = createStackNavigator({
  DashboardTabNavigator: DashboardTabNavigator
},{
  defaultNavigationOptions: ({ navigation }) => {
    return {
      headerLeft: <Icon style={{ paddingLeft: 10, }}  onPress={()=>{ navigation.openDrawer() }} name='md-menu' size={30} />
    }
  }
})

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
})

const AppSwitchNavigatior = createSwitchNavigator({
  Welcome: {screen: WelcomeScreen},
  Dashboard: {screen: AppDrawerNavigator}
});

const AppContainer = createAppContainer(AppSwitchNavigatior);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
