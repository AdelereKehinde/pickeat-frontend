import React from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { router } from 'expo-router'
import MenuBar from '../../../assets/icon/menuBar.svg';
import Bell from '../../../assets/icon/bell.svg';
import UserManagement from '../../../assets/icon/user-management.svg';
import DashboardIcon from '../../../assets/icon/dashboard-icon.svg';
import OrderManagement from '../../../assets/icon/order-management.svg';
import EarningTransaction from '../../../assets/icon/earnings-transaction.svg';
import Reports from '../../../assets/icon/reports.svg';
import PagesRestriction from '../../../assets/icon/pages-restrictions.svg';
import ContentManagement from '../../../assets/icon/content-management.svg';
import HelpSupport from '../../../assets/icon/help-support.svg';

import AdminHome from './home'
import AdminOrder from './order'
import AdminUser from './users'
import AdminTransaction from './transaction'
import AdminReportAnalytics from './reports'
import AdminPages from './pages'
import AdminContent from './content'
import AdminHelpSupport from './support'

const Drawer = createDrawerNavigator();

export default function Layout() {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
      screenOptions={({ navigation }) => ({
            // headerTitle: 'Dashboard', // Title in the center
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 16,
              // fontWeight: 'bold',
              fontFamily: 'Inter-SemiBold',
              color: '#1E1E1E', // Change title color
            },
            headerLeft: () => (
              <TouchableOpacity 
              className='ml-4'
              onPress={() => navigation.toggleDrawer()}>
                <MenuBar width={35} height={35} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity 
              className='mr-4'
              onPress={()=>{router.push('/notification')}}>
                <Bell />
              </TouchableOpacity>
            ),
          })}
      >
      <Drawer.Screen 
        name="Dashboard" 
        component={AdminHome} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <DashboardIcon width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
      <Drawer.Screen 
        name="Order Management" 
        component={AdminOrder} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <OrderManagement width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
      <Drawer.Screen 
        name="User management" 
        component={AdminUser} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <UserManagement width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
      <Drawer.Screen 
        name="Earning & Transactions" 
        component={AdminTransaction} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <EarningTransaction width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
      <Drawer.Screen 
        name="Reports & Analytics" 
        component={AdminReportAnalytics} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <Reports width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
      <Drawer.Screen 
        name="Pages & Restriction" 
        component={AdminPages} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <PagesRestriction width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
      <Drawer.Screen 
        name="Content management" 
        component={AdminContent} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <ContentManagement width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
      <Drawer.Screen 
        name="Help & Support" 
        component={AdminHelpSupport} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <HelpSupport width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 14,
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
        }} 
      />
    </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
