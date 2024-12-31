import { redirect } from 'react-router-dom';

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
