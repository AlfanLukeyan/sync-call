import React, {useEffect, useRef, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import Janus from 'janus-gateway';
import {RTCView, mediaDevices} from 'react-native-webrtc';

export default function JanusDemo() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [janusConnection, setJanusConnection] = useState(null);
  const [janusPlugin, setJanusPlugin] = useState(null);
  const localVideoRef = useRef(null);
  const myRoom = 1234; // Room ID
  const opaqueId = `videoroom-${Janus.randomString(12)}`;

  useEffect(() => {
    return () => {
      if (janusConnection) {
        janusConnection.destroy();
      }
    };
  }, [janusConnection]);

  const joinRoom = async role => {
    if (!username) {
      alert('Please enter a username');
      return;
    }
    setIsPublisher(role === 'publisher');
    setJoined(true);
    initializeJanus();
  };

  const initializeJanus = () => {
    Janus.init({
      debug: 'all',
      callback: () => {
        const janus = new Janus({
          server: 'ws://192.168.1.27:8188/', // Replace with your Janus server URL
          success: () => {
            setJanusConnection(janus);
            attachPlugin(janus);
          },
          error: error => {
            console.error('Error connecting to Janus', error);
            alert('Failed to connect to the Janus server');
          },
          destroyed: () => {
            resetState();
          },
        });
      },
    });
  };

  const attachPlugin = janus => {
    janus.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId,
      success: pluginHandle => {
        setJanusPlugin(pluginHandle);
        joinVideoRoom(pluginHandle);
      },
      error: error => {
        console.error('Error attaching plugin', error);
      },
      onmessage: handleOnMessage,
      onlocalstream: stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      },
      onremotestream: stream => {
        const remoteVideoRef =
          remoteParticipants[remoteParticipants.length - 1].videoRef;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      },
      oncleanup: () => console.log('Cleanup notification received.'),
    });
  };

  const joinVideoRoom = pluginHandle => {
    const register = {
      request: 'join',
      room: myRoom,
      ptype: isPublisher ? 'publisher' : 'subscriber',
      display: username,
    };
    pluginHandle.send({message: register});
  };

  const handleOnMessage = (msg, jsep) => {
    const event = msg['videoroom'];
    if (event === 'joined') {
      if (isPublisher) publishOwnFeed(true);
      if (msg['publishers']) handleRemotePublishers(msg['publishers']);
    } else if (event === 'event') {
      if (msg['publishers']) handleRemotePublishers(msg['publishers']);
      if (msg['leaving']) removeRemoteParticipant(msg['leaving']);
    }
    if (jsep) janusPlugin.handleRemoteJsep({jsep});
  };

  const publishOwnFeed = async useAudio => {
    const constraints = {audio: useAudio, video: true};
    const stream = await mediaDevices.getUserMedia(constraints);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    janusPlugin.createOffer({
      media: {
        audioRecv: true,
        videoRecv: true,
        audioSend: useAudio,
        videoSend: true,
      },
      stream,
      success: jsep =>
        janusPlugin.send({
          message: {request: 'publish', audio: useAudio, video: true},
          jsep,
        }),
      error: error => console.error('WebRTC error:', error),
    });
  };

  const handleRemotePublishers = publishers => {
    publishers.forEach(publisher => {
      setRemoteParticipants(prevParticipants => [
        ...prevParticipants,
        {
          id: publisher.id,
          display: publisher.display,
          videoRef: React.createRef(),
        },
      ]);
      attachRemoteFeed(publisher.id);
    });
  };

  const attachRemoteFeed = feedId => {
    janusConnection.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId: `remoteFeed-${Janus.randomString(12)}`,
      success: pluginHandle => {
        const subscribe = {
          request: 'join',
          room: myRoom,
          ptype: 'subscriber',
          feed: feedId,
        };
        pluginHandle.send({message: subscribe});
      },
      onremotestream: stream => {
        const videoRef = remoteParticipants.find(
          p => p.id === feedId,
        )?.videoRef;
        if (videoRef && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      },
    });
  };

  const removeRemoteParticipant = id => {
    setRemoteParticipants(prevParticipants =>
      prevParticipants.filter(participant => participant.id !== id),
    );
  };

  const toggleMute = () => {
    const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
    if (audioTracks.length > 0) {
      const muted = !audioTracks[0].enabled;
      audioTracks[0].enabled = muted;
      setIsMuted(muted);
    }
  };

  const toggleVideo = () => {
    const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
    if (videoTracks.length > 0) {
      const videoOff = !videoTracks[0].enabled;
      videoTracks[0].enabled = videoOff;
      setIsVideoOff(videoOff);
    }
  };

  const leaveRoom = () => {
    if (janusPlugin) janusPlugin.send({message: {request: 'leave'}});
    if (janusConnection) janusConnection.destroy();
    resetState();
  };

  const resetState = () => {
    setJoined(false);
    setIsPublisher(false);
    setRemoteParticipants([]);
    setJanusPlugin(null);
    setJanusConnection(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Janus WebRTC Demo - Multistream</Text>
      {!joined ? (
        <View style={styles.joinScreen}>
          <TextInput
            style={styles.usernameInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your name"
          />
          <Button
            title="Join as Publisher"
            onPress={() => joinRoom('publisher')}
          />
        </View>
      ) : (
        <View style={styles.videoScreen}>
          {isPublisher && (
            <RTCView
              ref={localVideoRef}
              style={styles.localVideo}
              objectFit="cover"
            />
          )}
          {remoteParticipants.map(participant => (
            <View key={participant.id} style={styles.participant}>
              <RTCView
                ref={participant.videoRef}
                style={styles.remoteVideo}
                objectFit="cover"
              />
              <Text>{participant.display}</Text>
            </View>
          ))}
          <View style={styles.controls}>
            {isPublisher && (
              <Button
                title={isMuted ? 'Unmute' : 'Mute'}
                onPress={toggleMute}
              />
            )}
            {isPublisher && (
              <Button
                title={isVideoOff ? 'Video On' : 'Video Off'}
                onPress={toggleVideo}
              />
            )}
            <Button title="Leave Room" onPress={leaveRoom} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 20, marginBottom: 20},
  joinScreen: {alignItems: 'center'},
  usernameInput: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginBottom: 10,
  },
  videoScreen: {alignItems: 'center', flex: 1},
  localVideo: {width: 300, height: 225, backgroundColor: 'black'},
  remoteVideo: {width: 300, height: 225, backgroundColor: 'black', margin: 10},
  controls: {flexDirection: 'row', marginTop: 10},
  participant: {alignItems: 'center', margin: 10},
});
