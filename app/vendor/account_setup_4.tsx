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
import ConnectionModal from '@/components/ConnectionModal';

export default function CreateProfile4(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();
    const { user } = useUser();
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [openState, setOpenState] = useState({bank_code:false})
    const [data, setData] = useState({bank_code:'', acc_number:"", acc_name: "", bank_name:""});
      
    interface Item {
        name: string;
        code: string;
      }
    const [bankList, setBankList] = useState<Item[]>([]);
    
    const [fetchloading, setFetchLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                setFetchLoading(true)
                type BankList = { name: string; code: string;};
                type ApiRes = { status: string; message: string; data: BankList[]};
                const response = await getRequest<ApiRes>(ENDPOINTS['payment']['banks'], true); // Authenticated
                // alert(JSON.stringify(response))
                setBankList(response.data)
                setFetchLoading(false)
            } catch (error) {
                // alert(error);
            }
        };
    
        fetchProfessions();
    }, []); // Empty dependency array ensures this runs once

    const validateInput = () =>{
        if((data.acc_name !== '') && (data.acc_number !== '') && (data.bank_code !== "") && (data.bank_name !== "")){
          return true;
        }
        return false; 
    }

    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 
    
    const validateAccNumber = async (value: string) =>{
        setData(prevState => ({...prevState, acc_name: ''}))
        if(data.bank_code != ""){
            if (value.trim().length == 10){
                try {
                    setFetchLoading(true)
                    type SubResData = { account_number: string; account_name: string; bank_id: number};
                    type ResData = { status: boolean; message: string; data: SubResData};
                    type ApiRes = { status: string; message: string; data: ResData};
                    const response = await getRequest<ApiRes>(`${ENDPOINTS['payment']["account-validate"]}?bank_code=${data.bank_code}&account_number=${value}`, true); // Authenticated
                    // alert(JSON.stringify(response.data.data.account_name))

                    if(response.data.status){
                        setData(prevState => ({...prevState, acc_name: response.data.data.account_name}))
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: "Account Not Found",
                            // text2: error.data?.message || 'Unknown Error',
                            visibilityTime: 7000, // time in milliseconds (5000ms = 5 seconds)
                            autoHide: true,
                        });
                    }
                    setFetchLoading(false)
                } catch (error) {
                    alert(JSON.stringify(error))
                }
            }
        }else{
            Toast.show({
                type: 'error',
                text1: "Select Bank",
                // text2: error.data?.message || 'Unknown Error',
                visibilityTime: 5000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
        }
    }

      const handleRequest = async () => {
        if(!loading && validateInput()){
            try {
                setLoading(true)
                const updatedProfile = await postRequest(ENDPOINTS['vendor']['bank-details'], data, true);
                setLoading(false)
                Toast.show({
                    type: 'success',
                    text1: "Bank Detail Uploaded.",
                    visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
                // await Delay(3000)
                router.replace({
                    pathname: '/vendor/transaction_pin',
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
                    <TitleTag withprevious={false} title='Set Account Details' withbell={false}/>
                </View> 

                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}
                
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
                                    (data.bank_code !== '' ) && (
                                    <Text
                                            style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Bank
                                        </Text>
                                    )
                                }
                                <Pressable
                                className='w-full z-10'
                                onPress={()=>{setOpenState(prevState => ({...prevState, gender: !openState.bank_code}));}}
                                >
                                    <CharFieldDropDown options={bankList.map(item => ({label: item.name, value: item.code}))} open={openState.bank_code}  placeholder="Bank" focus={false} border={true} name='' setValue='' getValue={(value: string)=>{setData(prevState => ({...prevState, bank_code: value, bank_name: (bankList.find(item => item.code === value)?.name || '')})); setData(prevState => ({...prevState, acc_name: ''})); setOpenState(prevState => ({...prevState, bank_code: false}))}}/>
                                </Pressable>
                            </View> 
                        </View>

                        <View
                        className='flex w-full mt-3 space-y-3'
                        >
                            <View>
                                {
                                    (data.acc_number !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Account Number
                                        </Text>
                                    )
                                }
                                {/* <CharField  placeholder="Account Number" focus={false} border={true} name='' getValue={(value: string)=>{setData(prevState => ({...prevState, acc_number: value})); validateAccNumber(value)}}/> */}
                                <PhoneNumber  placeholder="Account Number" focus={false} border={true} name='' getValue={(value: string)=>{setData(prevState => ({...prevState, acc_number: value})); validateAccNumber(value)}}/>
                            </View>
                            
                            <View>
                                {
                                    (data.acc_name !== "" ) && (
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[12px] text-custom-green ml-1 mt'
                                        >
                                        Name on Account
                                        </Text>
                                    )
                                }
                                <CharField  placeholder="Name on Account" focus={false} border={true} name='' readonly={true} setValue={data.acc_name} getValue={(value: string)=>{}}/>
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