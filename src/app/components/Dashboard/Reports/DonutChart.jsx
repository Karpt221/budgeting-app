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
        innerRadius={70}
        labelRadius={120}
        labels={({ datum }) => (datum.y >= 7 ? datum.x : null)}
        theme={VictoryTheme.clean}
        radius={({ datum }) =>
          hoveredSlice && hoveredSlice.category_name === datum.category_name
            ? 115
            : 110
        }
        events={[
          {
            target: 'data',
            eventHandlers: {
              onMouseOver: (event, props) => {
                setHoveredSlice(props.datum);
                return [{ mutation: () => ({ active: true }) }];
              },
              onMouseOut: () => {
                setHoveredSlice(null);
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
                ? datum.color
                : lightColor(datum.color),
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
          <span
            className={styles.spendingBreakdownContentLabel}
            style={{ fontSize: '10px', textAlign: 'center' }}
          >
            {data?.length && hoveredSlice
              ? hoveredSlice.category_name
              : 'Total Spending'}
          </span>
          <span
            className={styles.spendingBreakdownContentSpendingNum}
            style={{
              fontSize: '18px',
              textAlign: 'center',
            }}
          >
            {data?.length && hoveredSlice
              ? hoveredSlice.amount
              : totalSpendings
                ? totalSpendings
                : 0}
            $
          </span>
          {data?.length && hoveredSlice ? (
            <span
              className={styles.spendingBreakdownContentLabel}
              style={{ fontSize: '10px', textAlign: 'center' }}
            >
              {hoveredSlice.percent} %
            </span>
          ) : (
            ''
          )}
        </div>
      </foreignObject>
    </svg>
  );
};

export default DonutChart;
