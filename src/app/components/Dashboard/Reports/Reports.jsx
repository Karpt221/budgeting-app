import styles from './Reports.module.css';
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  Link,
  useLocation,
} from 'react-router-dom';

function Reports() {
  const location = useLocation();
  const transactions = useLoaderData();
  const { accounts, categories } = useOutletContext();
  console.log(transactions);
  return (
    <div className={styles.reportsWrapper}>
      <header className={styles.reportsHeader}>
        <Link
          className={
            location.pathname.includes('spending-breakdown')
              ? styles.selectedReport
              : ''
          }
          to="spending-breakdown"
        >
          Spending Breakdown
        </Link>
        <Link
          className={
            location.pathname.includes('spending-trends')
              ? styles.selectedReport
              : ''
          }
          to="spending-trends"
        >
          Spending Trends
        </Link>
      </header>

      <Outlet
        context={{
          accounts: accounts,
          categories: categories,
          transactions: transactions
        }}
      />
    </div>
  );
}

export default Reports;
