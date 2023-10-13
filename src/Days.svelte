<script>
    import { onMount } from 'svelte';
    import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip } from '@syncfusion/ej2-charts';
    import { Browser } from '@syncfusion/ej2-base';
    Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip);
  
    onMount(async () => {
      const apiUrl = 'https://api.recruitly.io/api/dashboard/sales/data/opportunitymonthlymetrics?start=01%2F01%2F2023&end=11%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77';
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      const chartData = data.map(item => ({
        x: item.monthLabel,
        opportunities: item.opportunities,
        days: item.days
      }));
  
      const chart = new Chart({
        primaryXAxis: {
          valueType: 'Category',
          majorGridLines: { width: 0 }
        },
        primaryYAxis: {
          labelFormat: '{value}',
          title: 'Opportunities',
          edgeLabelPlacement: 'Shift',
          majorTickLines: { width: 0 },
          lineStyle: { width: 0 },
          majorGridLines: { width: 1 },
        },
        series: [
          {
            type: 'Column',
            dataSource: chartData,
            xName: 'x',
            yName: 'opportunities',
            name: 'Opportunities',
            columnSpacing: 0.1,
          },
          {
            type: 'Line',
            dataSource: chartData,
            xName: 'x',
            yName: 'days',
            name: 'Days',
            yAxisName: 'rightYAxis',
            marker: {
              visible: true,
              height: 10, // Adjust the height to make the markers bigger
              width: 10, // Adjust the width to make the markers bigger
            }
          }
        ],
        axes: [
          {
            name: 'rightYAxis',
            opposedPosition: true,
            title: 'Total Time to Deal Days',
            majorGridLines: { width: 1 },
          },
        ],
        legendSettings: {
          visible: true,
        },
        tooltip: { enable: true, format: '${point.x}: ${point.y}' },
        width: '100%',
        height: '300px'
      });
  
      chart.appendTo('#chart-container');
    });
  </script>
  
  
  <style>
	.chart-card {
	  border: 1px solid #ccc;
	  border-radius: 8px;
	  padding: 16px;
	  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
  </style>
  
  <body>
	<div class="chart-card">
	  <h2>Deal Lifecycle Days</h2>
	  <div id='chart-container'></div> <!-- Place the chart inside the card container -->
	</div>
  </body>
  