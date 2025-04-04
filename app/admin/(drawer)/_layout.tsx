import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { router } from 'expo-router'
import MenuBar from '../../../assets/icon/menuBar.svg';
import MenuBarDark from '../../../assets/icon/MenuBarDark.svg';
import Bell from '../../../assets/icon/bell.svg';
import BellDark from '../../../assets/icon/bell-dark.svg';
import UserManagement from '../../../assets/icon/user-management.svg';
import DashboardIcon from '../../../assets/icon/dashboard-icon.svg';
import OrderManagement from '../../../assets/icon/order-management.svg';
import EarningTransaction from '../../../assets/icon/earnings-transaction.svg';
import Reports from '../../../assets/icon/reports.svg';
import AccountInactive from '../../../assets/icon/account_fill_inactive.svg';
import PagesRestriction from '../../../assets/icon/pages-restrictions.svg';
import ContentManagement from '../../../assets/icon/content-management.svg';
import HelpSupport from '../../../assets/icon/help-support.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { FontAwesome } from '@expo/vector-icons';

import AdminHome from './home'
import AdminOrder from './order'
import AdminUser from './users'
import AdminTransaction from './transaction'
import AdminReportAnalytics from './reports'
import AdminPages from './pages'
import AdminContent from './content'
import AdminHelpSupport from './support'
import Account from './account';


const Drawer = createDrawerNavigator();

export default function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={({ navigation }) => ({
            // headerTitle: 'Dashboard', // Title in the center
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 14,
              // fontWeight: 'bold',
              fontFamily: 'Inter-SemiBold',
              color: (theme == 'dark')? '#fff' : '#1E1E1E', // Change title color
            },
            headerStyle: {
              backgroundColor: (theme == 'dark')?  '#1f2937' : '#fff', // Replace with your desired color
            },
            drawerStyle: {
              backgroundColor: (theme == 'dark')? '#111827' : '#fff', // Set the background color of the drawer
            },
            headerLeft: () => (
              <TouchableOpacity 
              className='ml-4'
              onPress={() => navigation.toggleDrawer()}>
                {(theme == 'dark')?
                  <MenuBarDark width={35} height={35} />
                  :
                  <MenuBar width={35} height={35} />
                }
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity 
              className='mr-4'
              onPress={()=>{router.push('/notification')}}>
                {(theme == 'dark')?
                  <BellDark />
                  :
                  <Bell />
                }
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
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
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
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
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
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
        }} 
      />
      <Drawer.Screen 
        name="Earning & Transactions" 
        component={AdminTransaction} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <EarningTransaction width={30} height={30} />
          ),
          drawerLabelStyle: {
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
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
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
        }} 
      />
      {/* <Drawer.Screen 
        name="Pages & Restriction" 
        component={AdminPages} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <PagesRestriction width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
        }} 
      /> */}
      {/* <Drawer.Screen 
        name="Content management" 
        component={AdminContent} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <ContentManagement width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
        }} 
      /> */}
      <Drawer.Screen 
        name="Help & Support" 
        component={AdminHelpSupport} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <HelpSupport width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
        }} 
      />
      <Drawer.Screen 
        name="Account" 
        component={Account} 
        options={{
          drawerIcon: ({ focused, size }) => (
            <FontAwesome name="user" size={28} color={(theme == 'dark')? "#6b7280" : "#9ca3af"} />
            // <AccountInactive width={28} height={28} />
          ),
          drawerLabelStyle: {
            fontSize: 13,
            color: (theme == 'dark')? "#e5e7eb" : "#111827",
            fontFamily: 'Inter-Medium',  // Font for the drawer label
          },
          drawerActiveBackgroundColor: (theme == 'dark')? '#1f2937' : '#e5e7eb',
        }} 
      />
    </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
