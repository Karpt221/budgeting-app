import styles from './Transactions.module.css';
import { useLoaderData, useOutletContext, Form } from 'react-router-dom';
import AddIcon from './AddIcon';
import DeleteIcon from './DeleteIcon';
import { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm'; 

function Budget() {
  const { accounts, categories } = useOutletContext();
  const transactionsData = useLoaderData();
  const [currentAccount, setCurrentAccount] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isAddTransactionFormOpen, setIsAddTransactionFormOpen] =
    useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  console.log(transactionsData);
  useEffect(() => {
    if (transactionsData.account_id !== null) {
      const account = accounts.find(
        (account) => account.account_id === transactionsData.account_id,
      );
      setCurrentAccount(account);
    } else {
      setCurrentAccount(null);
    }
    setIsAddTransactionFormOpen(false);
    setEditingTransaction(null);
  }, [transactionsData, accounts]);

  useEffect(() => {
    setSelectedTransactions([]);
    setIsAddTransactionFormOpen(false);
  }, [currentAccount]);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectedTransactions(
      checked ? transactionsData.transactions.map((t) => t.transaction_id) : [],
    );
  };

  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions((prevSelected) => {
      if (prevSelected.includes(transactionId)) {
        return prevSelected.filter((id) => id !== transactionId); // Deselect
      } else {
        return [...prevSelected, transactionId]; // Select
      }
    });
  };

  const handleRowClick = (transaction) => {
    if (selectedTransactions.includes(transaction.transaction_id)) {
      setEditingTransaction(transaction);
    } else {
      setSelectedTransactions([transaction.transaction_id]);
      setEditingTransaction(null);
    }
  };

  const handleAddFormOpen = () => {
    setIsAddTransactionFormOpen(true);
    setSelectedTransactions([]);
  };

  return (
    <>
      <div className={styles.transactionsTitle}>
        <h2>{currentAccount ? currentAccount.account_name : 'All Accounts'}</h2>
      </div>
      <hr />
      <div className={styles.transactionsToolbar}>
        <button onClick={handleAddFormOpen}>
          <AddIcon /> Add Transaction
        </button>
        <Form
          method="post"
          action=''
        >
          <input
            type="hidden"
            name="transactin_ids"
            value={JSON.stringify(selectedTransactions)}
          />
          <button
            disabled={selectedTransactions.length === 0}
            className={
              selectedTransactions.length === 0
                ? styles.disabledButton
                : styles.deleteButton
            }
            name="action"
            value="delete"
            type="submit"
          >
            <DeleteIcon /> Delete
          </button>
        </Form>
      </div>
      <Form
        method="post"
        action=''
      >
        <table>
          <thead>
            <tr>
              <th className={styles.centered}>
                <input
                  type="checkbox"
                  name="selectAll"
                  id="selectAll"
                  onChange={handleSelectAll}
                  checked={
                    selectedTransactions.length ===
                    transactionsData.transactions.length
                  }
                />
              </th>
              {currentAccount ? null : <th>Account</th>}
              <th>Date</th>
              <th>Payee</th>
              <th>Category</th>
              <th>Memo</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {isAddTransactionFormOpen && (
              <TransactionForm
                action="create"
                categories={categories}
                accounts={accounts}
                onCancel={() => setIsAddTransactionFormOpen(false)}
                currentAccount={currentAccount}
              />
            )}
            {transactionsData.transactions.map((transaction) =>
              editingTransaction &&
              editingTransaction.transaction_id ===
                transaction.transaction_id ? (
                <TransactionForm
                  key={transaction.transaction_id}
                  action="edit"
                  categories={categories}
                  accounts={accounts}
                  onCancel={() => setEditingTransaction(null)}
                  currentAccount={currentAccount}
                  transaction={editingTransaction}
                />
              ) : (
                <tr
                  key={transaction.transaction_id}
                  onClick={() => handleRowClick(transaction)}
                  className={
                    selectedTransactions.includes(transaction.transaction_id)
                      ? styles.selectedRow
                      : ''
                  }
                >
                  <td className={styles.centered}>
                    <input
                      readOnly
                      type="checkbox"
                      name="select"
                      id={transaction.transaction_id}
                      checked={selectedTransactions.includes(
                        transaction.transaction_id,
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTransaction(transaction.transaction_id);
                      }}
                    />
                  </td>
                  {currentAccount ? null : (
                    <td>
                      {
                        accounts.find(
                          (account) =>
                            account.account_id === transaction.account_id,
                        ).account_name
                      }
                    </td>
                  )}
                  <td>{transaction.transaction_date.split('T')[0]}</td>
                  <td>{transaction.payee}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.memo || '-'}</td>
                  <td>{transaction.amount} $</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </Form>
    </>
  );
}

export default Budget;
