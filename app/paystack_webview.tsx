import React, { useState, useEffect, useRef } from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Link, router, useGlobalSearchParams } from "expo-router";

const PaystackWebView = () => {
    const { url } = useGlobalSearchParams();
    const [URL, setURL] = useState(Array.isArray(url)? url[0] : url)

    const handleResponse = (data: WebViewNavigation) => {
        // alert(JSON.stringify(data))
        // router.back()
    };

    return (
        <WebView
        source={{
            uri: URL,
            method: 'GET',
        }}
        onNavigationStateChange={(data) => handleResponse(data)}
        />
    );
};

export default PaystackWebView;
