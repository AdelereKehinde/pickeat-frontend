import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, Pressable } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import SpecialOffer from '@/components/SpecialOfferCard';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { TruncatedText } from '@/components/TitleCase';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

function SpecialOfferCard(){
    type VendorStore = { id: string; avatar: string; business_name: string;};
    type CategoryArray = { id: string; category_name: string;}[];
    type MealArray = { id: string; thumbnail: string; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
    type MealResponse = { count: string; next: string; previous: string; results: MealArray;};
    const [specialOffer, setSpecialOffer] = useState<MealArray>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getRequest<MealResponse>(ENDPOINTS['inventory']['special-offer-meal-list'], true);
                // alert(JSON.stringify(response2.results))
                setSpecialOffer(response.results) 
            } catch (error) {
                alert(error); 
            }
        };
    
        fetchCategories();
    }, []); // Empty dependency array ensures this runs once
    

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <View className='bg-white w-full'>
                <TitleTag withprevious={true} title='Special offer' withbell={false} />
            </View>
            
            <View className='w-full pb-10'>
                <ScrollView className='w-full p-5 space-y-3'>
                    {(specialOffer.length === 0) && 
                        <View className='flex'>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <View key={index} className='flex items-center w-full'>
                                    <ContentLoader
                                    width="100%"
                                    height={150}
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                    >
                                        {/* Add custom shapes for your skeleton */}
                                        <Rect x="0" y="0" rx="5" ry="5" width="100%" height="150" />
                                        <Rect x="45%" y="20" rx="10" ry="20" width="60%" height="25" />
                                        <Rect x="2.5%" y="100" rx="5" ry="5" width="95%" height="45" />
                                        <Circle cx="85%" cy="122" r="20" />
                                    </ContentLoader>
                                </View> 
                            ))}
                        </View>
                    }
                    {specialOffer.map((item) => (
                        <View key={item.id} className='h-[160px]' >
                            <Pressable
                            onPress={()=>{(router.push("/kitchen_page"))}}
                            >
                                <SpecialOffer 
                                    image={item.thumbnail}
                                    title={TruncatedText(item.vendor_store.business_name, 25)}
                                    sub_title='$2.99 Delivery fee | 15-20 min'
                                    discount={item.discount}
                                    discount_in_price={item.discount}
                                    discounted_price={item.discounted_price}
                                    tan_or_orange='tan'
                                />
                            </Pressable>
                        </View>    
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default SpecialOfferCard;