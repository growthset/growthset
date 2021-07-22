import React, { Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { Route, Switch, useLocation } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import Pace from "./shared/components/Pace";
import useAckee from 'use-ackee'

const LoggedInComponent = lazy(() => import("./logged_in/components/Main"));

const LoggedOutComponent = lazy(() => import("./logged_out/components/Main"));

function Content() {

  const location = useLocation();

  useAckee(location.pathname, {
		server: 'http://localhost:5000',
		domainId: '4ead782d-38ba-4c90-8c7a-11603c4a97d8'
	}, {
		ignoreLocalhost: false,
    detailed: true,
    ignoreOwnVisits: false
	});

  return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Pace color={theme.palette.primary.light} />
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route path="/c">
              <LoggedInComponent />
            </Route>
            <Route>
              <LoggedOutComponent />
            </Route>
          </Switch>
        </Suspense>
      </MuiThemeProvider>
  );
}
export default Content;
