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
import AuthenticatedRoute from './containers/AuthenticatedRoute/AuthenticatedRoute';
import NotFound from './components/NotFound/NotFound';
import Error from './hoc/Error/Error';

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
        <PrivateRoute exact path="/buzz"><BuzzPage/></PrivateRoute>
        <PrivateRoute exact path="/complaint"><ComplaintPage/></PrivateRoute>
        <AuthenticatedRoute exact path="/resolved"><ResolvedPage/></AuthenticatedRoute>
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
