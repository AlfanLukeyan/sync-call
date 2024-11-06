import React, {useEffect, useRef, useState} from 'react';
import {View, Button, Alert} from 'react-native';
import Janus from '../../helper/janus';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';

registerGlobals();

const CallScreen = () => {
  const janus = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);

  // Control States
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(false);

  const testServer = () => {
    Janus.init({
      debug: 'all',
      callback: () => {
        janus.current = new Janus({
          server: 'ws://192.168.1.27:8188/', // Replace with your server URL
          success: () => {
            console.log('Janus server is valid and connected.');
            Alert.alert('Success', 'Janus server is valid and connected.');
            janusStart(); // Initialize Janus session and attach plugins
          },
          error: error => {
            console.error('Janus connection error:', error);
            Alert.alert('Error', 'Janus connection error: ' + error);
          },
          destroyed: () => {
            console.log('Janus session destroyed');
          },
        });
      },
    });
  };

  const janusStart = () => {
    janus.current.attach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => {
        const register = {
          request: 'join',
          room: 1234,
          ptype: 'publisher',
          display: 'User_' + Math.floor(Math.random() * 1000),
        };
        pluginHandle.send({message: register});
      },
      error: error => Alert.alert('Error attaching plugin', error),
      onmessage: (msg, jsep) => {
        if (jsep) peerConnection.current.setRemoteDescription(jsep);
      },
      onlocalstream: stream => {
        setLocalStream(stream);
      },
      onremotestream: stream => {
        setRemoteStream(stream);
      },
      oncleanup: () => {
        setRemoteStream(null);
      },
    });
  };

  const startLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      if (peerConnection.current) {
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
    });

    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
      }
    };

    pc.ontrack = event => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current = pc;
  };

  const toggleAudioMute = () => {
    if (localStream) {
      localStream
        .getAudioTracks()
        .forEach(track => (track.enabled = !audioMuted));
      setAudioMuted(!audioMuted);
    }
  };

  const toggleVideoMute = () => {
    if (localStream) {
      localStream
        .getVideoTracks()
        .forEach(track => (track.enabled = !videoMuted));
      setVideoMuted(!videoMuted);
    }
  };

  const toggleSpeaker = () => {
    InCallManager.setForceSpeakerphoneOn(!speakerEnabled);
    setSpeakerEnabled(!speakerEnabled);
  };

  const endCall = () => {
    if (janus.current) {
      janus.current.destroy();
    }
    setLocalStream(null);
    setRemoteStream(null);
    Alert.alert('Call Ended');
  };

  useEffect(() => {
    createPeerConnection();
    startLocalStream();
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (localStream) {
        localStream.release();
      }
    };
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Test Janus Server" onPress={testServer} />

      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{width: 200, height: 200, marginBottom: 10}}
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{width: 200, height: 200, marginBottom: 10}}
        />
      )}

      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Button
          title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
          onPress={toggleAudioMute}
        />
        <Button
          title={videoMuted ? 'Unmute Video' : 'Mute Video'}
          onPress={toggleVideoMute}
        />
        <Button
          title={speakerEnabled ? 'Disable Speaker' : 'Enable Speaker'}
          onPress={toggleSpeaker}
        />
        <Button title="End Call" color="red" onPress={endCall} />
      </View>
    </View>
  );
};

export default CallScreen;
