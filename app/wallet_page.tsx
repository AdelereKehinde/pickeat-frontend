import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import KitchenCard from '@/components/Kitchen';
import AtmBlack from '../assets/icon/atm_black.svg';
import AtmChip from '../assets/icon/atm_gold_chip.svg';
import Empty from '../assets/icon/empy_transaction.svg'
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import TitleCase from '@/components/TitleCase';

export default function WalletPage(){
    type CardsResponse = { id: string; card_number: string; card_name: string; expiry: string; cvv: string;}[];
    type TransactionResponse = { id: string; bank_name: string; amount: string; date: string; status: string}[];
    type WalletResponse = { amount_in_wallet: string; cards: CardsResponse; transactions: TransactionResponse;};
    type ApiResponse = { status: string; message: string; data: WalletResponse;};

    const [cards, setCards] = useState<CardsResponse>([]);
    const [transactions, setTransactions] = useState<TransactionResponse>([]);
    const [amount, setAmount] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getRequest<ApiResponse>(ENDPOINTS['payment']['wallet-dashboard'], true);
                // alert(JSON.stringify(response))
                setCards(response.data.cards) 
                setTransactions(response.data.transactions)
                setAmount(response.data.amount_in_wallet)
                setLoading(false)
            } catch (error) {
                alert(error); 
            }
        };
    
        fetchCategories();
    }, []); // Empty dependency array ensures this runs once

    
    return (
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
                
                <TouchableOpacity
                className={`rounded-md ${loading? 'bg-custom-inactive-green': 'bg-custom-green'} self-end py-1 px-4 mt-2`}
                >
                    <Text
                        className={`text-white text-[10px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                    >
                        Add funds
                    </Text>
                </TouchableOpacity>
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
            <ScrollView className='w-full p-1 pb-5 mt-5 space-y-2'>
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

            {(transactions.length == 0) && (
                <View className='flex items-center'>
                    <Empty/>
                </View>
            )}
            
            {transactions.map((item) => (
                <View key={item.id} className='flex w-full py-2 px-4 border-y border-gray-200'>
                    <View className='flex flex-row items-center w-full justify-between'>
                        <Text
                        className={`text-gray-700 text-[12px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            {item.bank_name}
                        </Text>
                        <Text
                        className={`text-gray-700 text-[12px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            ${item.amount}
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
                        className={`text-custom-green text-[12px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>   
            ))}

            </ScrollView>
        </View>
    )
}