import { createBrowserRouter, redirect } from 'react-router-dom';
import apiService from './ApiService.js';
import App from './App';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Budget from './components/Dashboard/Budget/Budget';
import Reports from './components/Dashboard/Reports/Reports';
import SpendingBreakdown from './components/Dashboard/Reports/SpendingBreakdown';
import SpendingTrends from './components/Dashboard/Reports/SpendingTrends';
import Transactions from './components/Dashboard/Transactions/Transactions';
import {
  handleEditAccount,
  handleDeleteAccount,
  handleCreateAccount,
  handleCreateTransaction,
  handleDeleteTransaction,
  handleEditTransaction,
} from './actions.js';
import { loadTransactions, getMinMaxDate } from './loaders.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        loader: async () => {
          try {
            const token = localStorage.getItem('budgeting-user-token');
            console.log('token', token);
            if (!token) {
              return redirect('/sign-in');
            } else {
              const user = await apiService.decodeToken(token);
              console.log('user', user);
              return redirect(`${user.user_id}/dashboard/transactions`);
            }
          } catch (error) {
            if (error.code === 403) {
              localStorage.removeItem('budgeting-user-token');
              return redirect('/sign-in');
            }
          }
        },
      },
      {
        path: '/sign-in',
        element: <SignIn />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const email = formData.get('email');
          const password = formData.get('password');
          console.log('formData', formData);
          try {
            const { token } = await apiService.signIn(email, password);
            console.log('token', token);
            localStorage.setItem('budgeting-user-token', token);
            const user = await apiService.decodeToken(token);
            console.log('user', user);
            return redirect(`/${user.user_id}/dashboard/transactions`);
          } catch (error) {
            if (error.code === 403) {
              localStorage.removeItem('budgeting-user-token');
              return redirect('/sign-in');
            }
            return { error: error.message };
          }
        },
      },
      {
        path: '/sign-up',
        element: <SignUp />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const email = formData.get('email');
          const password = formData.get('password');
          console.log('formData', formData);
          try {
            await apiService.signUp(email, password);
            return redirect('/sign-in');
          } catch (error) {
            return { error: error.message };
          }
        },
      },
      {
        path: ':user_id/dashboard',
        element: <Dashboard />,
        loader: async ({ params }) => {
          const token = localStorage.getItem('budgeting-user-token');
          if (!token) return redirect('/sign-in');
          try {
            const userAccounts = await apiService.getAccounts(params.user_id);
            const user = await apiService.getUserByID(params.user_id);
            const categoriesResponse = await apiService.getAllCategories(
              params.user_id,
            );
            console.log('userAccounts', userAccounts);
            console.log('user', user);
            console.log('categoriesResponse', categoriesResponse);
            return {
              email: user.email,
              user_id: user.user_id,
              accounts: userAccounts.accounts,
              categories: categoriesResponse.categories,
            };
          } catch (error) {
            if (error.code === 403) {
              localStorage.removeItem('budgeting-user-token');
              return redirect('/sign-in');
            }
            throw new Error(error.message);
          }
        },
        children: [
          {
            path: 'budget',
            element: <Budget />,
            loader: async ({ params }) => {
              const readyToAssignResponese = await apiService.getReadyToAssign(
                params.user_id,
              );
              const categoriesResponse = await apiService.getCategories(
                params.user_id,
              );
              console.log('readyToAssignResponese', readyToAssignResponese);
              console.log('categoriesResponse', categoriesResponse);
              return {
                categories: categoriesResponse.categories,
                readyToAssign: readyToAssignResponese.ready_to_assign,
              };
            },
            action: async ({ request, params }) => {
              const formData = await request.formData();
              try {
                const action = formData.get('action');
                if (action === 'edit') {
                  const updateCategoriesResult = await apiService.updateCategory(
                    formData.get('category_id'),
                    formData.get('category_name'),
                    parseInt(formData.get('assigned')),
                  );
                  console.log('updateCategoriesResult', updateCategoriesResult);
                } else if (action === 'delete') {
                  const deleteCategoriesResult = await apiService.deleteCategories(
                    JSON.parse(formData.get('category_ids')),
                  );
                  console.log('createCategoryResult', deleteCategoriesResult);
                } else if (action === 'create') {
                  const createCategoryResult = await apiService.createCategory(
                    params.user_id,
                    formData.get('category_name'),
                  );
                  console.log('createCategoryResult',createCategoryResult);
                }
                const readyToAssignResponese =
                  await apiService.getReadyToAssign(params.user_id);
                  console.log('readyToAssignResponese',readyToAssignResponese);
                return {
                  readyToAssign: readyToAssignResponese.ready_to_assign,
                };
              } catch (error) {
                if (error.code === 409) {
                  return redirect(
                    `/${params.user_id}/dashboard/budget?categoryError=true&errorMessage=${error.message}`,
                  );
                } else {
                  throw new Error(error);
                }
              }
            },
          },
          {
            path: 'reports',
            element: <Reports />,
            children: [
              {
                path: 'spending-breakdown',
                element: <SpendingBreakdown />,
                loader: async ({ params }) => {
                  try {
                    const transactions = await loadTransactions(
                      async () =>
                        await apiService.getTransactions(params.user_id),
                    );
                    const accountsResponse = await apiService.getAccounts(
                      params.user_id,
                    );
                    const categoriesResponse = await apiService.getCategories(
                      params.user_id,
                    );
                    const { minDate, maxDate } = getMinMaxDate(transactions);
                    console.log('SpendingBreakdown transactions',transactions);
                    console.log('SpendingBreakdown accountsResponse',accountsResponse);
                    console.log('SpendingBreakdown categoriesResponse',categoriesResponse);
                    const categories_ids = categoriesResponse.categories.map(
                      (category) => {
                        return category.category_id;
                      },
                    );
                    const accounts_ids = accountsResponse.accounts.map(
                      (account) => {
                        return account.account_id;
                      },
                    );
                    const initialData =
                      await apiService.getSpendingsByCategories({
                        startDate: minDate,
                        endDate: maxDate,
                        categories: categories_ids,
                        accounts: accounts_ids,
                      });
                    console.log('SpendingBreakdown initialData',initialData);
                    return {
                      spendingsBreakdown: initialData.spendingsBreakdown,
                      transactions,
                      accounts: accountsResponse.accounts,
                      categories: categoriesResponse.categories.filter(
                        (category) =>
                          category.category_name !== 'Ready to Assign',
                      ),
                    };
                  } catch (error) {
                    throw new Error(error);
                  }
                },
              },
              {
                path: 'spending-trends',
                element: <SpendingTrends />,
                loader: async ({ params }) => {
                  try {
                    const transactions = await loadTransactions(
                      async () =>
                        await apiService.getTransactions(params.user_id),
                    );
                    const accountsResponse = await apiService.getAccounts(
                      params.user_id,
                    );
                    const categoriesResponse = await apiService.getCategories(
                      params.user_id,
                    );
                    const { minDate, maxDate } = getMinMaxDate(transactions);
                    const categories_ids = categoriesResponse.categories.map(
                      (category) => {
                        return category.category_id;
                      },
                    );
                    console.log('SpendingTrends transactions',transactions);
                    console.log('SpendingTrends accountsResponse',accountsResponse);
                    console.log('SpendingTrends categoriesResponse',categoriesResponse);
                    const accounts_ids = accountsResponse.accounts.map(
                      (account) => {
                        return account.account_id;
                      },
                    );
                    const initialData = await apiService.getSpendingTrends({
                      startDate: minDate,
                      endDate: maxDate,
                      categories: categories_ids,
                      accounts: accounts_ids,
                    });
                    console.log('SpendingTrends initialData',initialData);
                    return {
                      spendinTrends: initialData.spendinTrends,
                      transactions,
                      accounts: accountsResponse.accounts,
                      categories: categoriesResponse.categories.filter(
                        (category) =>
                          category.category_name !== 'Ready to Assign',
                      ),
                    };
                  } catch (error) {
                    throw new Error(error);
                  }
                },
              },
            ],
          },
          {
            path: 'transactions',
            element: <Transactions />,
            loader: async ({ params }) => {
              const loadedTransactions = await loadTransactions(
                async () => await apiService.getTransactions(params.user_id),
              );
              console.log('loadedTransactions', loadedTransactions);
              return {
                transactions: loadedTransactions,
                account_id: null,
              };
            },
            action: async ({ request }) => {
              const formData = await request.formData();
              const action = formData.get('action');
              try {
                if (action === 'edit') {
                  const editTransactionResult = await handleEditTransaction(formData);
                  console.log('editTransactionResult', editTransactionResult);
                } else if (action === 'delete') {
                  const deleteTransactionResult = await handleDeleteTransaction(formData);
                  console.log('deleteTransactionResult', deleteTransactionResult);
                } else if (action === 'create') {
                  const createTransactionResult = await handleCreateTransaction(formData);
                  console.log('createTransactionResult', createTransactionResult);
                }
              } catch (error) {
                throw new Error(error);
              }
            },
          },
          {
            path: 'transactions/:account_id',
            element: <Transactions />,
            loader: async ({ params }) => {
              const { account_id } = params;
              const loadedTransactions = await loadTransactions(
                async () =>
                  await apiService.getTransactionsByAccount(account_id),
              );
              console.log('loadedTransactions by Account',loadedTransactions);
              return {
                transactions: loadedTransactions,
                account_id,
              };
            },
            action: async ({ request, params }) => {
              const { account_id } = params;
              const formData = await request.formData();
              const action = formData.get('action');
              try {
                if (action === 'edit') {
                  const transactionEditedByAccount = await handleEditTransaction(formData, account_id);
                  console.log('transactionEditedByAccount',transactionEditedByAccount);
                } else if (action === 'delete') {
                  const transactionDeletedByAccount = await handleDeleteTransaction(formData);
                  console.log('transactionDeletedByAccount',transactionDeletedByAccount);
                } else if (action === 'create') {
                  const transactionCreatedByAccount = await handleCreateTransaction(formData, account_id);
                  console.log('transactionCreatedByAccount',transactionCreatedByAccount);
                }
              } catch (error) {
                throw new Error(error);
              }
            },
          },
          {
            path: 'account',
            action: async ({ params, request }) => {
              const formData = await request.formData();
              const action = formData.get('action');
              let redirectLocation = `/${params.user_id}/dashboard/transactions`;
              try {
                if (action === 'edit') {
                  const editedAccount = await handleEditAccount(formData);
                  console.log('editedAccount',editedAccount);
                  redirectLocation = formData.get('previousLocation');
                } else if (action === 'delete') {
                  const deletedAccount = await handleDeleteAccount(formData);
                  console.log('deletedAccount',deletedAccount);
                } else if (action === 'create') {
                  redirectLocation = await handleCreateAccount(formData);
                  console.log('redirectLocation',redirectLocation);
                }
                return redirect(`${redirectLocation}?modalClosed=true`);
              } catch (error) {
                console.log(error);
                if (error.code === 409) {
                  return redirect(
                    `${formData.get('previousLocation')}?accountError=true&errorMessage=${error.message}`,
                  );
                } else {
                  throw new Error(error);
                }
              }
            },
          },
        ],
      },
    ],
  },
]);

export default router;
