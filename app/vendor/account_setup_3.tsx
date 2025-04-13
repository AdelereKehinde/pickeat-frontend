import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ActivityIndicator, Platform, Alert, Image, TextInput, Pressable, ScrollView  } from "react-native";
import { Link, router } from "expo-router";
import Checkbox from '../../assets/icon/checkbox.svg';
import TitleTag from '@/components/Title';
import CharFieldDropDown from '@/components/CharFieldDropdown';
import CharField from '@/components/CharField';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Delay from '@/constants/Delay';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ConnectionModal from '@/components/ConnectionModal';

export default function AccountSetup3(){
  const { theme, toggleTheme } = useContext(ThemeContext);
  const toastConfig = {
      success: CustomToast,
      error: CustomToast,
  };
  const [openState, setOpenState] = useState({available_from:false, available_to:false, available_on_holiday: false, time_start: false, time_end: false, no_of_worker: false, terms: false})
  const [data, setData] = useState({available_from:"", time_end:"", available_on_holiday: false, time_start: '', available_to: "", no_of_worker: 0, terms: false});
  const dropdown = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednessday', value: 'wednessday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday ', value: 'sunday' },
  ]

  const availability = [
    { label: "Yes, I'm available", value: 'true' },
    { label: "No, I'm not available", value: 'false' },
  ]

  const [showTime, setShowTime] = useState(['', false]);
  const [time, setTime] = useState(new Date(0, 0, 1, 10, 0, 0));

  const onChangeTime = (event: any, selectedTime: any) => {
    if (selectedTime) {
        var timer = showTime[0]
        setShowTime(['', false]);
        setTime(selectedTime);
        // alert(selectedTime)
        // Format Time: '10:00am'
        const hours = selectedTime.getHours();
        const minutes = selectedTime.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        if (timer == 'time_start'){
          setData(prevState => ({...prevState, time_start: `${formattedHours}:${formattedMinutes} ${ampm}`,}));
        // alert(`${formattedHours}:${formattedMinutes} ${ampm}`)
        }
        if (timer == 'time_end'){
          setData(prevState => ({...prevState, time_end: `${formattedHours}:${formattedMinutes} ${ampm}`,}));
        }
    }
    // alert(data.time_start)
   // Close the picker
  };
  
  const workers = [
    { label: '2 people', value: '2' },
    { label: '3 people', value: '3' },
    { label: '4 people', value: '4' },
    { label: '5 people', value: '5' },
    { label: '6 people', value: '6' },
    { label: '7 people', value: '7' },
    { label: '8 people ', value: '8' },
    { label: 'more than 8 people ', value: '9' },
  ]

  const validateInput = () =>{
    if((data.available_to !== '') && (data.available_on_holiday !== false) && (data.no_of_worker !== 0) && (data.available_from !== '') && (data.terms !== false) && (data.time_end !== '') && (data.time_start !== '')){
      return true;
    }
    return false; 
  }

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state 

  const handleRequest = async () => {
    if(!loading && validateInput()){
        try {
            setLoading(true)
            const updatedProfile = await postRequest(ENDPOINTS['vendor']['availability'], data, true);
            setLoading(false)
            Toast.show({
                type: 'success',
                text1: "Profile Updated.",
                visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            // await Delay(3000)
            router.replace({
                pathname: '/vendor/set_store_address',
            }); 
        
        } catch (error: any) {
            setLoading(false)
            // alert(JSON.stringify(error))
            Toast.show({
                type: 'error',
                text1: "An error occured",
                text2: error.data?.message || 'Unknown Error',
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            setError(error.data?.message || 'Unknown Error'); // Set error message
        }
    }
  };

    return (
      <SafeAreaView>
        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}
        >
            <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
            <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full mb-4`}>
              <TitleTag withprevious={true} title='Create Profile' withbell={false}/>
            </View> 

            {/* Page requires intermet connection */}
            <ConnectionModal />
            {/* Page requires intermet connection */}
            
            <ScrollView className='px-4' contentContainerStyle={{ flexGrow: 1 }}>
            <View className='w-full grow'>

              {showTime[1] && (
                <DateTimePicker
                  value={time}
                  mode="time" // Set mode to "time" for time picker
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Use spinner for iOS, default for Android
                  onChange={onChangeTime}
                />
              )}

              <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-custom-green'} p-2`}>
                <View className='space-y-1'>
                  <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'}`}>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, available_from: !openState.available_from}));}}
                    >
                      <CharFieldDropDown options={dropdown} open={openState.available_from}  placeholder="----------" focus={false} border={false} name='From' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, available_from: value,})); setOpenState(prevState => ({...prevState, available_from: false}))}}/>
                    </Pressable>
                  </View>
                  <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'}`}>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, available_to: !openState.available_to}));}}
                    >
                      <CharFieldDropDown options={dropdown} open={openState.available_to}   placeholder="----------" focus={false} border={false} name='To' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, available_to: value,})); setOpenState(prevState => ({...prevState, available_to: false}))}}/>
                    </Pressable>
                  </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} mt-3`}>
                  <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, available_on_holiday: !openState.available_on_holiday}));}}
                    >
                    <CharFieldDropDown options={availability} open={openState.available_on_holiday}   placeholder="----------" focus={false} border={false} name='Available during Holidays' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, available_on_holiday: eval(value),})); setOpenState(prevState => ({...prevState, available_on_holiday: false}))}}/>
                  </Pressable>
                </View>

                <View className='flex flex-row justify-between -mt-2'>
                  <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} mt-3 w-[49%]`}>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setShowTime(['time_start', true]);}}
                    >
                      <CharFieldDropDown options={[]} active={false} open={openState.time_start}  placeholder="----------" focus={false} border={false} name='Time Start' setValue={data.time_start} getValue={(value: string)=>{setData(prevState => ({...prevState, time_start: value,})); }}/>
                    </Pressable>
                  </View>
                  <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} mt-3 w-[49%]`}>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setShowTime(['time_end', true]);}}
                    >
                      <CharFieldDropDown options={[]} active={false} open={openState.time_end}  placeholder="----------" focus={false} border={false} name='Time End' setValue={data.time_end} getValue={(value: string)=>{setData(prevState => ({...prevState, time_end: value,})); }}/>
                    </Pressable>
                  </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} mt-1`}>
                  <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, no_of_worker: !openState.no_of_worker}));}}
                    >
                    <CharFieldDropDown options={workers} open={openState.no_of_worker}  placeholder="----------" focus={false} border={false} name='Total Number of Workers' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, no_of_worker: parseInt(value),})); setOpenState(prevState => ({...prevState, no_of_worker: false}))}}/>
                  </Pressable>
                </View>
                
              </View>

              <View className='flex flex-row mt-2'>
                <Pressable
                onPress={()=>{setData(prevState => ({...prevState, terms: !openState.terms,})); setOpenState(prevState => ({...prevState, terms: !openState.terms}));}}
                className=''
                > 
                    <View className='flex flex-row mt-4 space-x-1'>
                      {openState.terms? 
                          <Checkbox/>:
                          <View className='border border-gray-300 h-5 w-5 rounded-sm'>
                      
                          </View>
                      }
                      <Text
                      style={{fontFamily: 'Inter-Regular'}}
                      className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-center text-[11px]`}
                      >
                        I understand and agree with the <Text style={{fontFamily: 'Inter-SemiBold'}} className='text-custom-green'>Terms and Conditions</Text> 
                      </Text>
                    </View>      
                </Pressable>
            </View>

              <View className='w-[90%] mx-auto mt-auto mb-10'>
                <TouchableOpacity
                onPress={handleRequest}
                className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                >
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    Done
                  </Text>
                  {loading && (
                    <View className='absolute w-full top-4'>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    )
}