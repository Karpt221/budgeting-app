import { Outlet, useLoaderData, Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import SidebarContextMenu from './SidebarContextMenu/SidebarContextMenu';
import Accounts from './Accounts/Accounts';

const Dashboard = () => {
  const userData = useLoaderData();

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.sidebarContainer}>
        <SidebarContextMenu userEmail={userData.email} />
        <ul className={styles.mainNav}>
          <li className={styles.sidebarNavItem}>
            <Link to="budget">Budget</Link>
          </li>
          <li className={styles.sidebarNavItem}>
            <Link to="reports/spending-breakdown">Reports</Link>
          </li>
          <li className={styles.sidebarNavItem}>
            <Link to="transactions">All accounts</Link>
          </li>
        </ul>
        <Accounts user_id={userData.user_id} accounts={userData.accounts} />
      </nav>

      <main className={styles.mainContainer}>
        <Outlet
          context={{
            accounts: userData.accounts,
            categories: userData.categories,
          }}
        />
      </main>
    </div>
  );
};

export default Dashboard;
