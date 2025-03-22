import React, { useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

interface Properties {
    open: boolean,
    service: string,
    getValue: (value: boolean) => void
}

const DeleteAccountModal: React.FC<Properties> = ({open, service,  getValue}) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [ loading, setLoading ] = useState(false);

    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const handleProceed = async () => {
        if (!loading){
            setLoading(true);
            try {
                if(service == 'rider'){
                    const response = await postRequest(`${ENDPOINTS['rider']['delete']}`, {}, true);     
                    router.push('/rider/signup')         
                }
                if(service == 'vendor'){
                    const response = await postRequest(`${ENDPOINTS['vendor']['delete']}`, {}, true);     
                    router.push('/vendor/signup')         
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: "An error occured",
                    text2: 'Unknown Error',
                    visibilityTime: 5000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = () => {
        if (!loading){
            // Close the modal without doing anything
            getValue(false)
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
            onRequestClose={()=>getValue(false)}  // Handle back button press
        >
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="flex-1 justify-center items-center">
                <View className="bg-white p-6 rounded-lg w-4/5 items-center">
                    <Text 
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className="text-[16px] mb-4 text-center">
                        Are you sure you want to delete your account?
                    </Text>
                    <Text 
                    style={{fontFamily: 'Inter-Regular'}}
                    className="text-[13px] text-center mb-6">
                        This action cannot be undone.
                    </Text>
                    
                    <View className="flex-row justify-between w-full">
                        <TouchableOpacity
                            onPress={handleCancel}  // Close the modal without deleting
                            className="bg-gray-300 px-6 py-3 rounded-md items-center"
                        >
                            <Text 
                            style={{fontFamily: 'Inter-Regular'}}
                            className="text-black text-[14px]">
                                Cancel
                            </Text>
                            {(loading) && (
                                <View className='absolute w-full top-3'>
                                    <ActivityIndicator size="small" color="#1f2937" />
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleProceed}  // Proceed with the account deletion
                            className={`${loading? 'bg-custom-inactive-green' : 'bg-custom-green'} px-6 py-3 rounded-md items-center`}
                        >
                            <Text 
                            style={{fontFamily: 'Inter-Regular'}}
                            className="text-white text-[14px]">
                                Proceed
                            </Text>
                            {(loading) && (
                                <View className='absolute w-full top-3'>
                                    <ActivityIndicator size="small" color="#1f2937" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Toast config={toastConfig} />
        </Modal>
    );
};

export default DeleteAccountModal;
