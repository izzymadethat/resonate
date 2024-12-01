import { csrfFetch } from "./csrf";

// const GET_PROJECT_CLIENTS = "clients/getProjectClients";
// const GET_CLIENT = "clients/getClient";
const ADD_CLIENT = "clients/addClient";
const EDIT_CLIENT = "clients/editClient";
const DELETE_CLIENT = "clients/deleteClient";

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

export const fetchAddClient = (client) => async (dispatch) => {
  const response = await csrfFetch(`/api/clients`, {
    method: "POST",
    body: JSON.stringify(client)
  });
  const data = await response.json();
  dispatch(addClient(data));
  return response;
};

export const fetchEditClient =
  (projectId, clientId, client) => async (dispatch) => {
    const response = await csrfFetch(
      `/api/projects/${projectId}/clients/${clientId}`,
      {
        method: "PUT",
        body: JSON.stringify(client)
      }
    );
    const data = await response.json();
    dispatch(editClient(data));
    return response;
  };

export const fetchDeleteClient = (projectId, clientId) => async (dispatch) => {
  const response = await csrfFetch(
    `/api/projects/${projectId}/clients/${clientId}`,
    {
      method: "DELETE"
    }
  );
  dispatch(deleteClient(clientId));
  return response;
};
