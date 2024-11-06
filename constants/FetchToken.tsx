import AsyncStorage from '@react-native-async-storage/async-storage';

const GetToken = async () => {
    await AsyncStorage.getItem('token');
}

export default GetToken;