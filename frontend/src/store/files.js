import { csrfFetch } from "./csrf";
import Cookies from "js-cookie";

const GET_FILES = "files/GET_FILES";
const GET_STREAM_URL = "files/GET_STREAM_URL";
const ADD_FILES = "files/ADD_FILES";
const REMOVE_FILE = "files/REMOVE_FILE";
const REMOVE_ALL_FILES = "files/REMOVE_ALL_FILES";

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

const removeFile = (fileName) => ({
  type: REMOVE_FILE,
  payload: fileName
});

const removeAllFiles = () => ({
  type: REMOVE_ALL_FILES
});

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

export const deleteFile = (fileName) => async (dispatch) => {
  const res = await fetch(`/api/files/${fileName}`, {
    method: "DELETE",
    headers: {
      "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
    },
    credentials: "include"
  });

  if (res.ok) {
    dispatch(removeFile(fileName));
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
    case REMOVE_FILE:
      return {
        ...state,
        files: state.files.filter((file) => file.name !== action.payload)
      };
    case REMOVE_ALL_FILES:
      return { ...state, files: [], file: null };
    default:
      return state;
  }
};

export default filesReducer;
