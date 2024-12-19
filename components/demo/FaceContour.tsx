import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface FaceContourProps {
  faceData: Face[];
  style?: any;
  showDebug?: boolean;
  contourColor?: string;
  contourWidth?: number;
}

const FaceContour: React.FC<FaceContourProps> = ({
  faceData,
  style,
  showDebug = false,
  contourColor = 'yellow',
  contourWidth = 3,
}) => {
  console.log('faceData:::', faceData);
  // 使用 useMemo 优化计算
  const facePoints = useMemo(() => calculateFacePoints(faceData), [faceData]);
  const pathData = useMemo(() => generatePath(facePoints), [facePoints]);

  // 动画属性
  const animatedProps = useAnimatedProps(() => ({
    d: pathData,
  }));

  return (
    <View style={[styles.container, style]}>
      <Svg height="100%" width="100%">
        <G>
          {/* 主轮廓 */}
          <AnimatedPath
            animatedProps={animatedProps}
            stroke={contourColor}
            strokeWidth={contourWidth}
            fill="none"
          />

          {showDebug && (
            <>
              {/* 调试信息 */}
              <Rect
                x={faceData.bounds.x}
                y={faceData.bounds.y}
                width={faceData.bounds.width}
                height={faceData.bounds.height}
                stroke="green"
                strokeWidth="2"
                fill="none"
              />

              {/* 特征点 */}
              {facePoints.map((point, index) => (
                <Circle key={index} cx={point.x} cy={point.y} r="2" fill="red" />
              ))}

              {/* 角度指示器 */}
              <Path d={getAngleIndicator(faceData)} stroke="blue" strokeWidth="2" />
            </>
          )}
        </G>
      </Svg>
    </View>
  );
};

// 辅助函数
const calculateFacePoints = (faceData: Face[]) => {
  // ... 之前的计算逻辑
};

const generatePath = (points: any) => {
  // ... 之前的路径生成逻辑
};

const getAngleIndicator = (faceData: Face[]) => {
  // ... 角度指示器逻辑
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    ...StyleSheet.absoluteFillObject,
  },
});

export default React.memo(FaceContour);
