import { useEffect, useState } from "react";

import { Alert, Collapse, IconButton } from "@mui/material";
import type { AlertProps } from "../../lib/type";

type AlertComponentProps = {
  alertProps: AlertProps;
  className?: string;
};

export const AlertToast = ({ alertProps }: AlertComponentProps) => {
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentSeverity, setCurrentSeverity] =
    useState<AlertProps["severity"]>("success");
  const [currentColor, setCurrentColor] =
    useState<AlertProps["color"]>("success");

  useEffect(() => {
    if (alertProps.isVisible) {
      setCurrentMessage(alertProps.message);
      setCurrentSeverity(alertProps.severity);
      setCurrentColor(alertProps.color);
      setOpen(true); // Open the alert

      const timer = setTimeout(() => {
        setOpen(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setOpen(false);
    }
  }, [alertProps]);

  if (!open) {
    return null;
  }

  return (
    <div
      style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}
    >
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
