import pool from './pool.js';

export const getUserSpendingsByCategory = async ({  
  startDate,  
  endDate,  
  categories,  
  accounts,  
}) => {  
  try {  
    const query = `  
    WITH category_totals AS (  
    SELECT   
        c.category_id,  
        c.category_name,  
        c.category_color,  
        ABS(SUM(t.amount))::INTEGER AS total_spending  
    FROM transactions t  
    JOIN categories c ON c.category_id = t.category_id  
    WHERE t.amount < 0  
      AND t.transaction_date BETWEEN TO_DATE($1, 'YYYY-MM')   
                                AND TO_DATE($2, 'YYYY-MM') + INTERVAL '1 month' - INTERVAL '1 day'  
      AND c.category_id = ANY($3)  
      AND t.account_id = ANY($4)  
    GROUP BY c.category_id, c.category_name, c.category_color  
),  
total_sum AS (  
    SELECT SUM(total_spending) AS overall_spending  
    FROM category_totals  
),  
normalized_totals AS (  
    SELECT   
        ct.category_id,  
        ct.category_name,  
        ct.category_color,  
        ct.total_spending,  
        FLOOR((ct.total_spending::NUMERIC / ts.overall_spending) * 100)::INTEGER AS percent  
    FROM category_totals ct  
    CROSS JOIN total_sum ts  
),  
final_totals AS (  
    SELECT   
        nt.category_id,  
        nt.category_name,  
        nt.category_color,  
        nt.total_spending,  
        nt.percent,  
        SUM(nt.percent) OVER () AS total_percent  
    FROM normalized_totals nt  
)  
SELECT   
    ft.category_id,  
    ft.category_name,  
    ft.category_color,  
    ft.total_spending,  
    CASE   
        WHEN ft.total_percent = 0 THEN 0  -- Handle case where total_percent is 0  
        WHEN ft.total_percent > 100 THEN   
            ROUND((ft.percent::NUMERIC / ft.total_percent) * 100)::INTEGER  
        ELSE   
            ft.percent  
    END AS percent  
FROM final_totals ft  
ORDER BY ft.total_spending DESC;  
`;  

    const values = [startDate, endDate, categories, accounts];  

    const { rows } = await pool.query(query, values);  
    return rows;  
  } catch (error) {  
    console.error('Error fetching user spendings by category:', error);  
    throw error;  
  }  
};

export const getUserSpendingStats = async ({  
  startDate,  
  endDate,  
  categories,  
  accounts,  
}) => {  
  try {  
    const query = `  
      WITH filtered_transactions AS (  
        SELECT   
          t.transaction_id,  
          t.amount,  
          t.transaction_date,  
          c.category_id,  
          c.category_name  
        FROM transactions t  
        JOIN categories c ON c.category_id = t.category_id  
        WHERE t.amount < 0  
          AND t.transaction_date BETWEEN TO_DATE($1, 'YYYY-MM')   
                                    AND TO_DATE($2, 'YYYY-MM') + INTERVAL '1 month' - INTERVAL '1 day'  
          AND c.category_id = ANY($3)  
          AND t.account_id = ANY($4)  
      ),  
      stats AS (  
        SELECT   
          ABS(SUM(amount)) AS total_spending,  
          -- Calculate total_days as the number of days between min and max transaction dates  
          (MAX(transaction_date) - MIN(transaction_date))::INTEGER + 1 AS total_days,  
          EXTRACT(MONTH FROM AGE(TO_DATE($2, 'YYYY-MM'), TO_DATE($1, 'YYYY-MM'))) + 1 AS total_months  
        FROM filtered_transactions  
      ),  
      most_frequent_category AS (  
        SELECT   
          category_name,  
          COUNT(transaction_id) AS transaction_count  
        FROM filtered_transactions  
        GROUP BY category_name  
        ORDER BY transaction_count DESC  
        LIMIT 1  
      ),  
      largest_outflow AS (  
        SELECT   
          category_name,  
          ABS(amount) AS amount  
        FROM filtered_transactions  
        ORDER BY ABS(amount) DESC  
        LIMIT 1  
      )  
      SELECT   
        (s.total_spending / s.total_months)::NUMERIC(10, 0) AS avg_monthly_spending,  
        (s.total_spending / NULLIF(s.total_days, 0))::NUMERIC(10, 0) AS avg_daily_spending,  
        mfc.category_name AS most_frequent_category_name,  
        mfc.transaction_count AS most_frequent_category_transactions,  
        lo.category_name AS largest_outflow_category,  
        lo.amount AS largest_outflow_amount,  
        s.total_spending AS total_spending
      FROM stats s  
      CROSS JOIN most_frequent_category mfc  
      CROSS JOIN largest_outflow lo;  
    `;  

    const values = [startDate, endDate, categories, accounts];  

    const { rows } = await pool.query(query, values);  
    return rows[0]; // Return a single row with aggregated data  
  } catch (error) {  
    console.error('Error fetching user spending stats:', error);  
    throw error;  
  }  
};

export const getUserSpendingsByCategoriesForAccounts = async ({  
  startDate,  
  endDate,  
  categories,  
  accounts,  
}) => {  
  try {  
    // Step 1: Get total spending and average monthly spending using a CTE  
    const totalSpendingQuery = `  
      WITH filtered_transactions AS (  
        SELECT   
          t.transaction_id,  
          t.amount,  
          t.transaction_date,  
          c.category_id,  
          c.category_name  
        FROM transactions t  
        JOIN categories c ON c.category_id = t.category_id  
        WHERE t.amount < 0  
          AND t.transaction_date BETWEEN TO_DATE($1, 'YYYY-MM')   
                                    AND TO_DATE($2, 'YYYY-MM') + INTERVAL '1 month' - INTERVAL '1 day'  
          AND c.category_id = ANY($3)  
          AND t.account_id = ANY($4)  
      ),  
      stats AS (  
        SELECT   
          ABS(SUM(amount)) AS total_spending,    
          EXTRACT(MONTH FROM AGE(TO_DATE($2, 'YYYY-MM'), TO_DATE($1, 'YYYY-MM'))) + 1 AS total_months  
        FROM filtered_transactions  
      )
      SELECT   
        s.total_spending,  
        (s.total_spending / NULLIF(s.total_months, 0))::NUMERIC(10, 0) AS avg_monthly_spending  
      FROM stats s;  
    `;  

    const totalValues = [startDate, endDate, categories, accounts];  
    const { rows: totalRows } = await pool.query(totalSpendingQuery, totalValues);  
    const totalSpending = totalRows[0]?.total_spending || 0;  
    const averageMonthlySpending = totalRows[0]?.avg_monthly_spending || 0;  

    // Step 2: Get spendings by category for each month  
    const monthQuery = `  
      SELECT DISTINCT TO_CHAR(transaction_date, 'YYYY-MM') AS month  
      FROM transactions  
      WHERE transaction_date BETWEEN TO_DATE($1, 'YYYY-MM')   
                                AND TO_DATE($2, 'YYYY-MM') + INTERVAL '1 month' - INTERVAL '1 day'  
      AND account_id = ANY($3)  
      ORDER BY month;  
    `;  

    const monthValues = [startDate, endDate, accounts];  
    const { rows: monthRows } = await pool.query(monthQuery, monthValues);  
    const spendingsBreakdownByMonth = [];  

    // Step 3: For each month, get spendings by category  
    for (const { month } of monthRows) {  
      const categoryResults = await getUserSpendingsByCategory({  
        startDate: month,  
        endDate: month,  
        categories,  
        accounts,  
      });  

      const formattedCategories = categoryResults.map((cat) => ({  
        name: cat.category_name,  
        amount: cat.total_spending,  
        percent: cat.percent,  
        color: cat.category_color,  
      }));  

      spendingsBreakdownByMonth.push({  
        month,  
        categories: formattedCategories,  
      });  
    }  

    // Step 4: Return results with total and average spending  
    return {  
      spendingsBreakdownByMonth,  
      totalSpending,  
      averageMonthlySpending,  
    };  
  } catch (error) {  
    console.error(  
      'Error fetching user spendings by categories for accounts:',  
      error,  
    );  
    throw error;  
  }  
};
