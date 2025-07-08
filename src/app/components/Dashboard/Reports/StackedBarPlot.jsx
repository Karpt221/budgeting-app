import {  
  VictoryChart,  
  VictoryStack,  
  VictoryBar,  
  VictoryTooltip,  
  VictoryAxis,  
  VictoryLabel,  
} from 'victory';  
import { useState } from 'react';  

function StackedBarPlot({ data }) {  
  const [hoveredBarPart, setHoveredBarPart] = useState(null);  

  const hasSingleBar = data.filter(monthData => monthData.categories.length > 0).length === 1;  

  const isEmptyData = data.length === 0;  

  return (  
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '85%' }}>
<VictoryChart standalone={false} responsive={false} width={800} height={500} domainPadding={{ x: 100 }}>  
      <VictoryAxis  
        style={{  
          tickLabels: { fontSize: 10 }, // Set the font size for the x-axis labels  
        }}  
        tickFormat={(t) => (isEmptyData ? '' : `${t}`)} // Hide x-axis labels if no data  
      />  
      <VictoryAxis  
        style={{  
          tickLabels: { fontSize: 10 }, 
        }}  
        dependentAxis  
        tickFormat={(y) => (isEmptyData ? '' : `${y} $`)}
      />  
      {isEmptyData ? (  
        // Render "No Data" message  
        <VictoryLabel  
          text="No Data"  
          x={400} // Center the text horizontally  
          y={200} // Center the text vertically  
          textAnchor="middle" // Center the text  
          style={{ fontSize: 18, fill: 'rgb(111, 100, 100)' }} // Style the text  
        />  
      ) : hasSingleBar ? (  
        // Render a single bar without stacking  
        data.map((monthData) => {  
          return monthData.categories.map((category) => (  
            <VictoryBar  
              key={`${monthData.month}-${category.name}`}  
              labelComponent={<VictoryTooltip />}  
              labels={({ datum }) =>  
                `${category.name}: $${category.amount} (${category.percent}%)`  
              }  
              data={[{ x: monthData.month, y: category.amount }]}  
              // Set a fixed width for the bar when there's only one  
              style={{  
                data: {  
                  fill: category.color,  
                  stroke:  
                    hoveredBarPart &&  
                    hoveredBarPart.x === monthData.month &&  
                    hoveredBarPart.name === category.name  
                      ? 'black'  
                      : 'transparent',  
                  strokeWidth:  
                    hoveredBarPart &&  
                    hoveredBarPart.x === monthData.month &&  
                    hoveredBarPart.name === category.name  
                      ? 5  
                      : 0,  
                },  
              }}  
              barWidth={100} // Adjust this value as needed  
            />  
          ));  
        })  
      ) : (  
        // Render stacked bars  
        <VictoryStack>  
          {data.map((monthData) => {  
            return monthData.categories.map((category) => (  
              <VictoryBar  
                key={`${monthData.month}-${category.name}`}  
                labelComponent={<VictoryTooltip />}  
                labels={({ datum }) =>  
                  `${category.name}: $${category.amount} (${category.percent}%)`  
                }  
                data={[{ x: monthData.month, y: category.amount }]}  
                style={{  
                  data: {  
                    fill: category.color,  
                    stroke:  
                      hoveredBarPart &&  
                      hoveredBarPart.x === monthData.month &&  
                      hoveredBarPart.name === category.name  
                        ? 'black'  
                        : 'transparent',  
                    strokeWidth:  
                      hoveredBarPart &&  
                      hoveredBarPart.x === monthData.month &&  
                      hoveredBarPart.name === category.name  
                        ? 5  
                        : 0,  
                  },  
                }}  
              />  
            ));  
          })}  
        </VictoryStack>  
      )}  
    </VictoryChart>  
    </svg>
    
  );  
}  

export default StackedBarPlot;