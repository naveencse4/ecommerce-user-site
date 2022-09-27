/**
 * 1. CREATE A DUPLICATE FILE FROM env_template.js FILE
 * 2. RENAME THE FILE AS env.js and save it.
 * 3. CHANE THE API_URL VALUE TO ENVIRONMENT SPECIFIC.
 *      DEV: HTTP://APIDEV.HEYBANDI.COM:3000/api
 *      STG: HTTP://APISTG.HEYBANDI.COM:3000/api
 *      PROD: HTTPS://API.HEYBANDI.COM/API
 **/

module.exports = {
    API_URL: 'HTTP://APISTG.HEYBANDI.COM:3000/api',
    rzp_key: 'rzp_test_uJ63M3AyyxaRIp',
    firebaseCongig: {
        apiKey: "AIzaSyC6lp5puPEw5wJ8QdRxL2EKRGZZh36q98w",
        authDomain: "heybandi-bc0f6.firebaseapp.com",
        databaseURL: "https://heybandi-bc0f6.firebaseio.com",
        projectId: "heybandi-bc0f6",
        storageBucket: "heybandi-bc0f6.appspot.com",
        messagingSenderId: "216757827240",
        appId: "1:216757827240:web:97ff827fafad21614bf49d",
        measurementId: "G-1TXPVSCFYL",
    },
    HOME_IMG_PREFIX: 'https://s3.amazonaws.com/dev.heybandi/images/',
};