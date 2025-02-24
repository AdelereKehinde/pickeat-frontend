import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import { router } from 'expo-router'
import Check from '../../../assets/icon/check.svg'
import AdminOrderTransaction from '@/components/AdminOrderTransaction';
import AdminMoneyTransaction from '@/components/AdminMoneyTransaction';
import { getRequest } from '@/api/RequestHandler';
import Empty from '../../../assets/icon/Empty2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ArrowRightCircle from '../../../assets/icon/arrow-right-circle.svg';
import Nigeria from '../../../assets/icon/nigeria.svg';
import Naira from '../../../assets/icon/naira.svg';
import Search from '../../../assets/icon/search.svg';
import Filter from '../../../assets/icon/filter.svg';
import { FontAwesome } from '@expo/vector-icons';
import Calender from '../../../assets/icon/calender.svg';

function AdminTransaction(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type ListData = { id: number; type: string; order_id: string; bank_name: string; wallet: string; price: string; date: string; commision: string;}[];
    type EarningResponse = { amount_in_wallet: string; pending_payout:  string; count: number; results: ListData; next: string; previous: string;};
    type ApiResponse = { status: string; message: string; data: EarningResponse;};

    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('client');
    const [isFocusedSearch, setIsFocusedSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [showAmount, setShowAmount] = useState(true)
    const [transactions, setTransactions] = useState<ListData>([]);
    const [data, setData] = useState<ApiResponse>()

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            // const response = await getRequest<ApiResponse>(`${ENDPOINTS['payment']['vendor-transactions']}?page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            const response = 
                {
                    status: 'completed',
                    message: 'string',
                    data: {
                        amount_in_wallet: '',
                        pending_payout: '',
                        count: 2,
                        next: '',
                        previous: '',
                        results: [
                            {
                                id: 1,
                                type: "credit",
                                order_id: "or66773",
                                bank_name: "UBA",
                                wallet: "",
                                price: "15000",
                                date: "26th Feb, 2025",
                                commision: "500"
                            },
                            {
                                id: 2,
                                type: "debit",
                                order_id: "or66773n",
                                bank_name: "UBA",
                                wallet: "",
                                price: "15000",
                                date: "26th Feb, 2025",
                                commision: "500"
                            }
                        ]
                    }
                }


            setData(response)
            setTransactions(response.data.results)
            setCount(response.data.count)
            setLoading(false)
        } catch (error) {
            setLoading(false) 
            alert(error);
        } 
    };
    
    useEffect(() => {
        setLoading(true)
        setTransactions([])
        fetchMeals(); 
    }, [currentPage]); // Empty dependency array ensures this runs once

    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchMeals()

        setRefreshing(false); // Stop the refreshing animation
    };

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-white'} w-full h-full flex items-center`}>      
                <View className='bg-white w-full p-4 relative flex flex-row items-center justify-center'>
                    <View className='absolute left-6 z-10'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} w-full h-[50px] ${isFocusedSearch? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[12px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocusedSearch(true)}
                        onBlur={()=>setIsFocusedSearch(false)}
                        onChangeText={setSearchValue}
                        defaultValue={searchValue}
                        placeholder="Search"
                        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                    />
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className='flex flex-row items-center absolute right-6 rounded-lg p-2 bg-gray-100'>
                        <Text
                        className='text-custom-green text-[12px]'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Filter
                        </Text>
                        <View className=''>
                            <Filter width={15} height={15} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className='bg-white p-4 flex flex-row w-full justify-around'>
                    <TouchableOpacity 
                        onPress={()=>{setFilter('client')}}
                        className={`${(filter == 'all')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter== 'all') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'all')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={()=>{setFilter('client')}}
                        className={`${(filter == 'client')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter== 'client') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'client')? 'text-white pl-2': 'text-[#909090]'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Client
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('vendor')}}
                        className={`${(filter == 'vendor')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'vendor') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'vendor')? 'text-white pl-2': 'text-[#909090]'} text-[11px] `}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Vendors 
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('rider')}}
                        className={`${(filter == 'rider')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'rider') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'rider')? 'text-white pl-2': 'text-[#909090]'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Riders
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className='w-full bg-[#F2F2F2]' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='bg-white'>
                        <View 
                        style={styles.shadow_box}
                        className={`${theme == 'dark'? 'bg-gray-800' : 'bg-[#F5F5F5]'} my-10 m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl`}
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
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[20px] mx-4`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {showAmount? 'N 3,027.87':'****'}
                                </Text>
                                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} flex flex-row px-2 rounded-2xl items-center space-x-1 ml-auto`}>
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

                            <View className='flex flex-row justify-end'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[10px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Pending Payout - <Text className='text-custom-green'>N {showAmount? 'N 1,027.87':'****'}</Text>
                                </Text>
                            </View>
                        </View>

                        <View className='bg-white rounded w-full p-2 mt-1'>
                            <View className='flex flex-row justify-between items-center w-full p-2'>
                                <View className='flex flex-row justify-start'>
                                    <Text className='text-[#000000] text-[14px] mr-1' style={{fontFamily: 'Inter-Bold'}}>
                                        Payout Management 
                                    </Text>
                                    <Text className='text-[#767676] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>(5)</Text>
                                </View>
                                <View className='px-2'>
                                    <TouchableOpacity>
                                        <ArrowRightCircle />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-4 mt-3 bg-[#F2F2F2]'>
                        <View className='flex flex-row'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-custom-green'} text-[18px]`}
                            style={{fontFamily: 'Inter-Bold'}}
                            >
                                Transactions
                            </Text>
                        </View>
                    
                        <View className='flex flex-row items-center'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                21st May - 25th Aug
                            </Text>
                            <Calender />
                        </View>
                    </View>
                    <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-[#F2F2F2]'} px-4`}>
                        {((!loading || (transactions.length !== 0)) && transactions.length === 0 ) && (
                            <View className='flex items-center'> 
                                <Empty/>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    We’ll notify you when there’s a transaction
                                </Text>
                            </View>
                        )}
                        {(loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <View key={index} className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-300'} border-b`}>
                                        <ContentLoader
                                        width="100%"
                                        height={50}
                                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            {/* <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" /> */}
                                            <Rect x="230" y="10" rx="5" ry="5" width="90" height="10" />
                                            <Rect x="230" y="30" rx="5" ry="5" width="90" height="15" />
                                            <Rect x="20" y="5" rx="5" ry="5" width="80" height="10" />
                                            {/* <Rect x="20" y="20" rx="5" ry="5" width="120" height="10" /> */}
                                            <Rect x="20" y="35" rx="5" ry="5" width="150" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }
                        {transactions.map((item) => (
                            (item.type=='credit')
                            ?
                            <AdminOrderTransaction key={item.id} 
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
                            <AdminMoneyTransaction key={item.id} type={item.type} receiver={item.bank_name} time={item.date} commission={item.commision} amount={item.price} status='Successful' />
                        ))}
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
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

export default AdminTransaction;