import React, { Component } from 'react';
import { View,
        Text,
        ScrollView,
        SafeAreaView,
        Image,
        TouchableWithoutFeedback,
        Animated,
        Dimensions,
        StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const images = [
  { id: 1, src: require('../../assets/1.jpg')},
  { id: 2, src: require('../../assets/2.jpg')},
  { id: 3, src: require('../../assets/3.jpg')},
  { id: 4, src: require('../../assets/4.jpg')}
];

export default class Profile extends Component {

  constructor() {
    super()
    this.state = {
      activeImage: null
    }
  }

  componentWillMount() {
    this.allImages = {}
    this.oldPOsition = {}
    this.dimensions = new Animated.ValueXY()
    this.position = new Animated.ValueXY()
    this.animation = new Animated.Value(0)
    this.activeImageStyle = null
  }

  openImage = (index) => {

    this.allImages[index].measure((x,y,width,height,PageX,PageY)=>{
      this.oldPOsition.x = PageX;
      this.oldPOsition.y = PageY;
      this.oldPOsition.width = width;
      this.oldPOsition.height = height;

      this.position.setValue({
        x: PageX,
        y: PageY
      })

      this.dimensions.setValue({
        x: width,
        y: height
      })

      this.setState({
        activeImage: images[index]
      }, ()=>{
        this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY)=>{
          Animated.parallel([
            Animated.timing(this.position.x, {
              toValue: dPageX,
              duration: 300
            }),
            Animated.timing(this.position.y, {
              toValue: dPageY,
              duration: 300
            }),
            Animated.timing(this.dimensions.x, {
              toValue: dWidth,
              duration: 300
            }),
            Animated.timing(this.dimensions.y, {
              toValue: dHeight,
              duration: 300
            }),
            Animated.timing(this.animation, {
              toValue: 1,
              duration: 300
            })
          ]).start()
        })
      })
    })
  }

  closeImage = () => {
    Animated.parallel([
      Animated.timing(this.position.x, {
        toValue: this.oldPOsition.x,
        duration: 300
      }),
      Animated.timing(this.position.y, {
        toValue: this.oldPOsition.y,
        duration: 300
      }),
      Animated.timing(this.dimensions.x, {
        toValue: this.oldPOsition.width,
        duration: 300
      }),
      Animated.timing(this.dimensions.y, {
        toValue: this.oldPOsition.height,
        duration: 300
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 300
      })
    ]).start(()=>{
      this.setState({
        activeImage: null
      })
    })
  }

  render() {

    const activeImageStyle = {
      width: this.dimensions.x,
      height: this.dimensions.y,
      top: this.position.y,
      left: this.position.x
    }

    const animatedContentY = this.animation.interpolate({
      inputRange: [0,1],
      outputRange: [-150, 0]
    })

    const animatedContentOpacity = this.animation.interpolate({
      inputRange: [0,0.5,1],
      outputRange: [0,1,1]
    })

    const animatedContentStyle = {
      opacity: animatedContentOpacity,
      transform: [{
        translateY: animatedContentY
      }]
    }

    const animatedCrossOpacity = {
      opacity: this.animation
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {images.map( (image, index) => {
            return (
              <TouchableWithoutFeedback key={image.id}
                onPress={() => this.openImage(index)}
              >
                <Animated.View style={{ height: screenHeight - 100, width: screenWidth, padding: 15 }}>
                  <Image source={image.src}
                    ref={(image)=>(this.allImages[index] = image)}
                    style={{ 
                      flex: 1,
                      height: null,
                      width: null,
                      resizeMode: 'cover',
                      borderRadius: 20
                    }} />
                </Animated.View>
              </TouchableWithoutFeedback>
            )
          })}
        </ScrollView>
        <View style={StyleSheet.absoluteFill}
          pointerEvents={this.state.activeImage ? 'auto' : 'none'} >
          <View style={{flex: 2, zIndex: 1001}} ref={(view)=>(this.viewImage = view)}>
            <Animated.Image 
              source={
                this.state.activeImage ? this.state.activeImage.src : null
                }
              style={[{
                resizeMode: 'cover',
                top: 0,
                left: 0,
                height: null,
                width: null,
                padding: -10
              }, activeImageStyle]}
                >
            </Animated.Image>
            <TouchableWithoutFeedback onPress={()=>this.closeImage()}>
              <Animated.View style={[{position: 'absolute', top: 30, right: 30}, animatedCrossOpacity]}>
                <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}} >X</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View style={[{flex: 1, zIndex: 1000, backgroundColor: 'white', padding: 20, paddingTop: 50}, animatedContentStyle]}>
            <Text style={{fontSize: 24, paddingBottom: 10}} >Just some Church</Text>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
          </Animated.View>
        </View>
      </View>
    );
  }
}
