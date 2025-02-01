import React, { useState, useEffect, useContext } from 'react';
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
import Prompt from '@/components/Prompt';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import RoundToDecimalPlace from '@/components/RoundToDecimalPlace';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function ConfirmOrder(){
    const { theme, toggleTheme } = useContext(ThemeContext);

    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const [loading, setLoading] = useState(false); // Loading state
    const [getLoading, setGetLoading] = useState(true); // Loading state
    const [showPrompt, setShowPrompt] = useState(false); // Loading state
    const [orderID, setOrderID] = useState(''); // Loading state
    const [estimatedTime, setEstimatedTime] = useState(''); // Loading state
    const {meal_id, quantity} = useGlobalSearchParams()
    const [mealId, setMealId] = useState(Array.isArray(meal_id) ? ( meal_id[0]? parseInt(meal_id[0]): 0) : (meal_id? parseInt(meal_id) : 0) )
    const [mealQuantity, setMealQuantity] = useState(Array.isArray(quantity) ? ( quantity[0]? parseInt(quantity[0]): 0) : (quantity? parseInt(quantity) : 0) )

    type ItemsType = { id: number; meal_name: string; quantity: number; amount: number; removable: boolean}

    type VendorStore = { id: string;  avatar: string; business_name: string;};
    type CategoryArray = { id: string; category_name: string;}[];
    type MealArray = { id: number; thumbnail: string; delivery_time: string; delivery_fee: number; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: number; discount: number;  discounted_price: number; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string};
    type MealResponse = { count: string; next: string; previous: string; results: MealArray;};

    type ReviewData = { total_reviews: string; average_rating: string;};
    type kitchenResponseResult = { id: string; avatar: string; delivery_time: string; delivery_fee: string; business_name: string; review: ReviewData; is_favourite: boolean};

    type ApiResponse = {
        status: string; 
        message: string; 
        data: {
            store: kitchenResponseResult; 
            meal: MealArray; 
            meals: MealArray[]; 
            pricing_data: {
                service_charge: number; 
                delivery_fee: number
            };
            delivery_address: string;
        }
    }

    const [kitchen, setKitchen] = useState<kitchenResponseResult>();
    const [meal, setMeal] = useState<MealArray>();
    const [meals, setMeals] = useState<MealArray[]>([]);
    const [pricingData, setPricingData] = useState({service_charge: 0.00, delivery_fee: 0.00});
    const [deliveryAddress, setDeliveryAddress] = useState("");

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

    const CalculateItemPrice = items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    
    const isFocused = useIsFocused();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // setGetLoading(true)
                const response = await getRequest<ApiResponse>(`${ENDPOINTS['cart']['buyer-confirm-order']}?meal_id=${mealId}`, true); // Authenticated
                // alert(JSON.stringify(response.data.pricing_data))
                setKitchen(response.data.store)
                setMeal(response.data.meal)
                setMeals(response.data.meals)
                setPricingData(response.data.pricing_data)
                setDeliveryAddress(response.data.delivery_address)
                handleSetItems({id: response.data.meal.id, meal_name: response.data.meal.meal_name, quantity: (mealQuantity!=0? mealQuantity : 1), amount: response.data.meal.discounted_price, removable: false})

                setGetLoading(false)
            } catch (error) {
                setGetLoading(false)
                // alert(JSON.stringify(error)); 
            }
        };
        
        fetchCategories();
    }, [isFocused]); // Empty dependency array ensures this runs once


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
            type DataResponse = { order_id: string; delivery_time:string;};
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(`${ENDPOINTS['cart']['buyer-confirm-order']}`, {
                meals: items,
                schedule_send: scheduleSend, 
                schedule_time: djangoDateTime,
            }, true);
            setLoading(false)

            setEstimatedTime(res.data.delivery_time)
            setOrderID(res.data.order_id)
            setShowPrompt(true)
          }
  
        } catch (error:any) {
          setLoading(false)
        //   alert(JSON.stringify(error))
          Toast.show({
            type: 'error',
            text1: "An error occured",
            text2: error.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          })
        }
    };

    const OnPromptClick = () => {
        router.back()
    }

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Confirm order' withbell={false} />
                </View> 

                {getLoading && (
                    <FullScreenLoader />
                )}

                {showPrompt && 
                    <Prompt main_text='' sub_text='' order_id={orderID} estimated_time={estimatedTime} clickFunction={OnPromptClick}/>
                }

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className=''>
                    <View className='px-4 mt-4'>
                        <View className='flex flex-row'>
                            <View>
                                {getLoading && 
                                    <View className='border-b border-gray-200 pb-2'>
                                        <ContentLoader
                                        width="80"
                                        height={80}
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                        >
                                            <Rect x="0" y="" rx="5" ry="5" width="75" height="75" />
                                        </ContentLoader>
                                    </View> 
                                }
                                <Image
                                source={{uri: kitchen?.avatar}}
                                className='w-20 h-20 rounded-md'
                                />
                            </View>

                            <View className='ml-2'>
                                <Text
                                style={{fontFamily: 'Inter-SemiBold'}} 
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[13px] mt-1`}
                                >
                                    {kitchen?.business_name}  
                                </Text>
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-700'} text-[10px] font-medium mt-1`}
                                >
                                    {meal?.meal_name}
                                </Text>
                            </View>
                        </View>
                    
                        <Text
                            style={{fontFamily: 'Inter-Regular'}} 
                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-700'} text-[10px] font-medium mt-3`}
                        >
                            This Kitchen provides both Delivery and self pickup options. By default Delivery has been selected (change)
                        </Text>
                        
                    </View>

                    <View className="flex flex-row justify-between items-start p-4 space-y-3">
                        <View className='w-[50%] py-4'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}} 
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[13px]`}>
                                Spicy
                            </Text>

                            <View className='w-full'>
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
                                className={` ${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[13px]`}>
                                    Quantity
                                </Text>
                                <View className='flex flex-row justify-between items-center'>                     
                                    <TouchableOpacity
                                    className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-9 h-9 rounded-md flex justify-around items-center`}
                                    onPress={()=>{UpdateItemQuantity(mealId, false)}}
                                    >   
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[15px] ${loading && 'text-gray-300'}`}
                                        >
                                            -
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <View className='w-7 h-7 mx-2 rounded-md flex justify-around items-center'>
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[15px]`}
                                        >
                                            {items.find((item) => item.id === mealId)?.quantity}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                    className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-9 h-9 rounded-md flex justify-around items-center`}
                                    onPress={()=>{UpdateItemQuantity(mealId, true)}}
                                    >
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[15px] ${loading && 'text-gray-300'}`}
                                        >
                                        +
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                <View />
                            </View>
                        </View>
                    </View>

                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}} 
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[15px] mt-4 pl-8 w-full`}
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
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-700'} text-[10px] mt-1 text-center`}
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

                    <View className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-200'} border-t border-b py-4 mt-5 w-[90%] mx-auto space-y-4`}>
                        {getLoading && 
                            <View className='border-b border-gray-200 pb-2'>
                                <ContentLoader
                                width="100%"
                                height={51}
                                backgroundColor="#f3f3f3"
                                foregroundColor="#ecebeb"
                                >
                                    {/* <Rect x="10" y="10" rx="5" ry="5" width="130" height="15" />
                                    <Rect x="10" y="40" rx="5" ry="5" width="100" height="15" /> */}
                                    <Rect x="0" y="15" rx="5" ry="5" width="60" height="15" />
                                    <Rect x="150" y="5" rx="5" ry="5" width="30" height="30" />
                                    <Rect x="210" y="5" rx="5" ry="5" width="30" height="30" />
                                    <Rect x="270" y="15" rx="5" ry="5" width="40" height="15" />
                                </ContentLoader>
                            </View> 
                        }
                        {items.map((item) => (
                            <View key={item.id} className='flex flex-row justify-between items-center'>
                                <Text
                                style={{fontFamily: 'Inter-SemiBold'}} 
                                className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-800'} text-[13px] `}
                                >
                                    {TruncatedText(item.meal_name, 16)}
                                </Text>
                                <View className='flex flex-row justify-between items-center'>                        
                                    <TouchableOpacity
                                    className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-9 h-9 rounded-md flex justify-around items-center`}
                                    onPress={()=>{(item.quantity != 0) && UpdateItemQuantity(item.id, false)}}
                                    >   
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[15px] ${loading && 'text-gray-300'}`}
                                        >
                                            -
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <View className='w-7 h-7 mx-2 rounded-md flex justify-around items-center'>
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[15px]`}
                                        >
                                            {item.quantity}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                    className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-9 h-9 rounded-md flex justify-around items-center`}
                                    onPress={()=>{UpdateItemQuantity(item.id, true)}}
                                    >
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[15px] ${loading && 'text-gray-300'}`}
                                        >
                                        +
                                        </Text>
                                        {(loading) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}} 
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[13px] ml-4`}
                                    >
                                        ₦{item.amount * item.quantity}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-[90%] mt-5 mx-auto px-4 py-1 rounded-xl`}>
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
                        placeholderTextColor={(theme == 'dark')? '#fff':'#228B22'}
                        />
                    </View>


                    <View className='space-y-2 mt-4'>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[11px] text-gray-400'
                            >
                                Service Charges:
                            </Text>  
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[11px] text-custom-green'
                            >
                                ₦{pricingData?.service_charge}
                            </Text>  
                        </View>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[11px] text-gray-400'
                            >
                                Delivery Charges:
                            </Text>  
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[11px] text-custom-green'
                            >
                                ₦{pricingData?.delivery_fee}
                            </Text>  
                        </View>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} text-[14px]`}
                            >
                                Total
                            </Text>  
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[14px] text-custom-green'
                            >
                                ₦{RoundToDecimalPlace((pricingData.delivery_fee + pricingData.service_charge + CalculateItemPrice), 2)}
                            </Text>  
                        </View>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className=' text-[12px] text-gray-400' 
                            >
                                DELIVER TO {"\n"}
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-800'} text-[10px]`}
                                >
                                    {TruncatedText(deliveryAddress || '', 40) }
                                </Text> 
                            </Text>  
                            <TouchableOpacity
                            onPress={()=>{router.push('/set_delivery_address?update=1')}}
                            >
                                <Text
                                style={{fontFamily: 'Inter-Medium-Italic'}} 
                                className=' text-[12px] text-custom-green'
                                >
                                    Change
                                </Text>  
                            </TouchableOpacity>
                        </View>
                    </View>

                    
                    <View className=' w-[90%] mx-auto mt-10 flex flex-row justify-between items-center'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-700'} text-[14px]`}
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
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[14px]`}
                            >
                                Date
                            </Text>
                            <View className='flex flex-row space-x-2 items-center'>
                                <Calender  />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px]`}
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
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[14px]`}
                            >
                                Time
                            </Text>
                            <View className='flex flex-row space-x-2 items-center'>
                                <Time />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px]`}
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