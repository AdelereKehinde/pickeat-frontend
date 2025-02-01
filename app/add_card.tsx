import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import KitchenCard from '@/components/Kitchen';
import Search from '../assets/icon/search.svg';
import Filter from '../assets/icon/filter.svg';
import Check from '../assets/icon/check.svg'
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { postRequest } from '@/api/RequestHandler';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Delay from '@/constants/Delay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function AddCard(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };

    const [cardNumber, setCardNumber] = useState('')
    const [mm, setMm] = useState('')
    const [yy, setYy] = useState('')
    const [cvv, setCvv] = useState('')
    const [name, setName] = useState('')


    const [isFocused, setIsFocus] = useState('number');
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const validateInput = () =>{
        if((cardNumber!= '') && (mm.length== 2) && (yy.length == 2) && (cvv.length == 3) && (name!= '')){
          return true;
        }
        return false;
      }

    const handleLogin = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          type DataResponse = { message: string; token:string; refresh: string };
          type ApiResponse = { status: string; message: string; data:DataResponse };
          const res = await postRequest<ApiResponse>(ENDPOINTS['payment']['buyer-create'], {
            card_number: cardNumber,card_name: name, expiry: `${mm}/${yy}`, cvv: cvv
        }, true);
          
          setLoading(false)

          Toast.show({
            type: 'success',
            text1: "Card Added Successfully",
            visibilityTime: 6000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });

          await Delay(2000)
          router.replace({
            pathname: '/wallet_page',
          }); 
        }

      } catch (error:any) {
        setLoading(false)
        // alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.data?.data?.message || 'Unknown Error',
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.data?.data?.message || 'Unknown Error'); // Set error message
      }
    };

    
    
    return (
      <SafeAreaView>
        <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex items-center`}>
          <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
            <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                <TitleTag withprevious={true} title='' withbell={false} />
            </View>
            
            <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
              <Text
              className={`${theme == 'dark'? 'bg-gray-800 text-white' : ' bg-white text-custom-green'} text-custom-green text-[15px] w-full text-left py-3 px-4`}
              style={{fontFamily: 'Inter-SemiBold'}}
              >
                  Add Card
              </Text>

              <View className='w-full my-3 px-6 flex items-start justify-center mt-10'>
                  <Text
                  className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[12px] text-left`}
                  style={{fontFamily: 'Inter-Medium'}}
                  >
                      Card number
                  </Text>
                  <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`w-full ${isFocused=='number'? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[14px]`}
                      autoFocus={false}
                      onFocus={()=>setIsFocus('number')}
                      onBlur={()=>setIsFocus('')}
                      onChangeText={setCardNumber}
                      defaultValue={cardNumber}
                      keyboardType="number-pad"
                      placeholder=""
                      placeholderTextColor=""
                  />
              </View>
              <View className='w-full my-3 px-6 flex flex-row space-x-2 justify-center'>
                  <View className='grow'>
                      <Text
                      className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[12px] text-left`}
                      style={{fontFamily: 'Inter-Medium'}}
                      >
                          MM
                      </Text>
                      <TextInput
                          style={{fontFamily: 'Inter-Medium'}}
                          className={`w-full ${isFocused=='mm'? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[14px]`}
                          autoFocus={false}
                          onFocus={()=>setIsFocus('mm')}
                          onBlur={()=>setIsFocus('')}
                          onChangeText={setMm}
                          defaultValue={mm}
                          placeholder=""
                          maxLength={2}
                          keyboardType="number-pad"
                          placeholderTextColor=""
                      />
                  </View>
                  <View className='grow'>
                      <Text
                      className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[12px] text-left`}
                      style={{fontFamily: 'Inter-Medium'}}
                      >
                          YY
                      </Text>
                      <TextInput
                          style={{fontFamily: 'Inter-Medium'}}
                          className={`w-full ${isFocused=='yy'? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[14px]`}
                          autoFocus={false}
                          onFocus={()=>setIsFocus('yy')}
                          onBlur={()=>setIsFocus('')}
                          onChangeText={setYy}
                          defaultValue={yy}
                          placeholder=""
                          maxLength={2}
                          keyboardType="number-pad"
                          placeholderTextColor=""
                      />
                  </View>
              </View>
              <View className='w-full my-3 px-6 flex items-start justify-center'>
                  <Text
                  className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[12px] text-left`}
                  style={{fontFamily: 'Inter-Medium'}}
                  >
                      CVV
                  </Text>
                  <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`w-full ${isFocused=='cvv'? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[14px]`}
                      autoFocus={false}
                      onFocus={()=>setIsFocus('cvv')}
                      onBlur={()=>setIsFocus('')}
                      onChangeText={setCvv}
                      defaultValue={cvv}
                      maxLength={3}
                      keyboardType="number-pad"
                      placeholder=""
                      placeholderTextColor=""
                  />
              </View>
              <View className='w-full my-3 px-6 flex items-start justify-center'>
                  <Text
                  className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[12px] text-left`}
                  style={{fontFamily: 'Inter-Medium'}}
                  >
                      Name on card
                  </Text>
                  <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`w-full ${isFocused=='name'? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[14px]`}
                      autoFocus={false}
                      onFocus={()=>setIsFocus('name')}
                      onBlur={()=>setIsFocus('')}
                      onChangeText={setName}
                      defaultValue={name}
                      placeholder=""
                      placeholderTextColor=""
                  />
              </View>

              <View className='w-[90%] mx-auto'>
                <TouchableOpacity
                onPress={handleLogin}
                className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
                >
                  {loading && (
                    <View className='absolute w-full top-4'>
                      <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                    </View>
                  )}
              
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    Add card
                  </Text>
                      
                </TouchableOpacity>
              </View>
            </ScrollView>
            <Toast config={toastConfig} />
          </View>
      </SafeAreaView>
    )
}