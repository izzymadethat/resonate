import { csrfFetch } from "./csrf";
import Cookies from "js-cookie";

const GET_FILES = "files/GET_FILES";
const GET_STREAM_URL = "files/GET_STREAM_URL";
const ADD_FILES = "files/ADD_FILES";
const DELETE_FILES = "files/DELETE_FILES";
const UNLOAD_FILE = "files/UNLOAD_FILE";

const getFiles = (files) => ({
  type: GET_FILES,
  payload: files
});

const getFileStream = (file) => ({
  type: GET_STREAM_URL,
  payload: file
});

const addFiles = (files) => ({
  type: ADD_FILES,
  payload: files
});

const removeFiles = (fileIds) => {
  return {
    type: DELETE_FILES,
    payload: fileIds
  };
};

export const fetchFiles = (projectId) => async (dispatch) => {
  const res = await csrfFetch(`/api/projects/${projectId}/files`);
  if (res.ok) {
    const files = await res.json();
    dispatch(getFiles(files));
  }

  return res;
};

export const fetchFileStreamUrl = (projectId, fileName) => async (dispatch) => {
  const res = await csrfFetch(
    `/api/projects/${projectId}/files/${fileName}/stream`
  );
  if (res.ok) {
    const file = await res.json();
    dispatch(getFileStream(file));
  }

  return res;
};

export const uploadFiles = (projectId, filesData) => async (dispatch) => {
  const res = await fetch(`/api/projects/${projectId}/files`, {
    method: "POST",
    body: filesData,
    headers: {
      "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
    },
    credentials: "include"
  });

  if (res.ok) {
    const files = await res.json();
    console.log(files);
    dispatch(addFiles(files));
  }

  return res;
};

export const deleteFiles = (projectId, fileIds) => async (dispatch) => {
  const res = await fetch(`/api/projects/${projectId}/files`, {
    method: "DELETE",
    headers: {
      "XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
      "COntent-Type": "application/json"
    },
    body: JSON.stringify({ fileIds }),
    credentials: "include"
  });

  if (res.ok) {
    dispatch(removeFiles(fileIds));
  }

  return res;
};

const initialState = {
  files: [],
  file: {
    metadata: {},
    duration: 0,
    isPlaying: false,
    currentTime: 0,
    streamUrl: "",
    downloadUrl: ""
  }
};

const filesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FILES:
      return { ...state, files: action.payload };
    case GET_STREAM_URL:
      return {
        ...state,
        file: {
          ...state.file,
          metadata: { ...action.payload.file },
          streamUrl: action.payload.streamUrl
        }
      };
    case ADD_FILES:
      return { ...state, files: [...state.files, ...action.payload] };
    case DELETE_FILES:
      return {
        ...state,
        files: state.files.filter((file) => !action.payload.includes(file.id))
      };
    case UNLOAD_FILE:
      return {
        ...state,
        file: {
          metadata: {},
          duration: 0,
          isPlaying: false,
          currentTime: 0,
          streamUrl: "",
          downloadUrl: ""
        }
      };
    default:
      return state;
  }
};

export default filesReducer;
