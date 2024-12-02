import { CameraView, CameraType, useCameraPermissions, CameraMode } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Brightness from 'expo-brightness';
import * as MediaLibrary from 'expo-media-library';

import { getLocales, getCalendars } from 'expo-localization';
import ModalCom from '@/components/ModalCom';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [index, setIndex] = useState<any>(0);
  const [brightness, setBrightness] = useState(0.5);
  const [cameraShow, setCameraShow] = useState(false);
  const CameraViewRef = useRef(null);
  const toggleBrightness = async (num: number) => {
    const { status } = await Brightness.requestPermissionsAsync();
    if (status === 'granted') {
      const res = await Brightness.getSystemBrightnessAsync();
      console.log(':::getSystemBrightnessAsync', res);
      await Brightness.setSystemBrightnessModeAsync(Brightness.BrightnessMode.MANUAL);
      await Brightness.setBrightnessAsync(num);
    }
  };
  useEffect(() => {
    toggleBrightness(brightness);
  }, [brightness]);

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }
  const [colors, setColors] = useState('red');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const togglebackGround = () => {
    // setIndex(Math.floor(Math.random() * colors.length));
    setIsModalVisible(true);
  };

  const takePhoto = async () => {
    setMode('picture');
    const res = await CameraViewRef.current?.takePictureAsync();
    console.log(':::takePictureAsync', res);
    if (res.uri) {
      saveImage(res.uri);
    }
  };

  const saveImage = async (imageUri: string) => {
    try {
      await MediaLibrary.saveToLibraryAsync(imageUri);
      alert('图片已保存到相册！');
    } catch (error) {
      console.error('保存图片到相册失败:', error);
      alert('保存图片到相册失败，请重试！');
    }
  };

  const startVideo = async () => {
    setMode('video');
    const res = await CameraViewRef.current?.recordAsync();
    console.log(':::recordAsync', res);
  };

  const pauseVideo = async () => {
    await CameraViewRef.current?.stopRecording();
  };
  const [mode, setMode] = useState<CameraMode>('picture');

  const {
    languageTag,
    languageCode,
    textDirection,
    digitGroupingSeparator,
    decimalSeparator,
    measurementSystem,
    currencyCode,
    currencySymbol,
    regionCode,
  } = getLocales()[0];

  const { calendar, timeZone, uses24hourClock, firstWeekday } = getCalendars()[0];

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors,
          position: 'relative',
        },
      ]}>
      <CameraView
        style={[
          styles.camera,
          {
            position: 'absolute',
            opacity: cameraShow ? 1 : 0,
            right: 30,
            top: 60,
          },
        ]}
        facing={facing}
        ref={CameraViewRef}
        mode={mode}></CameraView>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 2,
          justifyContent: 'space-between',
          paddingBottom: 50,
        }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>转换摄像头</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={togglebackGround}>
            <Text style={styles.text}>切换背景</Text>
          </TouchableOpacity>
          <View>
            {/* <TouchableOpacity style={styles.button} onPress={startVideo}>
              <Text style={styles.text}>录像开始</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pauseVideo}>
              <Text style={styles.text}>录像暂停</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setCameraShow(!cameraShow);
              }}>
              <Text style={styles.text}>显示/隐藏</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // setCameraSmall(!cameraSmall);
              }}>
              <Text style={styles.text}>全屏/小屏</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <View
          style={{
            width: '100%',
          }}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>拍照</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ModalCom
        show={isModalVisible}
        setColors={(color: string) => {
          setColors(color);
        }}
        setBrightness={(brightness: number) => {
          setBrightness(brightness);
        }}
        setShow={(show: boolean) => {
          setIsModalVisible(show);
        }}></ModalCom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: 200,
    height: 300,
  },
  buttonContainer: {
    width: '26%',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    // margin: 64,
    alignItems: 'center',
    paddingTop: 100,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    fontSize: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});
