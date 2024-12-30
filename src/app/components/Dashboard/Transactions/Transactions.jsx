import styles from './Transactions.module.css';
import { useLoaderData, useOutletContext, Form } from 'react-router-dom';
import AddIcon from './AddIcon';
import DeleteIcon from './DeleteIcon';
import { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm'; // Import the new form component

function Transactions() {
  const { accounts } = useOutletContext();
  const transactionsData = useLoaderData();
  const [currentAccount, setCurrentAccount] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isAddTransactionFormOpen, setIsAddTransactionFormOpen] =
    useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null); // New state for editing

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
      // If the row is already selected, set it for editing
      setEditingTransaction(transaction);
    } else {
      // Otherwise, select the transaction
      setSelectedTransactions([transaction.transaction_id]);
      setEditingTransaction(null); // Clear editing if a new transaction is selected
    }
  };

  const handleAddFormOpen = () => {
    setIsAddTransactionFormOpen(true);
    setSelectedTransactions([]);
  };

  return (
    <>
      <div className={styles.transactionsTitle}>
        <h2>{currentAccount ? currentAccount.name : 'All Accounts'}</h2>
      </div>
      <hr />
      <div className={styles.transactionsToolbar}>
        <button onClick={handleAddFormOpen}>
          <AddIcon /> Add Transaction
        </button>
        <Form
          method="post"
          action={
            currentAccount
              ? `/dashboard/transactions/${currentAccount.account_id}`
              : '/dashboard/transactions'
          }
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
        action={
          currentAccount
            ? `/dashboard/transactions/${currentAccount.account_id}`
            : '/dashboard/transactions'
        }
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
                  action="edit"
                  accounts={accounts}
                  onCancel={() => setEditingTransaction(null)} // Clear editing transaction
                  currentAccount={currentAccount}
                  transaction={editingTransaction} // Pass transaction data to the form
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
                        ).name
                      }
                    </td>
                  )}
                  <td>{transaction.date.split('T')[0]}</td>
                  <td>{transaction.payee}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.memo || '-'}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </Form>
    </>
  );
}

export default Transactions;
