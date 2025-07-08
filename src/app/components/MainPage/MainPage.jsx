// import styles from './SignIn.module.css';
import { Link } from 'react-router-dom';
// import { useState } from 'react';

export const EyeIcon = () => (
  <>
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
        stroke="currentCollor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
        stroke="currentCollor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

export const EyeSlashIcon = () => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
      stroke="currentCollor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function MainPage() {

  return (
    <div className="p-6 font-sans antialiased bg-gray-100 text-gray-800">
      
       <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <nav style={{display:"flex", justifyContent:"flex-end"}}>
        <Link to="/sign-in">Sign In</Link>
      </nav>
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Budgeting App Features Overview</h1>
        <ol className="list-decimal pl-5 space-y-8">
            <li className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Accounts Section</h2>
                <p className="text-gray-700 mb-3">The Accounts section in the sidebar allows users to manually track their financial accounts, such as checking accounts, savings accounts, or cash.</p>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Content:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
                    <li>Users can manually create and manage accounts by entering the account name and initial balance.</li>
                    <li>A list of all accounts will be displayed, showing the account name and current balance.</li>
                </ul>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Functionality:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>This system will not support linking to bank accounts. Users will need to manually enter all transactions and balances.</li>
                    <li>There will be no option to select an account type (e.g., checking, savings, credit). All accounts will be treated as general financial accounts.</li>
                    <li>Since account types are not supported, there will be no features for managing debts such as credit card balances or loans.</li>
                </ul>
            </li>

            <li className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Transactions Tab</h2>
                <p className="text-gray-700 mb-3">The Transactions tab allows users to manually record and track their financial transactions.</p>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Content:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
                    <li>A table displaying all transactions, with columns for date, payee, category, note, expense, and income.</li>
                </ul>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Functionality:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Users can manually add, edit, or delete transactions.</li>
                    <li>Transactions will automatically update the balance of the relevant account.</li>
                    <li>Categories will be assigned to transactions for tracking expenses and income.</li>
                </ul>
            </li>

            <li className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Budget Tab</h2>
                <p className="text-gray-700 mb-3">The Budget tab provides budgeting functionality, focusing on essential features to help users allocate their income and track spending.</p>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Content:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
                    <li>A table showing budget categories, with columns for planned amount, activity (expenses), and available funds. A header at the top will display funds ready to be assigned to categories.</li>
                </ul>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Functionality:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Users can manually allocate funds to categories based on their income.</li>
                    <li>The system will track spending within each category and update available funds accordingly.</li>
                    <li>No automation or suggestions for reallocating funds will be provided.</li>
                    <li>There will be no time-based budgeting timeline.</li>
                </ul>
            </li>

            <li className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reports Tab</h2>
                <p className="text-gray-700 mb-3">The Reports tab will provide basic visualizations to help users analyze their spending and income.</p>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Content:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
                    <li>A pie chart showing the distribution of expenses by category.</li>
                    <li>A bar chart for comparing spending trends over time.</li>
                </ul>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Functionality:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Users can filter visualizations by date range.</li>
                    <li>The system will calculate total expenses, average monthly and daily expenses, the most frequent spending category, and the largest outflow.</li>
                </ul>
            </li>
        </ol>
    </div>
    </div>
  );
}

export default MainPage;
