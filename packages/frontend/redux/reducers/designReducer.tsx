import {
  SET_INITIAL_SIZES,
  SET_INITIAL_SECTION,
  SET_INITIAL_TEMPLATE_LINK,
  TOGGLE_REMAINING_DOWNLOADNS_MODAL,
  TOGGLE_DOWNLOAD_MODAL,
  SET_SIDEPANEL_DEFAULT_OPEN,
  SET_FILE_DROPDOWN,
  SET_HINT_STAGE,
  SET_ELEMENTS_PANEL_CATEGORY,
  SET_IS_DOWNLOADING,
  INCREMENT_NUMBER_OF_CHANGES,
  RESET_NUMBER_OF_CHANGES,
} from "../types";

const initialState = {
  initialSizes: {
    width: 1080,
    height: 1080,
  },
  initialSection: "templates",
  initialTemplateLink: "",
  remainingDownloadsModalOpen: false,
  downloadModalOpen: false,
  isDownloading: false,
  sidePanelDefaultOpen: false,
  fileDropdown: null,
  hintStage: 1,
  elementsPanelCategory: "",
  numberOfChanges: 0,
};

export const designReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_INITIAL_SIZES:
      return {
        ...state,
        initialSizes: action.payload,
      };
    case SET_INITIAL_SECTION:
      return {
        ...state,
        initialSection: action.payload,
      };
    case SET_INITIAL_TEMPLATE_LINK:
      return {
        ...state,
        initialTemplateLink: action.payload,
      };
    case TOGGLE_REMAINING_DOWNLOADNS_MODAL:
      return {
        ...state,
        remainingDownloadsModalOpen: action.payload,
      };
    case SET_SIDEPANEL_DEFAULT_OPEN:
      return {
        ...state,
        sidePanelDefaultOpen: action.payload,
      };
    case SET_FILE_DROPDOWN:
      return {
        ...state,
        fileDropdown: action.payload,
      };
    case SET_HINT_STAGE:
      return {
        ...state,
        hintStage: action.payload,
      };
    case SET_ELEMENTS_PANEL_CATEGORY:
      return {
        ...state,
        elementsPanelCategory: action.payload,
      };
    case TOGGLE_DOWNLOAD_MODAL:
      return {
        ...state,
        downloadModalOpen: action.payload,
      };
    case SET_IS_DOWNLOADING:
      return {
        ...state,
        isDownloading: action.payload,
      };
    case INCREMENT_NUMBER_OF_CHANGES:
      return {
        ...state,
        numberOfChanges: state.numberOfChanges + action.payload,
      };
    case RESET_NUMBER_OF_CHANGES:
      return {
        ...state,
        numberOfChanges: 0,
      };
    default:
      return state;
  }
};
