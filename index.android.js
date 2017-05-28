/**
 * Cat countdown
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity ,
  Button,
  View
} from 'react-native';

export default class TestProj extends Component {

    constructor(props) {
        super(props);

        this.state = {

            countdownHours: '',
            countdownMinutes: '',

            countdown: 0,
            countdownInitial: 0,
            countdownHandle: '',

            photoHandle: '',
            photo: 'http://thecatapi.com/api/images/get?format=src&type=jpg&r=' + Math.random()
        };
    }

    doTick (dt) {

        const nextCountdown = this.state.countdown - dt
        if (nextCountdown <= 0) {

            clearInterval(this.state.countdownHandle)

            this.setState({
                countdown: 0,
                countdownHandle : ''
            })
        }
        else {

            this.setState({
                countdown: nextCountdown
            })
        }

    }

    isCountingDown() {
    //    return true
        return !!this.state.countdownHandle;
    }
    
    pauseResumeCountdown() {

        if (this.isCountingDown()) {
            clearInterval(this.state.photoHandle)
            clearInterval(this.state.countdownHandle)
            
            this.setState({
                countdownHandle: '',
                countdownMinutes: '',
                countdownHours: '',
                countdown: 0,
                countdownInitial: 0,
                photo: 'http://thecatapi.com/api/images/get?format=src&size=small&type=jpg'
            })
        }
        else {

            const ms = parseInt(this.state.countdownMinutes)
            const hs = parseInt(this.state.countdownHours)

            const t = (isNaN(ms) ? 10 : ms + (isNaN(hs) ? 10 : hs) * 60) * 60
            
            this.setState({
                countdown: t,
                countdownInitial: t,
                countdownHandle: setInterval(() => this.doTick(0.1), 100),
                photoHandle: setInterval(() => this.setState({
                    photo: 'http://thecatapi.com/api/images/get?format=src&type=jpg&size=small&r=' + Math.random()
                }), 15000)
            })
        }
    }

    resetCountdown() {

        if (this.isCountingDown()) {

            clearInterval(this.state.countdownHandle)
            this.setState({ countdown : 0, countdownHandle: '' })
        }
    }

    countdownPercentage() {

        const {
            countdownInitial,
            countdown
        } = this.state

        return countdownInitial == 0 ? 0 : (100 - (100 * countdown / countdownInitial)).toFixed(1)
    }

    isStartDisabled() {
        const {
            countdownHours,
            countdownMinutes
        } = this.state

        return !countdownHours || !countdownMinutes
    }

    render() {

        const {
            countdownHandle,
            countdownInitial,
            countdownHours,
            countdownMinutes,
            countdown,
            photo
        } = this.state


        let startCountdownButton = this.isStartDisabled() ? [styles.button, { opacity: 0.25, color: '#ccc' }] : styles.button

        const padOut = v => {
            v = parseInt(v)
            return isNaN(v) ? '00' : (v < 10 ? '0' : '') + v
        }
        
    return (
        <View style={styles.container}>

            {!this.isCountingDown() && <View style={styles.rows}>
                <Text style={styles.welcome}>
                        You're watching the clock?
                </Text>
                    <Text style={styles.instructions}>
                        Watch me instead. Let's countdown.
                        You know how this goes..
                </Text>

                    <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems : 'center'
                    }}>
                    <TextInput
                        style={styles.inputfields}
                        value={countdownHours}
                        placeholder='hh'
                        keyboardType='phone-pad'
                        onChangeText={text => this.setState({ countdownHours: text })}
                        maxLength={2} />
                    <Text
                        style={{ color: '#fff', fontWeight:'bold',fontSize:24 }}
                    >:</Text>
                    <TextInput
                        style={styles.inputfields}
                        value={countdownMinutes}
                        placeholder='mm'
                        keyboardType='phone-pad'
                        onChangeText={text => this.setState({ countdownMinutes: text })}
                        maxLength={2} />
                    </View>
                    <TouchableOpacity onPress={() => this.pauseResumeCountdown()} style={{ width: '50%' }} disabled={this.isStartDisabled()}>
                    <Text style={startCountdownButton} >{this.isCountingDown() ? 'Pause' : 'Let\'s do this'}</Text>
                    </TouchableOpacity>
            </View>
            }

            {
                this.isCountingDown() && <View style={styles.rows}>

                    <Image source={{ uri: photo }} style={{ borderRadius : 60, width: 120, height: 120, marginBottom : 15 }} />

                    <Text style={styles.instructions}>We're pretty much counting down from {padOut(countdownHours)} : {padOut(countdownMinutes)}.{'\n\n'}Like, right now.</Text>
                    <Text style={styles.welcome}>{this.countdownPercentage()}%</Text>


                    <View style={{ width: '100%', marginBottom : 35, height: 5, backgroundColor: '#22c' }}>
                        <View style={{ width: this.countdownPercentage() + '%', height: 5, backgroundColor: '#00ff55' }} />
                    </View>
                    {
                        this.isCountingDown() && <TouchableOpacity onPress={() => this.resetCountdown()} style={{ width: '50%' }} disabled={this.isStartDisabled()}>
                            <Text style={[styles.button, { fontSize: 14 }]} >{'Stop this maddness!'}</Text>
                        </TouchableOpacity>
                    }
                </View>
            }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44f',
    },
    rows: {
        width: '100%',
        alignItems: 'center'
    },
    button: {
        padding: 15,
        fontSize: 18,
        backgroundColor: '#22c',
        color: '#fff',
        borderRadius: 5,
        textAlign: 'center', 
        width: '100%'
    },
    inputfields: {
        borderBottomWidth: 2,
        color:'#fff',
        borderBottomColor: '#fff',
        margin : 15
    },
    welcome: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
    paddingTop: 35,
    paddingBottom: 35,
    //marginBottom: 25
  },
    instructions: {
      width:'75%',
    fontSize: 14, 
    textAlign: 'center',
    color: '#cfc'
  },
});

AppRegistry.registerComponent('TestProj', () => TestProj);
