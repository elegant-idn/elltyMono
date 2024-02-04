import {
  CHANGE_DASHBOARD_SEARCH_TERM,
  TOGGLE_SELECTED_ITEMS,
  SET_PROFILE_TOOLTIP,
} from "../types";

const initialState = {
  searchTerm: "",
  // the selected elements can be in all dashboard windows:
  // home, designs, folders, liked, trash
  selectedItems: {
    home: [],
    designs: [],
    folders: [],
    liked: [],
    trash: [],
  },
  profileTooltipState: null,
};

export const dashboardReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case CHANGE_DASHBOARD_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case TOGGLE_SELECTED_ITEMS:
      switch (action.payload.window) {
        case "home":
          return {
            ...state,
            selectedItems: {
              home: action.payload.items,
            },
          };
        case "design":
          return {
            ...state,
            selectedItems: {
              designs: action.payload.items,
            },
          };
        default:
          return state;
      }
    case SET_PROFILE_TOOLTIP:
      // console.log(state.profileTooltipState);
      return {
        ...state,
        profileTooltipState: action.payload,
      };
    default:
      return state;
  }
};
