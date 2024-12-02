import React, { memo, useEffect, useState } from 'react';
import {
  ViewProps,
  View,
  Platform,
  Dimensions,
  Image,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import Slider from '@react-native-community/slider';
export interface ModalComProps extends ViewProps {
  show: boolean;
  setImageShow: (show: boolean) => void;
  setImagesModalShow: (show: boolean) => void;
}

import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';

const ImageModalCom = memo(({ show, setImageShow, setImagesModalShow }: ModalComProps) => {
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : Dimensions.get('window').height + Constants.statusBarHeight;

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
            setImagesModalShow(false);
          }}
        />
      }>
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        <ScrollView
          horizontal
          style={{
            height: 300,
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => {
              setImageShow(true);
            }}>
            <Image source={require('@/assets/images/1.jpg')} style={styles.img} />
          </Pressable>
          <Pressable
            onPress={() => {
              setImageShow(true);
            }}>
            <Image source={require('@/assets/images/1.jpg')} style={styles.img} />
          </Pressable>
          <Pressable
            onPress={() => {
              setImageShow(true);
            }}>
            <Image source={require('@/assets/images/1.jpg')} style={styles.img} />
          </Pressable>
          <Pressable
            onPress={() => {
              setImageShow(true);
            }}>
            <Image source={require('@/assets/images/1.jpg')} style={styles.img} />
          </Pressable>
          <Pressable
            onPress={() => {
              setImageShow(true);
            }}>
            <Image source={require('@/assets/images/1.jpg')} style={styles.img} />
          </Pressable>
          <Pressable
            onPress={() => {
              setImageShow(true);
            }}>
            <Image source={require('@/assets/images/1.jpg')} style={styles.img} />
          </Pressable>
          <Pressable
            onPress={() => {
              setImageShow(true);
            }}>
            <Image source={require('@/assets/images/1.jpg')} style={styles.img} />
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
});
export default ImageModalCom;

const styles = StyleSheet.create({
  img: {
    width: 200,
    height: 300,
    objectFit: 'contain',
    marginRight: 10,
  },
});
