import React from 'react';
import './App.css';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import BuzzPage from './containers/BuzzPage/BuzzPage';
import ComplaintPage from './containers/ComplaintPage/ComplaintPage';
import ResolvedPage from './containers/ResolvedPage/AllComplaintsList/AllComplaintsList';
import About from './components/About/AboutInfo';
import Help from './components/Help/HelpPage';
import Login from './components/Login/Login';
import AuthToken from './containers/AuthToken/AuthToken';
import Home from './components/Home/Home';
import PrivateRoute from './containers/PrivateRoute/PrivateRoute';
import AuthenticatedAdminRoute from './containers/AuthenticatedRoute/AuthenticatedAdminRoute';
import AuthenticatedSuperadminRoute from './containers/AuthenticatedRoute/AuthenticatedSuperadminRoute';
import NotFound from './components/NotFound/NotFound';
import Error from './hoc/Error/Error';
import SuperAdmin from './containers/SuperAdmin/SuperAdmin';
import MyProfile from './containers/MyProfile/MyProfile';
import Profile from './containers/Profile/Profile';
import ProtectedRoute from './containers/AuthenticatedRoute/ProfileProtectedRoute';
import AuthenticateComplaint from './containers/AuthenticatedRoute/AuthenticatedComplaintRoute';
const App=()=>{
  return (
    <Router>
      <Switch>
      <Route path="/" exact component={Login}/>
      <Route path="/login" component={Login}/>
      <Route path="/authToken" component={AuthToken}/>
      <Error>
       <Home>
          <Route component={({match})=>
          <>
        <Switch>
        <PrivateRoute exact path="/myprofile"><MyProfile/></PrivateRoute>
        <ProtectedRoute exact path="/profile"><Profile/></ProtectedRoute>
        <PrivateRoute exact path="/buzz"><BuzzPage/></PrivateRoute>
        <AuthenticateComplaint exact path="/complaint"><ComplaintPage/></AuthenticateComplaint>
        <AuthenticatedAdminRoute exact path="/resolved"><ResolvedPage/></AuthenticatedAdminRoute>
        <AuthenticatedSuperadminRoute exact path="/superadmin"><SuperAdmin/></AuthenticatedSuperadminRoute>
        <Route exact path="/about" component={About}/>
        <Route exact path="/help" component={Help}/>
        <Route path="" component={NotFound}/>
        </Switch>
         </>
          }/>
         </Home>
      </Error>
         
      </Switch>
    </Router>
   
  );
}

export default App;
