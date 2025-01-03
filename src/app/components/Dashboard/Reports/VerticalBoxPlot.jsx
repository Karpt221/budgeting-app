import styles from './Reports.module.css';  

const VerticalBoxPlot = ({ data }) => {  
  return (  
    <ul className={styles.boxPlot}>  
      {data.map((item, index) => (  
        <li key={index} className={styles.boxPlotItem}>  
          <div className={styles.spendingBreakdownBarChartSection}>  
            <span>{item.category_name}</span>  
            <span className="amount">  
              {item.amount} $  
            </span>  
          </div>  
          <div className={styles.spendingBreakdownBarChartSection + ' '+ styles.barSection}>  
            <div  
               className={styles.spendingBreakdownBarChartBar}
              style={{  
                width: item.percent + '%', 
                backgroundColor: item.color,
              }}  
            ></div>  
            {item.percent + '%'}  
          </div>  
        </li>  
      ))}  
    </ul>  
  );  
};  

export default VerticalBoxPlot;  