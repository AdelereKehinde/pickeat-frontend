import React, { useState, useEffect, useContext } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, ActivityIndicator,StyleSheet, TextInput, RefreshControl, TouchableOpacity, FlatList, Image, Dimensions, ScrollView, Pressable, Keyboard } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import SpecialOffer from '@/components/SpecialOfferCard';
import KitchenCard from '@/components/Kitchen';
import { useUser } from '@/context/UserProvider';
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { TruncatedText } from '@/components/TitleCase';
import { useIsFocused } from '@react-navigation/native';
import useDebounce from '@/components/Debounce';
import { SafeAreaView } from 'react-native-safe-area-context';
import Nigeria from '../../../assets/icon/nigeria.svg';
import Naira from '../../../assets/icon/naira.svg';
import Calender from '../../assets/icon/calender.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TitleTag from '@/components/Title';
import ToggleOn from '../../../assets/icon/toggle_on.svg'
import ToggleOff from '../../../assets/icon/toggle_off.svg'
import TodayOrder from '../../../assets/icon/todays-order.svg'
import Caution from '../../../assets/icon/caution.svg'
import ChevronNext from '../../../assets/icon/chevron-next.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home(){
    const {name} = useGlobalSearchParams()
    const { user } = useUser();

    const { theme, toggleTheme } = useContext(ThemeContext);

    type ListData = { id: number; type: string; order_id: string; bank_name: string; wallet: string; price: string; date: string; commision: string;}[];
    type EarningResponse = { amount_in_wallet: string; pending_payout:  string; count: number; results: ListData; next: string; previous: string;};
    type ApiResponse = { status: string; message: string; data: EarningResponse;};
    const [data, setData] = useState<ApiResponse>()
    const [showAmount, setShowAmount] = useState(false)

    const isNavFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['payment']['vendor-transactions']}`, true);
            // alert(JSON.stringify(response))
            setData(response)
            setLoading(false)
        } catch (error) {
            // alert(error); 
        }
    };

    const [activeStatus, setActiveStatus] = useState(false)
    const checkActiveStatus = async () => {
        const pushNoti = await AsyncStorage.getItem('rider_active_status');
        if (pushNoti){
            setActiveStatus(eval(pushNoti)); // Show onboarding if the key doesn't exist
        }
    };
    const ToggleActiveStatus = async () => {
        // Set a flag to indicate the user has completed onboarding
        if (activeStatus){
            await AsyncStorage.setItem('rider_active_status', 'false');
        }else{
            await AsyncStorage.setItem('rider_active_status', 'true');
        }
        setActiveStatus(!activeStatus)
        const res = await postRequest(ENDPOINTS['rider']['toggle-active-status'], {}, true);
    };
    
    useEffect(() => {
        if (isNavFocused){
            // fetchCategories();
            checkActiveStatus()
        }
    }, []); // Empty dependency array ensures this runs once


    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCategories()
        setRefreshing(false); // Stop the refreshing animation
    };
    
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
                    <TitleTag withprevious={false} title='My Dashboard' withbell={true} />
                </View>

                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className={`overflow-hidden mx-auto w-full`} contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='w-full px-5 my-1'>
                        <View
                        className='flex flex-row w-full items-center'
                        >
                            <Text
                            style={{fontFamily: 'Inter-Medium'}} 
                            className={`text-custom-green text-[12px] font-medium`}
                            >
                                Active status
                            </Text>
                            <TouchableOpacity
                            onPress={ToggleActiveStatus}
                            className='ml-auto'
                            >
                                {activeStatus?
                                <ToggleOn width={40} />
                                :
                                <ToggleOff width={40} />
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View 
                    style={styles.shadow_box}
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} mt-10 m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl`}
                    >
                        <View 
                        className='flex flex-row items-center py-3 rounded-lg'>
                            <Naira />
                            <View>
                                <Text
                                className={`text-[11px] ${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} mx-4`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Total Earning
                                </Text>
                                <Text
                                className={`text-custom-green text-[20px] mx-4`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {showAmount? `N ${data?.data.amount_in_wallet}` :'****'}
                                </Text>
                            </View>
                            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} flex flex-row px-2 rounded-2xl items-center space-x-1 ml-auto`}>
                                <TouchableOpacity onPress={() => setShowAmount(!showAmount)}
                                className=''
                                >
                                <FontAwesome
                                    name={showAmount ? 'eye' : 'eye-slash'}
                                    size={18}
                                    color={(theme == 'dark')? '#fff':'#4b5563'}
                                />
                                </TouchableOpacity>
                                <Nigeria />
                            </View>
                        </View>
                    </View>

                    <View 
                    style={styles.shadow_box}
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} mt-10 m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl`}
                    >
                        <View
                        className='flex flex-row items-center'
                        >
                            <TodayOrder />
                            <Text
                            className={`text-[12px] ${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} mx-4`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Todays Orders
                            </Text>
                            <TouchableOpacity
                            onPress={()=>{}}
                            className='ml-auto'
                            >
                                <ChevronNext />
                            </TouchableOpacity>
                        </View>
                        <View
                        className='flex flex-row items-end ml-10 mt-2'
                        >
                            <Text
                            className={`text-[35px] text-custom-green`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                4
                            </Text>
                            <Text
                            className={`text-[12px] ${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} pb-2 ml-1`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                orders
                            </Text>
                        </View>
                    </View>


                    <View 
                    style={styles.shadow_box}
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} mt-10 m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl`}
                    >
                        <View
                        className='flex flex-row items-center'
                        >
                            <Text
                            className={`text-[13px] text-custom-green mx-2`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Distance
                            </Text>
                            <Caution />
                            <TouchableOpacity
                            onPress={()=>{}}
                            className='ml-auto'
                            >
                                <ChevronNext />
                            </TouchableOpacity>
                        </View>
                        <View
                        className='flex flex-row items-end ml-2 mt-2'
                        >
                            <Text
                            className={`text-[35px]  ${theme == 'dark'? 'text-gray-200' : ' text-gray-800'}`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                15.89
                            </Text>
                            <Text
                            className={`text-[12px] ${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} pb-2 ml-1`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                KM
                            </Text>
                        </View>
                    </View>
                </ScrollView>   
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
      elevation: 200,
    },
});