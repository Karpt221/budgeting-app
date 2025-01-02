import { redirect } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const loadTransactions = async (apiCall) => {
  const token = localStorage.getItem('budgeting-user-token');
  if (!token) return redirect('/sign-in');

  try {
    //const user = await apiService.decodeToken(token);
    console.log(apiCall);
    const responseObj = await apiCall();
    console.log(responseObj)
    return responseObj.transactions;
  } catch (error) {
    if (error.code === 403) {
      localStorage.removeItem('budgeting-user-token');
      return redirect('/sign-in');
    }
    throw new Error(error.message);
  }
};


export function getMinMaxDate(transactions ) {
  if (!transactions || transactions.length === 0) {
    return { minDate: null, maxDate: null };
  }
  const transactionDates = transactions.map((tx) =>
    dayjs.utc(tx.transaction_date),
  );
  const minDate = transactionDates.reduce(
    (min, date) => (date.isBefore(min) ? date : min),
    transactionDates[0],
  );
  const maxDate = transactionDates.reduce(
    (max, date) => (date.isAfter(max) ? date : max),
    transactionDates[0],
  );
  return {
    minDate: minDate.format('YYYY-MM'),
    maxDate: maxDate.format('YYYY-MM'),
  };
}