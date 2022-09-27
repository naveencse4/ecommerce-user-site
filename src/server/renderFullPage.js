// https://redux.js.org/recipes/server-rendering#inject-initial-component-html-and-state
export default function renderFullPage(html, preloadedState, helmet) {
	return `
	<!DOCTYPE html>
	<html lang="en">
		<head> 
			<meta charset="UTF-8"> 
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<link rel="icon" href="https://images.heybandi.com/favicon.ico" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#000000" />
			<meta property="og:type" content="website" />
			<meta property="og:title" content="HeyBandi" />
			<meta property="og:url" content="https://images.heybandi.com/catalogue.html" />
			<meta property="og:site_name" content="HeyBandi" />
			<meta property="og:description" content="Fresh Vegetables, Fruits and Groceries with great service experience." />
			<meta property="og:image" itemprop="image primaryImageOfPage" content="https://images.heybandi.com/HB-logo.png">
			<link rel="apple-touch-icon" href="/public/logo192.png" />
			<link rel="manifest" href="/public/manifest.json" />
			${helmet.title.toString()}
			${helmet.meta.toString()}
			${process.env.NODE_ENV === 'production' ? '<link rel="stylesheet" type="text/css" href="/dist/main.style.css" />' : ''}
		</head>
		<body>
			<div id="root">${html}</div>
			<script>
			window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
			</script>
			<script src="/dist/main.bundle.js"></script>
			<script src="/dist/runtime~main.bundle.js"></script>
			<script src="/dist/vendors~main.bundle.js"></script>
			<script src="/public/script.js" defer></script>
			<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
			<script src="https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js"></script>
			<script src="https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore-compat.js"></script>
			<script src="https://www.gstatic.com/firebasejs/9.1.3/firebase-auth-compat.js"></script>

			<script>
  			// Initialize Firebase
			var config = {
					apiKey: "AIzaSyC6lp5puPEw5wJ8QdRxL2EKRGZZh36q98w",
					authDomain: "heybandi-bc0f6.firebaseapp.com",
					databaseURL: "https://heybandi-bc0f6.firebaseio.com",
					projectId: "heybandi-bc0f6",
					storageBucket: "heybandi-bc0f6.appspot.com",
					messagingSenderId: "216757827240",
					appId: "1:216757827240:web:97ff827fafad21614bf49d",
					measurementId: "G-1TXPVSCFYL",
				};
			firebase.initializeApp(config);
      		</script>
		</body>
    </html>
    `;
}
