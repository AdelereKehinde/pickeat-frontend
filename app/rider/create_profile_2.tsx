import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,StatusBar,ActivityIndicator, ScrollView, Pressable, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Notice from '../../assets/icon/notice.svg';
import Checkbox from '../../assets/icon/checkbox.svg';
import Skip from '@/components/Skip';
import CharField from '@/components/CharField';
import CharFieldDropDown from '@/components/CharFieldDropdown';
import TitleTag from '@/components/Title';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';
import PhoneNumber from '@/components/NumberField';
import Delay from '@/constants/Delay';
import { getRequest, patchRequest, postRequest } from '@/api/RequestHandler';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoader from '@/components/FullScreenLoader';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function CreateProfile2(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();
    const { user } = useUser();
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const [openState, setOpenState] = useState({guarantor_1_relationship:false, guarantor_2_relationship :false, work_duration:false, terms:false})
    const [data, setData] = useState({
        guarantor_1_relationship:'', 
        guarantor_1_name: "", 
        guarantor_1_phone: "", 
        guarantor_2_relationship:"", 
        guarantor_2_name: "", 
        guarantor_2_phone: "", 
        previous_workplace: "", 
        work_duration: '', 
    });
      
    interface Item {
        id: number;
        name: string;
      }
    const [relationshipOption, setRelationshipOption] = useState<Item[]>([]);
    const workDurationOptions = [
        { label: '1 Yrs', value: 1 },
        { label: '2 Yrs', value: 2 },
        { label: '3 Yrs', value: 3 },
        { label: '4 Yrs', value: 4 },
        { label: '5 Yrs', value: 5 },
        { label: '6 Yrs', value: 6 },
        { label: '7 Yrs', value: 7 },
        { label: '8 Yrs', value: 8 },
        { label: '9 Yrs', value: 9 },
        { label: 'More than 10 years', value: 10 },
    ]

    const [fetchloading, setFetchLoading] = useState(true); // Loading state
    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                setFetchLoading(true)
                type RelationShipType = { id: number; name: string;};
                const relationship_response = await getRequest<RelationShipType[]>(ENDPOINTS['rider']['relationship'], false); // Authenticated
                // alert(JSON.stringify(response))
                setRelationshipOption(relationship_response)
                setFetchLoading(false)
            } catch (error) {
                // alert(error);
            }
        };
    
        fetchProfessions();
    }, []); // Empty dependency array ensures this runs once

    const validateInput = () =>{
        if((data.guarantor_1_name !== '') && (data.guarantor_1_phone !== '') && (data.guarantor_1_relationship !== "") && (data.guarantor_2_name !== "") && (data.guarantor_2_phone !== "") && (data.guarantor_2_relationship !== '') && (data.previous_workplace !== '') && (data.work_duration !== '')){
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
                const updatedProfile = await postRequest(ENDPOINTS['rider']['onboard-2'], data, true);
                setLoading(false)
                Toast.show({
                    type: 'success',
                    text1: "Profile Created.",
                    visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
                setUser({
                    email: user?.email,
                    phone_number:  user?.phone_number,
                    avatar: user?.avatar,
                    first_name: user?.first_name,
                    full_name: user?.full_name,
                    // store_name: data.business_name
                  })
                await Delay(1000)
                router.replace({
                    pathname: '/rider/create_profile_3',
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
                    <TitleTag withprevious={false} title='Create Profile' withbell={false}/>
                </View> 

                {fetchloading && (
                    <FullScreenLoader />
                )}

                <ScrollView className='' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className=' w-[95%] mx-auto'>

                        <View
                        className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full mt-3 flex flex-row items-center p-3 rounded-lg`}
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
                        className='flex w-full mt-3 space-y-3'
                        >
                            <View>
                                {
                                    (data.guarantor_1_name !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Guarantor 1 Name
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Guarantor 1 Name*" focus={true} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, guarantor_1_name: value}))}/>
                            </View>
                            {
                                (data.guarantor_1_phone !== "" ) && (
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className='text-[12px] text-custom-green ml-1 mt'
                                    >
                                    Guarantor 1 phone number
                                    </Text>
                                )
                            }
                            <View className='flex flex-row items-center'>
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} rounded-md w-12 h-12 flex items-center justify-around mr-2 border border-gray-300`}>
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-white' : ' text-gray-600'} text-[11px] text-center`}
                                    >
                                        +234
                                    </Text>
                                </View>
                                <View className='grow'>
                                    <PhoneNumber  placeholder="Guarantor 1 Phone Number*" focus={false} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, guarantor_1_phone: value}))}/>
                                </View>
                            </View>
                            <View>
                                {
                                    (data.guarantor_1_relationship !== '' ) && (
                                    <Text
                                            style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Relationship
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, guarantor_1_relationship: !openState.guarantor_1_relationship}));}}
                                >
                                    <CharFieldDropDown options={relationshipOption.map(item => ({label: item.name, value: item.id}))} open={openState.guarantor_1_relationship}  placeholder="Relationship" focus={false} border={true} name='' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, guarantor_1_relationship: value,})); setOpenState(prevState => ({...prevState, guarantor_1_relationship: false}))}}/>
                                </Pressable>
                            </View> 
                        </View>
                        
                        
                        <View
                        className='flex w-full mt-3 space-y-3'
                        >
                            <View>
                                {
                                    (data.guarantor_2_name !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Guarantor 2 Name
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Guarantor 2 Name*" focus={false} border={true} name='' setValue='' getValue={(value: string)=>setData(prevState => ({...prevState, guarantor_2_name: value}))}/>
                            </View>
                            {
                                (data.guarantor_2_phone !== "" ) && (
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className='text-[12px] text-custom-green ml-1 mt'
                                    >
                                    Guarantor 2 phone number
                                    </Text>
                                )
                            }
                            <View className='flex flex-row items-center'>
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} rounded-md w-12 h-12 flex items-center justify-around mr-2 border border-gray-300`}>
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-white' : ' text-gray-600'} text-[11px] text-center`}
                                    >
                                        +234
                                    </Text>
                                </View>
                                <View className='grow'>
                                    <PhoneNumber  placeholder="Guarantor 2 Phone Number*" focus={false} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, guarantor_2_phone: value}))}/>
                                </View>
                            </View>
                            <View>
                                {
                                    (data.guarantor_2_relationship !== '' ) && (
                                    <Text
                                            style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Relationship
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, guarantor_2_relationship: !openState.guarantor_2_relationship}));}}
                                >
                                    <CharFieldDropDown options={relationshipOption.map(item => ({label: item.name, value: item.id}))} open={openState.guarantor_2_relationship}  placeholder="Relationship" focus={false} border={true} name='' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, guarantor_2_relationship: value,})); setOpenState(prevState => ({...prevState, guarantor_2_relationship: false}))}}/>
                                </Pressable>
                            </View> 
                        </View>
                        

                        <View
                        className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full mt-3 flex flex-row items-center p-3 rounded-lg`}
                        >
                            <Notice/>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className='text-custom-green ml-2 text-[11px]'
                            >
                            All details you provided must be true, accurate {`\n`}and non-misleading.
                            </Text>
                        </View>

                        <View
                        className='flex w-full mt-3 space-y-3'
                        >   

                            <View>
                                {
                                    (data.previous_workplace !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Previous Place of Work  
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Previous Place of Work" focus={false} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, previous_workplace: value}))}/>
                            </View>
                            <View>
                                {
                                    (data.work_duration !== '' ) && (
                                    <Text
                                            style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        How long did you work there for?
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, vehicle_type: !openState.work_duration}));}}
                                >
                                    <CharFieldDropDown options={workDurationOptions} open={openState.work_duration}  placeholder="How long did you work there for?" focus={false} border={true} name='' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, work_duration: value,})); setOpenState(prevState => ({...prevState,work_durationvehicle_type: false}))}}/>
                                </Pressable>
                            </View>

                            <Pressable
                            onPress={()=>{setData(prevState => ({...prevState, terms: !openState.terms,})); setOpenState(prevState => ({...prevState, terms: !openState.terms}));}}
                            className=''
                            > 
                                <View className='flex flex-row mt-4 space-x-1 items-center'>
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


                        <View className='w-[90%] mx-auto mb-10 mt-3'>
                            <TouchableOpacity
                            onPress={handleRequest}
                            className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
                            >
                                <Text
                                className='text-white'
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                Continue
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