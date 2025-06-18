import React, { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { GiSplitCross } from "react-icons/gi";
import { MdOutlinePassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import {
  LoginAuthAsync,
  RegisterUserAuthAsync,
} from "../../api/BackEndApiCall";
import { useAlertContext } from "../../context/useAlertContext";
import { UseAuthContext } from "../../context/useAuthContext";
import {
  UserLoggedInAlertProps,
  UserRegisteredAlertProps,
} from "../Strings/strings";
import styles from "./LoginSignup.module.css";

type AuthAction = "Login" | "Sign Up";

const LoginSignup: React.FC = () => {
  const [action, setAction] = useState<AuthAction>("Login");
  const [authError, setAuthError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const { login } = UseAuthContext();
  const { SetAndDisplayAlert } = useAlertContext();
  const navigate = useNavigate();

  const validateInputs = (): boolean => {
    const errors: string[] = [];

    const usernameValue = usernameRef.current?.value ?? "";
    const passwordValue = passwordRef.current?.value ?? "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameValue) errors.push("Email required");
    else if (!emailRegex.test(usernameValue))
      errors.push("Invalid email format");

    if (!passwordValue) errors.push("Password required");
    else if (passwordValue.length < 6) errors.push("Password too short");

    setAuthError(errors.join(". "));
    return errors.length === 0;
  };

  const handleLoginClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const username = usernameRef.current!.value;
      const password = passwordRef.current!.value;

      const response = await LoginAuthAsync({ username, password });
      login(response.token);
      SetAndDisplayAlert(UserLoggedInAlertProps);

      navigate("/home");
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const username = usernameRef.current!.value;
      const password = passwordRef.current!.value;

      const response = await RegisterUserAuthAsync({ username, password });
      login(response.token);
      SetAndDisplayAlert(UserRegisteredAlertProps);

      navigate("/home");
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (newAction: AuthAction): void => {
    setAuthError("");
    setAction(newAction);
  };

  return (
    <div className={styles.baseContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.text}>{action}</div>
          <div className={styles.underline} />
        </div>

        <div className={styles.inputs}>
          <div className={styles.input}>
            <FaUser className={styles.iconStyle} />
            <input
              type="text"
              placeholder="Email"
              className={styles.inputTextField}
              ref={usernameRef}
            />
          </div>

          <div className={styles.input}>
            <MdOutlinePassword className={styles.iconStyle} />
            <input
              type="password"
              placeholder="Password"
              className={styles.inputTextField}
              ref={passwordRef}
            />
          </div>

          {authError && (
            <div className={styles.errorMessage}>
              <GiSplitCross className={styles.iconStyle} />
              <p className={styles.authError}>{authError}</p>
            </div>
          )}
        </div>

        <div className={styles.submitContainer}>
          <div
            className={
              action === "Sign Up"
                ? styles.submit
                : `${styles.submit} ${styles.unchecked}`
            }
            onClick={
              action === "Sign Up"
                ? handleSignupClick
                : () => handleModeSwitch("Sign Up")
            }
          >
            {loading && action === "Sign Up" ? (
              <BeatLoader color="#fff" size={12} />
            ) : (
              "Sign Up"
            )}
          </div>

          <div
            className={
              action === "Login"
                ? styles.submit
                : `${styles.submit} ${styles.unchecked}`
            }
            onClick={
              action === "Login"
                ? handleLoginClick
                : () => handleModeSwitch("Login")
            }
          >
            {loading && action === "Login" ? (
              <BeatLoader color="#fff" size={12} />
            ) : (
              "Login"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
