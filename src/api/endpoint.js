import { apiConfig } from '../config';

export const OVERVIEW_ENDPOINT = '/overview';
export const OVERVIEW_GENERAL_ENDPOINT = `${OVERVIEW_ENDPOINT}/general`;
export const OVERVIEW_NEW_ENDPOINT = `${OVERVIEW_ENDPOINT}/new`;
export const OVERVIEW_CHURN_ENDPOINT = `${OVERVIEW_ENDPOINT}/churn`;
export const OVERVIEW_FILTER_ENDPOINT = `${OVERVIEW_ENDPOINT}/filters`;

export const LOGIN_ENDPOINT = '/login';
export const CENTRAL_LOGOUT_ENDPOINT = `${apiConfig.apiUrl}/csoc/centralLogout`;
export const LOGOUT_ENDPOINT = `/logout`;
export const GET_USER_INFO_ENDPOINT = `/getUserInfo`;
export const VALIDATE_TOKEN_ENDPOINT = `/validateToken`;

//project
export const GETLIST_PROJECT = `${apiConfig.datablendUrl}/projects`;
