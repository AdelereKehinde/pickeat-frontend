import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, ActivityIndicator, TextInput, TouchableOpacity, FlatList, Image, Dimensions, ScrollView, Pressable, Keyboard } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import SpecialOffer from '@/components/SpecialOfferCard';
import KitchenCard from '@/components/Kitchen';
import { useUser } from '@/context/UserProvider';
import Account from '../../assets/icon/account.svg';
import Mail from '../../assets/icon/mail.svg';
import Notification from '../../assets/icon/notification.svg';
import Search from '../../assets/icon/search.svg';
import Filter from '../../assets/icon/filter.svg';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { TruncatedText } from '@/components/TitleCase';
import { useIsFocused } from '@react-navigation/native';
import useDebounce from '@/components/Debounce';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard(){
    const {name} = useGlobalSearchParams()
    const { user } = useUser();
    const [searchValue, setSearchValue] = useState('')

    type VendorStore = { id: string; avatar: string; business_name: string;};
    type CategoryArray = { id: string; category_name: string;}[];
    type MealArray = { id: string; thumbnail: string; delivery_time: string; delivery_fee: string; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
    type MealResponse = { count: string; next: string; previous: string; results: MealArray;};

    type SellerResponseResult = { id: string; store_id: number; avatar: string; full_name: string; email: string; phone_number: string; email_verified: boolean}[];
    type sellerResponse = { count: string; next: string; previous: string; results: SellerResponseResult;};

    type ReviewData = { total_reviews: string; average_rating: string;};
    type kitchenResponseResult = { id: string; avatar: string; delivery_time: string; delivery_fee: string; business_name: string; review: ReviewData; is_favourite: boolean}[];
    type kitchenResponse = { count: string; next: string; previous: string; results: kitchenResponseResult;};

    const [meals, setMeals] = useState<MealArray>([]);
    const [specialOffer, setSpecialOffer] = useState<MealArray>([]);
    const [sellers, setSellers] = useState<SellerResponseResult>([]);
    const [kitchens, setKitchens] = useState<kitchenResponseResult>([]);

    const isNavFocused = useIsFocused();
    useEffect(() => {
        if (isNavFocused){
            const fetchCategories = async () => {
                try {
                    const response = await getRequest<MealResponse>(`${ENDPOINTS['inventory']['meal-list']}?page_size=10&page=1`, true); // Authenticated
                    // alert(JSON.stringify(response.results))
                    setMeals(response.results) 
                    const response2 = await getRequest<MealResponse>(`${ENDPOINTS['inventory']['special-offer-meal-list']}?page_size=10&page=1`, true);
                    // alert(JSON.stringify(response2.results))
                    setSpecialOffer(response2.results) 
                    const response3 = await getRequest<sellerResponse>(`${ENDPOINTS['vendor']['list']}?page_size=10&page=1`, true);
                    // alert(JSON.stringify(response3.results))
                    setSellers(response3.results) 
                    const response4 = await getRequest<kitchenResponse>(`${ENDPOINTS['vendor']['store-list']}?page_size=10&page=1`, true);
                    // alert(JSON.stringify(response4.results))
                    setKitchens(response4.results)
                } catch (error) {
                    // alert(error); 
                }
            };
        
            fetchCategories();
        }
    }, [isNavFocused]); // Empty dependency array ensures this runs once

    const [isFocused, setIsFocus] = useState(false);
    const {width, height} = Dimensions.get('window')

    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<MealArray>([])
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const searchMeals = async (query: string) => {
        setLoading(true);
        try {
          const response = await getRequest<MealResponse>(`${ENDPOINTS['inventory']['meal-list']}?search=${query}`, true);
          setSearchResults(response.results); // Update results or set empty array
        //   alert(JSON.stringify(response.results))
          setDropdownVisible(query.length > 0 && searchResults.length > 0);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      };
    
    // Create a debounced version of fetchMeals with 500ms delay
    const debouncedSearch = useDebounce(searchMeals, 2000);

    const handleSearch = (query: string) => {
        setSearchValue(query);
        if (query.trim() === '') {
          setSearchResults([]); // Clear results if input is empty
          setLoading(false);
          return;
        }
        debouncedSearch(query); // Call debounced function
    };

    const handleCancel = () => {
        setSearchValue(''); // Clear search query
        setSearchResults([]); // Clear search results
        setDropdownVisible(false); // Hide the dropdown
        Keyboard.dismiss(); // Optionally dismiss the keyboard
    };
    
    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <ScrollView className={`overflow-hidden`} contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='flex flex-row justify-between py-2 px-4 w-full`'>
                        <View className='flex flex-row items-center space-x-2 rounded-2xl bg-gray-100 p-3'>
                            <View className=''>
                                <Account />
                            </View>
                            {(user?.first_name)?
                                <Text
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Welcome, {user?.first_name}
                                </Text>
                                :
                                <TouchableOpacity
                                onPress={()=>router.replace('/login')}
                                >
                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}}
                                    className=''
                                    >
                                    Please Login
                                    </Text>
                                </TouchableOpacity>
                            }
                            
                        </View>

                        <View className='flex flex-row space-x-2 items-center justify-around rounded-2xl bg-gray-100 p-3'>
                            <TouchableOpacity
                            className='flex flex-row space-x-2 '
                            onPress={()=>{router.push("/notification")}}
                            >
                                <View className=' '>
                                    <Notification />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                            className='flex flex-row space-x-2 '
                            onPress={()=>{router.push("/chat")}}
                            >
                                <View className=''>
                                    <Mail />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='mt-5 w-full px-5 relative flex flex-row items-center justify-center'>
                        <View className='absolute left-6 z-10'>
                            <Search />
                        </View>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-10 py-2 text-[11px]`}
                            autoFocus={false}
                            onFocus={()=>setIsFocus(true)}
                            onBlur={()=>setIsFocus(false)}
                            onChangeText={handleSearch}
                            value={searchValue}
                            placeholder="Search for available foods"
                            placeholderTextColor=""
                        />
                        {(loading) && (
                            <View className='absolute top-3 right-10'>
                                <ActivityIndicator size="small" color="#228B22" />
                            </View>
                        )}
                        {(searchValue.length  > 0 && dropdownVisible) && (
                            <TouchableOpacity onPress={handleCancel} className="ml-2 absolute top-3 right-7">
                                <Text className="text-custom-green">Cancel</Text>
                            </TouchableOpacity>
                        )}
                        {/* <TouchableOpacity 
                        onPress={()=>{}}
                        className='flex flex-row items-center px-2 absolute inset-y-0 space-x-1 top-2 right-7 rounded-lg h-8 bg-gray-100 my-auto'>
                            <Text
                            className='text-custom-green'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Filter
                            </Text>
                            <View className=''>
                                <Filter width={15} height={15} />
                            </View>
                        </TouchableOpacity> */}
                    </View>
                        
                    {/* Dropdown Scrollable List */}
                    {dropdownVisible && (
                        <View
                        className="absolute top-44 bg-gray-100 w-full shadow-md max-h-52 border border-gray-200 z-40 mt-2"
                        >
                            <ScrollView
                            className='w-full'
                            >
                            {searchResults.map((meal) => (
                                <TouchableOpacity
                                key={meal.id}
                                className="flex-row items-center px-4 py-2 border-b border-gray-300"
                                onPress={handleCancel} // Close dropdown on meal select
                                >
                                <Image
                                    source={{ uri: meal.thumbnail }}
                                    className="w-10 h-10 rounded-md mr-3"
                                />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}}
                                className="text-base font-medium text-[12px]">
                                    {meal.meal_name}
                                </Text>
                                </TouchableOpacity>
                            ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* No results found text */}
                    {searchResults.length === 0 && searchValue !== '' && (
                        <Text style={{fontFamily: 'Inter-Regular'}} className="text-center text-gray-500">No products found</Text>
                    )}

                    <View className="mt-3 px-3 h-40">
                        {(meals.length === 0) && 
                        <View className='flex flex-row space-x-2 w-screen p-2 overflow-hidden'>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <View key={index}>
                                    <ContentLoader
                                        width={140}
                                        height={140}
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            <Rect x="0" y="0" rx="5" ry="5" width="140" height="112" />
                                            <Rect x="10" y="115" rx="5" ry="5" width="120" height="15" />
                                    </ContentLoader>
                                </View>
                            ))}
                        </View>
                        }
                        <FlatList
                            className=''
                            data={meals}
                            renderItem={({ item }) => (
                                <View className=' flex items-center'>
                                    <Image
                                        source={{uri: item.thumbnail}}
                                        className="w-28 h-28 rounded-md" // Set desired width and height
                                    />
                                    <Text
                                    style={{fontFamily: 'Inter-Regular'}} 
                                    className='text-[11px] text-gray-700 font-medium mt-1'
                                    >
                                        {TruncatedText(item.meal_name, 13)}
                                    </Text>
                                </View>
                            )}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            // Add spacing between items with ItemSeparatorComponent
                            ItemSeparatorComponent={() => <View className='w-3' />}
                        />
                    </View>

                    <View className=''>
                        <Link
                        href="/special_offer"
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-gray-500 text-[12px] px-3'
                        >
                            Special offers for you
                        </Link>
                        <View className={`h-[180px] p-3`}>
                            {(specialOffer.length === 0) && 
                            <View className='flex flex-row space-x-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <View key={index} className='flex items-center'>
                                        <ContentLoader
                                        width={250}
                                        height={150}
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            <Rect x="0" y="0" rx="5" ry="5" width="250" height="150" />
                                            <Rect x="120" y="20" rx="10" ry="20" width="150" height="25" />
                                            <Rect x="5" y="100" rx="5" ry="5" width="240" height="45" />
                                            <Circle cx="220" cy="122" r="20" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                            }
                            <FlatList
                                className=''
                                data={specialOffer}
                                renderItem={({ item }) => (
                                    <View key={item.id} className='w-[250px] h-[150px]'>
                                        <Pressable
                                        onPress={()=>{(router.push(`/kitchen_product?kitchen_id=${item.vendor_store.id}`))}}
                                        >
                                            <SpecialOffer 
                                            image={item.thumbnail}
                                            title={TruncatedText(item.vendor_store.business_name, 25)}
                                            sub_title={`₦${item.delivery_fee} Delivery fee | ${item.delivery_time}`}
                                            discount={item.discount}
                                            discount_in_price={item.discount}
                                            discounted_price={item.discounted_price}
                                            tan_or_orange='tan'
                                        />
                                        </Pressable>
                                    </View>
                                )}
                                keyExtractor={item => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                // Add spacing between items with ItemSeparatorComponent
                                ItemSeparatorComponent={() => <View className='w-3' />}
                            />
                        </View>
                    </View>

                    <View className='mt-2'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-gray-500 text-[12px] px-3'
                        >
                            Featured Sellers
                        </Text>
                        <View className='h-24 p-3'>
                            {(specialOffer.length === 0) && 
                                <View className='flex flex-row space-x-2 w-screen px-2 overflow-hidden'>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <View key={index} className='flex items-center'>
                                            <ContentLoader
                                            width={100}
                                            height={101}
                                            backgroundColor="#f3f3f3"
                                            foregroundColor="#ecebeb"
                                            >
                                                {/* Add custom shapes for your skeleton */}
                                                <Circle cx="50" cy="20" r="20" />
                                                <Rect x="5" y="50" rx="5" ry="5" width="90" height="10" />
                                            </ContentLoader>
                                        </View> 
                                    ))}
                                </View>
                            }
                            <FlatList
                                className=''
                                data={sellers}
                                renderItem={({ item }) => (
                                    <View
                                    key={item.id}
                                    className='flex items-center'
                                    >   
                                        <TouchableOpacity
                                        onPress={()=>{router.push(`/kitchen_profile?kitchen_id=${item.store_id}`)}}
                                        className='flex items-center'
                                        >
                                            <View className='flex items-center rounded-full overflow-hidden '>
                                                <Image 
                                                source={{ uri: item.avatar}}
                                                className='w-12 h-12'
                                                />
                                            </View>
                                            <Text
                                            style={{fontFamily: 'Inter-Regular'}}
                                            className='text-[9px] mt-1'
                                            >
                                                {TruncatedText(item.full_name, 18)}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={item => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                // Add spacing between items with ItemSeparatorComponent
                                ItemSeparatorComponent={() => <View className='w-2' />}
                            />
                        </View>
                    </View>

                    <View className='mb-3 mt-5'>
                        <Link
                        href="/kitchen_page"
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-gray-500 text-[12px] px-3'
                        >
                            Kitchens near you
                        </Link>
                        {(kitchens.length === 0) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 3 }).map((_, index) => (
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
                        {kitchens.map((item) => (
                            <KitchenCard key={item.id} kitchen_id={item.id} image={item.avatar} name={item.business_name} is_favourite={item.is_favourite} time={item.delivery_time} rating={item.review.average_rating} fee={item.delivery_fee} />
                        ))}
                    </View>
                </ScrollView>   
            </View>
        </SafeAreaView>
    )
}