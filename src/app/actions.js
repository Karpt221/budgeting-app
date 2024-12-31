import apiService from './ApiService.js';

export async function handleEditAccount(formData) {
  const accountId = formData.get('account_id');
  const name = formData.get('name');
  await apiService.updateAccount(accountId, name);
}

export async function handleDeleteAccount(formData) {
  const accountId = formData.get('account_id');
  await apiService.deleteAccount(accountId);
}

export async function handleCreateAccount(formData) {
  const userId = formData.get('user_id');
  const name = formData.get('name');
  const balance = formData.get('balance');
  const createResponse = await apiService.createAccount(userId, name, balance);
  return `/${userId}/dashboard/transactions/${createResponse.account.account_id}`;
}

export async function handleEditTransaction(formData, account_id = null) {
  let finalAccount_id = null;
  const formAccount_id = formData.get('account_id');
  if (account_id) {
    finalAccount_id = account_id;
  } else {
    finalAccount_id = formAccount_id;
  }
  const transactionId = formData.get('transaction_id');
  console.log('handleEditTransaction:', transactionId);
  const updates = {
    account_id: finalAccount_id,
    transaction_date: formData.get('transaction_date'),
    payee: formData.get('payee'),
    category: formData.get('category'),
    memo: formData.get('memo'),
    amount: formData.get('amount'),
  };
  await apiService.updateTransaction(transactionId, updates);
}

export async function handleDeleteTransaction(formData) {
  const transactin_ids = JSON.parse(formData.get('transactin_ids'));
  await apiService.deleteTransactions(transactin_ids);
}

export async function handleCreateTransaction(formData, account_id = null) {
  let finalAccount_id = null;
  const formAccount_id = formData.get('account_id');
  if (account_id) {
    finalAccount_id = account_id;
  } else {
    finalAccount_id = formAccount_id;
  }

  const transactionData = {
    transaction_date: formData.get('transaction_date'),
    payee: formData.get('payee'),
    category: formData.get('category'),
    memo: formData.get('memo'),
    amount: formData.get('amount'),
  };

  await apiService.createTransaction(finalAccount_id, transactionData);
}
