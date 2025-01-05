import React, { useState, useRef } from "react";
import { View, Text, Animated, PanResponder } from "react-native";

type SliderProps = {
  initialValue?: number; // Default initial value of the slider
  onValueChange?: (value: number) => void; // Callback when value changes
};

const Slider: React.FC<SliderProps> = ({
  initialValue = 0.5,
  onValueChange,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0); // Dynamic slider width
  const [sliderValue, setSliderValue] = useState(initialValue);
  const panX = useRef(new Animated.Value(initialValue * sliderWidth)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      // Calculate the new position
      const newX = Math.max(
        0,
        Math.min(sliderWidth, gestureState.dx + sliderValue * sliderWidth)
      );

      // Calculate the normalized value (0 to 1)
      const newValue = newX / sliderWidth;

      // Update state and animation
      panX.setValue(newX);
      setSliderValue(newValue);

      // Trigger the callback with the clamped value
      if (onValueChange) {
        onValueChange(newValue);
      }
    },
  });

  return (
    <View className="w-full flex-row items-center justify-between px-5 my-4">
      <View
        className="flex-1 mx-4"
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
      >
        <View className="h-2 bg-gray-300 rounded-full w-full relative">
          {/* Active (filled) track */}
          <Animated.View
            className="absolute h-2 rounded-full"
            style={{
                backgroundColor: '#EF2A39',
                width: panX, // Dynamically change the width of the active part
            }}
          />
          {/* Thumb */}
          <Animated.View
            {...panResponder.panHandlers}
            className="absolute w-4 h-5 border-4 border-white rounded-2xl -mt-[7px] -ml-2"
            style={{
                backgroundColor: '#EF2A39',
                transform: [{ translateX: panX }],
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Slider;
