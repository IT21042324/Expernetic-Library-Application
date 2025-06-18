import { Modal, Button } from "rsuite";
import styles from "./modal.module.css";

type ConfirmModalProps = {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
}) => (
  <div>
    <Modal
      backdrop="static"
      keyboard={false}
      open={open}
      onClose={onCancel}
      className={styles.modalContainer}
    >
      <Modal.Header>
        <Modal.Title>Please Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onConfirm} appearance="primary">
          Yes
        </Button>
        <Button onClick={onCancel} appearance="subtle">
          No
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
);
