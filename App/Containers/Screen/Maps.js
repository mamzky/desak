
import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Text,
    Image, TouchableOpacity, Linking, BackHandler, ScrollView, Modal
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Images from '../../Themes/Images';
import CardView from 'react-native-cardview'
import { NavigationActions, StackActions } from 'react-navigation';

const screenWidth = Dimensions.get("screen").width
const screenHeight = Dimensions.get("screen").height
const mapRef = React.createRef();

class Maps extends Component {
    constructor(props) {
        super(props)
        this.state = {
            namaRS: '',
            alamatRS: '',
            phoneNumber: '',
            url: '',
            initialLat: 0.0,
            initialLon: 0.0,
            emergency: props.navigation.getParam('emergency'),
            hospitalInfo: props.navigation.getParam('hospitalInfo') || '',
            selectedLat: 0,
            selectedLon: 0,
            hospitalArray: [props.navigation.getParam('hospitalArray')] || [],
            listMarker: [],
            rsModal: false,
            hospitalSelected: '',
            hospitalAddrSelected: ''
        }
    }
    openMaps(lat, lon) {
        Linking.openURL(`http://maps.google.com/maps?daddr=${lat},${lon}`).catch(err => console.error('An error occurred', err))
    }
    componentWillUnmount() {
        // BackHandler.removeEventListener("hardwareBackPress", this.goHome)
    }
    componentDidMount() {
        // BackHandler.addEventListener("hardwareBackPress", this.goHome)
        if (this.state.emergency) {
            let profileRS = this.state.hospitalInfo
            this.setState({
                selectedLat: parseFloat(profileRS['lat']),
                selectedLon: parseFloat(profileRS['lon']),
                namaRS: profileRS['name'],
                alamatRS: profileRS['address']
            })
            this.state.listMarker.push(profileRS)
        } else {
            let initRegion = this.state.hospitalArray[0][0]
            console.tron.log(this.state.hospitalArray[0])
            console.tron.log(this.state.hospitalArray[0][0])
            this.setState({
                selectedLat: parseFloat(initRegion['lat']),
                selectedLon: parseFloat(initRegion['lon']),
                namaRS: initRegion['name'],
                alamatRS: initRegion['address']
            })
            this.state.hospitalArray[0].map((item) => {
                this.state.listMarker.push(item)
            })
        }
    }
    changeRegion() {
        mapRef.current.animateToRegion({
            latitude: parseFloat(this.state.selectedLon),
            longitude: parseFloat(this.state.selectedLat),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5
        })
    }
    goHome = () => {
        console.log('skjdfsdgfsdf')
        // this.props.navigation.popToTop()
        // return true;
        // const popAction = StackActions.pop(1)
        // this.props.navigation.dispatch(popAction)
        // this.props.navigation.navigate('Form')
    }
    render() {
        return (
            <View
                style={{ height: '100%', width: '100%', backgroundColor: 'white' }}
            >
                <TouchableOpacity
                    style={{ width: 30, height: 30, position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                    activeOpacity={.7}
                    onPress={() => { this.props.navigation.navigate('Form') }}>
                    <Image
                        style={{ width: 30, height: 30, position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                        source={Images.close}
                    />
                </TouchableOpacity>
                <Modal
                    visible={this.state.rsModal}
                    transparent={true}
                >
                    <TouchableOpacity
                        onPress={() => { this.setState({ rsModal: false }) }}
                        style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center' }}
                    >
                        <View
                            style={{ padding: 20, width: screenWidth * 0.8, borderRadius: 20, backgroundColor: 'white', alignSelf: 'center' }}
                        >
                            <Text style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>{this.state.hospitalSelected}</Text>
                            <Text style={{ width: '100%', textAlign: 'center', fontSize: 16 }}>Alamat</Text>
                            <Text style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{this.state.hospitalAddrSelected}</Text>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <MapView
                    ref={mapRef}
                    style={{ width: '100%', height: '100%' }}
                    region={{
                        latitude: parseFloat(this.state.selectedLat),
                        longitude: parseFloat(this.state.selectedLon),
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    {this.state.listMarker.map((item, index) => {
                        return (
                            <Marker
                                onPress={() => { this.setState({ rsModal: true, hospitalSelected: item['name'], hospitalAddrSelected: item['address'] }) }}
                                draggable={false}
                                coordinate={{
                                    latitude: parseFloat(item['lat']),
                                    longitude: parseFloat(item['lon'])
                                }}
                                title={item['label']}
                                key={index}
                            />
                        )
                    })}
                </MapView>
                <View
                    style={{
                        height: 220, width: '100%',
                        backgroundColor: 'white', zIndex: 10,
                        position: 'absolute', bottom: 0, left: 0,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    {this.state.listMarker.length < 2 && (
                        <CardView
                            style={{ height: 200, margin: 10 }}
                            cardElevation={10}
                            cardMaxElevation={10}
                            cornerRadius={15}
                        >
                            <View style={{ padding: 20 }}>
                                <Text style={{ width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{this.state.namaRS}</Text>
                                <Text style={{ width: '100%', textAlign: 'center', fontSize: 16, marginTop: 20 }}>{this.state.alamatRS}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20 }}>

                                <TouchableOpacity
                                    style={{ marginRight: 10, flex: 1, justifyContent: 'center' }}
                                    onPress={() => { Linking.openURL(this.state.url) }}
                                >
                                    <Image
                                        source={Images.ic_nav}
                                        style={{ width: 30, height: 30, alignSelf: 'center' }}
                                    />
                                    <Text style={{ alignSelf: 'center' }}>ui.ac.id</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginRight: 10, flex: 1, justifyContent: 'center' }}
                                    onPress={() => { Linking.openURL(`tel:${this.state.phoneNumber}`) }}
                                >
                                    <Image
                                        source={Images.phone_call}
                                        style={{ width: 30, height: 30, alignSelf: 'center' }}
                                    />
                                    <Text style={{ alignSelf: 'center' }}>08896876757</Text>
                                </TouchableOpacity>
                            </View>
                        </CardView>
                    )}
                    {this.state.listMarker.length > 1 && (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{ height: '100%' }}
                        >
                            {
                                this.state.listMarker.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={.7}
                                            key={index}
                                            style={{ height: 200, width: screenWidth * 0.8 }}
                                            onPress={() => {
                                                console.tron.log(item)
                                                this.setState({ selectedLat: parseFloat(item['lat']), selectedLon: parseFloat(item['lon']) })
                                                this.changeRegion()
                                            }}
                                        >
                                            <CardView
                                                style={{ height: '100%', margin: 10 }}
                                                cardElevation={10}
                                                cardMaxElevation={10}
                                                cornerRadius={15}
                                            >
                                                <View style={{ padding: 20 }}>
                                                    <Text style={{ width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{item['name']}</Text>
                                                    <Text style={{ width: '100%', textAlign: 'center', fontSize: 16, marginTop: 5 }}>{item['address']}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20 }}>

                                                    <TouchableOpacity
                                                        style={{ marginRight: 10, flex: 1, justifyContent: 'center' }}
                                                        onPress={() => { this.openMaps(item['lat'], item['lon']) }}
                                                    >
                                                        <Image
                                                            source={Images.ic_nav}
                                                            style={{ width: 30, height: 30, alignSelf: 'center' }}
                                                        />
                                                        <Text style={{ alignSelf: 'center' }}>Mulai</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{ marginRight: 10, flex: 1, justifyContent: 'center' }}
                                                        onPress={() => { Linking.openURL(`tel:${item['telphone']}`) }}
                                                    >
                                                        <Image
                                                            source={Images.phone_call}
                                                            style={{ width: 30, height: 30, alignSelf: 'center' }}
                                                        />
                                                        <Text style={{ alignSelf: 'center' }}>{item['telphone']}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </CardView>
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </ScrollView>
                    )}

                </View>
            </View>
        )
    }
}

export default Maps;
