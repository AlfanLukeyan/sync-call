import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  View,
  TextInput,
  Button,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  RTCView,
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  registerGlobals,
  RTCSessionDescription,
} from 'react-native-webrtc';
import Janus from 'janus-gateway';

import {ThemedText, ThemedView} from '../../components';
import {Colors} from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp} from '@react-navigation/native';

export default function CallScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const janus = useRef<Janus | null>(null);
  const pluginHandle = useRef<any>(null);
  registerGlobals();

  useEffect(() => {
    Janus.init({
      debug: 'all',
      callback: () => {
        console.log('Janus initialized:', Janus);
        initializeJanus();
      },
    });
  }, []);

  const initializeJanus = () => {
    janus.current = new Janus({
      server: 'ws://192.168.1.27:8188/', // Replace with your Janus server URL
      success: attachPlugin,
      error: error => console.error('Janus connection error:', error),
      destroyed: () => console.log('Janus session destroyed'),
    });
  };

  const attachPlugin = () => {
    janus.current!.attach({
      plugin: 'janus.plugin.videoroom',
      success: plugin => {
        pluginHandle.current = plugin;
        joinRoom();
      },
      error: error => console.error('Error attaching plugin:', error),
      onremotetrack: handleRemoteStream,
    });
  };

  const joinRoom = () => {
    const register = {
      request: 'join',
      room: 1234, // Your room ID
      ptype: 'publisher',
      display: username,
    };
    pluginHandle.current.send({message: register});
    startLocalStream();
    setJoined(true);
  };

  const startLocalStream = () => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          frameRate: 30,
          facingMode: 'user',
          width: 1280,
          height: 720,
        },
      })
      .then(stream => {
        setLocalStream(stream);
        pluginHandle.current.createOffer({
          media: {audio: true, video: true},
          stream,
          success: (jsep: RTCSessionDescription) => {
            const publish = {request: 'publish', audio: true, video: true};
            pluginHandle.current.send({message: publish, jsep});
          },
          error: (error: string) => console.error('WebRTC error:', error),
        });
      })
      .catch(error => console.error('getUserMedia error:', error));
  };

  const handleRemoteStream = (stream: MediaStream) => {
    setRemoteStreams(prevStreams => [...prevStreams, stream]);
  };

  const leaveRoom = () => {
    if (pluginHandle.current) {
      pluginHandle.current.send({message: {request: 'leave'}});
      pluginHandle.current.hangup();
    }
    if (janus.current) {
      janus.current.destroy({
        success: () => console.log('Janus session destroyed'),
      });
    }
    setJoined(false);
    setLocalStream(null);
    setRemoteStreams([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {!joined ? (
          <View style={styles.joinContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={username}
              onChangeText={setUsername}
            />
            <Button title="Join Room" onPress={joinRoom} />
          </View>
        ) : (
          <>
            <ThemedView style={styles.videoContainer}>
              {localStream && (
                <RTCView streamURL={localStream.toURL()} style={styles.video} />
              )}
              {remoteStreams.map((stream, index) => (
                <RTCView
                  key={index}
                  streamURL={stream.toURL()}
                  style={styles.video}
                />
              ))}
            </ThemedView>
            <ThemedView style={styles.footerContainer}>
              <TouchableOpacity onPress={leaveRoom}>
                <ThemedView style={styles.endCallButton}>
                  <Ionicons
                    size={24}
                    name="call"
                    color={Colors.light.background}
                  />
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          </>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  joinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  endCallButton: {
    borderRadius: 30,
    padding: 10,
    backgroundColor: 'red',
  },
});
