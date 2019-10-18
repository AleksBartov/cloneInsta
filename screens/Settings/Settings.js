import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler'

const { set, cond, add, eq, spring, startClock, stopClock, clockRunning, sub, defined, Value, Clock, event } = Animated;

function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

export default class Settings extends Component {
constructor() {
  super()
  this.translateX = new Value(0)
  const dragX = new Value(0)
  const state = new Value(-1)
  const dragVX = new Value(0)

  this.onGestureEvent = event([
    {
      nativeEvent: {
        translationX: dragX,
        velocityX: dragVX,
        state: state
      }
    }
  ])

  const clock = new Clock();
  const transX = new Value();
  this.translateX = cond(eq(state,State.ACTIVE),[
    set(transX, dragX),
    transX
  ],[
    set(transX, cond(
      defined(transX), runSpring(clock,transX,dragVX,0), 0
    ))
  ])
  
}

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PanGestureHandler onGestureEvent={this.onGestureEvent} onHandlerStateChange={this.onGestureEvent}>
            <Animated.View style={[styles.box, { transform: [{ translateX: this.translateX }] }]} />
          </PanGestureHandler>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    box: {
      height: 100,
      width: 100,
      backgroundColor: 'red'
    }
  });
