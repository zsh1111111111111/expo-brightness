import { CameraView, CameraType, useCameraPermissions, CameraMode } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import * as Brightness from 'expo-brightness';
import * as MediaLibrary from 'expo-media-library';

import { getLocales, getCalendars } from 'expo-localization';
import ImageModalCom from '@/components/ImageModal';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraShow, setCameraShow] = useState(false);
  const CameraViewRef = useRef(null);

  function toggleCameraFacing() {
    console.log(6666);
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

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
  const addImage = () => {};

  const [imagesShow, setImagesShow] = useState(false);
  const [imageModalShow, setImagesModalShow] = useState(false);
  const openImageModal = () => {
    setImagesModalShow(true);
  };

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
    <View style={[styles.container]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <Text style={styles.text}>转换摄像头</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={openImageModal}>
          <Text style={styles.text}>模版</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setImagesShow(!imagesShow);
          }}>
          <Text style={styles.text}>显示/隐藏</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
        <CameraView
          style={[{ width: '100%', height: '100%' }]}
          facing={facing}
          ref={CameraViewRef}
          mode={mode}></CameraView>
        {imagesShow ? (
          <Image
            source={require('@/assets/images/1-edit.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        ) : (
          <></>
        )}

        <Pressable
          onPress={() => {
            takePhoto();
          }}>
          <Image
            source={require('@/assets/images/photo.png')}
            style={{
              width: 40,
              height: 40,
              objectFit: 'contain',
              position: 'absolute',
              left: '50%',
              bottom: 200,
              zIndex: 10,
              transform: [{ translateX: 20 }],
            }}
          />
        </Pressable>
      </View>

      <ImageModalCom
        show={imageModalShow}
        setImageShow={(show: boolean) => {
          setImagesShow(show);
          setImagesModalShow(false);
        }}
        setImagesModalShow={(show: boolean) => {
          setImagesModalShow(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 20,
    marginHorizontal: 6,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '100%',
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
});
