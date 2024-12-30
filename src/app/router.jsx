import { createBrowserRouter, redirect } from 'react-router-dom';
import apiService from './ApiService.js';
import App from './App';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Budget from './components/Dashboard/Budget/Budget';
import Reports from './components/Dashboard/Reports/Reports';
import Transactions from './components/Dashboard/Transactions/Transactions';
import {
  handleEditAccount,
  handleDeleteAccount,
  handleCreateAccount,
  handleCreateTransaction,
  handleDeleteTransaction,
  handleEditTransaction,
} from './actions.js';
import { loadTransactions } from './loaders.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        loader: () => {
          const token = localStorage.getItem('budgeting-user-token');
          if (!token) {
            return redirect('/sign-in');
          } else {
            return redirect('/dashboard/transactions');
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
          try {
            const { token } = await apiService.signIn(email, password);
            localStorage.setItem('budgeting-user-token', token);
            return redirect('/dashboard/transactions');
          } catch (error) {
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
          try {
            const res = await apiService.signUp(email, password);
            return redirect('/sign-in');
          } catch (error) {
            return { error: error.message };
          }
        },
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
        loader: async () => {
          const token = localStorage.getItem('budgeting-user-token');
          if (!token) return redirect('/sign-in');
          try {
            const user = await apiService.decodeToken(token);
            const userAccounts = await apiService.getAccounts(user.id);
            return {
              email: user.email,
              id: user.id,
              accounts: userAccounts.accounts,
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
          },
          {
            path: 'reports',
            element: <Reports />,
          },
          {
            path: 'transactions',
            element: <Transactions />,
            loader: async () => {
              return {
                transactions: await loadTransactions(
                  async (userId) => await apiService.getTransactions(userId),
                ),
                account_id: null,
              };
            },
            action: async ({ request }) => {
              const formData = await request.formData();
              const action = formData.get('action');
              try {
                //let redirectLocation = '/dashboard';
                if (action === 'edit') {
                  handleEditTransaction(formData);
                  //redirectLocation = formData.get('previousLocation');
                } else if (action === 'delete') {
                  handleDeleteTransaction(formData);
                  //redirectLocation = '/dashboard/transactions';
                } 
                else if (action === 'create') {
                  handleCreateTransaction(formData);
                }
                //return redirect(`${redirectLocation}?modalClosed=true`);
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
              return {
                transactions: await loadTransactions(
                  async (userId) =>
                    await apiService.getTransactionsByAccount(account_id),
                ),
                account_id,
              };
            },
            action: async ({request, params }) => {
              const { account_id } = params;
              const formData = await request.formData();
              const action = formData.get('action');
              try {
                //let redirectLocation = '/dashboard';
                if (action === 'edit') {
                  handleEditTransaction(formData, account_id);
                  //redirectLocation = formData.get('previousLocation');
                } else if (action === 'delete') {
                  handleDeleteTransaction(formData);
                  //redirectLocation = '/dashboard/transactions';
                } 
                else if (action === 'create') {
                  await handleCreateTransaction(formData, account_id);
                }
                //return redirect(`${redirectLocation}?modalClosed=true`);
              } catch (error) {
                throw new Error(error);
              }
            }
          },
          {
            path: 'account',
            action: async ({ request }) => {
              const formData = await request.formData();
              const action = formData.get('action');
              try {
                let redirectLocation = '/dashboard';
                if (action === 'edit') {
                  handleEditAccount(formData);
                  redirectLocation = formData.get('previousLocation');
                } else if (action === 'delete') {
                  handleDeleteAccount(formData);
                  redirectLocation = '/dashboard/transactions';
                } else if (action === 'create') {
                  redirectLocation = await handleCreateAccount(formData);
                }
                return redirect(`${redirectLocation}?modalClosed=true`);
              } catch (error) {
                throw new Error(error);
              }
            },
          },
        ],
      },
    ],
  },
]);

export default router;
