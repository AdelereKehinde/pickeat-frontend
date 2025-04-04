import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, FlatList } from "react-native";
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
import TitleCase from '@/components/TitleCase';
import FilterModal from '@/components/FilterModal';

function AdminTransaction(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    type PopUpData = { 
        id: number;
        bank_name: string;
        bank_code: string;
        acc_number: string;
        acc_name: string; 
    }
    type ListData = { id: number; type: string; commission: string; status: string; order_id: string; bank_name: string; wallet: string; price: string; date: string; commision: string; item_data: PopUpData;}[];
    type EarningResponse = { amount_in_wallet: string; pending_payout:  {
        count: number;
        amount: number;
    }; count: number; results: ListData; next: string; previous: string;};
    type ApiResponse = { status: string; message: string; data: EarningResponse;};


    const [popUpData, setPopUpdata] = useState<PopUpData>({
        id: 0, 
        bank_name: '',
        bank_code: '',
        acc_name: '',
        acc_number: ''
    })
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [isFocusedSearch, setIsFocusedSearch] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false)
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
    const [filter, setFilter] = useState('');
    const [openFilter, setOpenFilter] = useState(false)
    const filterOptions = [
        { label: 'all', value: '' },
        { label: 'pending', value: 'pending'},
        { label: 'completed', value: 'completed' },
        { label: 'failed', value: 'failed' },
    ];
    const fetchMeals = async () => {
        try {
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['payment']['admin-transactions']}?page_size=${pageSize}&page=${currentPage}&status=${filter}`, true);
            
            setData(response)
            setTransactions(response.data.results)
            setCount(response.data.count)
            setLoading(false)
        } catch (error) {
            setLoading(false) 
            // alert(error);
        } 
    };
    
    useEffect(() => {
        setLoading(true)
        setTransactions([])
        fetchMeals(); 
    }, [currentPage, filter]); // Empty dependency array ensures this runs once

    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchMeals()

        setRefreshing(false); // Stop the refreshing animation
    };

    const Categories = [
        {id: '1', name: 'all'},
        {id: '2', name: 'pending'},
        {id: '3', name: 'completed'},
        {id: '4', name: 'cancelled'},
    ]

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-white'} w-full h-full flex items-center`}>   

                {showPopUp && (
                    <View 
                    className="absolute mb-4 w-full h-full flex items-center justify-around  z-10" style={{backgroundColor: '#00000080'}}>
                        <View 
                        style={{ minHeight: 250 }}
                        className={`${theme == 'dark'? 'bg-gray-700' : ' bg-white'} w-[90%] flex items-center justify-around p-3 rounded-3xl shadow-2xl`}>
                            <View
                            className='flex flex-col items-center mb-2'>
                                <Text
                                className={`${theme == 'dark'? 'text-white' : ' text-gray-900'} text-[16px]`}
                                style={{fontFamily: 'Inter-Bold'}} 
                                >
                                    {popUpData.acc_name}
                                </Text>
                                <Text
                                className={`text-custom-green text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}} 
                                >
                                    {TitleCase(popUpData.bank_name)}
                                </Text>
                            </View>
                            <View 
                            className='flex w-full'>
                                <View
                                className='flex flex-row justify-between items-center w-full px-3'>
                                    <Text
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px]`}
                                    style={{fontFamily: 'Inter-Regular'}} 
                                    >
                                        {popUpData.acc_number}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={()=>{setShowPopUp(!showPopUp)}}
                                className='flex flex-row items-center px-8 py-2 rounded-lg bg-custom-green mt-5'>
                                <Text
                                className='text-white text-[12px] items-center'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Ok
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}   
                {/* <View className={` w-full p-4 relative flex flex-row items-center justify-center`}>
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
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} p-4 flex flex-row w-full justify-around`}>
                    <FlatList
                    data={Categories} 
                    keyExtractor={(item) => item.id}
                    horizontal={true}  // This makes the list scroll horizontally
                    ItemSeparatorComponent={() => <View className='w-3' />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={()=>{setFilter(item.name)}}
                        className={`bg-gray-100 rounded-lg ${(filter == item.name) && 'bg-custom-green'} flex flex-row items-center px-4 py-2`}
                        >
                            {(filter== item.name) && (
                                <Check />
                            )}
                            <Text
                            className={`${(filter == item.name)? 'text-white':'text-gray-600'} ml-1 text-[12px] text-center`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {TitleCase(item.name)}
                            </Text>
                        </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}  // Hide the horizontal scroll bar
                    />
                </View> */}

                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className={`${theme == 'dark'? 'bg-gray-900' : 'bg-gray-100'} w-full`}contentContainerStyle={{ flexGrow: 1 }}>
                    <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-white'}`}>
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
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[20px] mx-2`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {showAmount? `${data?.data.amount_in_wallet || 0.00}`:'****'}
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
                                    Pending Payout - <Text className='text-custom-green'>{showAmount? `₦ ${data?.data.pending_payout.amount || 0.00}`:'****'}</Text>
                                </Text>
                            </View>
                        </View>

                        <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded w-full py-1 px-3 mt-1`}>
                            <View className='flex flex-row justify-between items-center w-full p-2'>
                                <View className='flex flex-row justify-start'>
                                    <Text 
                                    className={`${theme == 'dark'? 'text-gray-400' : 'text-gray-900'} text-[12px] mr-1`}
                                    style={{fontFamily: 'Inter-SemiBold'}}>
                                        Payout Management 
                                    </Text>
                                    <Text className={`${theme == 'dark'? 'text-gray-400' : 'text-gray-700'} text-[13px]`}
                                    style={{fontFamily: 'Inter-SemiBold'}}>
                                        ({`${data?.data.pending_payout.count || 0}`})
                                    </Text>
                                </View>
                                <View className='px-2'>
                                    <TouchableOpacity
                                    onPress={()=>{router.push('/admin/payout')}}
                                    >
                                        <ArrowRightCircle />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className={`${theme == 'dark'? '' : ' bg-white'} flex flex-row items-center justify-between w-full px-4 py-1`}>
                        <Text
                        className={`text-[14px] ${theme == 'dark'? 'text-gray-100' : ' text-gray-900'}`}
                        style={{fontFamily: 'Inter-Bold'}}
                        >
                            Transactions
                        </Text>

                        <FilterModal 
                        options={filterOptions} 
                        getValue={(value)=>{setFilter(value); setOpenFilter(false)}}
                        open={openFilter}
                        />
                    </View>
                    {/* <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-gray-100'} flex flex-row items-center justify-between w-full px-4 py-3`}>
                        <View className='flex flex-row'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-custom-green'} text-[18px]`}
                            style={{fontFamily: 'Inter-Bold'}}
                            >
                                Transactions
                            </Text>
                        </View>
                    
                        <View className='flex flex-row items-center space-x-1'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                21st May - 25th Aug
                            </Text>
                            <Calender />
                        </View>
                    </View> */}

                    <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-[#F2F2F2]'} px-2`}>
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
                            <View className='flex space-y-2 w-screen overflow-hidden'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-300'}`}>
                                        <ContentLoader
                                        width="100%"
                                        height={50}
                                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            <Rect x="5" y="0" rx="5" ry="5" width="93%" height="50" />
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
                        {transactions.map((item, _) => (
                            // <TouchableOpacity 
                            // onPress={()=>{setPopUpdata(item.item_data); setShowPopUp(!showPopUp)}} 
                            // key={_}>
                                <AdminMoneyTransaction 
                                key={item.id} 
                                type={item.type} 
                                receiver={item.bank_name} 
                                time={item.date} 
                                commission={item.commision} 
                                amount={item.price} 
                                status={item.status} />
                            // </TouchableOpacity>
                        ))}
                    </View>

                    <View className='mt-auto'>
                        {((transactions.length > 0) && (count > transactions.length)) &&
                            <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                        }
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