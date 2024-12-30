import styles from './Transactions.module.css';  

const TransactionForm = ({ action, accounts, onCancel, currentAccount, transaction }) => {  
  return (  
    <>  
      <tr  
       className={styles.addRow}>  
        <td>  
          {transaction && ( <input type="hidden" name="transaction_id" value={transaction.transaction_id} />)}
         
          <input readOnly type="checkbox" name="select" checked={true} />  
        </td>  
        {currentAccount ? null : (  
          <td>  
            <select name="account_id" id="account" required defaultValue={transaction?.account_id || ''}>  
              <option value="">Select an account</option>  
              {accounts.map((account) => (  
                <option key={account.account_id} value={account.account_id}>  
                  {account.name}  
                </option>  
              ))}  
            </select>  
          </td>  
        )}  
        <td>  
          <input type="date" name="date" id="date" required defaultValue={transaction?.date.split('T')[0] || ''} />  
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
          <input  
            type="text"  
            name="category"  
            id="category"  
            placeholder="category"  
            required  
            defaultValue={transaction?.category || ''}  
          />  
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

export default TransactionForm;