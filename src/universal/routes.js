import React from "react";
import { Switch, Route } from "react-router";
import App from "../containers/App";
import Home from "../containers/Home";
import Category from "../containers/Category";
import Product from "../containers/Product";
import Checkout from "../containers/Checkout";
//import Orders from "../containers/Orders";
import Orders from "../components/pages/orders";
import Order from "../components/pages/orders/Order";
//import Order from "../containers/Order";
import Profile from "../components/pages/profile/Profile";
// import DashBoard from "../components/pages/profile/DashBoard";
// import Affiliates from "../components/pages/profile/Affiliates";
import Refund from "../components/pages/static/Refund";
import Terms from "../components/pages/static/Terms";
import Privacy from "../components/pages/static/Privacy";
import About from "../components/pages/static/About";
import NotFound from "../containers/NotFound";
import service from "../redux/actions/index";
import Download from "../components/pages/static/Download";

export const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
    loadData: (re, storeId) => service.getHomeDataSSR(re, storeId), // getUserCommonData
  },
  {
    path: "/product/:slug",
    exact: true,
    component: Product,
    loadData: (params, storeId) =>
      service.getProductPageDataSSR(params, storeId),
  },
  {
    path: "/category/:slug",
    exact: true,
    component: Category,
    loadData: (params, storeId) =>
      service.getCategoryPageDataSSR(params, storeId),
  },
  {
    path: "/checkout",
    exact: true,
    component: Checkout,
    loadData: (storeId) => service.checkoutCart(storeId),
  },
  {
    path: "/orders",
    exact: true,
    component: Orders,
  },
  {
    path: "/order/:slug",
    exact: true,
    component: Order,
    loadData: (params, storeId) =>
      service.getSingleOrderDataSSR(params, storeId),
  },
  {
    path: "/profile",
    exact: true,
    component: Profile,
  },
  {
    path: "/privacy",
    exact: true,
    component: Privacy,
  },
  {
    path: "/terms",
    exact: true,
    component: Terms,
  },
  {
    path: "/refund",
    exact: true,
    component: Refund,
  },
  {
    path: "/about",
    exact: true,
    component: About,
  },
  {
    path: "/download",
    exact: true,
    component: Download,
  },
  {
    component: NotFound,
  },
];

export default function Router() {
  return (
    <App>
      <Switch>
        {routes.map((route) => {
          return (
          <Route key={route.path || "notfound"} {...route} />
        )})}
      </Switch>
    </App>
  );
}
