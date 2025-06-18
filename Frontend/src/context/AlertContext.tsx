import { createContext, useReducer } from "react";
import type {
  AlertActionState,
  AlertContextProviderProps,
  AlertProps,
  AlertState,
} from "../lib/type";

interface AlertContextValue {
  alert: AlertProps;
  dispatch: React.Dispatch<AlertActionState>;
}

export const AlertContext = createContext<AlertContextValue | undefined>(
  undefined
);

function reducer(state: AlertState, action: AlertActionState): AlertState {
  switch (action.type) {
    case "SetAndDisplayAlert":
      return {
        ...state,
        alert: action.payload as AlertProps,
      };
    default:
      return state;
  }
}

const AlertContextProvider = ({ children }: AlertContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    alert: {} as AlertProps,
  });

  return (
    <AlertContext.Provider value={{ alert: state.alert, dispatch }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;
