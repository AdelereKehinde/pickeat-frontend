import { Text, View, StatusBar, Pressable} from "react-native";
import { Link } from "expo-router";
import { router } from 'expo-router'
import Back from '../assets/icon/back_arrow.svg';
import Bell from '../assets/icon/bell.svg';

interface Properties {
    title: string,
    withprevious: boolean;
    withbell: boolean
  }

const TitleTag: React.FC<Properties> = ({title, withbell, withprevious})  =>{
    return (
        <View className="w-full">
            <View className="flex flex-row justify-between h-12 items-center">
                <View className="w-6 h-6 flex items-end justify-around ml-5">
                    {withprevious && (
                        <Pressable 
                        onPress={()=>{router.back()}}
                        className="">
                            <Back />
                        </ Pressable>
                    )}
                </View>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}} 
                className="text-[14px] text-gray-700"
                >
                    {title}
                </Text>

                
                <View className="mr-5 w-6 h-6 flex items-end justify-around">
                {withbell && (
                    <Pressable 
                    onPress={()=>{router.push('/notification')}}
                    className="ml-5">
                        <Bell />
                    </Pressable>
                )}
                </View>

            </View>
        </View>
    )
}

export default TitleTag;