<script>
    import { onMount } from 'svelte';
    import { Chart, ColumnSeries, Category, Legend, Tooltip } from '@syncfusion/ej2-charts';
    import { Browser } from '@syncfusion/ej2-base';
    Chart.Inject(ColumnSeries, Category, Legend, Tooltip);
  
    onMount(async () => {
      // Make an HTTP request to fetch data from the API
      const apiUrl = 'https://api.recruitly.io/api/dashboard/sales/data/opportunitymonthlyusermetrics?start=01%2F10%2F2022&end=01%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77';
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      // Define an array to store user names for the horizontal axis
      const users = ['Andy Barnes', 'Bob Shaw', 'Gary Williams'];
  
      // Process the API response data to format it for the chart
      const chartData = users.map(userName => ({
        name: userName,
        data: data.map(item => ({
          x: item.monthLabel,
          y: item[userName]
        }))
      }));
      console.log(chartData);
      const chart = new Chart({
        primaryXAxis: {
          valueType: 'Category',
          majorGridLines: { width: 0 }
        },
        primaryYAxis: {
          labelFormat: '{value}',
          title: 'Opportunity Value',
          edgeLabelPlacement: 'Shift',
          majorTickLines: { width: 0 },
          lineStyle: { width: 0 },
        },
        series: chartData.map(userData => ({
          type: 'Column',
          dataSource: userData.data,
          xName: 'x',
          width: 2,
          yName: 'y',
          name: userData.name,
          columnSpacing: 0.1,
        })),
        legendSettings: {
          visible: true,
        },
        // Add tooltip settings
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
      <h2>Opportunity Value by User</h2>
      <div id='chart-container'></div> <!-- Place the chart inside the card container -->
    </div>
  </body>
  