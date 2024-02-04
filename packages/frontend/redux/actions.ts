import {
  // mainReducer
  FETCH_USER,
  TOGGLE_MENU,
  CHANGE_MOBILE_MENU,
  SET_DESIGN_TAB,
  TOGGLE_FILTER,
  SET_ACTIVE_TEMPLATES_CATEGORY,
  TOGGLE_TEMPLATES_MODAL,
  TOGGLE_PRO_TEMPLATES_MODAL,
  SET_PRO_TEMPLATES_MODAL_PREVIEW,
  TOGGLE_PRO_ELEMENTS_MODAL,
  SET_PRO_ELEMENTS_MODAL_PREVIEW,
  CHANGE_TEMPLATES_SEARCH_TERM,
  CHANGE_LANG,
  TOGGLE_AUTH_MODAL,
  CHANGE_AUTH_FORM,
  TOGGLE_CHECKOUT_MODAL,
  SET_CHECKOUT_MODAL_BACKDROP_TIMEOUT,
  SET_AUTH_PROCESS_EMAIL,
  SET_CHECKOUT_PLAN_DURATION,
  CHANGE_CHECKOUT_STEP,
  SET_USER,
  // designReducer
  SET_INITIAL_SIZES,
  SET_INITIAL_SECTION,
  SET_INITIAL_TEMPLATE_LINK,
  TOGGLE_REMAINING_DOWNLOADNS_MODAL,
  SET_FILE_DROPDOWN,
  SET_HINT_STAGE,
  SET_ELEMENTS_PANEL_CATEGORY,
  TOGGLE_DOWNLOAD_MODAL,
  // dashboardReducer
  CHANGE_DASHBOARD_SEARCH_TERM,
  TOGGLE_SELECTED_ITEMS,
  SET_PROFILE_TOOLTIP,
  SET_SIDEPANEL_DEFAULT_OPEN,
  SET_IS_DOWNLOADING,
  FAILED_FETCH_USER,
  INCREMENT_NUMBER_OF_CHANGES,
  RESET_NUMBER_OF_CHANGES,
  SET_AFTER_AUTH_REDIRECT,
} from "./types";

// action creators
// mainReducer

export const FetchUserAction = (payload: any) => ({
  type: FETCH_USER,
  payload: payload,
});

export const FailedFetchUserAction = (payload: any) => ({
  type: FAILED_FETCH_USER,
  payload: payload,
});

export const SetUser = (payload: any) => ({
  type: SET_USER,
  payload: payload,
});

export const ToggleMenuAction = (payload: any) => ({
  type: TOGGLE_MENU,
  payload: payload,
});

export const ChangeMobileMenuAction = (payload: any) => ({
  type: CHANGE_MOBILE_MENU,
  payload: payload,
});

export const SetDesignTabAction = (payload: any) => ({
  type: SET_DESIGN_TAB,
  payload: payload,
});

export const ToggleFilterAction = (payload: any) => ({
  type: TOGGLE_FILTER,
  payload: payload,
});

export const SetActiveTemplatesCategory = (payload: any) => ({
  type: SET_ACTIVE_TEMPLATES_CATEGORY,
  payload: payload,
});

export const ToggleTemplatesModalAction = (payload: any) => ({
  type: TOGGLE_TEMPLATES_MODAL,
  payload: payload,
});

export const ToggleProTemplatesModalAction = (payload: any) => ({
  type: TOGGLE_PRO_TEMPLATES_MODAL,
  payload: payload,
});

export const SetProTemplatesModalPreviewAction = (payload: any) => ({
  type: SET_PRO_TEMPLATES_MODAL_PREVIEW,
  payload: payload,
});

export const ToggleProElementsModalAction = (payload: any) => ({
  type: TOGGLE_PRO_ELEMENTS_MODAL,
  payload: payload,
});

export const SetProElementsModalPreviewAction = (payload: any) => ({
  type: SET_PRO_ELEMENTS_MODAL_PREVIEW,
  payload: payload,
});

export const ChangeTemplatesSearchTermAction = (payload: any) => ({
  type: CHANGE_TEMPLATES_SEARCH_TERM,
  payload: payload,
});

export const ChangeLangAction = (payload: any) => ({
  type: CHANGE_LANG,
  payload: payload,
});

export const ToggleAuthModalAction = (payload: any) => ({
  type: TOGGLE_AUTH_MODAL,
  payload: payload,
});

export const ChangeAuthFormAction = (payload: any) => ({
  type: CHANGE_AUTH_FORM,
  payload: payload,
});

// if payload function returns true, that page reload should only happen after a redirect
// that would be triggered by the payload function
export const SetAfterAuthActionAction = (payload: () => boolean) => ({
  type: SET_AFTER_AUTH_REDIRECT,
  payload: payload,
});

export const ToggleCheckoutModalAction = (payload: any) => ({
  type: TOGGLE_CHECKOUT_MODAL,
  payload: payload,
});

export const SetCheckoutModalBackdropTimeoutAction = (payload: any) => ({
  type: SET_CHECKOUT_MODAL_BACKDROP_TIMEOUT,
  payload: payload,
});

export const SetAuthProcessEmailAction = (payload: any) => ({
  type: SET_AUTH_PROCESS_EMAIL,
  payload: payload,
});

export const SetCheckoutPlanDurationAction = (payload: any) => ({
  type: SET_CHECKOUT_PLAN_DURATION,
  payload: payload,
});

export const ChangeCheckoutStepAction = (payload: any) => ({
  type: CHANGE_CHECKOUT_STEP,
  payload: payload,
});

// designReducer
export const SetInitialSizesAction = (payload: any) => ({
  type: SET_INITIAL_SIZES,
  payload: payload,
});

export const SetInitialSectionAction = (payload: any) => ({
  type: SET_INITIAL_SECTION,
  payload: payload,
});

export const SetInitialTemplateLinkAction = (payload: any) => ({
  type: SET_INITIAL_TEMPLATE_LINK,
  payload: payload,
});

export const ToggleRemainingDownloadsModalAction = (payload: any) => ({
  type: TOGGLE_REMAINING_DOWNLOADNS_MODAL,
  payload: payload,
});

export const SetSidePanelDafaultOpenAction = (payload: any) => ({
  type: SET_SIDEPANEL_DEFAULT_OPEN,
  payload: payload,
});

export const SetFileDropdownAction = (payload: any) => ({
  type: SET_FILE_DROPDOWN,
  payload: payload,
});

export const SetHintStageAction = (payload: any) => ({
  type: SET_HINT_STAGE,
  payload: payload,
});

export const SetElementsPanelCategoryAction = (payload: any) => ({
  type: SET_ELEMENTS_PANEL_CATEGORY,
  payload: payload,
});

// dashboardReducer
export const ChangeDashboardSearchTermAction = (payload: any) => ({
  type: CHANGE_DASHBOARD_SEARCH_TERM,
  payload: payload,
});

export const ToggleSelectedItemsAction = (payload: any) => ({
  type: TOGGLE_SELECTED_ITEMS,
  payload: payload,
});

export const SetProfileTooltipAction = (payload: any) => ({
  type: SET_PROFILE_TOOLTIP,
  payload: payload,
});

export const ToggleDownloadModalAction = (payload: boolean) => ({
  type: TOGGLE_DOWNLOAD_MODAL,
  payload: payload,
});

export const SetIsDownloadingAction = (payload: boolean) => ({
  type: SET_IS_DOWNLOADING,
  payload: payload,
});

export const IncrementNumberOfChangesAction = (payload = 1) => ({
  type: INCREMENT_NUMBER_OF_CHANGES,
  payload,
});

export const ResetNumberOfChangesAction = () => ({
  type: RESET_NUMBER_OF_CHANGES,
});
