import { Tabs } from 'expo-router';
import HomeActive from '../../../assets/icon/home_fill_active.svg';
import HomeInactive from '../../../assets/icon/home_fill_inactive.svg';
import ChatActive from '../../../assets/icon/chat_fill_active.svg';
import ChatInactive from '../../../assets/icon/chat_fill_inactive.svg';
import OrderActive from '../../../assets/icon/order_fill_active.svg';
import OrderInactive from '../../../assets/icon/order_fill_inactive.svg';
import AccountActive from '../../../assets/icon/account_fill_active.svg';
import AccountInactive from '../../../assets/icon/account_fill_inactive.svg';

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#7eb37f',
      headerShown: false,
      tabBarStyle: {
        paddingHorizontal: 20,
        paddingVertical: 2,
        height: 70,
        backgroundColor: '#228B22',
      },
      tabBarLabelStyle: {
        fontSize: 11,
        marginBottom: 10,
        marginTop: -5,
        fontFamily: 'Inter-Medium',  // Use your custom font
      },
      tabBarIconStyle: {
        marginBottom: -5,
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
              ? <HomeActive width={34} height={34} />
              : <HomeInactive width={34} height={34} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="order"
        options={{ 
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <OrderActive width={34} height={34} />
            : <OrderInactive width={34} height={34} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <ChatActive width={34} height={34} />
            : <ChatInactive width={34} height={34} />
          ), 
        }} 
      />

      <Tabs.Screen
        name="account" 
        options={{ 
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            focused 
            ? <AccountActive width={34} height={34} />
            : <AccountInactive width={34} height={34} />
          ), 
        }} 
      />
    </Tabs>
  );
}
