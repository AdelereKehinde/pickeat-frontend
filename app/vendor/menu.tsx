import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import TitleTag from '@/components/Title';
import VendorProductList from '@/components/VendorProductList';
import TitleCase from '@/components/TitleCase';
import Empty from '../../assets/icon/Empty2.svg';
import Search from '../../assets/icon/search.svg';
import Add from '../../assets/icon/add_product.svg';
import Check from '../../assets/icon/check.svg'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Menu(){
    const [loading, setLoading] = useState(false);
    type CategoryArray = { id: string; category_name: string;}[];
    type MealArray = { id: number; thumbnail: string; meal_name: string; category: CategoryArray; vendor_store: string; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
    type ApiResponse = { count: string; next: string; previous: string; results: MealArray;};
    
    const [meals, setMeals] = useState<MealArray>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const response = await getRequest<ApiResponse>(ENDPOINTS['inventory']['vendor-meal-list'], true); // Authenticated
                // alert(JSON.stringify(response.results)) 
                setMeals(response.results) 
                setLoading(false)
            } catch (error) {
                // alert(JSON.stringify(error));
                setLoading(false)
            }
        };
    
        fetchCategories();
      }, []); // Empty dependency array ensures this runs once
    
    const handleRemoveItem = (itemId: number) => { 
        // alert(itemId)
        var newMeals = meals.filter((item)=>item.id != itemId)
        setMeals(newMeals); 
    };

    const Details = {
        kitchen: {
            name: 'Mardiya Kitchen',
            description: 'Rice and chicken Both fried and Jollof',
            delivery_condition: 'This Kitchen provides both Delivery and self pickup options. By default Delivery has been selected (change)',
        },
        products: [
            { id: '1', source: require('../../assets/images/image1.jpg'), name:'Green chile stew' },
            { id: '2', source: require('../../assets/images/image2.jpg'), name:'Chicago - style pizza'},
            { id: '3', source: require('../../assets/images/image3.jpg'), name:'Key lime pie' },
            { id: '4', source: require('../../assets/images/image1.jpg'), name:'Cobb salad' },
            { id: '5', source: require('../../assets/images/image1.jpg'), name:'Green chile stew' },
            { id: '6', source: require('../../assets/images/image2.jpg'), name:'Fried plantain'},
            { id: '7', source: require('../../assets/images/image3.jpg'), name:'Key lime pie' },
            { id: '8', source: require('../../assets/images/image1.jpg'), name:'Cobb salad' },
        ]
    };
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState('all');
    
    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center mb-10'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-white w-full'>
                    <TitleTag withprevious={true} title='Menu' withbell={false} />
                </View>

                <TouchableOpacity
                onPress={()=>{router.push('/vendor/create_product')}}
                className='self-end -mt-8 mr-4'>
                    <Add />
                </TouchableOpacity>

                <View className='bg-white w-full my-3 px-4 relative flex flex-row items-center justify-center'>
                    <View className='absolute left-6 z-10'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[11px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocus(true)}
                        onBlur={()=>setIsFocus(false)}
                        onChangeText={setSearchValue}
                        defaultValue={searchValue}
                        placeholder="Search through your menu"
                        placeholderTextColor=""
                    />
                </View>

                <View className='my-3 mt-5 flex flex-row w-full justify-around'>
                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex('all')}}
                        className={`${(filterIndex == 'all')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filterIndex == 'all') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 'all')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex('dessert')}}
                        className={`${(filterIndex == 'dessert')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filterIndex == 'dessert') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 'dessert')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Desert
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex('breakfast')}}
                        className={`${(filterIndex == 'breakfast')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filterIndex == 'breakfast') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 'breakfast')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Breakfast
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex('lunch')}}
                        className={`${(filterIndex == 'lunch')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filterIndex == 'lunch') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 'lunch')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Lunch
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* <Text
                className={`text-[15px] self-start ml-3 mt-5`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Add ons
                </Text>

                <View className="px-4 py-3 h-[130px]">
                    <FlatList
                        className=''
                        data={Details.products}
                        renderItem={({ item }) => (
                            <View className='w-20 flex items-center'>
                                <Image
                                    source={item.source}
                                    className="w-14 h-14 rounded-full" // Set desired width and height
                                />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className='text-[10px] text-gray-700 mt-1 text-center'
                                >
                                    {item.name}
                                </Text>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        // Add spacing between items with ItemSeparatorComponent
                        ItemSeparatorComponent={() => <View className='' />}
                    />
                </View> */}
                
                <View className='w-full bg-gray-50 mt-3'>
                    <ScrollView className='w-full space-y-1 mb-56' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && filterIndex == 'all' && meals.length == 0) && (
                            <View className='flex items-center'>
                                <TouchableOpacity
                                onPress={()=>{router.push('/vendor/create_product')}}
                                className=''>
                                    <Empty />
                                </TouchableOpacity>
                            </View>
                        )} 
                        {(!loading && filterIndex !== 'all' && meals.filter((item)=>item.category[0].category_name == filterIndex).length == 0) && (
                            <View className='flex items-center'>
                                <TouchableOpacity
                                onPress={()=>{router.push('/vendor/create_product')}}
                                className=''>
                                    <Empty />
                                </TouchableOpacity>
                            </View>
                        )} 
                        {(loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className='mt-5 border-b border-gray-300'>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" />
                                            <Rect x="230" y="10" rx="5" ry="5" width="90" height="25" />
                                            <Rect x="120" y="10" rx="5" ry="5" width="80" height="10" />
                                            <Rect x="120" y="50" rx="5" ry="5" width="80" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }
                        {(filterIndex == 'all')?
                            (searchValue.trim() == '')?
                                meals.map((item) => (
                                    <View key={item.id}>
                                        <VendorProductList 
                                        onRemove={handleRemoveItem}
                                        image={item.thumbnail} 
                                        id={item.id}
                                        category={TitleCase(item.category[0].category_name)}
                                        name={TitleCase(item.meal_name)} 
                                        price={item.price} 
                                        discount={item.discount} 
                                        discounted_price={item.discounted_price} 
                                        quantity_in_cart={item.cart_quantity}
                                        description={item.meal_description}
                                        />
                                    </View>
                                ))
                                :
                                meals.filter((item)=>item.meal_name.includes(searchValue)).map((item) => (
                                    <View key={item.id}>
                                        <VendorProductList 
                                        onRemove={handleRemoveItem}
                                        image={item.thumbnail} 
                                        id={item.id}
                                        category={TitleCase(item.category[0].category_name)}
                                        name={TitleCase(item.meal_name)} 
                                        price={item.price} 
                                        discount={item.discount} 
                                        discounted_price={item.discounted_price} 
                                        quantity_in_cart={item.cart_quantity}
                                        description={item.meal_description}
                                        />
                                    </View>
                                ))
                            :
                                (searchValue.trim() == '')?
                                    meals.filter((item)=>item.category[0].category_name == filterIndex).map((item) => (
                                        <View key={item.id}>
                                            <VendorProductList 
                                            onRemove={handleRemoveItem}
                                            image={item.thumbnail} 
                                            id={item.id}
                                            category={TitleCase(item.category[0].category_name)}
                                            name={TitleCase(item.meal_name)} 
                                            price={item.price} 
                                            discount={item.discount} 
                                            discounted_price={item.discounted_price} 
                                            quantity_in_cart={item.cart_quantity}
                                            description={item.meal_description}
                                            />
                                        </View>
                                    ))
                                    :
                                    meals.filter((item)=>item.meal_name.includes(searchValue)).filter((item)=>item.category[0].category_name == filterIndex).map((item) => (
                                        <View key={item.id}>
                                            <VendorProductList 
                                            onRemove={handleRemoveItem}
                                            image={item.thumbnail} 
                                            id={item.id}
                                            category={TitleCase(item.category[0].category_name)}
                                            name={TitleCase(item.meal_name)} 
                                            price={item.price} 
                                            discount={item.discount} 
                                            discounted_price={item.discounted_price} 
                                            quantity_in_cart={item.cart_quantity}
                                            description={item.meal_description}
                                            />
                                        </View>
                                    ))
                        }
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}