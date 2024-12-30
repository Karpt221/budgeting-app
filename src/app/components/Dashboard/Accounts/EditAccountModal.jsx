import styles from './AccountModal.module.css';
import CloseIcon from './CloseIcon';
import { Form,useLocation } from 'react-router-dom';

const EditAccountModal = ({ account, isOpen, onClose }) => {
  if (!isOpen) return null;
  const location = useLocation();
  // console.log(location.pathname);
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Edit Account</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>Account Information</p>
          <Form method="post" action="/dashboard/account">
            <input
              readOnly
              type="hidden"
              name="account_id"
              value={account.account_id}
            />
            <input
              readOnly
              type="hidden"
              name="previousLocation"
              value={location.pathname}
            />
            <div className={styles.inputGroup}>
              <label>Account Nickname</label>
              <input
                type="text"
                name="name"
                defaultValue={account.name}
                required
              />
            </div>
            {/* <div className={styles.inputGroup}>
              <label>Working Balance</label>
              <input
                type="text"
                name="balance"
                placeholder="0,00"
                defaultValue={account.balance}
                required
              />
            </div> */}
            <div className={styles.modalFooter}>
              <button
                type="submit"
                name="action"
                value="delete"
                className={styles.closeAccountButton}
              >
                Delete Account
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                name="action"
                value="edit"
                className={styles.saveButton}
              >
                Save
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
