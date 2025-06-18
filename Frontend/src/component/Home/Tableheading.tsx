import ExitIcon from "@rsuite/icons/Exit";
import { useAlertContext } from "../../context/useAlertContext";
import { UseAuthContext } from "../../context/useAuthContext";
import { UserLoggedOutAlertProps } from "../Strings/strings";
import styles from "./heading.module.css";

export const TableHeading = () => {
  const { logout } = UseAuthContext();
  const { SetAndDisplayAlert } = useAlertContext();

  const handleLogoutClick = () => {
    logout();
    SetAndDisplayAlert(UserLoggedOutAlertProps);
  };

  return (
    <div className={styles.container}>
      <div>Library Book List</div>
      <div className={styles.logoutIcon}>
        <ExitIcon onClick={handleLogoutClick} />
      </div>
    </div>
  );
};
