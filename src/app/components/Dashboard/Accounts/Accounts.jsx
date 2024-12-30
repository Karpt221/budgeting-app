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
  const [editAccount, setEditAccount] = useState({account_id:'', name: '', balance: '' });
  const location = useLocation();  
  
  useEffect(() => {  
    const params = new URLSearchParams(location.search);  
    if (params.get('modalClosed') === 'true') {  
      setIsEditAccountModalOpen(false);  
      setIsAddAccountModalOpen(false);
    }  
  }, [location]);  

  return (
    <>
    <AddAccountModal
        user_id={user_id}
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
      />
      <EditAccountModal
        account={editAccount}
        isOpen={isEditAccountModalOpen}
        onClose={() => setIsEditAccountModalOpen(false)}
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
        <button onClick={()=>setIsAddAccountModalOpen(true)}>
          <img src={addIcon} alt="Add Account" />
          Add Account
        </button>
      </div>
    </>
  );
}

export default Accounts;
