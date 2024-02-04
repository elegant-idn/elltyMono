import { createStore, combineReducers, applyMiddleware } from "redux";
import { mainReducer } from "./reducers/mainReducer";
import { designReducer } from "./reducers/designReducer";
import { dashboardReducer } from "./reducers/dashboardReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  mainReducer,
  designReducer,
  dashboardReducer,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof rootReducer>;
