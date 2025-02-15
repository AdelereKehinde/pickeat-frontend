import { View, TextInput, Animated, Text,TouchableOpacity, StyleSheet, Image, Modal, FlatList, Pressable, Keyboard, ActivityIndicator} from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useState, useRef, useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Back from '../assets/icon/back_arrow.svg';
import Arrow from '../assets/icon/arrow_left.svg';
import Out_Of_Bound from '../assets/icon/out_of_bound.svg';
import Search from '../assets/icon/search.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import useDebounce from '@/components/Debounce';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { TruncatedText } from './TitleCase';
import Product from './Product';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

type VendorStore = { id: string; avatar: string; business_name: string;};
type CategoryArray = { id: string; category_name: string;}[];
type MealArray = { id: string; thumbnail: string; delivery_time: string; delivery_fee: string; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
type MealResponse = { count: string; next: string; previous: string; results: MealArray;};

interface Properties {
  open: boolean,
  getValue: (value: boolean) => void
}

const SearchMeal: React.FC<Properties> = ({open,  getValue}) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [isFocused, setIsFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState<MealArray>([])

    const searchMeals = async (query: string) => {
        setLoading(true);
        try {
            const response = await getRequest<MealResponse>(`${ENDPOINTS['inventory']['meal-list']}?search=${query}`, true);              setSearchResults(response.results); // Update results or set empty array
            // alert(JSON.stringify(response.results))
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create a debounced version of fetchMeals with 500ms delay
    const debouncedSearch = useDebounce(searchMeals, 800);

    const handleSearch = (query: string) => {
        setSearchValue(query);
        if (query.trim() === '') {
          setSearchResults([]); // Clear results if input is empty
          setLoading(false);
          return;
        }
        debouncedSearch(query); // Call debounced function
    };

    const handleClear = () => {
        setSearchValue(''); // Clear search query
        setSearchResults([]); // Clear search results
        Keyboard.dismiss(); // Optionally dismiss the keyboard
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
                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} h-full flex flex-col items-center`}>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full flex flex-row justify-between items-center px-4 py-2`}>
                        <Pressable 
                        onPress={()=>{getValue(false)}}
                        className="">
                            {(theme == 'dark')?
                            <Arrow />
                            :
                            <Back />
                            }
                        </ Pressable>

                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}} 
                        className={`${theme == 'dark'? 'text-white' : ' text-gray-700'} text-[14px] `}
                        >
                            Search Meals
                        </Text>

                        <View className="mr-5 w-6 h-6 flex items-end justify-around">
                        </View>
                    </View>

                    <View className='mt-5 w-full px-5 relative flex flex-row items-center justify-center'>
                        <View className='absolute left-6 z-10'>
                            <Search />
                        </View>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-10 py-2 text-[11px]`}
                            autoFocus={false}
                            onFocus={()=>setIsFocus(true)}
                            onBlur={()=>setIsFocus(false)}
                            onChangeText={handleSearch}
                            value={searchValue}
                            placeholder="Search for available foods"
                            placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                        />
                        {(loading) && (
                            <View className='absolute top-3 right-10'>
                                <ActivityIndicator size="small" color="#228B22" />
                            </View>
                        )}
                        {(searchValue.length  > 0 && searchValue != '') && (
                            <TouchableOpacity onPress={handleClear} className="ml-2 absolute top-3 right-7">
                                <Text style={{fontFamily: 'Inter-Regular'}}  className={`${theme == 'dark'? 'text-gray-100' : ' text-custom-green'} text-[12px]`}>Clear</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    {(loading) && 
                        <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <View key={index} className='mt-5 border-b border-gray-300'>
                                    <ContentLoader
                                    width="100%"
                                    height={100}
                                    backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                    foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
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
                    
                    <FlatList
                        className='w-[100%] pt-4'
                        data={ searchResults }
                        renderItem={({ item }) => (
                            <View
                            // onPress={()=>{router.push(`/confirm_order?meal_id=${item.id}`)}}
                            className=' flex flex-row items-center w-[100%]'>
                                <Product 
                                image={item.thumbnail} 
                                meal_id={item.id}
                                name={TruncatedText(item.meal_name, 17)} 
                                price={item.price} 
                                discount={item.discount} 
                                discounted_price={item.discounted_price} 
                                quantity_in_cart={item.cart_quantity}
                                description={TruncatedText(item.meal_description, 18)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        // horizontal
                        // showsHorizontalScrollIndicator={false}
                        // Add spacing between items with ItemSeparatorComponent
                        ItemSeparatorComponent={() => <View className='h-3' />}
                        ListEmptyComponent={
                            <View className=' flex justify-around items-center ml-5'>
                                <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-gray-500'}`} style={{fontFamily: 'Inter-Medium-Italic'}}>No food items found</Text>
                            </View>
                        }
                    />
                </View>
            </Modal>
    );
};

export default SearchMeal