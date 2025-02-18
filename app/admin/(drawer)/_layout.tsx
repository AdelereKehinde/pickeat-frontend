import React from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { router } from 'expo-router'
import MenuBar from '../../../assets/icon/menuBar.svg';
import Bell from '../../../assets/icon/bell.svg';

import AdminHome from './home'
import AdminOrder from './order'
import AdminUser from './users'

const Drawer = createDrawerNavigator();

export default function Layout() {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
      screenOptions={({ navigation }) => ({
            // headerTitle: 'Dashboard', // Title in the center
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1E1E1E', // Change title color
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <MenuBar width={40} height={40} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={()=>{router.push('/notification')}}>
                <Bell />
              </TouchableOpacity>
            ),
          })}
      >
      <Drawer.Screen name="Dashboard" component={AdminHome} />
      <Drawer.Screen name="Order Management" component={AdminOrder} />
      <Drawer.Screen name="User management" component={AdminUser} />
      {/* <Drawer.Screen name="Earning & Transactions" component={AdminUser} /> */}
    </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
