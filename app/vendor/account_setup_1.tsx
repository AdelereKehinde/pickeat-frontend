import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar,ActivityIndicator, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
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
import axios from 'axios';

import Delay from '@/constants/Delay';
import { getRequest, postRequest } from '@/api/RequestHandler';

export default function AccountSetup1(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [business_name, setBusinessName] = useState('')
    const [business_email, setBusinessEmail] = useState('');
    const [business_number, setBusinessNumber] = useState('')
    const [work_alone, setWorkAlone] = useState('No');
    const [terms, setTerms] = useState(true)
    const [description, setDescription] = useState('');
    const [additional_info, setAdditionalInfo] = useState('')
    const [profession, setProfession] = useState('');
    const [profession_category, setProfessionCategory] = useState('');
    const [experience, setExperience] = useState('');
    
    interface Item1 {
        id: string;
        category_name: string;
      }
    interface Item {
        id: string;
        name: string;
        categories: Item1[];
      }
    const [profession_option, setProfessionOption] = useState<Item[]>([]);
    const [profession_category_option, setProfessionCategoryOption] = useState<Item1[]>([{id: '1', category_name: '-----'}]);;


    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                type ApiCategories = { id: string; category_name: string;};
                // Define the type for an array of ApiCategories objects
                type ApiCategoriesArray = ApiCategories[];
                type ApiResponse = { id: string; name: string; categories: ApiCategoriesArray};
                // Define the type for an array of ApiResponse objects
                type ApiResponseArray = ApiResponse[];

                const response = await getRequest<ApiResponseArray>(ENDPOINTS['account']['profession'], false); // Authenticated
                setProfessionOption(response)
            } catch (error) {
                alert(error);
            }
        };
    
        fetchProfessions();
    }, []); // Empty dependency array ensures this runs once

    useEffect(() => { 
        if (profession != ''){
            alert(profession)
            alert(JSON.stringify(profession_option.find(item => (item.id == profession))?.categories))
            const oCategory = profession_option.find(item => (item.id == profession))?.categories
            setProfessionCategoryOption(oCategory)
        }
    }, []); // Empty dependency array ensures this runs once

    const validateInput = () =>{
        if(business_email.includes(".com") && terms){
          return true;
        }
        return false; 
    }

    const dropdown = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 },
        { label: 'Option 4', value: 4 },
        { label: 'Option 5', value: 5 },
        { label: 'Option 6', value: 6 },
        { label: 'Option 7', value: 7 },
        { label: 'Option 8', value: 8 },
        { label: 'Option 9', value: 9 },
        { label: 'Option 10', value: 10 },
    ]
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
        const profileData = {
            business_name: business_name,
            business_mail: business_email,
            business_number: business_number,
            work_alone: (work_alone == 'No')? false: true,
            terms: terms,
            description: description,
            additional_info: additional_info,
            profession: profession,
            profession_category: profession_category,
            experience: experience,
        };
          
        try {
            setLoading(true)
            const updatedProfile = await postRequest(ENDPOINTS['vendor']['onboard'], profileData, true);
            setLoading(false)
            Toast.show({
                type: 'success',
                text1: "Profile Created.",
                visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            await Delay(3000)
            router.push({
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
    };

    return (
        <View 
        className='w-full h-full bg-white flex items-center'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />

            <TitleTag withprevious={false} title='Create Profile' withbell={false}/>
            
            

            <ScrollView className='pl-3 pr-4'>
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
                className='flex w-full mt-3 space-y-2'
                >
                    <View>
                        <CharField  placeholder="Business Name*" focus={true} border={true} name='' getValue={(value: string)=>setBusinessName(value)}/>
                    </View>
                    {/* <View>
                        <CharField  placeholder="How do you want to address?" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View> */}
                    {/* <View>
                        <CharField  placeholder="Full Name*" focus={false} border={true} name='' getValue={(value: string)=>setBusinessName(value)}/>
                    </View> */}
                    <View>
                        <CharFieldDropDown options={experience_options}  placeholder="Years of Experience" focus={false} border={true} name='' getValue={(value: string)=>setExperience(value)}/>
                    </View>
                </View>

                <View
                className='w-full flex flex-row items-center p-3 mt-5 rounded-lg bg-blue-100'
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
                        <CharField  placeholder="Business mail*" focus={false} border={true} name='' getValue={(value: string)=>setBusinessEmail(value)}/>
                    </View>
                    <View>
                        <CharField  placeholder="Selected Country Region(Nigeria)" focus={false} border={true} name='' getValue={(value: string)=>setBusinessName(value)}/>
                    </View>
                    <View className='flex flex-row'>
                        <View className='rounded-md w-12 bg-gray-100 h-12 flex items-center justify-around mr-2 border border-gray-300'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className='text-gray-600 text-[11px] text-center'
                            >
                                +234
                            </Text>
                        </View>
                        <View className='grow'>
                            <CharField  placeholder="Business Phone Number" focus={false} border={true} name='' getValue={(value: string)=>setBusinessNumber(value)}/>
                        </View>
                    </View>
                </View>

                <View
                className='w-full flex flex-row items-center p-3 mt-5 rounded-lg bg-blue-100'
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
                        <CharFieldDropDown options={profession_option.map(item => ({label: item.name, value: item.id}))}  placeholder="Profession*" focus={false} border={true} name='' getValue={(value: string)=>setProfession(value)}/>
                    </View>
                    <View>
                        {/* <CharFieldDropDown options={profession_category_option.map(item => ({label: item.category_name, value: item.id}))}  placeholder="Category*" focus={false} border={true} name='' getValue={(value: string)=>setProfessionCategory(value)}/> */}
                        <CharFieldDropDown options={profession_option.map(item => ({label: item.name, value: item.id}))}  placeholder="Category*" focus={false} border={true} name='' getValue={(value: string)=>setProfessionCategory(value)}/>
                    </View>
                    <View>
                        <CharFieldDropDown options={work_alone_options}  placeholder="You work alone?" focus={false} border={true} name='' getValue={(value: string)=>setWorkAlone(value)}/>
                    </View> 
                </View>


                <View
                className='w-full flex flex-row items-center p-3 mt-5 rounded-lg bg-blue-100'
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
                        <CharField  placeholder="Membership ID/Promo Code" focus={false} border={true} name='' getValue={(value: string)=>setBusinessName(value)}/>
                    </View>
                </View>
                
                <View className='flex flex-row mt-4'>
                    <TouchableOpacity
                    onPress={()=>{setTerms(!terms)}}
                    className='mr-1'
                    >
                        {terms? 
                            <Checkbox/>:
                            <View className='border border-gray-300 h-5 w-5 rounded-sm'>
                        
                            </View>
                        }
                        
                    </TouchableOpacity>
                    <Text
                    style={{fontFamily: 'Inter-Regular'}}
                    className='text-center text-[11px] text-gray-500'
                    >
                        I understand and agree with the <Link href="/registration" style={{fontFamily: 'Inter-SemiBold'}} className='text-gray-800'>Terms and Conditions</Link> 
                    </Text>
                </View>

                <View className='w-[90%] mx-auto mb-16 mt-3'>
                    <TouchableOpacity
                    onPress={handleRequest}
                    className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
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
                        Continue
                        </Text>
                            
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </View>
    )
}