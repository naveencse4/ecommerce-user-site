import app from "firebase/app";
import firebase from "firebase";
var firebaseConfig = {
    apiKey: "AIzaSyC6lp5puPEw5wJ8QdRxL2EKRGZZh36q98w",
    authDomain: "heybandi-bc0f6.firebaseapp.com",
    databaseURL: "https://heybandi-bc0f6.firebaseio.com",
    projectId: "heybandi-bc0f6",
    storageBucket: "heybandi-bc0f6.appspot.com",
    messagingSenderId: "216757827240",
    appId: "1:216757827240:web:97ff827fafad21614bf49d",
    measurementId: "G-1TXPVSCFYL",
  };
class Firebase {
	constructor() {
		if (!app.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}
	}
}
export default Firebase;