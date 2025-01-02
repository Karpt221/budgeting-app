import styles from './Budget.module.css';

function Budget() {
  return (
    <>
      <header className={styles.budgetHeader}>
        <div className={styles.budgetDate}></div>
        <div className={styles.budgetTotals}></div>
      </header>
      <main className={styles.budgetTable}>


      </main>
      <aside className={styles.budgetInspector}>

      </aside>
    </>
  );
}

export default Budget;
