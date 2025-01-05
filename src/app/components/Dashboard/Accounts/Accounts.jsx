import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Accounts.module.css';
import addIcon from '../../../assets/addPlus.svg';
import AccountsList from './AccountsList';
import EditAccountModal from './EditAccountModal';
import AddAccountModal from './AddAccountModal';

function Accounts({ user_id, accounts }) {
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState({
    account_id: '',
    name: '',
    balance: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('modalClosed') === 'true') {
      setIsEditAccountModalOpen(false);
      setIsAddAccountModalOpen(false);
      setErrorMessage(null);
    } else if (params.get('accountError') === 'true') {
      setErrorMessage(params.get('errorMessage'));
    }
  }, [location]);

  return (
    <>
      <AddAccountModal
        errorMessage={errorMessage}
        user_id={user_id}
        isOpen={isAddAccountModalOpen}
        onClose={() => {
          setErrorMessage(null);
          setIsAddAccountModalOpen(false);
        }}
      />
      <EditAccountModal
        errorMessage={errorMessage}
        account={editAccount}
        isOpen={isEditAccountModalOpen}
        onClose={() => {
          setErrorMessage(null);
          setIsEditAccountModalOpen(false);
        }}
      />
      {accounts.length !== 0 ? (
        <AccountsList
          setEditAccount={setEditAccount}
          setIsEditAccountModalOpen={setIsEditAccountModalOpen}
          accounts={accounts}
        />
      ) : (
        <div>No accounts were added</div>
      )}

      <div className={styles.addAccountNav}>
        <button onClick={() => setIsAddAccountModalOpen(true)}>
          <img src={addIcon} alt="Add Account" />
          Add Account
        </button>
      </div>
    </>
  );
}

export default Accounts;
