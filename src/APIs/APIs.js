import axios from 'axios';
import { serverURI } from './APIEndpoints';
import { store } from '../store/store';

let headers = {};
let authenticatedRequests=null;
let authorizedRequests=null;

const listener = () => {
  let token = store.getState().auth.token;
  headers = {
      authorization: `Bearer ${token.access_token},Bearer ${token.id_token}`
  }
};

export const authenticatedRequestsHandler = () => {
  if(authenticatedRequests){
    return authenticatedRequests;
  }
  authenticatedRequests=axios.create({
    baseURL: serverURI 
  });
  return authenticatedRequests;
}

export const authorizedRequestsHandler = () => {
  listener();
  if(authorizedRequests){
    return authorizedRequests;
  }
  authorizedRequests=axios.create({
    baseURL: serverURI,
    headers: headers
  });
  return authorizedRequests;
}
