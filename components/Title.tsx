import { Text, View, StatusBar,} from "react-native";
import { Link } from "expo-router";
import Back from '../assets/icon/back_arrow.svg';

interface Properties {
    href: string,
    title: string,
  }

const TitleTag: React.FC<Properties> = ({href, title})  =>{
    return (
        <View className="mt-9 w-full">
            <View className="flex flex-row justify-start h-12 items-center">
                <Link 
                href={href}
                className="ml-5">
                    <Back />
                </Link>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}} 
                className="text-[14px] text-gray-700 mx-auto pr-6"
                >
                    {title}
                </Text>
            </View>
        </View>
    )
}

export default TitleTag;