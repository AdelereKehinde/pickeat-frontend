import { Tabs } from 'expo-router';
import HomeFill from '../../assets/icon/home_fill.svg';
import HomeOutline from '../../assets/icon/home_outline.svg';
import CartFill from '../../assets/icon/cart_fill.svg';
import CartOutline from '../../assets/icon/cart_outline.svg';
import ServiceFill from '../../assets/icon/service_fill.svg';
import ServiceOutline from '../../assets/icon/service_outline.svg';
import AccountFill from '../../assets/icon/account_fill.svg';
import AccountOutline from '../../assets/icon/account_outline.svg';
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
        name="dashboard" 
        options={{ 
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused 
              ? <HomeFill width={30} height={30} />
              : <HomeOutline width={34} height={34} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="services"
        options={{ 
          title: 'Services',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <ServiceFill width={34} height={34} />
            : <ServiceOutline width={34} height={34} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="cart" 
        options={{ 
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <CartFill width={34} height={34} />
            : <CartOutline width={34} height={34} />
          ), 
        }} 
      />

      <Tabs.Screen
        name="account" 
        options={{ 
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <AccountFill width={34} height={34} />
            : <AccountOutline width={34} height={34} />
          ), 
        }} 
      />
    </Tabs>
  );
}
