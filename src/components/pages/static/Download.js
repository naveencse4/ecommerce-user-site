import React, {useEffect} from 'react';
import {
    isAndroid,
    isIOS
} from "react-device-detect";
import queryString from 'query-string';

class App extends React.Component{

     componentDidMount() {
         // const windowUrl = window.location.search;
         // const params = new URLSearchParams(windowUrl);
         let s1 = window.location.href.toString().split("?")[1]
         let s2 = s1.split("=")[1]

         if (isAndroid) {
             window.location.href =
                 "https://play.google.com/store/apps/details?id=com.heybandi.user&referrer="+s2;
         }else if(isIOS) {
             window.location.href =
                 "https://apps.apple.com/app/capsigo/id1547746310&referrer="+s2;
         } else{
             window.location.href =
                 "https://heybandi.com";
         }
     }

    render() {
        return (
            <div className="App">
            </div>
        );
    }
}

export default App;
