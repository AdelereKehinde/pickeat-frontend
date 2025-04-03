import { View, TextInput, Animated, Text,TouchableOpacity, StyleSheet, Modal, FlatList, Pressable} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import Filter from '../assets/icon/filter.svg';

type OptionType = {
    label: string;
    value: string | number;
  };

interface Properties {
  options: OptionType[],
  active?: boolean,
  open: boolean,
  getValue: (value: string) => void
}

const FilterModal: React.FC<Properties> = ({options, active=true, open,  getValue}) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocus] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(''); 
    
    const handleSelect = (option:string, value:string|number) => {
        setSelectedOption(option);
        setIsVisible(false);
        setInputValue(option)
        getValue(""+value);
    };
    
    useEffect(() => {
        setInputValue(
            options[0].label
        )
    }, []); // Empty dependency array ensures this runs only once (on mount/unmount)
    return (
        <View 
        className=''
        >

            <Pressable 
            onPress={() => setIsVisible(!isVisible)} 
            className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} flex flex-row items-center space-x-2 my-2 py-2 px-4 rounded-lg`}>
                
                {/* TextInput */}
                <Text 
                style={{fontFamily: 'Inter-Regular'}} 
                className={`${theme == 'dark'? 'text-gray-100' : ' text-black'} text-[11px]`}>
                    {inputValue}
                </Text>
            
                <View>   
                    <Filter width={15} height={15} />
                </View>
            </Pressable>
        
        {/* Dropdown list */}
        {isVisible && (
            <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade" // Slides up from the bottom
            onRequestClose={()=>setIsVisible(false)}
            >
                {/* Background Overlay */}
                <TouchableOpacity
                className="flex-1 bg-black/40 flex items-center justify-around w-full h-full"
                onPress={()=>setIsVisible(false)}
                >
                    {/* Modal Container */}
                    <View className="bg-white rounded-2xl p-4 w-[90%] max-h-[50%]">
                        <FlatList
                            data={options}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-4 border-b border-gray-200"
                                onPress={() => {
                                    handleSelect(item.label, item.value);
                                }}
                            >
                                <Text 
                                style={{fontFamily: 'Inter-Regular'}} 
                                className="text-lg text-gray-800 text-[15px]">{item.label}</Text>
                            </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    shadow_box: {
      backgroundColor: 'white',
      // iOS shadow properties
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      // Android shadow property
      elevation: 50,
    },
  });

export default FilterModal