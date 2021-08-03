import React from 'react';
import {Component } from 'react';
import './App.css';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import { useLocation } from 'react-router-dom';

import CreateGuide from './CreateGuide';
import Guides from './Guides';
import Users from './Users';
import Analytics from './Analytics';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Login from './Login';
import ChangePassword from './changePassword';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { gql } from '@apollo/client';


// import { ReactQueryDevtools } from "react-query-devtools";
import { useToken, logout } from './util/auth';
import _ from 'lodash';

// Good state article:
// https://kentcdodds.com/blog/application-state-management-with-react

// Add react router
// https://reactrouter.com/web/guides/quick-start


type AppState = {

}

function MainTabs() {
  const GET_USERS = gql`
  query GetUsers {
    listUsers {
      local {
        email
      },
      role
    }
  }`;
  const location = useLocation();
  const allTabs = ['/', '/analytics', '/users'];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const closeMenu = () => {
    setAnchorEl(null);
  }
  return (
    <AppBar position="static">
        <Tabs
          value={location.pathname}
          aria-label="Main Menu"
          centered
        >
          <Tab label="Guides" value="/"  component={Link} to={allTabs[0]} />
          <Tab label="Analytics" value="/analytics" component={Link} to={allTabs[1]} />
          <Tab label="Users" value="/users" component={Link} to={allTabs[2]} />
          <Tab label="Profile" value="/logout" aria-controls="simple-menu" aria-haspopup="true" onClick={openMenu} />
          <Menu
            id="simple-menu"     
            anchorEl = {anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            onClick={closeMenu}>
            {/*<MenuItem>Profile</MenuItem>*/}
            <MenuItem onClick={() => setOpen(true)}>Change Password</MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
            <ChangePassword open={open} setOpen={setOpen} GET_USERS={GET_USERS}></ChangePassword>
          </Menu>
        </Tabs>
      </AppBar>
  );
}

function AppWithRouter() {
  const token = useToken();

  if (_.isUndefined(token)) return (<Login/>);
  return (
    <Router>
      <div>
        <MainTabs/>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/analytics">
            <Analytics />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Guides />
          </Route>          
        </Switch>
      </div>
    </Router>
  );
}

//  <ReactQueryDevtools initialIsOpen/>

class App extends Component<{}, AppState>{

  render() {
      return (<AppWithRouter/>);
  }
}
export default App;
