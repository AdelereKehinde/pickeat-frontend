import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, RefreshControl, ActivityIndicator, Alert, Image, TextInput, StyleSheet  } from "react-native";
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
import Pagination from '@/components/Pagination';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import FullScreenLoader from '@/components/FullScreenLoader';
import TitleCase from '@/components/TitleCase';
import WithdrawalRequest from '@/components/WithdrawalRequestModal';

import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Function to create an HTML template for the transaction history
type ListData = { id: number; type: string; order_id: string; bank_name: string; wallet: string; price: string; date: string; commision: string;}[];

const generatePDFTemplate = (data: ListData) => {
    const transactionRows = data.map(
      (transaction) => `
        <tr>
          <td>${transaction.order_id}</td>
          <td>${transaction.date}</td>
          <td>${transaction.bank_name}</td>
          <td>${transaction.price}</td>
          <td>${transaction.type}</td>
          <td>${transaction.commision}</td>
        </tr>
      `
    ).join('');

    const htmlTemplate = `
        <html>
        <head>
            <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Transaction History</h1>
            <table>
            <thead>
                <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Bank Name</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Commission</th>
                </tr>
            </thead>
            <tbody>
                ${transactionRows}
            </tbody>
            </table>
        </body>
        </html>
    `;
    return htmlTemplate;
};

// Function to handle the PDF creation and sharing
const downloadTransactionHistoryPDF = async (data: ListData) => {
    const html = generatePDFTemplate(data);
  
    try {
        // Generate PDF from HTML
        const { uri } = await Print.printToFileAsync({ html });
      
        // Define the destination file path (within document directory)
        const fileUri = FileSystem.documentDirectory + 'pickeat_transaction_history.pdf';

        // Move the generated PDF to the document directory for download
        await FileSystem.moveAsync({
            from: uri,
            to: fileUri,
        });


        // Optionally save the file to the file system and share
        await Sharing.shareAsync(fileUri);

    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
    //   Alert.alert('Error', 'There was an issue generating the PDF.');
    }
};


export default function Earnings(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    type ListData = { 
        id: number; 
        type: string; 
        order_id: string; 
        bank_name: string; 
        wallet: string; 
        price: string; 
        date: string; 
        commision: string;
        status: string;
        item_data: {
            total: number;
            order_id: string;
            status: string;
            date: string;   
            items: {
                name: string;
                quantity: number;
            }[]            
        }
    }[];
    type BankDetails = {
        id: number;
        bank_name: string;
        acc_number: string;
        acc_name: string
    }
    type PopUpData = { 
        total: number;
        order_id: string;
        status: string;
        date: string;
        items: {
            name: string;
            quantity: number;
        }[]            
    }

    type EarningResponse = { 
        amount_in_wallet: string; 
        pending_payout:  string; 
        bank_details: BankDetails;
        count: number; 
        results: ListData; 
        next: string; previous: string;
    };
    type ApiResponse = { status: string; message: string; data: EarningResponse;};
    const [data, setData] = useState<ApiResponse>()
    const [popUpData, setPopUpdata] = useState<PopUpData>({
        total: 0, 
        order_id: '',
        status: '',
        date: '',
        items: [
            {name: 'Fried Rice', quantity: 1}
        ]
    })
    const [showPopUp, setShowPopUp] = useState(false)
    const [showAmount, setShowAmount] = useState(true)
    const [loading, setLoading] = useState(true); // Loading state
    const [downloadLoading, setDownloadLoading] = useState(false); // Loading state

    const [transactions, setTransactions] = useState<ListData>([]);
    const [bankDetails, setBankDetails] = useState<BankDetails>();

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const [refreshing, setRefreshing] = useState(false);

    const fetchMeals = async () => {
        try {
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['payment']['vendor-transactions']}?page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            setData(response)
            setTransactions(response.data.results)
            setCount(response.data.count)
            setBankDetails(response.data.bank_details)
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

    const handleDownload = async () => {
        if (transactions.length !== 0) {
            setDownloadLoading(true)
            // alert(transactions)
            await downloadTransactionHistoryPDF(transactions);
            setDownloadLoading(false)
            return;
        }
    };

    const [showWithdrawalReq, setShowWithdrawalReq] = useState(false)

    return (
        <SafeAreaView>
            <View 
            className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-50'} w-full h-full flex items-center`}
            >
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
                    <TitleTag withprevious={true} title='Earnings and Payment' withbell={false} />
                </View>

                {downloadLoading && <FullScreenLoader/>}

                <WithdrawalRequest 
                open={showWithdrawalReq} 
                getValue={(value)=>{setShowWithdrawalReq(value)}} 
                bank_name={bankDetails?.bank_name || ''}
                acc_name={bankDetails?.acc_name || ''}
                acc_number={bankDetails?.acc_number || ''}
                user='rider'
                />

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
                                    {popUpData.order_id}
                                </Text>
                                <Text
                                className={`text-custom-green text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}} 
                                >
                                    {TitleCase(popUpData.status)}
                                </Text>
                            </View>
                            {popUpData.items.map((item_, _) => (
                                <View 
                                className='flex w-full'
                                key={_}>
                                    <View
                                    className='flex flex-row justify-between items-center w-full px-3'>
                                        <Text
                                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px]`}
                                        style={{fontFamily: 'Inter-Regular'}} 
                                        >
                                            {item_.name}
                                        </Text>
                                        <Text
                                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                                        style={{fontFamily: 'Inter-SemiBold'}} 
                                        >
                                            X{item_.quantity}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                            <View
                            className='flex flex-row justify-between items-center w-full px-3 mt-3'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-Regular'}} 
                                >
                                    Date
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                                style={{fontFamily: 'Inter-SemiBold'}} 
                                >
                                    {popUpData.date}
                                </Text>
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

                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <View 
                    style={styles.shadow_box}
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} mt-10 m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl`}
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
                                {showAmount? data?.data.amount_in_wallet:'****'}
                            </Text>
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

                        <View>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[10px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Pending Payout - <Text className='text-custom-green'>₦ {showAmount? data?.data.pending_payout:'****'}</Text>
                            </Text>
                        </View>
                    </View>


                    <View className='flex flex-row items-center justify-between w-[90%] mt-3'>
                        <View className='flex flex-row space-x-2'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-custom-green'} text-[13px] ml-4`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Transactions
                            </Text>
                        </View>
                    
                        {/* <View className='flex flex-row items-center space-x-2'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                21st May - 25th Aug
                            </Text>
                            <Calender />
                        </View> */}
                    </View>

                    <ScrollView 
                    className='w-[98%] px-3 mt-2 mb-8' contentContainerStyle={{ flexGrow: 1 }}>
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
                                {Array.from({ length: 5 }).map((_, index) => (
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
                        {transactions.map((item, _) => (
                            (item.type=='credit')
                            ?
                            <TouchableOpacity 
                            onPress={()=>{setPopUpdata(item.item_data); setShowPopUp(!showPopUp)}} 
                            key={_}>
                                <OrderTransaction 
                                receiver={item.bank_name}
                                time={item.date} 
                                commission={item.commision} 
                                amount={item.price}
                                status={item.status}
                                order_id = {item.order_id}
                                />
                            </TouchableOpacity>
                            :
                            <MoneyTransaction key={item.id} type={item.type} receiver={item.bank_name} time={item.date} commission={item.commision} amount={item.price} status='Successful' />
                        ))}
                    </ScrollView>

                    <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                    
                    <View className='w-[90%] mx-auto mb-5'>
                        <TouchableOpacity
                        onPress={()=>{setShowWithdrawalReq(!showWithdrawalReq)}}
                        className={`text-center ${(transactions.length !== 0)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-2 flex items-center justify-around`}
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
                            Request Withdrawal
                            </Text>     
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={handleDownload}
                        className={`text-center bg-blue-100 relative rounded-xl p-4 w-[90%] self-center mt-2 flex items-center justify-around`}
                        >
                            {loading && (
                                <View className='absolute w-full top-4'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                                            
                            <Text
                            className={'text-custom-green'}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                            Download Report
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