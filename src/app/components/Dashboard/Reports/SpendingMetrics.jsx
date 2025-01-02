import styles from './Reports.module.css';  

const SpendingMetrics = ({ data }) => {  
  return (  
    <div className={styles.spendingBreakdownContentMetrics}>  
      <div className={styles.spendingBreakdownContentMetricsItem}>  
        <span className={styles.spendingBreakdownContentLabel}>  
          Average Monthly Spending  
        </span>  
        <span className={styles.spendingBreakdownContentMetricsValue}>  
          {data ? data.avg_monthly_spending : 0} $  
        </span>  
      </div>  
      <div className={styles.spendingBreakdownContentMetricsItem}>  
        <span className={styles.spendingBreakdownContentLabel}>  
          Average Daily Spending  
        </span>  
        <span className={styles.spendingBreakdownContentMetricsValue}>  
          {data ? data.avg_daily_spending : 0} $  
        </span>  
      </div>  
      <div className={styles.spendingBreakdownContentMetricsItem}>  
        <span className={styles.spendingBreakdownContentLabel}>  
          Most Frequent Category  
        </span>  
        <span className={styles.spendingBreakdownContentMetricsValue}>  
          {data ? data.most_frequent_category_name : 'n/a'}  
        </span>  
        {data ? (  
          <span className={styles.spendingBreakdownContentLabel}>  
            {data.most_frequent_category_transactions} transactions  
          </span>  
        ) : (  
          ''  
        )}  
      </div>  
      <div className={styles.spendingBreakdownContentMetricsItem}>  
        <span className={styles.spendingBreakdownContentLabel}>  
          Largest Outflow  
        </span>  
        <span className={styles.spendingBreakdownContentMetricsValue}>  
          {data ? data.largest_outflow_category : 'n/a'}  
        </span>  
        {data ? (  
          <span className={styles.spendingBreakdownContentLabel}>  
            {data.largest_outflow_amount} $  
          </span>  
        ) : (  
          ''  
        )}  
      </div>  
    </div>  
  );  
};  

export default SpendingMetrics;  