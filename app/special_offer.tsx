import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, Pressable } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import SpecialOffer from '@/components/SpecialOfferCard';

function SpecialOfferCard(){
    const Special = [
        { 
            id: '1', 
            source: require('../assets/images/image4.jpg'), 
            title:'Stainless Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'15',
            discount_in_price:'10',
            discounted_price:'45'
        },
        { 
            id: '2', 
            source: require('../assets/images/image15.jpg'), 
            title:'Mardiya Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'22',
            discount_in_price:'5',
            discounted_price:'40'
        },
        { 
            id: '3', 
            source: require('../assets/images/image4.jpg'), 
            title:'Stainless Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'15',
            discount_in_price:'10',
            discounted_price:'45'
        },
        { 
            id: '4', 
            source: require('../assets/images/image15.jpg'), 
            title:'Mardiya Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'20',
            discount_in_price:'5',
            discounted_price:'40'
        },
        { 
            id: '5', 
            source: require('../assets/images/image4.jpg'), 
            title:'Stainless Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'15',
            discount_in_price:'10',
            discounted_price:'45'
        },
        { 
            id: '6', 
            source: require('../assets/images/image15.jpg'), 
            title:'Mardiya Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'22',
            discount_in_price:'5',
            discounted_price:'40'
        },
        { 
            id: '7', 
            source: require('../assets/images/image4.jpg'), 
            title:'Stainless Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'15',
            discount_in_price:'10',
            discounted_price:'45'
        },
        { 
            id: '8', 
            source: require('../assets/images/image15.jpg'), 
            title:'Mardiya Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'20',
            discount_in_price:'5',
            discounted_price:'40'
        },
    ];

    return (
        <View className=' bg-gray-50 w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag title='Special offer' withbell={false} />
            
            <ScrollView className='w-full p-5 space-y-3 mb-5'>
            {Special.map((item) => (
                <View key={item.id} className='h-[160px]' >
                    <Pressable
                    onPress={()=>{(router.push("/kitchen_page"))}}
                    >
                        <SpecialOffer 
                            image={item.source}
                            title={item.title}
                            sub_title={item.sub_title}
                            discount={item.discount}
                            discount_in_price={item.discount_in_price}
                            discounted_price={item.discounted_price}
                            tan_or_orange='tan'
                        />
                    </Pressable>
                </View>    
            ))}
            </ScrollView>
        </View>
    )
}

export default SpecialOfferCard;