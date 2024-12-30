import styles from './AccountModal.module.css';
import CloseIcon from './CloseIcon';
import { Form, useLocation } from 'react-router-dom';
const AddAccountModal = ({ user_id, isOpen, onClose }) => {
  if (!isOpen) return null;
  const location = useLocation();
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Add Account</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>Account Information</p>
          <Form method="post" action="/dashboard/account">
            <input readOnly type="hidden" name="user_id" value={user_id} />
            <input
              readOnly
              type="hidden"
              name="previousLocation"
              value={location.pathname}
            />
            <div className={styles.inputGroup}>
              <label>Account Nickname</label>
              <input type="text" name="name" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Working Balance</label>
              <input type="text" name="balance" placeholder="0,00" required />
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveButton}
                name="action"
                value="create"
              >
                Add
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
