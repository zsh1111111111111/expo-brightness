import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { Skia, Canvas, Rect, Paint, Group } from '@shopify/react-native-skia';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function App() {
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    // detection options
    // autoScale: true,
  }).current;

  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  const [face, setFace] = useState<Face | null>(null);

  const aFaceW = useSharedValue(0);
  const aFaceH = useSharedValue(0);
  const aFaceX = useSharedValue(0);
  const aFaceY = useSharedValue(0);
  const aRot = useSharedValue(0);

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[], frame: any) => {
    if (faces && faces.length > 0) {
      const face = faces[0];
      const { bounds } = faces[0];
      const { width, height, x, y } = bounds;
      console.log('faces detected111', width, height, x, y);
      aFaceW.value = width;
      aFaceH.value = height;
      aFaceX.value = x;
      aFaceY.value = y;
    }
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // frame.render();
    const faces = detectFaces(frame);
    handleDetectedFaces(faces, frame);
  }, []);

  const [facingFront, setFacingFront] = useState<boolean>(true);
  // const cameraDevice = useCameraDevice(facingFront ? 'front' : 'back');
  const device = useCameraDevice(facingFront ? 'front' : 'back');

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log({ status });
    })();
  }, [device]);

  function handleUiRotation(rotation: number) {
    aRot.value = rotation;
  }

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    borderWidth: 4,
    borderLeftColor: 'rgb(0,255,0)',
    borderRightColor: 'rgb(0,255,0)',
    borderBottomColor: 'rgb(0,255,0)',
    borderTopColor: 'rgb(255,0,0)',
    width: withTiming(aFaceW.value, {
      duration: 100,
    }),
    height: withTiming(aFaceH.value, {
      duration: 100,
    }),
    left: withTiming(aFaceX.value, {
      duration: 100,
    }),
    top: withTiming(aFaceY.value, {
      duration: 100,
    }),
    transform: [
      {
        rotate: `${aRot.value}deg`,
      },
    ],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'red', position: 'relative' }}>
      {!!device ? (
        <Camera
          style={styles.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          onUIRotationChanged={handleUiRotation}
        />
      ) : (
        <Text>No Device</Text>
      )}

      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Button onPress={() => setFacingFront((current) => !current)} title={'Toggle Cam'} />
        </View>
      </View>

      {/* 添加错误边界和条件检查 */}
      <Animated.View style={animatedStyle} />
    </View>
  );
}
const styles = StyleSheet.create({
  absoluteFill: {
    flex: 1,
    width: '100%',
    height: '100%',
    // height: 500,
  },
});
