import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet ,StatusBar, ScrollView, TouchableOpacity, Alert, Image, TextInput, RefreshControl  } from "react-native";
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
import Information from '../../../assets/icon/alert-circle.svg';
import ArrowRightCircle from '../../../assets/icon/arrow-right-circle.svg';

export default function AdminHome(){
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<{ label: string; value: number } | null>(null);
  const [showAmount, setShowAmount] = useState(true)

  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');

  const onRefresh = async () => {
        setRefreshing(true);
    
      // await fetchMeals()

      setRefreshing(false); // Stop the refreshing animation
  };

  //Donut Chart
  const widthAndHeight = 150
  const series = [
    { value: 150, color: '#97ACFC'  },
    { value: 45, color: '#365DFD' },
    { value: 10, color: '#D5DEFE'  },
  ]

    return (
      <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'custom-gray-1'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <ScrollView 
                  refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  className='w-full flex p-5 mb-[10px]' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='bg-white rounded w-full p-2'>
                      <View className='flex flex-row justify-between items-center w-full p-2' 
                      style={{borderBottomWidth: 2, borderBottomColor:'#228B22'}}>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              Todays Orders
                          </Text>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-[#787676]'} text-[14px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              {currentDate}
                          </Text>
                      </View>
                      <View className='flex flex-row justify-between items-center w-full p-2 mt-4'>
                        <View style={styles.chartContainer}>
                          <PieChart widthAndHeight={widthAndHeight} series={series} cover={0.75} />
                          {/* Centered Label and Value */}
                          <View style={styles.centerText}>
                            <Text style={styles.value}>
                              {selectedSlice ? selectedSlice.value : '100%'}
                            </Text>
                            <Text style={styles.label}>
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
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Active Orders
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#11263C]'} text-[12px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    150 Orders
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
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Completed Orders
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#11263C]'} text-[12px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    45 Orders
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
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Canceled Orders
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#11263C]'} text-[12px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    10 Orders
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className='bg-white rounded w-full p-2 mt-4'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                          <View className='mr-[10px] my-auto'>
                            <Naira />
                          </View>
                          <View>
                            <Text className='text-[#8D8D8D] text-[12px]'>Todays Earning</Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-[#000000]'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}>
                                 {showAmount ? 'N 3,027.87' : '******'} 
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

                    <View className='bg-white rounded w-full p-2 mt-4'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                          <View className='mr-[10px] my-auto'>
                            <PendingApproval />
                          </View>
                          <View style={{borderLeftWidth: 2, borderLeftColor:'#787676', padding: 10}}>
                            <Text className='text-[#787676] text-[14px]' style={{fontFamily: 'Inter-SemiBold'}}>Pending approvals</Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[16px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                 5
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
                    
                    <View className='mt-4'>
                      <Text
                        className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[18px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Order Stat
                        </Text>
                    </View>

                    <View className='bg-white rounded w-full p-2 mt-2'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              August 2023
                          </Text>
                        </View>
                        <View className='flex flex-row px-2 rounded-2xl items-center space-x-4 ml-auto'>
                            <TouchableOpacity>
                              <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >D</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >W</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold', backgroundColor: '#228B22', color: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5}}
                                >M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >Y</Text>
                            </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View className='bg-white rounded w-full p-2 mt-4'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <ActiveOrder />
                          </View>
                          <View style={{borderLeftWidth: 2, borderLeftColor:'#E5F2FF', padding: 10}}>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[16px]`} style={{fontFamily: 'Inter-Bold'}}>Active Orders</Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[16px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                 750,456
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[12px]`} style={{fontFamily: 'Inter-SemiBold'}}>N 9,456,004.98</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    <View className='bg-white rounded w-full p-2 mt-4'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <Clickboard />
                          </View>
                          <View style={{borderLeftWidth: 2, borderLeftColor:'#E5F2FF', padding: 10}}>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[16px]`} style={{fontFamily: 'Inter-Bold'}}>Completed Orders</Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[16px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                 750,456
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-custom-green'} text-[12px]`} style={{fontFamily: 'Inter-SemiBold'}}>N 9,456,004.98</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className='bg-white rounded w-full p-2 mt-4'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <PendingOrder />
                          </View>
                          <View style={{borderLeftWidth: 2, borderLeftColor:'#E5F2FF', padding: 10}}>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-[#787676]'} text-[16px]`} style={{fontFamily: 'Inter-Bold'}}>Pending Orders</Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[16px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                 5
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[10px]`} style={{fontFamily: 'Inter-SemiBold'}}>N 9,456,004.98</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    <View className='bg-white rounded w-full p-2 mt-4'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start pb-2'>
                          <View className='mr-[10px] my-auto'>
                            <CancelledOrder />
                          </View>
                          <View style={{borderLeftWidth: 2, borderLeftColor:'#E5F2FF', padding: 10}}>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-[#787676]'} text-[16px]`} style={{fontFamily: 'Inter-Bold'}}>Canceled Orders</Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-dark'} text-[16px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                 5
                            </Text>
                            <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-[#f00]'} text-[10px]`} style={{fontFamily: 'Inter-SemiBold'}}>N 9,456,004.98</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    <View className='bg-white rounded w-full p-2 my-4'>
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
                            594
                        </Text>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : 'text-[#868585]'} text-[12px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Users
                        </Text>
                      </View>
                      <View className='flex flex-row justify-start p-2'>
                        <View className="bg-[#228B22] w-[75%] h-[15px] rounded-[5px]"></View>
                        <View className="bg-[#E5F2FF] w-[15%] h-[15px] rounded-[5px]"></View>
                        <View className="bg-[#F5F5F5] w-[10%] h-[15px] rounded-[5px]"></View>
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

                        <View className="bg-[#E5F2FF] w-[35px] h-[5px] rounded-[5px] ml-[10px]"></View>
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

                        <View className="bg-[#F5F5F5] w-[35px] h-[5px] rounded-[5px] ml-[10px]"></View>
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