import { csrfFetch } from "./csrf";

const GET_PROJECTS = "projects/getProjects";
const GET_PROJECT = "projects/getProject";
const ADD_PROJECT = "projects/addProject";
const EDIT_PROJECT = "projects/editProject";
const DELETE_PROJECT = "projects/deleteProject";

// actions
const getProjects = (projects) => {
  return {
    type: GET_PROJECTS,
    payload: projects,
  };
};

const getProject = (project) => {
  return {
    type: GET_PROJECT,
    payload: project,
  };
};

const addProject = (project) => {
  return {
    type: ADD_PROJECT,
    payload: project,
  };
};

export const fetchProjects = () => async (dispatch) => {
  const response = await csrfFetch("/api/projects");
  const data = await response.json();
  dispatch(getProjects(data));
  return response;
};

export const fetchProject = (projectId) => async (dispatch) => {
  const response = await csrfFetch(`/api/projects/${projectId}`);
  const data = await response.json();
  dispatch(getProject(data));
  return response;
};

export const createProject = (projectData) => async (dispatch) => {
  const response = await csrfFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const data = await response.json();
  dispatch(addProject(data));
  return response;
};

const initialState = {
  allProjects: [],
  currentProject: null,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECTS:
      return { ...state, allProjects: action.payload };
    case GET_PROJECT:
      return { ...state, currentProject: action.payload };
    case ADD_PROJECT:
      return { ...state, allProjects: [...state.allProjects, action.payload] };
    default:
      return state;
  }
};

export default projectReducer;
