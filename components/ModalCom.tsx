import React, { memo, useEffect, useState } from 'react';
import { ViewProps, View, Platform, Dimensions, Image, Text, Pressable } from 'react-native';

import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import Slider from '@react-native-community/slider';
export interface ModalComProps extends ViewProps {
  show: boolean;
  setColors: (color: string) => void;
  setBrightness: (brightness: number) => void;
  setShow: (show: boolean) => void;
}

import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';

const ModalCom = memo(({ show, setColors, setBrightness, setShow }: ModalComProps) => {
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : Dimensions.get('window').height + Constants.statusBarHeight;

  const onSelectColor = ({ hex }: { hex: string }) => {
    // do something with the selected color.
    console.log(':::onSelectColor', hex);
    setColors(hex);
  };
  if (!show) return null;
  return (
    <Modal
      animationInTiming={0}
      isVisible={show}
      hardwareAccelerated
      statusBarTranslucent
      deviceHeight={deviceHeight}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
        // backgroundColor: 'blue',
      }}
      customBackdrop={
        <Pressable
          style={{ flex: 1, backgroundColor: 'transparent' }}
          onPress={() => {
            setShow(false);
          }}
        />
      }>
      <View
        style={{
          width: '100%',
          //   height: '70%',
          //   backgroundColor: '#fff',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <ColorPicker
          style={{
            width: '100%',
            backgroundColor: '#fff',
            paddingVertical: 30,
            paddingHorizontal: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          value="red"
          onComplete={onSelectColor}>
          {/* <Preview /> */}
          <Panel1
            style={{
              marginBottom: 20,
            }}
          />
          <HueSlider
            style={{
              marginBottom: 20,
            }}
          />
          <OpacitySlider
            style={{
              marginBottom: 20,
            }}
          />

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 50,
              backgroundColor: '#ccc',
            }}>
            <Slider
              style={{ width: '100%', height: 20 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              // value={brightness}
              onValueChange={(value) => {
                setBrightness(value);
              }}
            />
          </View>

          {/* <Swatches /> */}
        </ColorPicker>
      </View>
    </Modal>
  );
});
export default ModalCom;
