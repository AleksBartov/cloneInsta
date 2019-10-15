import React, { Component } from 'react';
import { View,
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

export default class Feed extends Component {

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
            })
          ]).start()
        })
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

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {images.map( (image, index) => {
            return (
              <TouchableWithoutFeedback key={image.id}
                onPress={() => this.openImage(index)}
              >
                <Animated.View style={{ height: screenHeight, width: screenWidth, padding: 15 }}>
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
          <View style={{flex: 2}} ref={(view)=>(this.viewImage = view)}>
            <Animated.Image 
              source={
                this.state.activeImage ? this.state.activeImage.src : null
                }
              style={[{
                resizeMode: 'cover',
                top: 0,
                left: 0,
                height: null,
                width: null
              }, activeImageStyle]}
                >
            </Animated.Image>
          </View>
          <View style={{flex: 1}}>
          
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
