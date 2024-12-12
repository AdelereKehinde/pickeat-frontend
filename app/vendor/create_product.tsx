import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar,ActivityIndicator, StyleSheet, Platform, Alert, Image, TextInput,  } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Link, router, useGlobalSearchParams } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../../assets/icon/profile.svg';
import Camera from '../../assets/icon/camera.svg';
import TitleTag from '@/components/Title';
import Notice from '../../assets/icon/notice.svg';
import CharField from '@/components/CharField';
import CharFieldDropDown from '@/components/CharFieldDropdown';

import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import PhoneNumber from '@/components/NumberField';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function CreateProduct(){
    const {id} = useGlobalSearchParams()
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };

    type mealInfo = { id: number; category: string; meal_name: 'string'; meal_description: string; thumbnail: string; discount: string; price: string; in_stock: string;}
    const [mealData, setMealData] = useState<mealInfo>()
    
    type ApiCategories = { id: string; category_name: string;};
    // Define the type for an array of ApiCategories objects
    type ApiCategoriesArray = ApiCategories[];
    const [category_option, setCategoryOption] = useState<ApiCategories[]>([]);

    const [description, setDescription] = useState('')
    const [mealName, setMealName] = useState('')
    const [mealPrice, setMealPrice] = useState('')
    const [priceDiscount, setPriceDiscount] = useState('')
    const [mealCategory, setMealCategory] = useState('')
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const [data, setData] = useState({}); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [fetchloading, setFetchLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const validateInput = () =>{
      if((mealName !== "") && (parseInt(mealPrice) !== 0) && (mealCategory !== "") && (description !== "") && (parseInt(priceDiscount) !== 0) && (thumbnail !== "")){
        return true;
      }
      return false;
    }

    useEffect(() => {
      const fetchCategories = async () => {
          try {
              if(id){
                setFetchLoading(true)
                const mealDetails = await getRequest<mealInfo>(`${ENDPOINTS['inventory']['meal']}${id}`, true);
                // alert(JSON.stringify(mealDetails)) 
                setMealData(mealDetails)
                setMealName(mealDetails.meal_name)
                setDescription(mealDetails.meal_description)
                setPriceDiscount(mealDetails.discount)
                setMealPrice(mealDetails.price)

                setFetchLoading(false)
              }
              const response = await getRequest<ApiCategoriesArray>(ENDPOINTS['inventory']['categories'], false); // Authenticated
              setCategoryOption(response)
          } catch (error) {
              setFetchLoading(false)
              alert(error);
          }
      };
  
      fetchCategories();
    }, []); // Empty dependency array ensures this runs once

    const pickImage = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [5, 5],
        quality: 1,
      });
  
      if (!result.canceled) {
        setThumbnail(result.assets[0].uri);
      }
    };

    const handleRequest = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          //PREPARE THE FORMDATA
          const formData = new FormData();
          const file = {
            uri: thumbnail,
            name: 'upload.jpg',
            type: 'image/jpeg',
          };
          if (Platform.OS === 'android') {
            formData.append('thumbnail', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any);  
          } else {
            formData.append('thumbnail', file as any);
          }
          // Append additional fields
          formData.append('meal_name', mealName);
          formData.append('meal_description', description);
          formData.append('category', mealCategory);
          formData.append('discount', priceDiscount);
          formData.append('price', mealPrice);

          const res = await postRequest(ENDPOINTS['inventory']['create-meal'], formData, true, true);
          // alert(JSON.stringify(res))
          setLoading(false)

          Toast.show({
            type: 'success',
            text1: "Meal Successfully Created",
            visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });

          await Delay(2000)
          router.back()
        }

      } catch (error:any) {
        setLoading(false)
        // alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.response?.data?.data?.message || 'Unknown Error',
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.response.data?.data?.message || 'Unknown Error'); // Set error message
      }
    };
    
    return (
        <View 
        className='w-full h-full bg-gray-100 flex items-center'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='bg-white w-full'>
              <TitleTag withprevious={true} title='Menu' withbell={false}/>
            </View>

            {fetchloading && (
              <FullScreenLoader />
            )}

            <View className='px-4 w-full mt-4'>
              <View style={styles.shadow_box} className='bg-white w-full rounded-lg p-4 flex flex-row items-center mt-4'>
                <TouchableOpacity
                onPress={pickImage}
                className={`w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden ${thumbnail && 'border-2 border-custom-green'}`}>
                  {/* Image Preview */}
                  {id?
                    <Image 
                    source={{ uri: mealData?.thumbnail }} 
                    style={{ width: 100, height: 100}} />
                    :
                    thumbnail?
                      <Image 
                      source={{ uri: thumbnail }} 
                      style={{ width: 100, height: 100}} />
                      :
                      <View>
                        <Camera/>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className='text-[8px] text-gray-700 text-center -mt-2'
                        >
                          Upload{'\n'} Meal Photo
                        </Text>
                      </View>
                    
                  }
                </TouchableOpacity>
                <View  className='ml-4'>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[11px] text-custom-green'
                  >
                    Upload all meal related {'\n'}informations and pricing
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-Medium'}}
                  className='text-[10px] text-gray-400 '
                  >
                    1. Meal Photo{'\n'}
                    2. Pricing{'\n'}
                    3. Category{'\n'}
                    4. Description
                  </Text>
                </View>
              </View>

              <View
                className='w-full mt-3 flex flex-row items-center p-3 rounded-lg bg-blue-100'
                >
                <Notice/>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className='text-custom-green ml-2 text-[11px]'
                >
                    Please Kindly provide the correct info below
                </Text>
              </View>

              <View
                className='flex w-full mt-3 space-y-1'
                >   
                <View>
                    <CharField  placeholder="Meal Name*" focus={false} border={true} setValue={mealName} name='' getValue={(value: string)=>setMealName(value)}/>
                </View>
                <View>
                    <PhoneNumber  placeholder="Enter Meal Price*" focus={false} setValue={mealPrice} border={true} name=''  getValue={(value: string)=>setMealPrice(value)}/>
                </View>
                <View>
                    <PhoneNumber  placeholder="Enter Price Discount*" focus={false} setValue={priceDiscount} border={true} name='' getValue={(value: string)=>setPriceDiscount(value)}/>
                </View>
                <View>
                    <CharFieldDropDown options={category_option.map(item => ({label: item.category_name, value: item.id}))}  placeholder="Category?" focus={false} border={true} name='' getValue={(value: string)=>setMealCategory(value)}/>
                </View>
            </View>

              <View style={styles.shadow_box} className='bg-white w-full rounded-lg p-4 mt-4'>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className='text-[12px] text-custom-green -mt-2 border-b border-custom-green'
                >
                  Meal Description
                </Text>
                <TextInput
                  onChangeText={setDescription}
                  value={description}
                  multiline={true}
                  numberOfLines={5}
                  style={{fontFamily: 'Inter-SemiBold'}}
                  placeholder="Kindly Provide details below"
                  className="text-[12px] rounded-lg text-start"
                />
              </View>
              
              <View className='w-[90%] mx-auto mb-16 mt-3'>
              <TouchableOpacity
              onPress={handleRequest}
              className={`text-center ${(validateInput())? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
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
                  Save
                </Text>
                    
              </TouchableOpacity>
              </View>
            </View>
            <Toast config={toastConfig} />
        </View>
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