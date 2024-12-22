import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import KitchenCard from '@/components/Kitchen';
import AtmBlack from '../assets/icon/atm_black.svg';
import AtmChip from '../assets/icon/atm_gold_chip.svg';
import Empty from '../assets/icon/empy_transaction.svg'
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import TitleCase from '@/components/TitleCase';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';

export default function WalletPage(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };
    type CardsResponse = { id: string; card_number: string; card_name: string; expiry: string; cvv: string;}[];
    type TransactionResponse = { id: number; bank_name: string; total_amount: string; date: string; status: string}[];
    type TransactionResponse1 = { count: number; next: string; previous: string; date: string; results: TransactionResponse};
    type WalletResponse = { amount_in_wallet: string; cards: CardsResponse; transactions: TransactionResponse1;};
    type ApiResponse = { status: string; message: string; data: WalletResponse;};

    const [cards, setCards] = useState<CardsResponse>([]);
    const [transactions, setTransactions] = useState<TransactionResponse>([]);
    const [amount, setAmount] = useState('');

    const [loading, setLoading] = useState(true);
    const [isFocused, setIsFocus] = useState('');
    const [amountToFund, setAmountToFund] = useState('');
    const [fundLoading, setFundLoading] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const fetchCategories = async () => {
        try {
            setLoading(true)
            setTransactions([])
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['payment']['wallet-dashboard']}?page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            setCards(response.data.cards) 
            setCount(response.data.transactions.count)
            setTransactions(response.data.transactions.results)
            setAmount(response.data.amount_in_wallet)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            // alert(error); 
        }
    };
    useEffect(() => {    
        fetchCategories();
    }, [currentPage]); // Empty dependency array ensures this runs once


    const handleFunding = async () => {
        try {
          if(!fundLoading && (parseInt(amountToFund) > 100)){
            setFundLoading(true)
            type DataResponse = { message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(ENDPOINTS['payment']['fund-wallet'], {amount:amountToFund}, true);
            setFundLoading(false)
            setAmount(`${parseInt(amount) + parseInt(amountToFund)}`)
            setAmountToFund('')
            Toast.show({
              type: 'success',
              text1: "Wallet Funding Successful",
              visibilityTime: 6000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
          }
  
        } catch (error:any) {
          setFundLoading(false)
          // alert(JSON.stringify(error))
          Toast.show({
            type: 'error',
            text1: "An error occured",
            text2: error.data?.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
        }
      };
    
    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-gray-100 w-full'>
                    <TitleTag withprevious={true} title='Payment' withbell={true} />
                </View>
                
                <View className='w-[90%] p-2 bg-gray-100 my-3 rounded-md flex items-start'>
                    <Text
                        className={`text-gray-700 text-[12px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Wallet
                    </Text>
                    {loading? 
                        <ContentLoader
                        width="100%"
                        height={30}
                        backgroundColor="#fff"
                        foregroundColor="#ecebeb"
                        >
                            <Rect x="" y="0" rx="5" ry="5" width="100" height="30" fill="#fff" />
                        </ContentLoader>
                        :
                        <Text
                        className={`text-[22px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            {amount}
                        </Text>
                    }

                    <View className='self-end mt-2 flex flex-row items-center space-x-2'>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`w-20 ${isFocused=='amount'? 'border-custom-green border': 'border-gray-400 border'} rounded-md px-4 text-[10px]`}
                            autoFocus={false}
                            onFocus={()=>setIsFocus('amount')}
                            onBlur={()=>setIsFocus('')}
                            onChangeText={setAmountToFund}
                            defaultValue={amountToFund}
                            placeholder="Amount"
                            maxLength={10}
                            keyboardType="number-pad"
                            placeholderTextColor=""
                        />
                        <TouchableOpacity
                        className={`rounded-md ${loading? 'bg-custom-inactive-green': 'bg-custom-green'} py-[7px] px-4 relative flex items-center`}
                        onPress={handleFunding}
                        >
                            <Text
                                className={`text-white text-[10px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                            >
                                Add funds
                            </Text>
                            {(fundLoading) && (
                                <View className='absolute w-full top-1'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                
                <Text
                className={`text-black text-[12px] self-start ml-4`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Stored Card
                </Text>
                    
                <View className='my-3 px-4 flex flex-row w-full items-center justify-around'>
                    {(loading && cards.length == 0) && 
                        <View className='flex w-[100%] px-2'>
                            <View  className=' border-gray-300'>
                                <ContentLoader
                                width="100%"
                                height={150}
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                                >
                                    <Rect x="5" y="0" rx="5" ry="5" width="97%" height="100%" />
                                    <Rect x="210" y="30" rx="5" ry="5" width="90" height="15" />
                                    <Rect x="10" y="30" rx="5" ry="5" width="60" height="50" />
                                    <Rect x="10" y="90" rx="5" ry="5" width="180" height="15" />
                                    <Rect x="10" y="120" rx="5" ry="5" width="70" height="15" />
                                    <Rect x="240" y="120" rx="5" ry="5" width="50" height="15" />
                                </ContentLoader>
                            </View> 
                        </View>
                    }
                    <FlatList
                        className=''
                        data={cards}
                        renderItem={({ item }) => (
                            <View
                            key={item.id}
                            className='flex items-center'
                            >
                                <AtmBlack />
                                <View className='absolute w-full p-4'>
                                    <View className='flex flex-row justify-between items-start w-full'>
                                        <View className='-ml-2'>
                                            <AtmChip />
                                        </View>
                                        
                                        <Text
                                        style={{fontFamily: 'Inter-Regular'}}
                                        className='text-[11px] text-white mt-3'
                                        >
                                            Debit
                                        </Text>
                                    </View>
                                    
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className='text-[14px] text-white mt-1'
                                    >
                                        {item.card_number}
                                    </Text>

                                    <View className='flex flex-row justify-between items-start w-full'>
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[14px] text-white mt-3'
                                        >
                                            mm/yy
                                        </Text>
                                        
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className='text-[14px] text-white mt-3'
                                        >
                                            cvv
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        // Add spacing between items with ItemSeparatorComponent
                        ItemSeparatorComponent={() => <View className='w-2' />}
                    />
                </View>

                <TouchableOpacity
                onPress={()=>{router.replace('/add_card')}}
                className={`text-center ${loading? 'bg-custom-inactive-green': 'bg-custom-green'} relative rounded-xl w-[70%] mt-1 p-4 flex items-center justify-around`}
                >
                    <Text
                    className='text-white'
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Add card
                    </Text>       
                </TouchableOpacity>

                <Text
                className={`text-custom-green text-[12px] mt-5`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Transaction History
                </Text>
                <ScrollView className='w-full p-1 mb-3 mt-5 space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                {loading && 
                    <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <View key={index} className='border-t border-gray-300'>
                                <ContentLoader
                                width="100%"
                                height={60}
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                                >
                                    <Rect x="10" y="10" rx="5" ry="5" width="130" height="15" />
                                    <Rect x="10" y="40" rx="5" ry="5" width="100" height="15" />
                                    <Rect x="260" y="10" rx="5" ry="5" width="60" height="15" />
                                    <Rect x="230" y="40" rx="5" ry="5" width="90" height="15" />
                                </ContentLoader>
                            </View> 
                        ))}
                    </View>
                }

                {(transactions.length == 0 && !loading) && (
                    <View className='flex items-center'>
                        <Empty/>
                    </View>
                )}
                
                {transactions.map((item) => (
                    <View key={item.id} className='flex w-full py-2 px-4 border-y border-gray-200'>
                        <View className='flex flex-row items-center w-full justify-between'>
                            <Text
                            className={`text-gray-700 text-[13px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {TitleCase(item.bank_name) + ' - '}
                                <Text
                                className={`text-gray-700 text-[13px] ${(item.bank_name == 'wallet')? 'text-red-500' : 'text-custom-green'}`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {(item.bank_name == 'wallet')? 'Debit' : 'Credit'}
                                </Text>
                            </Text>
                            <Text
                            className={`text-gray-700 text-[12px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                ${item.total_amount}
                            </Text>
                        </View>
                        <View className='flex flex-row items-center w-full justify-between mt-2'>
                            <Text
                            className={`text-gray-400 text-[10px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {item.date}
                            </Text>
                            <Text
                            className={`text-custom-green text-[12px] ${(item.status == 'pending') && 'text-yellow-500'}`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {TitleCase(item.status)}
                            </Text>
                        </View>
                    </View>   
                ))}
                <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}