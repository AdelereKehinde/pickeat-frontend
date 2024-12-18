import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, ActivityIndicator, Alert, Image, TextInput, StyleSheet  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Nigeria from '../../assets/icon/nigeria.svg';
import Naira from '../../assets/icon/naira.svg';
import Calender from '../../assets/icon/calender.svg';
import TitleTag from '@/components/Title';
import MoneyTransaction from '@/components/MoneyTransaction';
import OrderTransaction from '@/components/OrderTransaction';
import { getRequest } from '@/api/RequestHandler';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Empty from '../../assets/icon/empy_transaction.svg';
import ENDPOINTS from '@/constants/Endpoint';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Earnings(){
    type ListData = { id: number; type: string; order_id: string; bank_name: string; wallet: string; price: string; date: string; commision: string;}[];
    type EarningResponse = { amount_in_wallet: string; pending_payout:  string; results: ListData; next: string; previous: string;};
    type ApiResponse = { status: string; message: string; data: EarningResponse;};
    const [data, setData] = useState<ApiResponse>()
    const [showAmount, setShowAmount] = useState(false)
    const [loading, setLoading] = useState(false); // Loading state

    const [transactions, setTransactions] = useState<ListData>([]);
    const [nextUrl, setNextUrl] = useState('')

    useEffect(() => {
            const fetchMeals = async () => {
                try {
                setLoading(true)
                const response = await getRequest<ApiResponse>(`${ENDPOINTS['payment']['vendor-transactions']}`, true);
                // alert(JSON.stringify(response))
                setData(response)
                setTransactions(response.data.results)
                setNextUrl(response.data.next)
                setLoading(false)
            } catch (error) {
                setLoading(false) 
                alert(error);
            } 
        };
        
        fetchMeals(); 
    }, []); // Empty dependency array ensures this runs once

    const HandleDownload = () =>{
        if(transactions.length !== 0){
            alert('Dev Haywhy will work on it')
        }
    }

    return (
        <SafeAreaView>
            <View 
            className='w-full h-full bg-gray-50 flex items-center'
            >
                <StatusBar barStyle="light-content" backgroundColor="#228B22" />
                <View className='w-full bg-white'>
                    <TitleTag withprevious={false} title='Earnings and Payment' withbell={false} />
                </View>

                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <View 
                    style={styles.shadow_box}
                    className='mt-10 bg-white m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl'
                    >
                        <Text
                        className={`text-[11px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Total Earning
                        </Text>
                        <View 
                        className='flex flex-row items-center py-3 rounded-lg'>
                            <Naira />
                            <Text
                            className={`text-[20px] mx-4`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {showAmount? data?.data.amount_in_wallet:'****'}
                            </Text>
                            <View className='flex flex-row px-2 rounded-2xl items-center bg-gray-100 space-x-1 ml-10'>
                                <TouchableOpacity onPress={() => setShowAmount(!showAmount)}
                                className=''
                                >
                                <FontAwesome
                                    name={showAmount ? 'eye' : 'eye-slash'}
                                    size={18}
                                    color="#4b5563"
                                />
                                </TouchableOpacity>
                                <Nigeria />
                            </View>
                        </View>

                        <View>
                            <Text
                            className={`text-[10px] text-gray-500`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Pending Payout - <Text className='text-custom-green'>N {showAmount? data?.data.pending_payout:'****'}</Text>
                            </Text>
                        </View>
                    </View>


                    <View className='flex flex-row items-center justify-between w-[90%] mt-3'>
                        <View className='flex flex-row space-x-2'>
                            <Text
                            className={`'text-custom-green text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Transactions
                            </Text>
                        </View>
                    
                        <View className='flex flex-row items-center space-x-2'>
                            <Text
                            className='text-[11px] text-gray-500'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                21st May - 25th Aug
                            </Text>
                            <Calender />
                        </View>
                    </View>

                    <ScrollView className='w-[98%] max-h-[50%] px-3 mt-2' contentContainerStyle={{ flexGrow: 1 }}>
                        {((!loading || (transactions.length !== 0)) && transactions.length === 0 ) && (
                            <View className='flex items-center'> 
                                <Empty/>
                                <Text
                                className={`text-[11px] text-gray-600`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    We’ll notify you when there’s a transaction
                                </Text>
                            </View>
                        )}
                        {(transactions.length === 0 && loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <View key={index} className='border-b border-gray-300'>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            {/* <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" /> */}
                                            <Rect x="230" y="20" rx="5" ry="5" width="90" height="10" />
                                            <Rect x="230" y="50" rx="5" ry="5" width="90" height="25" />
                                            <Rect x="20" y="10" rx="5" ry="5" width="80" height="10" />
                                            <Rect x="20" y="30" rx="5" ry="5" width="120" height="10" />
                                            <Rect x="20" y="60" rx="5" ry="5" width="150" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }
                        {transactions.map((item) => (
                            (item.type=='credit')
                            ?
                            <OrderTransaction key={item.id} 
                            receiver={item.bank_name}
                            time={item.date} 
                            commission={item.commision} 
                            amount={item.price}
                            status='Successful' 
                            order_id = {item.order_id}
                            item = {['Fried Rice', 'Chicken']}
                            price = "8000.00"
                            date={item.date}
                            />
                            :
                            <MoneyTransaction key={item.id} type={item.type} receiver={item.bank_name} time={item.date} commission={item.commision} amount={item.price} status='Successful' />
                        ))}
                    </ScrollView>
                    
                    <View className='w-[90%] mx-auto mt-auto mb-10'>
                    <TouchableOpacity
                    onPress={HandleDownload}
                    className={`text-center ${(transactions.length !== 0)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
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
                        Download
                        </Text>
                            
                    </TouchableOpacity>
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
      elevation: 100,
    },
  });