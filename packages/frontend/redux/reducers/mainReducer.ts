import {
  FETCH_USER,
  SET_USER,
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
  FAILED_FETCH_USER,
  SET_AFTER_AUTH_REDIRECT,
} from "../types";

const initialState = {
  user: {
    first_name: null,
    last_name: null,
    full_name: null,
    email: null,
    status: null,
    plan: null,
    role: null,
    remainingDownloads: null,
    billingPeriod: null,
    avatar: null,
    expiresIn: null,
    accessToken: null,
    message: null,
    language: null,
    subscription: null,
    cancelSubscriptionDisabled: null,
  },
  fetchUserFail: {},
  menuState: {
    menuOpen: false,
    menuWindow: "main", // main, lang, auth
  },
  // popular, socialMedia, marketing, advertising,
  // branding, more
  designTab: "popular",
  filterOpen: false,
  // to display open accordions on the templates page:
  // popular, socialMedia, marketing, advertising, branding, more
  activeTemplatesCategory: [],
  templatesModalOpen: false,
  proTemplateModalOpen: false,
  proTemplateModalPreview: "",
  proElementModalOpen: false,
  proElementModalPreview: "",
  templatesSearchTerm: "",
  // it shouldn't matter which language is set by default.
  // i18n determines the language itself, then at the first
  // render each page dispatches the language here
  lang: {
    abbr: "en",
    value: "English",
  },
  openAuthModal: false,
  // authForm can be: logIn, signUp, registerCode, forgotPassword,
  // emailCode, setPassword, passwordReset
  authForm: "logIn",
  afterAuthAction: null,
  authProcessEmail: "",
  openCheckoutModal: false,
  checkoutModalBackdropTimeout: true,
  // annually, monthly
  checkoutPlanDuration: "annually",
  // step1, step2, thankYou
  checkoutStep: "step1",
};

export const mainReducer = (state: any = initialState, action: any) => {
  const blockPageScroll = (elem: any) => {
    // classList.toggle does not work
    elem
      ? document.querySelector("body")!.classList.add("mobileMenu")
      : document.querySelector("body")!.classList.remove("mobileMenu");
  };

  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        user: action.payload,
      };
    case FAILED_FETCH_USER:
      return {
        ...state,
        fetchUserFail: action.payload,
      };
    case SET_USER:
      const { uuid, ...userData } = action.payload;
      return {
        ...state,
        user: userData,
      };
    case TOGGLE_MENU:
      blockPageScroll(!state.menuState.menuOpen);
      return {
        ...state,
        menuState: {
          ...state.menuState,
          menuOpen: !state.menuState.menuOpen,
          menuWindow: "main",
        },
        // when you open the templates filter, and then the mobile menu opens, you must close the filter
        filterOpen: false,
      };
    case CHANGE_MOBILE_MENU:
      return {
        ...state,
        menuState: {
          ...state.menuState,
          menuWindow: action.payload,
        },
      };
    case SET_DESIGN_TAB:
      return {
        ...state,
        designTab: action.payload,
      };
    case TOGGLE_FILTER:
      blockPageScroll(action.payload);
      return {
        ...state,
        filterOpen: action.payload,
      };
    case SET_ACTIVE_TEMPLATES_CATEGORY:
      if (action.payload === null)
        return {
          ...state,
          activeTemplatesCategory: [],
        };

      const toggleActiveTemplatesCategory = (payload: any) => {
        const idx = state.activeTemplatesCategory.findIndex(
          (s: any) => s == payload
        );
        if (idx !== -1) {
          return [
            ...state.activeTemplatesCategory.slice(0, idx),
            ...state.activeTemplatesCategory.slice(idx + 1),
          ];
        } else {
          return state.activeTemplatesCategory.concat(payload);
        }
      };

      return {
        ...state,
        activeTemplatesCategory: toggleActiveTemplatesCategory(action.payload),
      };
    case TOGGLE_TEMPLATES_MODAL:
      return {
        ...state,
        templatesModalOpen: action.payload,
      };
    case TOGGLE_PRO_TEMPLATES_MODAL:
      return {
        ...state,
        proTemplateModalOpen: action.payload,
      };
    case SET_PRO_TEMPLATES_MODAL_PREVIEW:
      return {
        ...state,
        proTemplateModalPreview: action.payload,
      };
    case TOGGLE_PRO_ELEMENTS_MODAL:
      return {
        ...state,
        proElementModalOpen: action.payload,
      };
    case SET_PRO_ELEMENTS_MODAL_PREVIEW:
      return {
        ...state,
        proElementModalPreview: action.payload,
      };
    case CHANGE_TEMPLATES_SEARCH_TERM:
      return {
        ...state,
        templatesSearchTerm: action.payload,
      };
    case CHANGE_LANG:
      return {
        ...state,
        lang: action.payload,
      };
    case SET_AFTER_AUTH_REDIRECT:
      return {
        ...state,
        afterAuthAction: action.payload,
      };
    case TOGGLE_AUTH_MODAL:
      return {
        ...state,
        afterAuthAction: null,
        openAuthModal: !state.openAuthModal,
      };
    case CHANGE_AUTH_FORM:
      return {
        ...state,
        authForm: action.payload,
      };
    case TOGGLE_CHECKOUT_MODAL:
      return {
        ...state,
        openCheckoutModal: action.payload,
      };
    case SET_CHECKOUT_MODAL_BACKDROP_TIMEOUT:
      return {
        ...state,
        checkoutModalBackdropTimeout: action.payload,
      };
    case SET_AUTH_PROCESS_EMAIL:
      return {
        ...state,
        authProcessEmail: action.payload,
      };
    case SET_CHECKOUT_PLAN_DURATION:
      return {
        ...state,
        checkoutPlanDuration: action.payload,
      };
    case CHANGE_CHECKOUT_STEP:
      return {
        ...state,
        checkoutStep: action.payload,
      };
    default:
      return state;
  }
};
