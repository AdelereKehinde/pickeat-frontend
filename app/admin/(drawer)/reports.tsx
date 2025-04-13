import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Image } from "react-native";
import { router } from 'expo-router'
import { getRequest } from '@/api/RequestHandler';
import Empty from '../../../assets/icon/Empty2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { BarChart, LineChart } from 'react-native-chart-kit';
import ConnectionModal from '@/components/ConnectionModal';

function AdminReportAnalytics(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const { theme, toggleTheme } = useContext(ThemeContext);
    const [refreshing, setRefreshing] = useState(false);

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

    const [engagementLoading, setEngagementLoading] = useState(true)
    type EngageResponse = { id: number; avatar: string; orders: number; name: string;}[];
    const [engagement, setEngagment] = useState<EngageResponse>([])
    const fetchEngagement = async () => {
        try {  
            setEngagment([])
            setEngagementLoading(true)    
            type EngageAPIResponse = { count: string; next: string; previous: string; results: EngageResponse;};
            const response = await getRequest<EngageAPIResponse>(`${ENDPOINTS['admin']['user-engagement']}?page_size=10`, true);
            
            setEngagment(response.results)
            setEngagementLoading(false)
        } catch (error) {
        setBarLoading(false)     
            // alert(error);
        } 
    };

    useEffect(() => { 
        fetchBarchart(); 
    }, [barChartFilter]);

    useEffect(() => { 
        fetchEngagement(); 
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBarchart()
        await fetchEngagement(); 
        setRefreshing(false); // Stop the refreshing animation
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'custom-gray-1'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />

                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}
                
                <ScrollView 
                  refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  className='w-full flex p-2 mb-[10px]' contentContainerStyle={{ flexGrow: 1 }}>
                    {/* <View className='w-full p-2'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-[#1E1E1E]'} text-[18px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              Revenue
                          </Text>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-white'} text-[12px] mt-2 py-2 px-4 rounded bg-[#228B22]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              $1200.87
                          </Text>
                      </View>
                    </View> */}
                    
                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded-lg w-full py-3 px-2 mt-1`}>
                        <View className='flex flex-row justify-between items-center w-full py-2'>
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
                        backgroundColor={(theme == 'dark')? '#1f2937':'#fff'}
                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                        >
                            <Rect x="" y="0" rx="5" ry="5" width="100%" height="260" />
                        </ContentLoader>
                        :
                        <LineChart
                        bezier
                        data={barData}
                        width={screenWidth}
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

                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded mx-auto p-2 mt-2 w-[95%]`}>
                        <View className='flex flex-row justify-center mb-4'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#3D4857]'} text-[13px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Monthly user engagement report
                            </Text>
                        </View>
                        {(engagement.length === 0 && engagementLoading) && 
                            <View className='flex space-y-2 w-screen overflow-hidden'>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <View key={index} className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-300'}`}>
                                        <ContentLoader
                                        width="100%"
                                        height={50}
                                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            {/* <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" /> */}
                                            <Circle cx="25" cy="25" r="25" />
                                            {/* <Rect x="230" y="20" rx="5" ry="5" width="90" height="10" />
                                            <Rect x="230" y="50" rx="5" ry="5" width="90" height="25" /> */}
                                            {/* <Rect x="20" y="10" rx="5" ry="5" width="80" height="10" /> */}
                                            <Rect x="65" y="10" rx="5" ry="5" width="80" height="8" />
                                            <Rect x="65" y="25" rx="5" ry="5" width="100" height="8" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }

                        {engagement.map((item, _) => (
                            <View key={_} className='flex flex-row justify-start my-2'>
                                <View>
                                    <Image 
                                    source={{uri: item.avatar}}
                                    className='w-10 h-10 rounded-md'/>
                                </View>
                                <View className='ml-2'>
                                    <Text 
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-500'} text-[13px]`}>
                                        {item.name}
                                    </Text>
                                    <Text 
                                    style={{fontFamily: 'Inter-Regular'}}
                                    className={`${theme == 'dark'? 'text-gray-400' : 'text-gray-500'} text-[12px]`}>
                                        {item.orders} orders
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded mx-auto p-2 mt-4 w-[95%]`}>
                        <View className='flex flex-row justify-center mb-4'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#3D4857]'} text-[13px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Order insight
                            </Text>
                        </View>
                        <View className='flex flex-row justify-start my-2'>
                            <View>
                                <Image source={require("../../../assets/images/image22.jpg")} className='w-10 h-10 rounded-md'/>
                            </View>
                            <View className='ml-2'>
                                <Text 
                                style={{fontFamily: 'Inter-Regular'}}
                                className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-500'} text-[13px]`}>
                                    Most sells
                                </Text>
                                <Text 
                                style={{fontFamily: 'Inter-SemiBold'}}
                                className={`text-custom-green text-[13px]`}>
                                    Fried rice
                                </Text>
                            </View>
                        </View>
                        <View className='flex flex-row justify-start my-2'>
                            <View>
                                <Image source={require("../../../assets/images/image22.jpg")} className='w-10 h-10 rounded-md'/>
                            </View>
                            <View className='ml-2'>
                                <Text 
                                style={{fontFamily: 'Inter-Regular'}}
                                className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-500'} text-[13px]`}>
                                    Popular orders
                                </Text>
                                <Text 
                                style={{fontFamily: 'Inter-SemiBold'}}
                                className={`text-custom-green text-[13px]`}>
                                    Fried rice
                                </Text>
                            </View>
                        </View>
                        <View className='flex flex-row justify-start my-2'>
                            <View>
                                <Image source={require("../../../assets/images/image22.jpg")} className='w-10 h-10 rounded-md'/>
                            </View>
                            <View className='ml-2'>
                                <Text 
                                style={{fontFamily: 'Inter-Regular'}}
                                className={`${theme == 'dark'? 'text-gray-300' : 'text-gray-500'} text-[13px]`}>
                                    Peak orders hours
                                </Text>
                                <Text 
                                style={{fontFamily: 'Inter-SemiBold'}}
                                className={`text-custom-green text-[13px]`}>
                                    Fried rice
                                </Text>
                            </View>
                        </View>
                    </View> */}
                </ScrollView>
            </View>
        </SafeAreaView>
    )

}

export default AdminReportAnalytics;