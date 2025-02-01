import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, Pressable, StyleSheet, ScrollView ,Linking, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import WhatsAPP from '../assets/icon/whatsapp.svg';
import Email from '../assets/icon/email.svg';
import Prompt from '@/components/Prompt';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';


function Support(){
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [showPrompt, setShowPrompt] = useState(false)
    const [error, setError] = useState('')

    const phoneNumber = '2349012345678'; // Replace with the desired phone number
    const message = 'Hello, I would like to make a complaint!'; // Replace with your message

    const openWhatsApp = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url);
            } else {
                setError('WhatsApp is not installed on your device.')
            }
        })
          .catch((err) => {
            setError('Error opening WhatsApp.')
        });
    };

    const recipient = 'support@pickeatpickit.com'; // Replace with the recipient's email
    const subject = 'Inquiry about your services'; // Replace with the subject
    const body = ''; // Replace with the email body

    const sendEmail = () => {
        const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url);
            } else {
                setError('No email client is installed on your device.')
            }
        })
          .catch((err) => {
            setError('Error opening email client app.')
        });
    };
    return (
        <SafeAreaView className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'}`}>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                
                <View style={styles.shadow_box} className={`${theme == 'dark'? 'text-gray-800' : ' bg-blue-100'} w-full`}>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View>

                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <Text
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} text-custom-green text-[16px] p-4`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Support
                    </Text>

                    <View className='mt-10'>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[13px] px-4`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            PickEat PickIt Support
                        </Text>
                        <Text
                        className='text-gray-500 text-[12px] px-4'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Chat with PickEat PickIt Customer care support
                        </Text>

                        {error != '' && (
                            <Text
                            className='text-red-500 text-[12px] px-4 mt-2'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {error}
                            </Text>
                        )}  

                        <TouchableOpacity 
                        onPress={sendEmail}
                        className={`${theme == 'dark'? 'bg-gray-800 border-black' : ' bg-gray-100 border-gray-300'} flex flex-row items-center space-x-5 py-2 rounded-lg mt-4 border-b px-4`}>
                            <View>
                                <Email />
                            </View>
                            <View>
                                <Text
                                className='text-gray-500 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Email Our Support
                                </Text>
                                <Text
                                className='text-custom-green text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Support@pickeatpickit.com
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        onPress={openWhatsApp}
                        className={`${theme == 'dark'? 'bg-gray-800 border-black' : ' bg-gray-100 border-gray-300'} flex flex-row items-center space-x-5 py-2 rounded-lg mt-4 border-b px-4`}>
                            <View>
                                <WhatsAPP />
                            </View>
                            <View>
                                <Text
                                className='text-gray-500 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Chat PickItPickEat Support on Whatsapp
                                </Text>
                                <Text
                                className='text-custom-green text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    +234 901 2345 678
                                </Text>
                            </View>
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

export default Support;