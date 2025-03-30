import { View, TextInput, Animated, Text,TouchableOpacity, ScrollView, Modal, ActivityIndicator, Pressable} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Back from '../assets/icon/back_arrow.svg';
import Out_Of_Bound from '../assets/icon/out_of_bound.svg';
import Arrow from '../assets/icon/arrow_left.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import Search from '../assets/icon/search.svg';

type OptionType = {
    label: string;
    value: string | number;
  };

interface Properties {
  open: boolean,
  user: string,
  acc_name: string,
  acc_number: string,
  bank_name: string,
  getValue: (value: boolean) => void
}

const WithdrawalRequest: React.FC<Properties> = ({open,  getValue, user='buyer', acc_name, acc_number, bank_name}) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        
    };

    return (
            <Modal
            transparent={true}
            visible={open}
            animationType="slide" // Slides up from the bottom
            onRequestClose={()=>getValue(false)}
            >
                {/* Background Overlay */}
                {/* <TouchableOpacity
                className="flex-1 bg-black/40"
                onPress={()=>getValue(false)}
                /> */}
                
                {/* Modal Container */}
                <View className={`${(theme == 'dark')? "bg-gray-900" :"bg-white"} h-full`}>
                    <View className={`${(theme == 'dark')? "bg-gray-800" :"bg-custom-green"} w-full flex items-start px-4 py-2`}>
                        <Pressable 
                        onPress={()=>{getValue(false)}}
                        className="">
                            {(theme == 'dark')?
                            <Arrow />
                            :
                            <Back />
                            }
                        </ Pressable>
                    </View>

                    <ScrollView
                    className='w-full px-5' contentContainerStyle={{ flexGrow: 1 }}>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[15px] mt-10`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Make a Withdrawal
                        </Text>

                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px] mt-1`}
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                            Initiate your withdrawal now and access your hard-earned funds. Confirm your important details first.
                        </Text>
                        

                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px] mt-10`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Amount you want to withdraw
                        </Text>

                        <View className='mt-2 w-full relative flex flex-row items-center justify-center'>
                            <TextInput
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 py-2 text-[11px]`}
                                autoFocus={false}
                                onFocus={()=>setIsFocus(true)}
                                onBlur={()=>setIsFocus(false)}
                                onChangeText={setSearchValue}
                                value={searchValue}
                                keyboardType="number-pad"
                                // placeholder="Search for available foods"
                                placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                            />
                        </View>

                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px] mt-5`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Account details
                        </Text>

                        <View
                        className={`${(theme == 'dark')? "bg-gray-800" :"bg-gray-100"} rounded-lg flex flex-col items-center w-full mt-1 mx-auto py-4 space-y-4`}
                        >
                            <View className='w-[90%] mx-auto'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Account number
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                    {acc_number}
                                </Text>
                            </View>
                            <View className='w-[90%] mx-auto'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Recipent name
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                    {acc_name}
                                </Text>
                            </View>
                            <View className='w-[90%] mx-auto'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Bank name
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                    {bank_name}
                                </Text>
                            </View>
                        </View>
                        
                        <View className='mt-3'>
                            <TouchableOpacity
                            onPress={handleRequest}
                            className={`text-center ${(loading || searchValue.length == 0)? 'bg-custom-inactive-green' : 'bg-custom-green'} relative rounded-xl p-2 w-full self-center mt-2 flex items-center justify-around`}
                            >
                                {loading && (
                                <View className='absolute w-full top-4'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                                )}
                            
                                <Text
                                className={'text-white'}
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                Withdraw
                                </Text>     
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
    );
};

export default WithdrawalRequest