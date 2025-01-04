import styles from './Reports.module.css';
import { useMemo, useState } from 'react';
import DonutChart from './DonutChart';
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks';
import CustomDatePicker from './CustomDatePicker';
import { Form, useLoaderData } from 'react-router-dom';
import apiService from '../../../ApiService.js';
import SpendingMetrics from './SpendingMetrics';
import VerticalBoxPlot from './VerticalBoxPlot.jsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function SpendingBreakdown() {
  const { spendingsBreakdown, transactions, accounts, categories } =
    useLoaderData();
  const [actionSpendingsBreakdown, setActionSpendingsBreakdown] =
    useState(null);
  const [actionAccounts, setActionAccounts] = useState([]);
  const [actionCategories, setActionCategories] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  console.log(spendingsBreakdown);
  async function handleFiltersSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    setActionAccounts(formData.get('accounts').split(','));
    setActionCategories(formData.get('categories').split(','));
    setMinDate(formData.get('startDate'));
    setMaxDate(formData.get('endDate'));

    async function fetchSpendingBreakdown() {
      try {
        const spendingBreakdownResponse =
          await apiService.getSpendingsByCategories({
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            categories: formData.get('categories').split(','),
            accounts: formData.get('accounts').split(','),
          });
        return spendingBreakdownResponse.spendingsBreakdown;
      } catch (error) {
        throw new Error(error);
      }
    }

    setActionSpendingsBreakdown(await fetchSpendingBreakdown());
  }

  const totalSpendings = actionSpendingsBreakdown
    ? actionSpendingsBreakdown.spendingStats.total_spending
    : spendingsBreakdown.spendingStats.total_spending;

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
        <h2 className={styles.spendingBreakdownMainHeader}>
          Spending Breakdown
        </h2>
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
      <div className={styles.spendingBreakdownContent}>
        <div className={styles.spendingBreakdownContentLeftColumn}>
          <div className={styles.spendingBreakdownContentChart}>
            <div className={styles.spendingBreakdownContentChartHeader}>
              <div
                className={
                  styles.spendingBreakdownContentChartHeaderSpendingWrapper
                }
              >
                <span className={styles.spendingBreakdownContentLabel}>
                  Total Spending
                </span>
                <span className={styles.spendingBreakdownContentSpendingNum}>
                  {totalSpendings ? totalSpendings : 0} $
                </span>
              </div>
            </div>
            <div className={styles.spendingBreakdownContentChartDonut}>
              <DonutChart
                totalSpendings={totalSpendings}
                data={
                  actionSpendingsBreakdown
                    ? actionSpendingsBreakdown.spendingsByCategories
                    : spendingsBreakdown.spendingsByCategories
                }
              />
            </div>
          </div>
          <SpendingMetrics
            data={
              actionSpendingsBreakdown
                ? actionSpendingsBreakdown.spendingStats
                : spendingsBreakdown.spendingStats
            }
          />
        </div>
        <div className={styles.spendingBreakdownContentSidebar}>
          <div className={styles.spendingBreakdownContentSidebarHeader}>
            <span className={styles.spendingBreakdownContentLabel}>
              Categories
            </span>
            <span className={styles.spendingBreakdownContentLabel}>
              Total Spending
            </span>
          </div>
          <div className={styles.spendingBreakdownContentSidebarContent}>
            <VerticalBoxPlot
              data={
                actionSpendingsBreakdown
                  ? actionSpendingsBreakdown.spendingsByCategories
                  : spendingsBreakdown.spendingsByCategories
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpendingBreakdown;
