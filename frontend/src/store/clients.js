import { csrfFetch } from "./csrf";

// const GET_PROJECT_CLIENTS = "clients/getProjectClients";
const GET_CLIENT = "clients/getClient";
const ADD_CLIENT = "clients/addClient";
const EDIT_CLIENT = "clients/editClient";
const DELETE_CLIENT = "clients/deleteClient";

const getClient = (client) => {
  return {
    type: GET_CLIENT,
    payload: client
  };
};

const addClient = (client) => {
  return {
    type: ADD_CLIENT,
    payload: client
  };
};

const editClient = (client) => {
  return {
    type: EDIT_CLIENT,
    payload: client
  };
};

const deleteClient = (clientId) => {
  return {
    type: DELETE_CLIENT,
    payload: clientId
  };
};

export const fetchClient = (clientId) => async (dispatch) => {
  const response = await csrfFetch(`/api/clients/${clientId}`);
  const data = await response.json();
  dispatch(getClient(data));
  return data;
};

export const fetchAddClient = (client) => async (dispatch) => {
  const response = await csrfFetch(`/api/clients`, {
    method: "POST",
    body: JSON.stringify(client)
  });
  const data = await response.json();
  dispatch(addClient(data));
  return response;
};

export const fetchEditClient = (clientId, client) => async (dispatch) => {
  const response = await csrfFetch(`/api/clients/${clientId}`, {
    method: "PUT",
    body: JSON.stringify(client)
  });
  const data = await response.json();
  dispatch(editClient(data));
  return response;
};

export const fetchDeleteClient = (clientId) => async (dispatch) => {
  const response = await csrfFetch(`/api/clients/${clientId}`, {
    method: "DELETE"
  });
  dispatch(deleteClient(clientId));
  return response;
};

const initialState = {
  allClients: [],
  currentClient: null
};

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CLIENT:
      return { ...state, currentClient: action.payload };
    case ADD_CLIENT:
      return { ...state, allClients: [...state.allClients, action.payload] };
    case EDIT_CLIENT:
      return {
        ...state,
        allClients: state.allClients.map((client) =>
          client.id === action.payload.id ? action.payload : client
        )
      };
    case DELETE_CLIENT:
      return {
        ...state,
        allClients: state.allClients.filter(
          (client) => client.id !== action.payload
        ),
        currentClient: null
      };
    default:
      return state;
  }
};

export default clientReducer;
