import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { TruncatedText } from "./TitleCase";
import { router } from "expo-router";

type FoodItem = {
  id: number;
  name: string;
  image: string;
};

type FoodDisplayProps = {
  foodItems: FoodItem[];
};

const FoodDisplay: React.FC<FoodDisplayProps> = ({ foodItems }) => {
    return (
        <View className="mx-4 mt-2">
            <FlatList
                data={foodItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    onPress={()=>{router.push(`/confirm_order?meal_id=${item.id}`)}}
                    className=' flex items-center'>
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 64, height: 64, borderRadius: 8 }}
                            resizeMode="cover"
                        />
                        <Text className="text-[10px]" style={{fontFamily: 'Inter-Regular' }}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                // Add spacing between items with ItemSeparatorComponent
                ItemSeparatorComponent={() => <View className='w-3' />}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", color: "#9e9e9e", marginTop: 16 }}>No food items found</Text>
                }
            />
         </View>
    );
};

export default FoodDisplay;
