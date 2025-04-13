import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, Pressable } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import SpecialOffer from '@/components/SpecialOfferCard';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { TruncatedText } from '@/components/TitleCase';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import Pagination from '@/components/Pagination';
import ConnectionModal from '@/components/ConnectionModal';

function SpecialOfferCard(){
    const { theme, toggleTheme } = useContext(ThemeContext);

    type VendorStore = { id: string; avatar: string; business_name: string;};
    type CategoryArray = { id: string; category_name: string;}[];
    type MealArray = { id: string; thumbnail: string; delivery_time: string; delivery_fee: string; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
    type MealResponse = { count: string; next: string; previous: string; results: MealArray;};
    type SpecialOfferMealArray = { id: string; thumbnail: string; delivery_time: string; delivery_fee: string; meal_name: string; vendor_store: string; price: string; discount: string;  discounted_price: string; meal_description: string;}[];
    type SpecialOfferResponse = { count: string; next: string; previous: string; results: SpecialOfferMealArray;};
    const [specialOffer, setSpecialOffer] = useState<SpecialOfferMealArray>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getRequest<SpecialOfferResponse>(`${ENDPOINTS['inventory']['special-offer-meal-list']}?&page_size=${pageSize}&page=${currentPage}`, true);
                // alert(JSON.stringify(response2.results))
                setSpecialOffer(response.results) 
            } catch (error) {
                alert(error); 
            }
        };
    
        fetchCategories();
    }, []); // Empty dependency array ensures this runs once
    

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Special offer' withbell={false} />
                </View>
                
                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}
                
                {/* <View className='w-full'> */}
                    <ScrollView className='w-[100%] px-5 space-y-3 mb-4 ' contentContainerStyle={{ flexGrow: 1 }}>
                        {(specialOffer.length === 0) && 
                            <View className='flex space-y-3'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className='flex items-center w-full'>
                                        <ContentLoader
                                        width="100%"
                                        height={150}
                                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
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
                                        title={TruncatedText(item.vendor_store, 25)}
                                        sub_title={`₦${item.delivery_fee} Delivery fee | ${item.delivery_time}`}
                                        discount={item.discount}
                                        discount_in_price={item.discount}
                                        discounted_price={item.discounted_price}
                                        tan_or_orange='tan'
                                    />
                                </Pressable>
                            </View>    
                        ))} 

                    {((specialOffer.length > 0) && (count > specialOffer.length)) &&
                        <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                    }
                    </ScrollView>
                {/* </View> */}
            </View>
        </SafeAreaView>
    )
}

export default SpecialOfferCard;