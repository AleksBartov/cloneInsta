import React, { Component } from 'react';
import Icon from '@expo/vector-icons/Ionicons';

import { createStackNavigator } from 'react-navigation-stack';

import Feed from './Feed';
import { Detail } from './Detail';


export const FeedStack = createStackNavigator({
    Feed: {
      screen: Feed,
      navigationOptions: ({navigation}) => {
        return {
          headerTitle: 'Feed',
          headerLeft: (
            <Icon style={{ paddingLeft: 10, }}  onPress={()=>{ navigation.openDrawer() }} name='md-menu' size={30} />
          )
        }
      }
    },
    Detail: {
      screen: Detail
    }
  },{
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  });
