import { useState } from 'react';
import { VictoryPie, VictoryTheme } from 'victory';
import styles from './Reports.module.css';

const DonutChart = ({ data, totalSpendings = 0 }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Function to create a light shade of a color
  const lightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const blendWithWhite = (channel) =>
      Math.min(255, Math.floor(channel + (255 - channel) * 0.7));

    return `rgb(${blendWithWhite(r)}, ${blendWithWhite(g)}, ${blendWithWhite(b)})`;
  };

  // Default data to show a single 100% grey slice if data is falsy
  const chartData = data?.length
    ? data
    : [{ x: 'No Data', y: 100, color: '#d3d3d3' }];

  return (
    <svg viewBox="0 0 400 400">
      <VictoryPie
        standalone={false}
        width={400}
        height={400}
        data={chartData}
        innerRadius={80}
        labelRadius={150}
        theme={VictoryTheme.clean}
        radius={({ datum }) =>
          hoveredSlice && hoveredSlice.category_name === datum.category_name
            ? 140
            : 130
        } // Increase radius on hover
        events={[
          {
            target: 'data',
            eventHandlers: {
              onMouseOver: (event, props) => {
                setHoveredSlice(props.datum); // Set the hovered slice datum
                return [{ mutation: () => ({ active: true }) }];
              },
              onMouseOut: () => {
                setHoveredSlice(null); // Reset on mouse out
                return [{ mutation: () => ({ active: false }) }];
              },
            },
          },
        ]}
        style={{
          data: {
            fill: ({ datum }) =>
              hoveredSlice === null ||
              hoveredSlice.category_name === datum.category_name
                ? datum.color // Use original color if no slice is hovered or slice is hovered
                : lightColor(datum.color), // Otherwise, use dull color
            stroke: '#fff',
            strokeWidth: 3,
          },
        }}
      />
      <foreignObject x="150" y="150" width="100" height="100">
        <div
          className={styles.spendingBreakdownContentChartHeaderSpendingWrapper}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {/* "spendingsByCategories": [
        {
            "x": "Category 2\n87878 $\n99%",
            "y": "99",
            "color": "#f950ae",
            "category_name": "Category 2",
            "amount": "87878",
            "percent": "99"
        },
        
    ], */}
          <span
            className={styles.spendingBreakdownContentLabel}
            style={{ fontSize: '10px', textAlign: 'center' }}
          >
            {hoveredSlice ? hoveredSlice.category_name : 'Total Spending'}
          </span>
          <span
            className={styles.spendingBreakdownContentSpendingNum}
            style={{
              fontSize: '18px',
              textAlign: 'center',
            }}
          >
            {hoveredSlice
              ? hoveredSlice.amount
              : totalSpendings
                ? totalSpendings
                : 0}
            $
          </span>
          {hoveredSlice && (
            <span
              className={styles.spendingBreakdownContentLabel}
              style={{ fontSize: '10px', textAlign: 'center' }}
            >
              {hoveredSlice.percent} %
            </span>
          )}
        </div>
      </foreignObject>
    </svg>
  );
};

export default DonutChart;
