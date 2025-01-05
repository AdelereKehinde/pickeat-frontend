import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, ScrollView, Platform } from "react-native";
import TitleTag from '@/components/Title';
import { router, useGlobalSearchParams } from 'expo-router'
import On from '../assets/icon/toggle_on.svg';
import Off from '../assets/icon/toggle_off.svg';
import { TruncatedText } from '@/components/TitleCase';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Time from '../assets/icon/time2.svg';
import Calender from '../assets/icon/calender2.svg';
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import FullScreenLoader from '@/components/FullScreenLoader';
import Slider from '@react-native-community/slider';
import CustomSlider from '@/components/CustomSlider';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

export default function ConfirmOrder(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const [loading, setLoading] = useState(false); // Loading state
    const [getLoading, setGetLoading] = useState(true); // Loading state
    const {meal_id} = useGlobalSearchParams()
    const [mealId, setMealId] = useState(Array.isArray(meal_id) ? ( meal_id[0]? parseInt(meal_id[0]): 0) : (meal_id? parseInt(meal_id) : 0) )

    type ItemsType = { id: number; meal_name: string; quantity: number; amount: string; removable: boolean}

    type VendorStore = { id: string;  avatar: string; business_name: string;};
    type CategoryArray = { id: string; category_name: string;}[];
    type MealArray = { id: number; thumbnail: string; delivery_time: string; delivery_fee: string; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string};
    type MealResponse = { count: string; next: string; previous: string; results: MealArray;};

    type ReviewData = { total_reviews: string; average_rating: string;};
    type kitchenResponseResult = { id: string; avatar: string; delivery_time: string; delivery_fee: string; business_name: string; review: ReviewData; is_favourite: boolean};

    type ApiResponse = {status: string; message: string; data: {store: kitchenResponseResult; meal: MealArray; meals: MealArray[]}}

    const [kitchen, setKitchen] = useState<kitchenResponseResult>();
    const [meal, setMeal] = useState<MealArray>();
    const [meals, setMeals] = useState<MealArray[]>([]);

    const [items, setItems] = useState<ItemsType[]>([])
    const [instruction, setInstruction] = useState(''); 
    const [scheduleSend, setScheduleSend] = useState(false); 

    const [sliderValue, setSliderValue] = useState(0);
    const heatLevel = sliderValue < 0.5 ? "Mild" : "Hot";

    const handleSetItems = (data: ItemsType) => {
        // alert(JSON.stringify(data))
        const found = items.find(item => item.id === data.id);
        if (!found){
            setItems((prevState) => [
                ...prevState, data
            ]);
        }
    }

    const handleRemoveItem = (id: number) => { 
        // alert(itemId)
        var newItems = items.filter((item)=>item.id != id)
        setItems(newItems); 
    };

    const UpdateItemQuantity = (id: number, increase: boolean) => {
        const Oitem = items.find((item) => item.id === id);
        if (Oitem?.quantity == 1 && Oitem.removable && !increase){
            handleRemoveItem(id)
        }else if(Oitem?.quantity == 1 && !Oitem.removable && !increase){
            return true
        }else{
            var newItems = items.map((item) =>
                item.id === id ? { ...item, quantity: increase? (item.quantity + 1): (item.quantity - 1) } : item
            );
            setItems(newItems); 
        }
    }
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // setGetLoading(true)
                const response = await getRequest<ApiResponse>(`${ENDPOINTS['cart']['buyer-confirm-order']}?meal_id=${mealId}`, true); // Authenticated
                // alert(JSON.stringify(response))
                setKitchen(response.data.store)
                setMeal(response.data.meal)
                setMeals(response.data.meals)

                handleSetItems({id: response.data.meal.id, meal_name: response.data.meal.meal_name, quantity: 1, amount: response.data.meal.discounted_price, removable: false})

                setGetLoading(false)
            } catch (error) {
                setGetLoading(false)
                alert(JSON.stringify(error)); 
            }
        };
        
        fetchCategories();
    }, []); // Empty dependency array ensures this runs once


    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date(0, 0, 1, 10, 0, 0));
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    const [formattedDate, setFormattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const [djangoDateTime, setDjangoDateTime] = useState('');
    
    const onChangeDate = (event: any, selectedDate: any) => {
        setShowDate(false);
        if (selectedDate) {
            setDate(selectedDate);

            // Format Date: '29th May, 2024'
            const formatWithSuffix = (day: any) => {
                if (day > 3 && day < 21) return `${day}th`;
                const suffix = ['st', 'nd', 'rd'][((day % 10) - 1)] || 'th';
                return `${day}${suffix}`;
            };

            const day = formatWithSuffix(selectedDate.getDate());
            const month = selectedDate.toLocaleString('default', { month: 'long' });
            const year = selectedDate.getFullYear();
            setFormattedDate(`${day} ${month}, ${year}`);
        }
    };

    const onChangeTime = (event: any, selectedTime: any) => {
        setShowTime(false); // Close the picker
        if (selectedTime) {
            setTime(selectedTime);

            // Format Time: '10:00am'
            const hours = selectedTime.getHours();
            const minutes = selectedTime.getMinutes();
            const ampm = hours >= 12 ? 'pm' : 'am';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            setFormattedTime(`${formattedHours}:${formattedMinutes}${ampm}`);
        }
    };
    
    // Combine Date and Time for Django
    const combineDateTime = () => {
        const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
        );
        const isoDateTime = combinedDateTime.toISOString();
        setDjangoDateTime(isoDateTime); // This is what you send to Django
    };

    const validateInput = () =>{
        if (scheduleSend){
            if((formattedDate != '') && (formattedTime != '')){
                return true
            }else{
                return false
            }
        }else{
            return true;
        }
    }

    const handleOrder = async () => {
        try {
          if(!loading && validateInput()){
            setLoading(true)
            combineDateTime()
            type DataResponse = { message: string; token:string; refresh: string, name:string; email:string; avatar:string; first_name:string; full_name:string; phone_number:string; buyer_address:string; latitude:string; longitude:string; delivery_address: boolean };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(`${ENDPOINTS['cart']['buyer-confirm-order']}`, {
                meals: items,
                schedule_send: scheduleSend, 
                schedule_time: djangoDateTime,
            }, true);
            setLoading(false)
          }
  
        } catch (error:any) {
          setLoading(false)
          // alert(JSON.stringify(error))
          Toast.show({
            type: 'error',
            text1: "An error occured",
            text2: error.data?.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          })
        }
    };

    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-white w-full'>
                    <TitleTag withprevious={true} title='Confirm order' withbell={false} />
                </View>

                {getLoading && (
                    <FullScreenLoader />
                )}
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className=''>
                    <View className='px-4 mt-4'>
                        <View className='flex flex-row'>
                            <View>
                                <Image
                                source={{uri: kitchen?.avatar}}
                                className='w-20 h-20 rounded-md'
                                />
                            </View>

                            <View className='ml-2'>
                                <Text
                                style={{fontFamily: 'Inter-SemiBold'}} 
                                className='text-[13px] mt-1'
                                >
                                    {kitchen?.business_name}  
                                </Text>
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className='text-[10px] text-gray-700 font-medium mt-1'
                                >
                                    {meal?.meal_name}
                                </Text>
                            </View>
                        </View>
                    
                        <Text
                            style={{fontFamily: 'Inter-Regular'}} 
                            className='text-[10px] text-gray-700 font-medium mt-3'
                        >
                            This Kitchen provides both Delivery and self pickup options. By default Delivery has been selected (change)
                        </Text>
                        
                    </View>

                    <View className="flex flex-row justify-between items-start p-4 space-y-3">
                        <View className='w-[50%] py-4'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}} 
                            className="text-[13px] text-gray-500">
                                Spicy
                            </Text>

                            <View className='w-full border'>
                                {/* <Slider
                                    style={{ width: '100%', height: 20}}
                                    minimumValue={0}
                                    maximumValue={1}
                                    step={0.01}
                                    value={sliderValue}
                                    onValueChange={(value) => setSliderValue(value)}
                                    minimumTrackTintColor="#EF2A39" // Mild (Orange)
                                    maximumTrackTintColor="#6b7280      " // Track color (Gray)
                                    thumbTintColor="#EF2A39" // Thumb color (Tomato Red)
                                /> */}
                                <CustomSlider />
                            </View>
                            
                            <View className="flex-row justify-between mt-4">
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}  
                                className="text-[13px] text-custom-green">
                                    Mild
                                </Text>

                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className="text-[13px] text-red-700">
                                    Hot
                                </Text>
                            </View>
                        </View>   

                            <View className='flex items-start space-y-3'>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className="text-[13px] text-gray-500">
                                    Quantity
                                </Text>
                                <View className='flex flex-row justify-between items-center'>                     
                                    <TouchableOpacity
                                    className='w-9 h-9 rounded-md bg-gray-100 flex justify-around items-center'
                                    onPress={()=>{UpdateItemQuantity(mealId, false)}}
                                    >   
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`text-[15px] text-custom-green ${loading && 'text-gray-300'}`}
                                        >
                                            -
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color="#6b7280" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <View className='w-7 h-7 mx-2 rounded-md flex justify-around items-center'>
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className=' text-[15px]'
                                        >
                                            {items.find((item) => item.id === mealId)?.quantity}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                    className='w-9 h-9 rounded-md bg-gray-100 flex justify-around items-center'
                                    onPress={()=>{UpdateItemQuantity(mealId, true)}}
                                    >
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`text-[15px] text-custom-green ${loading && 'text-gray-300'}`}
                                        >
                                        +
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color="#6b7280" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                <View />
                            </View>
                        </View>
                    </View>

                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}} 
                    className='text-[15px] mt-4 pl-8 w-full'
                    >
                    Add Ons
                    </Text>

                    <View className="px-4 py-3 h-38 ">
                        <FlatList
                            className=''
                            data={meals}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                onPress={()=>{handleSetItems({id: item.id, amount: item.discounted_price, meal_name: item.meal_name, quantity: 1, removable: true})}}
                                className='w-20 flex items-center'>
                                    <Image
                                        source={{uri: item.thumbnail}}
                                        className="w-16 h-16 rounded-full" // Set desired width and height
                                    />
                                    <Text
                                    style={{fontFamily: 'Inter-Regular'}} 
                                    className='text-[10px] text-gray-700 mt-1 text-center'
                                    >
                                        {TruncatedText(item.meal_name, 18)}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id + ""}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            // Add spacing between items with ItemSeparatorComponent
                            ItemSeparatorComponent={() => <View className='w-2' />}
                        />
                    </View>

                    <View className='border-gray-200 border-t border-b py-4 mt-5 w-[90%] mx-auto space-y-4'>
                        {items.map((item) => (
                            <View key={item.id} className='flex flex-row justify-between items-center'>
                                <Text
                                style={{fontFamily: 'Inter-SemiBold'}} 
                                className='text-[13px] text-gray-800'
                                >
                                    {TruncatedText(item.meal_name, 16)}
                                </Text>
                                <View className='flex flex-row justify-between items-center'>                        
                                    <TouchableOpacity
                                    className='w-9 h-9 rounded-md bg-gray-100 flex justify-around items-center'
                                    onPress={()=>{(item.quantity != 0) && UpdateItemQuantity(item.id, false)}}
                                    >   
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`text-[15px] text-custom-green ${loading && 'text-gray-300'}`}
                                        >
                                            -
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color="#6b7280" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <View className='w-7 h-7 mx-2 rounded-md flex justify-around items-center'>
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className=' text-[15px]'
                                        >
                                            {item.quantity}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                    className='w-9 h-9 rounded-md bg-gray-100 flex justify-around items-center'
                                    onPress={()=>{UpdateItemQuantity(item.id, true)}}
                                    >
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`text-[15px] text-custom-green ${loading && 'text-gray-300'}`}
                                        >
                                        +
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color="#6b7280" />
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}} 
                                    className='text-[13px] ml-4 text-gray-800'
                                    >
                                        ₦{parseFloat(item.amount) * item.quantity}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View className='w-[90%] mt-5 mx-auto bg-gray-100 px-4 py-1 rounded-xl'>
                        <TextInput
                        style={{fontFamily: 'Inter-Medium-Italic'}}
                        className={`w-full rounded-lg text-[11px] text-gray-500`}
                        autoFocus={false}
                        readOnly={loading}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setInstruction}
                        value={instruction}
                        placeholder='Write instruction for the kitchen such as allergies'
                        placeholderTextColor="#228B22"
                        />
                    </View>
                    
                    <View className=' w-[90%] mx-auto mt-10 flex flex-row justify-between items-center'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[14px] text-gray-700'
                        >
                            Schedule send
                        </Text>

                        <TouchableOpacity
                        className=''
                        onPress={()=>{setScheduleSend(!scheduleSend)}}
                        >
                            {scheduleSend?
                            <On />
                            :
                            <Off />
                            }
                            
                        </TouchableOpacity>
                    </View>
 
                    <View className=' border-gray-200 border-t border-b py-4 flex flex-row items-center justify-between mx-4'>
                        <TouchableOpacity 
                        onPress={()=>{setShowDate(true)}}
                        >
                            <Text
                            style={{fontFamily: 'Inter-Medium'}} 
                            className='text-[14px] text-gray-800'
                            >
                                Date
                            </Text>
                            <View className='flex flex-row space-x-2 items-center'>
                                <Calender  />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className='text-[12px] text-gray-500'
                                >
                                    {formattedDate || 'No date selected'}
                                </Text>
                            </View>
                            {showDate && (
                                <DateTimePicker
                                value={date}
                                mode="date" // Choose 'time' or 'datetime' for other modes
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Options: 'spinner', 'calendar'
                                onChange={onChangeDate}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                        onPress={()=>{setShowTime(true)}}
                        className='px-6 border-l border-gray-500'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}} 
                            className='text-[14px] text-gray-800'
                            >
                                Time
                            </Text>
                            <View className='flex flex-row space-x-2 items-center'>
                                <Time />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className='text-[12px] text-gray-500'
                                >
                                    {formattedTime || 'No time selected'}
                                </Text>
                            </View>
                            {showTime && (
                                <DateTimePicker
                                value={time}
                                mode="time" // Set mode to "time" for time picker
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Use spinner for iOS, default for Android
                                onChange={onChangeTime}
                              />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className='w-[90%] mx-auto mb-5 mt-5'>
                        <TouchableOpacity
                        onPress={handleOrder}
                        className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
                        >        
                            <Text
                            className='text-white'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Confirm Order
                            </Text>

                            {loading && (
                            <View className='absolute w-full top-4'>
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}