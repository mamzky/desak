/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Text,
    Image, TouchableOpacity, BackHandler
} from 'react-native';

import Images from '../../Themes/Images';
import { NavigationActions, StackActions } from 'react-navigation';
import Orientation from 'react-native-orientation'

const screenWidth = Dimensions.get("screen").width
const screenHeight = Dimensions.get("screen").height
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        Orientation.lockToPortrait()
        setTimeout(()=>{this.navigateToForm()},1500)
        // BackHandler.addEventListener("hardwareBackPress", this.exitApp)
    }
    componentWillUnmount(){
        // BackHandler.removeEventListener("hardwareBackPress", this.exitApp)
    }
    navigateToForm(){
        const resetAction = StackActions.reset({
            index:0,
            actions:[NavigationActions.navigate({routeName:'Form'})]
        })
        this.props.navigation.dispatch(resetAction)
    }
    render() {
        return (
            <View
                style={{ height: '100%', width: '100%', backgroundColor: 'white' }}
            >
                <View
                    style={{ width: screenWidth, height: screenWidth * 0.7, justifyContent: "center" }}
                >
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                        onPress={()=>{this.props.navigation.navigate('Form')}}
                        >
                            <Image
                                style={{ height: 150, width: 300, resizeMode:'contain' }}
                                source={Images.img_desak_round}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Image
                    style={{ height: screenWidth * 1.2, width: screenWidth * 1.2, resizeMode: 'contain', position: 'absolute', bottom: -60, left: -50 }}
                    source={Images.home}
                />
            </View>
        )
    }
}

export default Home;
