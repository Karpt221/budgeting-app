import { useState, useEffect } from 'react';
import styles from './Accounts.module.css';
import sidebarAccountsList from '../../../assets/sidebarAccountsList.svg';
import DropdownItem from './DropdownItem';

const AccountsList = ({ setEditAccount, setIsEditAccountModalOpen, accounts }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [accountsSum, setAccountsSum] = useState(0);

  useEffect(() => {
    setAccountsSum(
      accounts.reduce((accumulator, account) => {
        return accumulator + account.balance;
      }, 0),
    );
  }, [accounts]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.navAccountsList}>
      <div className={styles.navAccountsBtn} onClick={toggleDropdown}>
        <button>
          <img src={sidebarAccountsList} alt="Accounts" />
          <span>Accounts</span>
        </button>
        <span className={styles.accountsSum}>
          {accountsSum} <bdi className={styles.accounts}>$</bdi>
        </span>
      </div>

      {isDropdownOpen && (
        <ul className={styles.dropdownList}>
          {accounts.map((account, index) => (
            <DropdownItem
              setEditAccount={setEditAccount}
              setIsEditAccountModalOpen={setIsEditAccountModalOpen}
              key={account.account_id}
              account={account}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccountsList;
