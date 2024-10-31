declare module 'react-native/Libraries/NativeModules/specs/NativeDevSettings' {
    const NativeDevSettings: {
      setIsDebuggingRemotely(value: boolean): void;
      setHotLoadingEnabled?(value: boolean): void;
      setIsShakeToShowDevMenuEnabled?(value: boolean): void;
    };
    export default NativeDevSettings;
  }