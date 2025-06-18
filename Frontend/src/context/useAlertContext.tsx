import { useContext } from "react";
import { AlertContext } from "./AlertContext";
import type { AlertProps } from "../lib/type";

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within AlertContextProvider");
  }

  const SetAndDisplayAlert = (alertProps: AlertProps) => {
    const uniqueId = Date.now(); //to ensure uniqueness
    context.dispatch({
      type: "SetAndDisplayAlert",
      payload: { ...alertProps, id: uniqueId },
    });
  };

  return { ...context, SetAndDisplayAlert };
};
