import { Tabs } from 'expo-router';
import HomeFill from '../../../assets/icon/rider-home-fill.svg';
import HomeOutline from '../../../assets/icon/rider-home-outline.svg';
import OrderFill from '../../../assets/icon/rider-orders-fill.svg';
import OrderOutline from '../../../assets/icon/rider-orders-outline.svg';
import MapFill from '../../../assets/icon/rider-map-fill.svg';
import MapOutline from '../../../assets/icon/rider-map-outline.svg';
import AccountFill from '../../../assets/icon/rider-account-fill.svg';
import AccountOutline from '../../../assets/icon/rider-account-outline.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { useContext } from 'react';

export default function TabLayout() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#228B22',
      headerShown: false,
      tabBarStyle: {
        paddingHorizontal: 20,
        paddingVertical: 2,
        height: 70,
        backgroundColor: (theme == 'dark')? '#1f2937' : '#ffffff',
      },
      tabBarLabelStyle: {
        fontSize: 11,
        marginBottom: 10,
        marginTop: 0,
        fontFamily: 'Inter-Medium',  // Use your custom font
      },
      tabBarIconStyle: {
        marginBottom: 0,
        marginTop: 5,
      }
    }} 
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused 
              ? <HomeFill width={25} height={25} />
              : <HomeOutline width={25} height={25} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="orders"
        options={{ 
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <OrderFill width={25} height={25} />
            : <OrderOutline width={25} height={25} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <MapFill width={25} height={25} />
            : <MapOutline width={25} height={25} />
          ), 
        }} 
      />

      <Tabs.Screen
        name="account" 
        options={{ 
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <AccountFill width={25} height={25} />
            : <AccountOutline width={25} height={25} />
          ), 
        }} 
      />
    </Tabs>
  );
}
