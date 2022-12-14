import React from "react";
import { renderToString } from "react-dom/server";
import { matchPath } from "react-router-dom";
import { StaticRouter } from "react-router";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import Router, { routes } from "../universal/routes";
import renderFullPage from "./renderFullPage";
import createReduxStore from "../universal/createReduxStore";
import NotFound from "../containers/NotFound";
import Cookies from "universal-cookie";

export default function handleRender(req, res) {
  const promises = [];
  const cookies = new Cookies(req.headers.cookie);

  // Create a new Redux store instance for every request
  const store = createReduxStore({ server: true });

  const storeId = cookies.get("store");
  let matchedRoute;
  // use `some` to imitate `<Switch>` behavior of selecting only the first to match
  routes.some((route) => {
    matchedRoute = matchPath(req.path, route);
    if (matchedRoute && route.loadData)
      promises.push(
        store.dispatch(route.loadData(route.component.loadData(req), storeId))
      );
    return matchedRoute;
  });

  // once all the promises from the routes have been resolved, continue with rendering
  return Promise.all(promises)
    .then(() => {
      // here is where we actually render the html, once we have the required asnyc data
      const html = renderToString(
        // eslint-disable-line
        <Provider store={store}>
          <StaticRouter location={req.url} context={{}}>
            <Router />
          </StaticRouter>
        </Provider>
      );
      const helmet = Helmet.renderStatic();
      // get the preloaded state from the redux store
      const preloadedState = store.getState();

      // send a code based on whether the route matched or was not found
      return res
        .status(matchedRoute && matchedRoute.isExact ? 200 : 404)
        .send(renderFullPage(html, preloadedState, helmet));
    })
    .catch((error) => {
      const html = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={{}}>
            <NotFound />
          </StaticRouter>
        </Provider>
      );
      return res.status(404).send(html);
    });
}
