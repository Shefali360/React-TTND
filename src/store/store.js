import {createStore,applyMiddleware,compose,combineReducers} from 'redux';
import thunk from 'redux-thunk';
import tokenReducer from './reducers/AccessTokenReducer';
import revokeTokenReducer from './reducers/RevokeTokenReducer';
import checkAdminReducer from './reducers/AdminRouteProtectReducer';
import redirectError from './reducers/ErrorReducer';
import userData from './reducers/GetUserData';

const composeEnhancers = (process.env.NODE_ENV === 'development'?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :null)|| compose;

const rootReducer=combineReducers({
auth:tokenReducer,
logout:revokeTokenReducer,
adminCheck:checkAdminReducer,
redirect:redirectError,
user:userData
});

export const store=createStore(rootReducer,composeEnhancers(
  applyMiddleware(thunk)
));