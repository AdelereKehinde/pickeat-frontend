import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet ,StatusBar, ScrollView, TouchableOpacity, Dimensions, Image, TextInput, RefreshControl  } from "react-native";
import TitleTag from '@/components/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import PieChart from 'react-native-pie-chart'
import { Images } from '../../../constants';
import { FontAwesome } from '@expo/vector-icons';
import Nigeria from '../../../assets/icon/nigeria.svg';
import Naira from '../../../assets/icon/naira.svg';
import Clickboard from '../../../assets/icon/Clickboard.svg';
import PendingApproval from '../../../assets/icon/pending-approval.svg';
import PendingOrder from '../../../assets/icon/pending-order.svg';
import CancelledOrder from '../../../assets/icon/cancelled-order.svg';
import ActiveOrder from '../../../assets/icon/active-order.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Information from '../../../assets/icon/alert-circle.svg';
import ArrowRightCircle from '../../../assets/icon/arrow-right-circle.svg';
import { useIsFocused } from '@react-navigation/native';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import FullScreenLoader from '@/components/FullScreenLoader';
import { BarChart, LineChart } from 'react-native-chart-kit';
import ConnectionModal from '@/components/ConnectionModal';

export default function AdminHome(){
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<{ label: string; value: number } | null>(null);
  const [showAmount, setShowAmount] = useState(true)

  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');

  type RanItem1 = {count: number; amount: number}
  type Data = {
    orders: {
      total: RanItem1;
      completed: RanItem1;
      cancelled: RanItem1;
      pending: RanItem1;
    };
    today_orders: {
      total: RanItem1;
      pending: RanItem1;
      completed: RanItem1;
      cancelled: RanItem1
    };
    earnings: {
      total: number;
      pending_approval: number;
    };
    users:{
      total: number;
      buyers: number;
      vendors: number;
      riders: number;
    }
  }
  type APIResponse = { status: string; message: string; data: Data;};
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [resData, setResData] = useState<Data>()
  
  // Calculate the percentage for each user group (vendors, buyers, riders
  const [vendorPercentage, setVendorPercentage] = useState(33)
  const [buyerPercentage, setBuyerPercentage] = useState(33)
  const [riderPercentage, setRiderPercentage] = useState(33)

  const fetchMeals = async () => {
    try {  
        // setLoading(true)    
        const response = await getRequest<APIResponse>(`${ENDPOINTS['admin']['dashboard']}`, true);
        setRiderPercentage((response?.data.users.riders || 0) / (response?.data.users.total || 1) * 100);
        setVendorPercentage((response?.data.users.vendors || 0) / (response?.data.users.total || 1) * (100));
        setBuyerPercentage((response?.data.users.buyers || 0) / (response?.data.users.total || 1) * (100));
        // alert(`${riderPercentage},${vendorPercentage},${buyerPercentage}`)
        setResData(response.data)
        setLoading(false)
    } catch (error) {
        setLoading(false)     
        // alert(error);
    } 
  };

  useEffect(() => { 
      fetchMeals(); 
  }, [isFocused]); // Empty dependency array ensures this runs once

  const [barChartFilter, setBarChartFilter] = useState('W')
  const [barLoading, setBarLoading] = useState(true)
  type barType = { labels: string[]; datasets: {
    data: number[]
  }[]; };
  const [barData, setBarData] = useState<barType>({
    labels: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 20, 45, 28, 80, 99, 20, 45, 28, 80, 110],
      },
    ],
  })
  const fetchBarchart = async () => {
    try {  
        setBarLoading(true)    
        type ChartResponse = { status: string; message: string; data: barType;};
        const response = await getRequest<ChartResponse>(`${ENDPOINTS['admin']['chart']}?period=${barChartFilter}`, true);
        
        setBarData(response.data)
        setBarLoading(false)
    } catch (error) {
      setBarLoading(false)     
        // alert(error);
    } 
  };

  useEffect(() => { 
    fetchBarchart(); 
  }, [barChartFilter]);

  const onRefresh = async () => {
      setRefreshing(true);
      await fetchMeals()
      await fetchBarchart(); 
      setRefreshing(false); // Stop the refreshing animation
  };
  
  const screenWidth = Dimensions.get('window').width;


    return (
      <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-gray-100'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                {loading && (
                    <FullScreenLoader />
                )}
                
                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}
                
                <ScrollView 
                  refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  className='w-full flex p-5 mb-0' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full py-2 px-3'`}>
                      <View className='flex flex-row justify-between items-center w-[90%] pb-2 mx-auto' 
                      style={{borderBottomWidth: 2, borderBottomColor:'#228B22'}}>
                          <Text
                          className={`text-custom-green text-[14px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              Todays Orders
                          </Text>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-600'} text-[13px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              {currentDate}
                          </Text>
                      </View>
                      <View className='flex flex-row justify-between items-center w-full p-2 mt-4'>
                        <View style={styles.chartContainer}>
                          <PieChart widthAndHeight={150} series={[
                            { value: resData?.today_orders.pending.count || 10, color: '#99aeff'  },
                            { value: resData?.today_orders.completed.count || 10, color: '#365eff' },
                            { value: resData?.today_orders.cancelled.count || 10, color: '#d6dfff'  },
                          ]} 
                          cover={0.75} 
                          />
                          {/* Centered Label and Value */}
                          <View style={styles.centerText}>
                            <Text className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} mt-2 text-[15px]`}
                            style={{fontFamily: 'Inter-Bold'}}>
                              {resData?.today_orders.total.count || 0}
                            </Text>
                            <Text 
                            className={`${theme == 'dark'? 'text-gray-400' : 'text-gray-600'} text-[12px]`}
                            style={{fontFamily: 'Inter-Medium'}}>
                              {selectedSlice ? selectedSlice.label : "Total"}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <View className='flex flex-row justify-start'>
                            <View className="bg-[#97ACFC] w-[30px] h-[5px] rounded-[5px]"></View>
                            <View className='mt-[-10px] ml-[10px]'>
                              <TouchableOpacity onPress={() => setSelectedSlice({ value: 150, label: "Active Orders" })}>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[10px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Pending Orders
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#11263C]'} text-[12px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {resData?.today_orders.pending.count || 0} Orders
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View className='flex flex-row justify-start mt-5'>
                            <View className="bg-[#365DFD] w-[30px] h-[5px] rounded-[5px]"></View>
                            <View className='mt-[-10px] ml-[10px]'>
                              <TouchableOpacity onPress={() => setSelectedSlice({ value: 45, label: "Completed Orders" })}>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[10px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Completed Orders
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#11263C]'} text-[12px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {resData?.today_orders.completed.count || 0} Orders
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View className='flex flex-row justify-start mt-5'>
                            <View className="bg-[#D5DEFE] w-[30px] h-[5px] rounded-[5px]"></View>
                            <View className='mt-[-10px] ml-[10px]'>
                              <TouchableOpacity onPress={() => setSelectedSlice({ value: 10, label: "Canceled Orders" })}>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[10px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Cancelled Orders
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#11263C]'} text-[12px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {resData?.today_orders.cancelled.count || 0} Orders
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full p-2 mt-4`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                          <View className='mr-[10px] my-auto'>
                            <Naira />
                          </View>
                          <View>
                            <Text 
                            style={{fontFamily: 'Inter-Regular'}}
                            className='text-[#8D8D8D] text-[10px]'>
                              Todays Earning
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-[#000000]'} text-[18px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}>
                                 ₦ {showAmount ? `${resData?.earnings.total || 0.00}`: '****'} 
                            </Text>
                          </View>
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

                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full p-2 mt-4`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                          <View className='mr-[10px] my-auto'>
                            <PendingApproval />
                          </View>
                          <View className='border-l-2 px-3 border-gray-400'>
                            <Text 
                            className={`${theme == 'dark'? 'text-gray-400' : 'text-gray-600'} text-[14px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}>
                              Pending approvals
                            </Text>
                            <Text className={`text-custom-green text-[25px]`}
                            style={{fontFamily: 'Inter-Bold'}}>
                                 {resData?.earnings.pending_approval || 0}
                            </Text>
                          </View>
                        </View>
                        <View className='flex flex-row px-2 rounded-2xl items-center space-x-1 ml-auto'>
                            <TouchableOpacity>
                              <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    
                    <View className={`mt-4`}>
                      <Text
                        className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[15px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Order Stat
                        </Text>
                    </View>

                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full py-3 px-2 mt-1`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              August 2023
                          </Text>
                        </View>
                        <View className='flex flex-row px-2 rounded-2xl items-center space-x-1 ml-auto'>
                            <TouchableOpacity
                            onPress={()=>{setBarChartFilter('D')}}>
                              <Text
                                className={`${theme == 'dark'? (barChartFilter == 'D')? 'text-gray-100 bg-custom-green' : 'text-gray-100' : (barChartFilter == 'D')? "bg-custom-green text-white" : 'text-custom-green'} rounded-lg px-2 py-1 text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >D</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={()=>{setBarChartFilter('W')}}>
                              <Text
                                className={`${theme == 'dark'? (barChartFilter == 'W')? 'text-gray-100 bg-custom-green' : 'text-gray-100' : (barChartFilter == 'W')? "bg-custom-green text-white" : 'text-custom-green'} rounded-lg px-2 py-1 text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >W</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={()=>{setBarChartFilter('M')}}>
                              <Text
                                className={`${theme == 'dark'? (barChartFilter == 'M')? 'text-gray-100 bg-custom-green' : 'text-gray-100' : (barChartFilter == 'M')? "bg-custom-green text-white" : 'text-custom-green'} rounded-lg px-2 py-1 text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={()=>{setBarChartFilter('Y')}}>
                              <Text
                                className={`${theme == 'dark'? (barChartFilter == 'Y')? 'text-gray-100 bg-custom-green' : 'text-gray-100' : (barChartFilter == 'Y')? "bg-custom-green text-white" : 'text-custom-green'} rounded-lg px-2 py-1 text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >Y</Text>
                            </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View className=''>
                      {barLoading?
                        <ContentLoader
                        width="100%"
                        height={260}
                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                        >
                            <Rect x="" y="0" rx="5" ry="5" width="100%" height="260" />
                        </ContentLoader>
                        :
                        <LineChart
                        bezier
                        data={barData}
                        width={screenWidth * 0.89}
                        height={260}
                        yAxisLabel="₦"
                        yAxisSuffix=""
                        chartConfig={{
                          backgroundColor: (theme == 'dark')? "#1f2937" :"#fff",
                          backgroundGradientFrom: (theme == 'dark')? "#1f2937" :"#fff",
                          backgroundGradientTo: (theme == 'dark')? "#1f2937" :"#fff",
                          decimalPlaces: 0,
                          paddingTop: 10,
                          color: (opacity = 1) => `#228B22`,
                          labelColor: (opacity = 1) => `#228B22`,
                          style: {
                            borderRadius: 16,
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                            elevation: 5,
                          },
                          propsForLabels: {
                            fontFamily: 'Inter-Medium',  // Custom font family for labels
                            fontSize: 11,         // Custom font size for labels
                            // fontWeight: 'bold',      // Custom font weight
                          },
                          propsForVerticalLabels: {
                            fontSize: 11,
                            // fontWeight: 'bold',
                            fontFamily: 'Inter-Medium',
                          },
                        }}
                        verticalLabelRotation={30}
                        horizontalLabelRotation={0}
                      />
                      }
                    </View>

                    {/* <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded w-full p-2 mt-4`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <ActiveOrder />
                          </View>
                          <View
                          className='border-l-2 border-gray-400 px-5'>
                            <Text className={`text-custom-green text-[14px]`} style={{fontFamily: 'Inter-Bold'}}>
                              Active Orders
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} text-[18px]`}
                            style={{fontFamily: 'Inter-Bold'}}>
                              {resData?.orders.pe.count || 0}
                            </Text>
                            <Text className={`text-custom-green text-[12px]`} 
                            style={{fontFamily: 'Inter-SemiBold'}}>
                              ₦ {resData?.orders.active.amount || 0}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View> */}
                    
                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full p-2 mt-4`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <Clickboard width={30} height={30} />
                          </View>
                          <View 
                          className='border-l-2 border-gray-400 px-5'>
                            <Text className={`text-custom-green text-[16px]`} 
                            style={{fontFamily: 'Inter-Bold'}}>
                              Completed Orders
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-200' : 'text-dark'} text-[16px]`}
                            style={{fontFamily: 'Inter-Bold'}}>
                                 {resData?.orders.completed.count || 0}
                            </Text>
                            <Text className={`text-custom-green text-[12px]`} 
                            style={{fontFamily: 'Inter-SemiBold'}}>
                              ₦ {resData?.orders.completed.amount || 0}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded w-full p-2 mt-4`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <PendingOrder />
                          </View>
                          <View 
                          className='border-l-2 border-gray-400 px-5'>
                            <Text className={`${theme == 'dark'? 'text-gray-400' : 'text-[#787676]'} text-[14px]`} 
                            style={{fontFamily: 'Inter-Bold'}}>
                              Pending Orders
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[18px]`}
                            style={{fontFamily: 'Inter-Bold'}}>
                                {resData?.orders.pending.count || 0}
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[10px]`} 
                            style={{fontFamily: 'Inter-SemiBold'}}>
                              ₦ {resData?.orders.pending.amount || 0}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full p-2 mt-4`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <CancelledOrder />
                          </View>
                          <View className='border-l-2 border-gray-400 px-5'>
                            <Text className={`${theme == 'dark'? 'text-gray-400' : 'text-[#787676]'} text-[14px]`} 
                            style={{fontFamily: 'Inter-Bold'}}>
                              Cancelled Orders
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[18px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                {resData?.orders.cancelled.count || 0}
                            </Text>
                            <Text className={`text-[#f00] text-[11px]`} style={{fontFamily: 'Inter-SemiBold'}}>
                              ₦ {resData?.orders.cancelled.count || 0}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full p-2 mt-4 mb-14`}>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px] mr-2`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              Active Users
                          </Text>
                          <Information />
                        </View>
                      </View>
                      <View className='flex flex-row justify-start p-2'>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : 'text-[#11263C]'} text-[18px] mr-2`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                          {resData?.users.total || 0}
                        </Text>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[12px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Users
                        </Text>
                      </View>
                      <View className='flex flex-row justify-start p-2'>
                        <View
                          style={{ width: '100%' }}
                          className="bg-gray-200 absolute h-[15px] rounded-[5px]"
                        ></View>

                        {/* Vendor + Rider Bar */}
                        <View
                          style={{
                            width: `${vendorPercentage + buyerPercentage }%`,
                          }}
                          className="bg-gray-400 absolute h-[15px] rounded-[5px]"
                        ></View>

                        {/* Buyer Bar */}
                        <View
                          style={{
                            width: `${buyerPercentage}%`,
                          }}
                          className="bg-custom-green absolute h-[15px] rounded-[5px]"
                        ></View>

                      </View>
                      <View className='flex flex-row justify-start p-2'>
                        <View className="bg-[#228B22] w-[35px] h-[5px] rounded-[5px]"></View>
                        <View className='mt-[-8px] ml-[10px]'>
                          <TouchableOpacity onPress={() => setSelectedSlice({ value: 10, label: "Clients" })}>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[12px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Clients 
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View className="bg-gray-400 w-[35px] h-[5px] rounded-[5px] ml-[10px]"></View>
                        <View className='mt-[-8px] ml-[10px]'>
                          <TouchableOpacity onPress={() => setSelectedSlice({ value: 10, label: "Clients" })}>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[12px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Vendors
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View className="bg-gray-200 w-[35px] h-[5px] rounded-[5px] ml-[10px]"></View>
                        <View className='mt-[-8px] ml-[10px]'>
                          <TouchableOpacity onPress={() => setSelectedSlice({ value: 10, label: "Clients" })}>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[12px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Riders
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>     

                    </View>
                </ScrollView>
            </View>
      </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
    fontFamily: 'Inter-Medium'
  },
  value: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#333",
  },
  legendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
  },
});