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
        loader: async () => {
          const token = localStorage.getItem('budgeting-user-token');
          if (!token) {
            return redirect('/sign-in');
          } else {
            const user = await apiService.decodeToken(token);
            return redirect(`${user.user_id}/dashboard/transactions`);
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
            console.log(token);
            localStorage.setItem('budgeting-user-token', token);
            const user = await apiService.decodeToken(token);
            console.log(user);
            return redirect(`/${user.user_id}/dashboard/transactions`);
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
            const categoriesResponse = await apiService.getCategorie(params.user_id);
            return {
              email: user.email,
              user_id: user.user_id,
              accounts: userAccounts.accounts,
              categories:categoriesResponse.categories,
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
            loader: async ({ params }) => {
              console.log(params.user_id);
              return {
                transactions: await loadTransactions(
                  async () => await apiService.getTransactions(params.user_id),
                ),
                account_id: null,
                
              };
            },
            action: async ({ request }) => {
              const formData = await request.formData();
              const action = formData.get('action');
              try {
                if (action === 'edit') {
                  await handleEditTransaction(formData);
                } else if (action === 'delete') {
                  await handleDeleteTransaction(formData);
                } 
                else if (action === 'create') {
                  await handleCreateTransaction(formData);
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
              return {
                transactions: await loadTransactions(
                  async () =>
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
                if (action === 'edit') {
                  await handleEditTransaction(formData, account_id);
                } else if (action === 'delete') {
                  await handleDeleteTransaction(formData);
                } 
                else if (action === 'create') {
                  await handleCreateTransaction(formData, account_id);
                }
              } catch (error) {
                throw new Error(error);
              }
            }
          },
          {
            path: 'account',
            action: async ({ params,request }) => {
              const formData = await request.formData();
              const action = formData.get('action');
              try {
                let redirectLocation = `/${params.user_id}/dashboard/transactions`;
                if (action === 'edit') {
                  await handleEditAccount(formData);
                  redirectLocation = formData.get('previousLocation');
                } else if (action === 'delete') {
                  await handleDeleteAccount(formData);
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
