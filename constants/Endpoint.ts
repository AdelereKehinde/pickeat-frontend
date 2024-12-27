import Constants from "expo-constants";

const BASE_URL = `https://pickeat-backend.onrender.com/api/v1/`
const ACOOUNT_BASE = `account/`
const BUYER_BASE = `buyer/`
const VENDOR_BASE = `vendor/`
const INVENTORY_BASE = `inventory/`
const CART_BASE = `cart/`
const PAYMENT_BASE = `payment/`
const ENDPOINTS = {
    'account': {
        'profession': `${ACOOUNT_BASE}professions`,
        'chats': `${ACOOUNT_BASE}chats`,
        'chats-create': `${ACOOUNT_BASE}chats/create`,
        'send-message': `${ACOOUNT_BASE}chats/message/send`
    },
    'buyer': {
        'signin': `${BUYER_BASE}signin`,
        'signup': `${BUYER_BASE}signup`,
        'verify': `${BUYER_BASE}`,
        'user-data':`${BUYER_BASE}data`,
        'search-user': `${BUYER_BASE}users/search`,
        'create-address': `${BUYER_BASE}address/create`,
        'update-address': `${BUYER_BASE}address/update`,
        'buyer-address': `${BUYER_BASE}buyer-address/update`,
        'forget-password': `${BUYER_BASE}password/forget`,
        'validate-password-reset': `${BUYER_BASE}password/validate-otp`,
        'reset-password': `${BUYER_BASE}password/reset`,
        'add-remove-favourite-store': `${BUYER_BASE}store/`,
        'information': `${BUYER_BASE}information`,
        'notification': `${BUYER_BASE}notification`,
        'review': `${BUYER_BASE}review`,
    },
    'vendor': {
        'signin': `${VENDOR_BASE}signin`,
        'signup': `${VENDOR_BASE}signup`,
        'verify': `${VENDOR_BASE}`,
        'user-data':`${VENDOR_BASE}data`,
        'onboard': `${VENDOR_BASE}profile/create`,
        'availability': `${VENDOR_BASE}profile/availability`,
        'forget-password': `${VENDOR_BASE}password/forget`,
        'validate-password-reset': `${VENDOR_BASE}password/validate-otp`,
        'reset-password': `${VENDOR_BASE}password/reset`,
        'list': `${VENDOR_BASE}list`,
        'profile': `${VENDOR_BASE}store`,
        'store-list': `${VENDOR_BASE}store/list`,
        'dashboard': `${VENDOR_BASE}dashboard`,
        'review': `${VENDOR_BASE}review`,
        'create-address': `${VENDOR_BASE}address/create`,
        'update-address': `${VENDOR_BASE}address/update`,
        'information': `${VENDOR_BASE}information`,
    },
    'inventory': {
        'categories': `${INVENTORY_BASE}categories`,
        'create-meal': `${INVENTORY_BASE}meal/create`,
        'meal-list': `${INVENTORY_BASE}meal/list`,
        'meal': `${INVENTORY_BASE}meal/`,
        'special-offer-meal-list': `${INVENTORY_BASE}meal/list/special-offer`,
        'vendor-meal-list': `${INVENTORY_BASE}meal/list/vendor`,
        'kitchen-meal': `${INVENTORY_BASE}meal/`,
        'delete-meal': `${INVENTORY_BASE}meal/delete`,
    },
    'cart': {
        'add': `${CART_BASE}add`,
        'remove': `${CART_BASE}remove`,
        'list': `${CART_BASE}list`,
        'edit': `${CART_BASE}edit`,
        'checkout': `${CART_BASE}checkout`,
        'checkout-summary': `${CART_BASE}checkout/summary`,
        'buyer-orders': `${CART_BASE}buyer/orders`,
        'vendor-orders': `${CART_BASE}vendor/orders`,
        'orders-history': `${CART_BASE}order_history`,
    },
    'payment': {
        'buyer-create': `${PAYMENT_BASE}buyer/card/create`,
        'wallet-dashboard': `${PAYMENT_BASE}buyer/wallet/dashboard`,
        'fund-wallet': `${PAYMENT_BASE}buyer/wallet/fund`,
        'pay': `${PAYMENT_BASE}buyer/pay`,
        'vendor-transactions': `${PAYMENT_BASE}transaction/vendor`,
    },
}

export default ENDPOINTS;