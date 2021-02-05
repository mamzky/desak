
import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker'
import RadioButton from 'react-native-radio-button'
import CardView from 'react-native-cardview'
import { Images } from '../../Themes';
import moment from 'moment'
import Api from '../../Services/Api'
const screenWidth = Dimensions.get("screen").width
const screenHeight = Dimensions.get("screen").height

const isPortrait = () => {
    const dim = Dimensions.get('window');
    return dim.height >= dim.width;
  };

class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleTimePicker: false,
            name: '',
            noTelp: '',
            selectionYes: [{ label: 'yes', value: 'yes' }],
            selectionNo: [{ label: 'no', value: 'no' }],
            face: false,
            arm: false,
            speech: false,
            time: '0.0',
            balance: false,
            eye: false,
            selectedHours: 0,
            selectedMinutes: 0,
            formVisible: true,
            loading: false,
            diagnoseResult: '',
            emergency: false,
            timeSelected: '0.00',
            hospitalInfo: '',
            hospitalArray: [],
            orientation: isPortrait() ? 'portrait' : 'landscape'
        }

    }
    componentDidMount() {
        Dimensions.addEventListener('change',()=>{
            this.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape'
              });
              console.tron.log(this.state.orientation)
        })
        this.setState({
            formVisible: true, name: '', noTelp: '', face: false, arm: false, speech: false,timeSelected: '0.00',
        })
        console.tron.log(this.state)
    }
    goToMaps() {
        this.setState({ formVisible: true })
        this.props.navigation.navigate('Maps', {
            hospitalInfo: this.state.hospitalInfo,
            emergency: false,
            hospitalArray: this.state.hospitalArray
        })
    }
    submitDiagnose(params) {
        this.setState({ loading: true })
        Api.create().submitDiagnosa(params).then((response) => {
            if (response.ok) {
                if (response.data['hospital'].length > 1) {
                    this.setState({ diagnoseResult: response.data['message'], hospitalArray: response.data['hospital'] })
                } else {
                    this.setState({ diagnoseResult: response.data['message'], hospitalInfo: response.data['hospital'] })
                }
                this.setState({ loading: false, formVisible: false })
            }
            this.setState({ diagnoseResult: response.data['message'],loading: false,formVisible: false })
        })
    }
    render() {
        return (
            <ScrollView
                style={{ height: '100%', width: '100%' }}
            >
                {this.state.loading && (<ActivityIndicator size={'small'} />)}
                <DateTimePicker
                    is24Hour={true}
                    isVisible={this.state.visibleTimePicker}
                    mode='time'
                    onConfirm={(value) => {
                        let timeSelected = moment(value).format('H.mm')
                        this.setState({ timeSelected, selectedHours: timeSelected.split('.')[0], selectedMinutes: timeSelected.split('.')[1] })
                        if (this.state.selectedHours < 4 && this.state.selectedMinutes < 30) {
                            this.setState({ emergency: true })
                        }
                        this.setState({ visibleTimePicker: false })
                    }}
                    onCancel={() => { this.setState({ visibleTimePicker: false }) }}
                />
                <Image
                    source={Images.img_desak_header}
                    style={{ width: '100%', height: this.state.orientation=='landscape' ? screenWidth * 0.8 : screenWidth * 0.6, resizeMode:'cover', marginTop:-5}}
                />
                <View>
                    <View style={{ width: '100%', height: 100, backgroundColor: 'white', borderRadius: 20, marginTop: -40, paddingTop: 20, padding: 10 }}>
                        <Image
                            source={Images.befast}
                            style={{ width: "100%", height: 100, resizeMode: 'cover' }}
                        />
                    </View>
                    {/* FORM INFORMATION */}
                    {this.state.formVisible && (

                        <View
                            style={{ padding: 20, marginTop: 20 }}
                        >
                            {/* NAMA */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold' }}>Nama</Text>
                                <TextInput
                                    onChangeText={(value) => { this.setState({ name: value }) }}
                                    value={this.state.name}
                                    style={{ width: screenWidth * 0.5, backgroundColor: '#D1D1D1', borderRadius: 20, height: 30, paddingBottom: 5, paddingLeft: 10 }}
                                />
                            </View>
                            {/* NO TELP */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>No Telpon</Text>
                                <TextInput
                                    keyboardType={'phone-pad'}
                                    onChangeText={(value) => { this.setState({ noTelp: value }) }}
                                    value={this.state.noTelp}
                                    style={{ width: screenWidth * 0.5, backgroundColor: '#D1D1D1', borderRadius: 20, height: 30, paddingBottom: 5, paddingLeft: 10 }}
                                />
                            </View>
                            <View style={{ width: '100%', height: 2, backgroundColor: 'black', marginVertical: 10 }}></View>
                            {/* FACE */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>F(Face)</Text>
                                    <Text>Ketidaksimetrisan wajah dengan meminta untuk tersenyum</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>Yes</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={this.state.face}
                                            onPress={
                                                () => {
                                                    this.setState({ face: true })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>No</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={!this.state.face}
                                            onPress={
                                                () => {
                                                    this.setState({ face: false })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                </View>
                            </View>

                            {/* ARM */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>A(Arm)</Text>
                                    <Text>Kelemahan pada lengan salah satu sisi dengan meminta mengangkat kedua tangan</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>Yes</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={this.state.arm}
                                            onPress={
                                                () => {
                                                    this.setState({ arm: true })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>No</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={!this.state.arm}
                                            onPress={
                                                () => {
                                                    this.setState({ arm: false })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                </View>
                            </View>

                            {/* SPEECH */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>S(Speech)</Text>
                                    <Text>Melihat kelainan dalam berbicara</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>Yes</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={this.state.speech}
                                            onPress={
                                                () => {
                                                    this.setState({ speech: true })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>No</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={!this.state.speech}
                                            onPress={
                                                () => {
                                                    this.setState({ speech: false })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                </View>
                            </View>

                            {/* TIME */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>T(Time)</Text>
                                    <Text>Waktu kejadian</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5 }}>
                                    <TouchableOpacity
                                        style={{ width: '100%', height: 25, backgroundColor: '#d1d1d1', borderRadius: 5 }}
                                        onPress={() => { this.setState({ visibleTimePicker: true }) }}
                                    >
                                        <Text style={{ width: '100%', textAlign: 'center' }}>{this.state.timeSelected}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* BALANCE */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>B(Balance)</Text>
                                    <Text>Cara berjalannya dan kelemahan pada ekstrimitas bawah</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>Yes</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={this.state.balance}
                                            onPress={
                                                () => {
                                                    this.setState({ balance: true })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>No</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={!this.state.balance}
                                            onPress={
                                                () => {
                                                    this.setState({ balance: false })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                </View>
                            </View>

                            {/* EYE */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>E(Eye)</Text>
                                    <Text>Adanya gangguan penglihatan seperti kehilangan pernglihatan, diplopia dan andangan kabut</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>Yes</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={this.state.eye}
                                            onPress={
                                                () => {
                                                    this.setState({ eye: true })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ alignSelf: 'center' }}>No</Text>
                                        <RadioButton
                                            outerColor='#414141'
                                            innerColor='#414141'
                                            isSelected={!this.state.eye}
                                            onPress={
                                                () => {
                                                    this.setState({ eye: false })
                                                }
                                            }
                                            size={15} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    {this.state.formVisible && (
                        <View style={{ marginRight: 20, marginBottom: 20, flexDirection: 'column-reverse' }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'center', height: 42, width: 144, backgroundColor: '#414141', borderRadius: 20, alignSelf: 'flex-end' }}
                                onPress={() => {
                                    let params = {
                                        "name": this.state.name,
                                        "telphone": this.state.noTelp,
                                        "face": this.state.face ? "Yes" : "No",
                                        "arm": this.state.arm ? "Yes" : "No",
                                        "speech": this.state.speech ? "Yes" : "No",
                                        "time": this.state.timeSelected,
                                        "balance": this.state.balance ? "Yes" : "No",
                                        "eye": this.state.eye ? "Yes" : "No"
                                    }
                                    let valid = true
                                    if (this.state.name.length == 0) {
                                        Alert.alert("Perhatian", 'Nama belum terisi')
                                    } else if (this.state.noTelp.length == 0) {
                                        Alert.alert("Perhatian", 'Nomor Telpon belum terisi')
                                    } else if (this.state.timeSelected === "0.00") {
                                        Alert.alert("Perhatian", 'Kolom waktu belum terisi')
                                    } else {
                                        this.submitDiagnose(params)
                                    }
                                }}
                            >
                                <Text style={{ fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>Diagnosa</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!this.state.formVisible && (
                        <View style={{ padding: 10, marginTop: 40 }}>
                            <CardView
                                style={{ width: '100%', height: 150 }}
                                cardElevation={10}
                                cardMaxElevation={10}
                                cornerRadius={15}
                            >
                                <TouchableOpacity
                                    style={{ width: 30, height: 30, position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                                    activeOpacity={.7}
                                    onPress={() => { 
                                        // this.props.navigation.navigate('Home') 
                                        this.setState({
                                            formVisible: true, name: '', noTelp: '', face: false, arm: false, speech: false, timeSelected:'0.00'
                                        })
                                        }}>
                                    <Image
                                        style={{ width: 30, height: 30, position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                                        source={Images.close}
                                    />
                                </TouchableOpacity>

                                <View style={{ width: '100%', height: '100%', padding: 20, justifyContent: 'center', flexDirection: 'column' }}>
                                    <Text style={{ width: '100%', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{this.state.diagnoseResult}</Text>
                                </View>
                            </CardView>

                            {this.state.diagnoseResult === 'Anda mengalami gejala stroke' && (
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', height: 42, width: 184, backgroundColor: '#414141', borderRadius: 20, alignSelf: 'center', marginTop: 40 }}
                                    onPress={() => {
                                        this.goToMaps()
                                    }}
                                >
                                    <Text style={{ fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>Mencari RS Terdekat</Text>
                                </TouchableOpacity>
                            )}

                        </View>
                    )}
                </View>

            </ScrollView>
        )
    }
}

export default Form;
