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
import { getRequest, postRequest } from '@/api/RequestHandler';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoader from '@/components/FullScreenLoader';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function CreateProfile(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();
    const { user } = useUser();
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [profession_category, setProfessionCategory] = useState('');    
    const [openState, setOpenState] = useState({gender:false, vehicle_type:false,})
    const [data, setData] = useState({gender:'', first_name:"", last_name: "", contact_mail: '', phone_number: "", vehicle_type: "", vehicle_brand: "", plate_number: ""});
      

    interface Item1 {
        id: number;
        category_name: string;
      }
    interface Item {
        id: number;
        name: string;
        categories: Item1[];
      }
    const [profession_option, setProfessionOption] = useState<Item[]>([]);
    const [profession_category_option, setProfessionCategoryOption] = useState<Item1[]>([]);;
    
    const [fetchloading, setFetchLoading] = useState(true); // Loading state

    // useEffect(() => {
    //     const fetchProfessions = async () => {
    //         try {
    //             setFetchLoading(true)
    //             type ApiCategories = { id: number; category_name: string;};
    //             // Define the type for an array of ApiCategories objects
    //             type ApiCategoriesArray = ApiCategories[];
    //             type ApiResponse = { id: number; name: string; categories: ApiCategoriesArray};
    //             // Define the type for an array of ApiResponse objects
    //             type ApiResponseArray = ApiResponse[];

    //             const response = await getRequest<ApiResponseArray>(ENDPOINTS['account']['profession'], false); // Authenticated
    //             // alert(JSON.stringify(response))
    //             setProfessionOption(response)
    //             setFetchLoading(false)
    //         } catch (error) {
    //             // alert(error);
    //         }
    //     };
    
    //     fetchProfessions();
    // }, []); // Empty dependency array ensures this runs once

    const loadCategory = (value: string) => { 
        setData(prevState => ({...prevState, profession: parseInt(value),}));
        setProfessionCategory('')
        // alert(JSON.stringify(profession_option))
        // alert(JSON.stringify(profession_option.find(item => (item.id === parseInt(value)))?.categories))
        const oCategory = profession_option.find(item => (item.id == parseInt(value)))?.categories
        setProfessionCategoryOption(oCategory || [])
    }

    const validateInput = () =>{
        if(data.contact_mail.includes(".com") && (data.first_name !== '') && (data.last_name !== '') && (data.gender !== "") && (data.vehicle_type !== "") && (data.vehicle_brand !== "") && (data.plate_number !== '') && (data.phone_number !== '')){
          return true;
        }
        return false; 
    }

    const gender_option = [
        { label: 'Male', value: 'M' },
        { label: 'Femal', value: 'F' },
    ]
    const vehicle_type_options = [
        { label: 'Truck', value: 'truck' },
        { label: 'Car', value: 'car' },
        { label: 'Bike', value: 'bike' },
        { label: 'Tricycle', value: 'tricycle' },
    ]

      const [loading, setLoading] = useState(false); // Loading state
      const [error, setError] = useState(''); // Error state 
  
      const handleRequest = async () => {
        if(!loading && validateInput()){
            try {
                setLoading(true)
                const updatedProfile = await postRequest(ENDPOINTS['vendor']['onboard'], data, true);
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
                // await Delay(3000)
                router.replace({
                    pathname: '/vendor/account_setup_2',
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

                {/* {fetchloading && (
                    <FullScreenLoader />
                )} */}

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
                                    (data.first_name !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        First Name
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="First Name*" focus={true} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, first_name: value}))}/>
                            </View>
                            <View>
                                {
                                    (data.last_name !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Last Name
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Last Name*" focus={true} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, last_name: value}))}/>
                            </View>
                            <View>
                                {
                                    (data.contact_mail !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Contact mail*
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Contact mail*" focus={true} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, contact_mail: value}))}/>
                            </View>
                            <View>
                                {
                                    (data.gender !== '' ) && (
                                    <Text
                                            style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Gender
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, gender: !openState.gender}));}}
                                >
                                    <CharFieldDropDown options={gender_option} open={openState.gender}  placeholder="Gender" focus={false} border={true} name='' getValue={(value: string)=>{setData(prevState => ({...prevState, gender: value,})); setOpenState(prevState => ({...prevState, gender: false}))}}/>
                                </Pressable>
                            </View> 
                            {
                                (data.phone_number !== "" ) && (
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className='text-[12px] text-custom-green ml-1 mt'
                                    >
                                    Contact phone number
                                    </Text>
                                )
                            }
                            <View className='flex flex-row'>
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} rounded-md w-12 h-12 flex items-center justify-around mr-2 border border-gray-300'`}>
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-white' : ' text-gray-600'} text-[11px] text-center`}
                                    >
                                        +234
                                    </Text>
                                </View>
                                <View className='grow'>
                                    <PhoneNumber  placeholder="Contact Phone Number" focus={false} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, phone_number: value}))}/>
                                </View>
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
                            All details you provided must be true, accurate and non-misleading. In the event you provided wrong information, you shall be held liable for such misconduct
                            </Text>
                        </View>

                        <View
                        className='flex w-full mt-3 space-y-3'
                        >   
                            <View>
                                {
                                    (data.vehicle_type !== '' ) && (
                                    <Text
                                            style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Vehicle type
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, vehicle_type: !openState.vehicle_type}));}}
                                >
                                    <CharFieldDropDown options={vehicle_type_options} open={openState.vehicle_type}  placeholder="Vehicle type" focus={false} border={true} name='' getValue={(value: string)=>{setData(prevState => ({...prevState, vehicle_type: value,})); setOpenState(prevState => ({...prevState, vehicle_type: false}))}}/>
                                </Pressable>
                            </View> 
                                
                            <View>
                                {
                                    (data.vehicle_brand !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Vehicle Brand
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Vehicle Brand" focus={true} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, vehicle_brand: value}))}/>
                            </View>

                            <View>
                                {
                                    (data.plate_number !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Plate Number
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Plate Number" focus={true} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, plate_number: value}))}/>
                            </View>
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