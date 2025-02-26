import { Text, View, StatusBar, Pressable} from "react-native";
import { Link } from "expo-router";
import { router } from 'expo-router'
import Back from '../assets/icon/back_arrow.svg';
import Bell from '../assets/icon/bell.svg';

interface Properties {
    next:'/vendor/signup' | '/vendor/get_started' |'/vendors/orders' | '/rider/signup',
  }

const Skip: React.FC<Properties> = ({next})  =>{
    return (
        <View className="flex flex-row w-full">
            <Pressable
            onPress={()=>{router.push(next)}}
            className={`text-center p-3 ml-auto self-center mt-5 flex items-center justify-around`}
            >
                <Text
                style={{fontFamily: 'Inter-SemiBold'}} 
                className="text-[14px text-custom-green"
                >
                    Skip
                </Text>
            </Pressable>
        </View>
    )
}

export default Skip;