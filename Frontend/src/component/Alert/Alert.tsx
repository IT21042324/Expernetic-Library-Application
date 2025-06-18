import { useEffect, useState } from "react";

import { Alert, Collapse, IconButton } from "@mui/material";
import { useAlertContext } from "../../context/useAlertContext";
import type { AlertProps } from "../../lib/type";
import styles from "./alert.module.css";

export const AlertToast = () => {
  const { alert: alertBody, dispatch: AlertDispatch } = useAlertContext();

  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentSeverity, setCurrentSeverity] =
    useState<AlertProps["severity"]>("success");
  const [currentColor, setCurrentColor] =
    useState<AlertProps["color"]>("success");

  useEffect(() => {
    if (alertBody.isVisible) {
      setCurrentMessage(alertBody.message);
      setCurrentSeverity(alertBody.severity);
      setCurrentColor(alertBody.color);
      setOpen(true); // Open the alert

      const timer = setTimeout(() => {
        setOpen(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setOpen(false);
    }
  }, [alertBody]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.alert}>
      <Collapse in={open}>
        <Alert
          severity={currentSeverity}
          color={currentColor}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            ></IconButton>
          }
        >
          {currentMessage}
        </Alert>
      </Collapse>
    </div>
  );
};
