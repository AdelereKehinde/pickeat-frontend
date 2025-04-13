import React, { useState, useEffect, useContext } from 'react';
import { Text, View, ScrollView, TouchableOpacity,StatusBar,ActivityIndicator, StyleSheet, Platform, Alert, Image, TextInput, Pressable} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Link, router, useGlobalSearchParams } from "expo-router";
import TitleTag from '@/components/Title';
import TitleCase from '@/components/TitleCase';

import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest, patchRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import PhoneNumber from '@/components/NumberField';
import FullScreenLoader from '@/components/FullScreenLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ConnectionModal from '@/components/ConnectionModal';

export default function MealDetails(){
  const { theme, toggleTheme } = useContext(ThemeContext);
    const {id} = useGlobalSearchParams()
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };

    type mealInfo = { id: number; category: number[]; meal_name: 'string'; meal_description: string; thumbnail: string; discount: string; price: string; in_stock: string;}
    const [mealData, setMealData] = useState<mealInfo>()
    
    type ApiCategories = { id: number; category_name: string;};
    // Define the type for an array of ApiCategories objects
    type ApiCategoriesArray = ApiCategories[];
    const [category_option, setCategoryOption] = useState<ApiCategories[]>([]);

    const [loading, setLoading] = useState(false); // Loading state
    const [fetchloading, setFetchLoading] = useState(false); // Loading state
    const [deactivate, setDeactivate] = useState(false); // Error state 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setFetchLoading(true)
                const storedData = await AsyncStorage.getItem('categories');
                if (storedData){
                    const parsedData: ApiCategoriesArray = JSON.parse(storedData);
                    setCategoryOption((prevCategories) => [...prevCategories, ...parsedData]);
                }   
                
                const mealDetails = await getRequest<mealInfo>(`${ENDPOINTS['admin']['meal-detail']}/${id}`, true);
                setMealData(mealDetails)
                // alert(JSON.stringify(mealDetails)) 
                setFetchLoading(false)
            } catch (error) {
                setFetchLoading(false)
              // alert(error);
          }
      };
  
      fetchCategories();
    }, []); // Empty dependency array ensures this runs once

    const handleDeactivate = () =>{
        if(!deactivate){
            setDeactivate(true)
        }
    }
    
    return (
      <SafeAreaView>
        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex items-center`}
        >
            <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
            <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full mb-4`}>
              <TitleTag withprevious={true} title='Menu' withbell={false}/>
            </View>

            {fetchloading && (
              <FullScreenLoader />
            )}

            {/* Page requires intermet connection */}
            <ConnectionModal />
            {/* Page requires intermet connection */}

            <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
              <View className='px-4 w-full'>
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 flex items-center mt-2`}>
                  <View
                  className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-24 h-24 rounded-full flex items-center justify-center overflow-hidden`}>
                    {/* Image Preview */}
                        <Image 
                        source={{ uri: mealData?.thumbnail }} 
                        style={{ width: 100, height: 100}} />   
                    </View>
                </View>

                <View
                className={`flex w-full mt-5 space-y-3`}
                >   
                  <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg py-2 px-2`}>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className='text-[13px] text-custom-green ml-2 mt-1'
                    >
                      Meal name
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-600'} text-[12px] ml-2 mt-1`}
                    >
                      {mealData?.meal_name}
                    </Text>
                  </View>

                  <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg py-2 px-2`}>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className='text-[13px] text-custom-green ml-2 mt-1'
                    >
                      Meal price
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-600'} text-[12px] ml-2 mt-1`}
                    >
                      {mealData?.price}
                    </Text>
                  </View>
                  <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg py-2 px-2`}>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className='text-[13px] text-custom-green ml-2 mt-1'
                    >
                      Price discount
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-600'} text-[12px] ml-2 mt-1`}
                    >
                      {mealData?.discount}%
                    </Text>
                  </View>
                  <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg py-2 px-2`}>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className='text-[13px] text-custom-green ml-2 mt-1'
                    >
                      Category
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-600'} text-[12px] ml-2 mt-1`}
                    >
                      {category_option.find(obj => obj.id === (mealData?.category[0]))?.category_name}
                    </Text>
                  </View>
                  <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg py-2 px-2`}>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className='text-[13px] text-custom-green ml-2 mt-1'
                    >
                      Meal Description
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-600'} text-[12px] ml-2 mt-1`}
                    >
                      {mealData?.meal_description}
                    </Text>
                  </View>
                </View>
                
                <View className='w-[90%] mx-auto mb-16 mt-3'>
                <TouchableOpacity
                onPress={handleDeactivate}
                className={`text-center ${(deactivate)? 'bg-custom-green' : 'bg-red-600'} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
                >
                  {loading && (
                    <View className='absolute w-full top-4'>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
              
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    {deactivate? 'Activate Meal':'Deactivate Meal'}
                  </Text>
                      
                </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  shadow_box: {
    // iOS shadow properties
    shadowColor: '#1212126a',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    // Android shadow property
    elevation: 100,
  },
});