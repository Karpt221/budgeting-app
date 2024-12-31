import { useState } from 'react';  
import styles from './Accounts.module.css';  
import accountEdit from '../../../assets/accountEdit.svg';  
import { Link } from 'react-router-dom';

const DropdownItem = ({ setEditAccount, setIsEditAccountModalOpen, account }) => {  
  const [isHovering, setIsHovering] = useState(false);

  const getTransactions = (event) => {  
    console.log(event.currentTarget.id);  
  };  
  // console.log(account);
  const showModal = (event) => { 
    event.preventDefault();    
    setIsEditAccountModalOpen(true);
    setEditAccount(account);
  };  

  return (  
    <li> 
      <Link 
        to={`transactions/${account.account_id}`} 
        onClick={getTransactions}  
        id={account.account_id}  
        className={`${styles.navAccountsBtn} ${styles.account}`}  
        onMouseEnter={() => setIsHovering(true)}  
        onMouseLeave={() => setIsHovering(false)} 
        onContextMenu={showModal} 
      >  
        <button>  
          <img onClick={showModal} className={isHovering ? '' : styles.invisible} src={accountEdit} alt={`Edit ${account.name}`} />  
          <span>{account.account_name || `Account`}</span>  
        </button>  
        <span className={styles.accountsSum}>  
          {account.balance || 0}  
          <bdi className={styles.accounts}>$</bdi>  
        </span>  
      </Link>  
    </li>  
  );  
};  

export default DropdownItem;