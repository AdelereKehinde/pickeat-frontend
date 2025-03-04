import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, ScrollView, StatusBar, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import ChevronNext from '../../assets/icon/chevron-next.svg';
import Delete from '../../assets/icon/delete.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postRequest } from '@/api/RequestHandler';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Device from "expo-device";
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TitleTag from '@/components/Title';

export default function RiderHandbook(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();

    return (
      <SafeAreaView>
        <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full`}>
            <TitleTag withprevious={true} title='Handbook' withbell={false} />
        </View>
        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}
        >
            <ScrollView className='w-full px-5 mb-28' contentContainerStyle={{ flexGrow: 1 }}>
                <Text
                style={{fontFamily: 'Inter-Regular'}}
                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] text-center leading-7 mt-5`}
                >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit nisi vel ante mollis, sed cursus metus facilisis. Vivamus viverra metus vitae ante pretium, non tristique magna placerat. Mauris ultricies enim id nunc cursus, ac facilisis magna lacinia. Nam consequat justo et efficitur congue. Nulla facilisi. Integer laoreet diam vel elit placerat, ac tincidunt risus fermentum. Ut at dui id risus fermentum mollis. Sed quis libero turpis. Aenean tincidunt lorem at orci porttitor, ac malesuada turpis posuere.

                Aliquam erat volutpat. Sed hendrerit leo quis purus cursus, in volutpat lectus convallis. Nullam hendrerit felis eu diam aliquet, eu vestibulum ex dignissim. Etiam eget consequat libero. Nunc dictum, ante et lacinia tempor, libero libero consequat odio, in pretium purus felis sed nisi. In bibendum dui a ligula dictum, nec dictum arcu sollicitudin. Sed consequat eros sed libero tincidunt, nec maximus purus venenatis. Donec gravida, sapien ut tempor efficitur, turpis purus egestas purus, et tincidunt libero felis et turpis. Phasellus at lectus malesuada, vehicula justo id, ullamcorper magna.

                Proin auctor viverra nunc, ac egestas felis egestas vel. Integer aliquet volutpat lorem, a cursus nisl cursus in. Sed vehicula, dui ac eleifend tincidunt, turpis urna auctor purus, sit amet fringilla neque ligula et erat. Suspendisse potenti. Ut lobortis arcu nec orci pretium, sed malesuada felis malesuada. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec venenatis purus ut turpis dignissim, eget volutpat ex placerat.
                </Text>
            </ScrollView>
        </View>
      </SafeAreaView>
    )
}