import styles from './Reports.module.css';
import { useMemo, useState } from 'react';
import DonutChart from './DonutChart';
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks';
import CustomDatePicker from './CustomDatePicker';
import {
  Form,
  useActionData,
  useOutletContext,
  useLoaderData,
} from 'react-router-dom';
import SpendingMetrics from './SpendingMetrics';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function SpendingBreakdown() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const { accounts, categories, transactions } = useOutletContext();
  console.log(actionData);
  console.log(loaderData);
  const totalSpendings = accounts.reduce((total, account) => {
    return total + Math.abs(account.balance);
  }, 0);
  const { minDate, maxDate } = useMemo(() => {
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
          <Form method="post" action="">
            <CustomDatePicker
              label="Start Date"
              fieldName="startDate"
              defaultValue={minDate}
            />
            <CustomDatePicker
              label="End Date"
              fieldName="endDate"
              defaultValue={maxDate}
            />
            <MultipleSelectCheckmarks
              fieldName="categories"
              itemName="Categories"
              options={categories.map((item) => ({
                id: item.category_id,
                value: item.category_name,
              }))}
            />
            <MultipleSelectCheckmarks
              fieldName="accounts"
              itemName="Accounts"
              options={accounts.map((item) => ({
                id: item.account_id,
                value: item.account_name,
              }))}
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
                  actionData
                    ? actionData.spendingsByCategories
                    : loaderData.spendingsByCategories
                }
              />
            </div>
          </div>
          <SpendingMetrics
            data={
              actionData
                ? actionData.spendingStats
                : loaderData.spendingStats
            }
          />
          
        </div>
        <div className={styles.spendingBreakdownContentSidebar}>
          <div className={styles.spendingBreakdownContentSidebarHeader}>
            <span className={styles.spendingBreakdownContentLabel}>
              Categories
            </span>
            <span className={styles.spendingBreakdownContentLabel}>
              Total Spendind
            </span>
          </div>
          <div className={styles.spendingBreakdownContentSidebarContent}>
            Bar Chart
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpendingBreakdown;
