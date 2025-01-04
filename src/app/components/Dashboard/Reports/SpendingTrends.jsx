import styles from './Reports.module.css';
import { useMemo, useState } from 'react';
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks';
import CustomDatePicker from './CustomDatePicker';
import { Form, useLoaderData } from 'react-router-dom';
import apiService from '../../../ApiService.js';
import StackedBarPlot from './StackedBarPlot.jsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function SpendingTrends() {
  const { spendinTrends, transactions, accounts, categories } = useLoaderData();
  const [actionSpendinTrends, setActionSpendinTrends] = useState(null);
  const [actionAccounts, setActionAccounts] = useState([]);
  const [actionCategories, setActionCategories] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  console.log('spendinTrends', spendinTrends);
  console.log('actionSpendinTrends', actionSpendinTrends);
  async function handleFiltersSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    setActionAccounts(formData.get('accounts').split(','));
    setActionCategories(formData.get('categories').split(','));
    setMinDate(formData.get('startDate'));
    setMaxDate(formData.get('endDate'));

    async function fetchSpendingTrends() {
      try {
        const spendinTrendsResponse = await apiService.getSpendingTrends({
          startDate: formData.get('startDate'),
          endDate: formData.get('endDate'),
          categories: formData.get('categories').split(','),
          accounts: formData.get('accounts').split(','),
        });
        return spendinTrendsResponse.spendinTrends;
      } catch (error) {
        throw new Error(error);
      }
    }

    setActionSpendinTrends(await fetchSpendingTrends());
  }

  const totalSpendings = accounts.reduce((total, account) => {
    return total + Math.abs(account.balance);
  }, 0);

  const { minDate: calculatedMinDate, maxDate: calculatedMaxDate } =
    useMemo(() => {
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
    }, [transactions]);

  return (
    <div className={styles.spendingBreakdownMain}>
      <div className={styles.spendingBreakdownHeaderWrapper}>
        <h2 className={styles.spendingBreakdownMainHeader}>Spending Trends</h2>
        <div className={styles.spendingBreakdownFilters}>
          <Form onSubmit={handleFiltersSubmit} method="post" action="">
            <CustomDatePicker
              label="Start Date"
              fieldName="startDate"
              value={minDate || calculatedMinDate}
            />
            <CustomDatePicker
              label="End Date"
              fieldName="endDate"
              value={maxDate || calculatedMaxDate}
            />
            <MultipleSelectCheckmarks
              fieldName="categories"
              itemName="Categories"
              options={categories.map((item) => ({
                id: item.category_id,
                value: item.category_name,
              }))}
              actionSelectedValues={actionCategories}
              onChange={setActionCategories}
            />
            <MultipleSelectCheckmarks
              fieldName="accounts"
              itemName="Accounts"
              options={accounts.map((item) => ({
                id: item.account_id,
                value: item.account_name,
              }))}
              actionSelectedValues={actionAccounts}
              onChange={setActionAccounts}
            />
            <button className={styles.SumbitBtn} type="submit">
              Apply
            </button>
          </Form>
        </div>
      </div>
      <div className={styles.spendingTrendsContent}>
        <div className={styles.spendingBreakdownContentChart}>
          <div className={styles.spendingTrendsContentChartHeader}>
            <div
              className={
                styles.spendingTrendsContentChartHeaderMonthlyContainer
              }
            >
              <span className={styles.spendingBreakdownContentLabel}>
                Average Monthly Spending
              </span>
              <span>
                {actionSpendinTrends
                  ? actionSpendinTrends.averageMonthlySpending
                  : spendinTrends.averageMonthlySpending} $
              </span>
            </div>
            <div
              className={
                styles.spendingTrendsContentChartHeaderTotalContainer
              }
            >
              <span className={styles.spendingBreakdownContentLabel}>
                Total Spending
              </span>
              <span>
                {actionSpendinTrends
                  ? actionSpendinTrends.totalSpending
                  : spendinTrends.totalSpending} $
              </span>
            </div>
          </div>
          <StackedBarPlot
            data={
              actionSpendinTrends
                ? actionSpendinTrends.spendingsBreakdownByMonth
                : spendinTrends.spendingsBreakdownByMonth
            }
          />
        </div>
        {/* <div className={styles.spendingBreakdownContentMetrics}>
            Content Transactions
            
        </div> */}
      </div>
    </div>
  );
}

export default SpendingTrends;
