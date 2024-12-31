import styles from './Transactions.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';


const TransactionForm = ({
  action,
  accounts,
  onCancel,
  currentAccount,
  transaction,
  categories
}) => {

  console.log(categories);

  return (
    <>
      <tr className={styles.addRow}>
        <td>
          {transaction && (
            <input
              type="hidden"
              name="transaction_id"
              value={transaction.transaction_id}
            />
          )}
          <input readOnly type="checkbox" name="select" checked={true} />
        </td>
        {currentAccount ? null : (
          <td>
            <select
              name="account_id"
              id="account"
              required
              defaultValue={transaction?.account_id || ''}
            >
              {accounts.map((account) => (
                <option
                  selected
                  key={account.account_id}
                  value={account.account_id}
                >
                  {account.account_name}
                </option>
              ))}
            </select>
          </td>
        )}
        <td>
          <input
            type="date"
            name="transaction_date"
            id="date"
            required
            defaultValue={transaction?.transaction_date.split('T')[0] || ''}
          />
        </td>
        <td>
          <input
            type="text"
            name="payee"
            id="payee"
            placeholder="payee"
            required
            defaultValue={transaction?.payee || ''}
          />
        </td>
        <td>
        <select
              name="category"
              id="category"
              required
              defaultValue={transaction?.category || ''} 
            >
              {categories.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
          {/* <input  
            type="text"  
            name="category"  
            id="category"  
            placeholder="category"  
            required  
            defaultValue={transaction?.category || ''}  
          />   */}
        </td>
        <td>
          <input
            type="text"
            name="memo"
            id="memo"
            placeholder="memo"
            defaultValue={transaction?.memo || ''}
          />
        </td>
        <td>
          <input
            type="text"
            name="amount"
            id="amount"
            placeholder="amount"
            required
            defaultValue={transaction?.amount || ''}
          />
        </td>
      </tr>
      <tr className={styles.addRow}>
        <td></td>
        {currentAccount ? null : <td></td>}
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            name="action"
            value={action}
            className={styles.saveButton}
            type="submit"
          >
            Save
          </button>
        </td>
      </tr>
    </>
  );
};

TransactionForm.propTypes = {
  action: PropTypes.string.isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      account_id: PropTypes.string,
      account_name: PropTypes.string,
    }),
  ).isRequired,
  onCancel: PropTypes.func.isRequired,
  currentAccount: PropTypes.shape({
    account_id: PropTypes.string,
    account_name: PropTypes.string,
  }),
  transaction: PropTypes.shape({
    transaction_id: PropTypes.string,
    account_id: PropTypes.string,
    transaction_date: PropTypes.string,
    payee: PropTypes.string,
    category: PropTypes.string,
    memo: PropTypes.string,
    amount: PropTypes.number,
  }),
};

export default TransactionForm;
