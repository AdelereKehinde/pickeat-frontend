import Constants from "expo-constants";

const BASE_URL = `https://4179-102-89-82-229.ngrok-free.app/api/v1/`
const AUTH = `${BASE_URL}account/`
const ENDPOINTS = {
    'signin': `${AUTH}signin`,
    'signup': `${AUTH}signup`,
    'verify': `${AUTH}`,
    'user-data':`${AUTH}data`,
    'forgot-password': `${AUTH}password/forget`,
    'reset-password': `${AUTH}password/reset`,
    'search-user': `${AUTH}users/search`,
    'create-address': `${AUTH}address/create`,
}

export default ENDPOINTS;