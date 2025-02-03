import React from "react";
import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';


interface Properties {
    star: number,
    rating: number,
    total: number,
  }

const RatingMeter: React.FC<Properties> = ({ star, rating, total }) => {
    const percentage = (rating / total) * 100;
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <View className="flex-row items-center mb-3">
            <Text 
            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-900'} text-right text-sm text-[12px]`}
            style={{fontFamily: 'Inter-Medium'}}>
                {star} star{(star!==1) && 's'}
            </Text>
            <View className="flex-1 h-2 bg-blue-100 rounded-lg overflow-hidden mx-2">
                <View
                className="h-full bg-green-500"
                style={{ width: `${(total==0)? 0 : percentage}%` }}
                />
            </View>
            <Text 
            className="text-right text-sm text-[12px]"
            style={{fontFamily: 'Inter-Medium'}}>
                {rating}
            </Text>
        </View>
    );
};

export default RatingMeter