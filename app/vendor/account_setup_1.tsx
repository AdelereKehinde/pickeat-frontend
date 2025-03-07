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

export default function AccountSetup1(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();
    const { user } = useUser();
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [profession_category, setProfessionCategory] = useState('');    
    const [openState, setOpenState] = useState({experience:false, profession:false, profession_category: false, time_start: false, time_end: false, no_of_worker: false, work_alone: false, terms: false})
    const [data, setData] = useState({experience:0, business_name:"", business_email: "", business_number: '', profession: 0, profession_category: 0, promoID: "", description: "", additional_info: "", work_alone: '', terms: false});
      

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

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                setFetchLoading(true)
                type ApiCategories = { id: number; category_name: string;};
                // Define the type for an array of ApiCategories objects
                type ApiCategoriesArray = ApiCategories[];
                type ApiResponse = { id: number; name: string; categories: ApiCategoriesArray};
                // Define the type for an array of ApiResponse objects
                type ApiResponseArray = ApiResponse[];

                const response = await getRequest<ApiResponseArray>(ENDPOINTS['account']['profession'], false); // Authenticated
                // alert(JSON.stringify(response))
                setProfessionOption(response)
                setFetchLoading(false)
            } catch (error) {
                // alert(error);
            }
        };
    
        fetchProfessions();
    }, []); // Empty dependency array ensures this runs once

    const loadCategory = (value: string) => { 
        setData(prevState => ({...prevState, profession: parseInt(value),}));
        setProfessionCategory('')
        // alert(JSON.stringify(profession_option))
        // alert(JSON.stringify(profession_option.find(item => (item.id === parseInt(value)))?.categories))
        const oCategory = profession_option.find(item => (item.id == parseInt(value)))?.categories
        setProfessionCategoryOption(oCategory || [])
    }

    const validateInput = () =>{
        if(data.business_email.includes(".com") && data.terms && (data.business_name !== '') && (data.business_number !== '') && (data.experience !== 0) && (data.profession !== 0) && (data.profession_category !== 0) && (data.promoID !== '') && (data.work_alone !== '')){
          return true;
        }
        return false; 
    }

    const experience_options = [
        { label: '1 Yrs', value: 1 },
        { label: '2+ Yrs', value: 2 },
        { label: '3+ Yrs', value: 3 },
        { label: '4+ Yrs', value: 4 },
        { label: '5+ Yrs', value: 5 },
        { label: '6+ Yrs', value: 6 },
        { label: '7+ Yrs', value: 7 },
    ]
    const work_alone_options = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
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
                    store_name: data.business_name
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
                        className='flex w-full mt-3 space-y-2'
                        >
                            <View>
                                {
                                    (data.business_name !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Business Name
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Business Name*" focus={true} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, business_name: value}))}/>
                            </View>
                            {/* <View>
                                <CharField  placeholder="How do you want to address?" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                            </View> */}
                            {/* <View>
                                <CharField  placeholder="Full Name*" focus={false} border={true} name='' getValue={(value: string)=>setBusinessName(value)}/>
                            </View> */}
                            <View>
                                {
                                    (data.experience !== 0 ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Years of Experience
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, experience: !openState.experience}));}}
                                >
                                    <CharFieldDropDown options={experience_options} open={openState.experience}  placeholder="Years of Experience" focus={false} border={true} name='' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, experience: parseInt(value),})); setOpenState(prevState => ({...prevState, experience: false}))}}/>
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
                            All necessary info will be sent to business contact provided below
                            </Text>
                        </View>

                        <View
                        className='flex w-full mt-3 space-y-1'
                        >   
                            <View>
                                {
                                    (data.business_email !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Business mail
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Business mail*" focus={false} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, business_email: value}))}/>
                            </View>
                            <View className={`${theme == 'dark'? 'bg-transparent' : ' bg-gray-100'} py-3 border rounded-md border-gray-300 px-2`}>
                                <Text
                                style={{fontFamily: 'Inter-Regular'}}
                                className={`${theme == 'dark'? 'text-white' : ' text-gray-900'} text-[12px] ml-1 mt`}
                                >
                                    Selected Country Region
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className='text-[12px] text-custom-green ml-1 mt'
                                    >
                                        (Nigeria)
                                    </Text>
                                </Text>
                            </View>
                            {
                                (data.business_number !== "" ) && (
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className='text-[12px] text-custom-green ml-1 mt'
                                    >
                                    Business phone number
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
                                    <PhoneNumber  placeholder="Business Phone Number" focus={false} border={true} name='' getValue={(value: string)=>setData(prevState => ({...prevState, business_number: value}))}/>
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
                        className='flex w-full mt-3 space-y-1'
                        >   
                            <View>
                                {
                                    (data.profession !== 0 ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Profession
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-30'
                                onPress={()=>{setOpenState(prevState => ({...prevState, profession: !openState.profession}));}}
                                >
                                    <CharFieldDropDown options={profession_option.map(item => ({label: item.name, value: item.id}))} open={openState.profession}   placeholder="Profession*" focus={false} border={true} name='' setValue='' getValue={(value: string)=>{loadCategory(value); setOpenState(prevState => ({...prevState, profession: false}))}}/>
                                </Pressable>
                            </View> 
                            <View>
                                {/* <CharFieldDropDown options={profession_category_option.map(item => ({label: item.category_name, value: item.id}))}  placeholder="Category*" focus={false} border={true} name='' getValue={(value: string)=>setProfessionCategory(value)}/> */}
                                {
                                    (data.profession_category !== 0 ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Category
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-20'
                                onPress={()=>{setOpenState(prevState => ({...prevState, profession_category: !openState.profession_category}));}}
                                >
                                    <CharFieldDropDown options={profession_category_option.map(item => ({label: item.category_name, value: item.id}))} open={openState.profession_category}  placeholder="Category*" focus={false} border={true} setValue={profession_category} name='' getValue={(value: string)=>{setData(prevState => ({...prevState, profession_category: parseInt(value),})); setOpenState(prevState => ({...prevState, profession_category: false}))}}/>
                                </Pressable>
                            </View>
                            <View>
                                {
                                    (data.work_alone !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        You work alone?
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, work_alone: !openState.work_alone}));}}
                                >
                                    <CharFieldDropDown options={work_alone_options} open={openState.work_alone}  placeholder="You work alone?" focus={false} border={true} name='' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, work_alone: value})); setOpenState(prevState => ({...prevState, work_alone: false}))}}/>
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
                            In order to make points and benefits from PickEat {'\n'}PickIt please enter your membership ID
                            </Text>
                        </View>

                        <View
                        className='flex w-full mt-3 space-y-1'
                        >   
                            <View>
                                {
                                    (data.promoID !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Membership ID/Promo Code
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Membership ID/Promo Code" focus={false} border={true} name='' getValue={(value: string)=>{setData(prevState => ({...prevState, promoID: value}))}}/>
                            </View>
                        </View>
                        
                        <View className='flex flex-row mt-4'>
                            <TouchableOpacity
                            onPress={()=>{{setData(prevState => ({...prevState, terms: !prevState.terms}))}}}
                            className='mr-1 flex flex-row w-full space-x-1'
                            >
                                {data.terms? 
                                    <Checkbox/>:
                                    <View className='border border-gray-300 h-5 w-5 rounded-sm'>
                                
                                    </View>
                                }
                                <Text
                                style={{fontFamily: 'Inter-Regular'}}
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-center text-[11px]`}
                                >
                                    I understand and agree with the <Link href="/registration" style={{fontFamily: 'Inter-SemiBold'}} className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'}`}>Terms and Conditions</Link> 
                                </Text>
                            </TouchableOpacity>
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