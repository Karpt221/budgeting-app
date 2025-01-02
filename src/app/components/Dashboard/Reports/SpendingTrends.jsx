import styles from './Reports.module.css';
import { useMemo } from 'react';
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks';
import CustomDatePicker from './CustomDatePicker';
import { Form, useActionData, useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function SpendingTrends() {
  const actionData = useActionData();
  const { accounts, categories, transactions } = useOutletContext();
  console.log(actionData);
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
      minDate: minDate.format('YYYY-MM-DD'), // Format to YYYY-MM-DD
      maxDate: maxDate.format('YYYY-MM-DD'), // Format to YYYY-MM-DD
    };
  }, [transactions]);

  return (
    <div className={styles.spendingBreakdownMain}>
      <div className={styles.spendingBreakdownHeaderWrapper}>
        <h2 className={styles.spendingBreakdownMainHeader}>
          Spending Trends
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
      <div className={styles.spendingTrendsContent}>
        
          <div className={styles.spendingBreakdownContentChart}>
            Content Chart
          </div>
          <div className={styles.spendingBreakdownContentMetrics}>
            Content Transactions
            
        </div>
      </div>
    </div>
    );
}

export default SpendingTrends;