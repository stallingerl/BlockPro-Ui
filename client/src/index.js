import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RTLLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <React.StrictMode>
        <HashRouter>
          <Switch>
            <Route path={`/auth`} component={AuthLayout} />
            <Route path={`/signUp`} component={AuthLayout} />
            <Route path={`/admin`} component={AdminLayout} />
            <Route path={`/rtl`} component={RTLLayout} />
            <Redirect from='/' to='/auth' />
          </Switch>
        </HashRouter>
      </React.StrictMode>
    </Provider>
  </ChakraProvider>,
  document.getElementById("root")
);