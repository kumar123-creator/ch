<script>
	import { onMount } from 'svelte';
	import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip } from '@syncfusion/ej2-charts';
	import { Browser } from '@syncfusion/ej2-base';
	Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip);
  
	onMount(async () => {
	  // Code for the "Deal Lifecycle Days" chart
	  const apiUrlDays = 'https://api.recruitly.io/api/dashboard/sales/data/opportunitymonthlymetrics?start=01%2F01%2F2023&end=11%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77';
	  const responseDays = await fetch(apiUrlDays);
	  const dataDays = await responseDays.json();
  
	  const chartDataDays = dataDays.map(item => ({
		x: item.monthLabel,
		opportunities: item.opportunities,
		days: item.days
	  }));
  
	  const chartDays = new Chart({
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
			dataSource: chartDataDays,
			xName: 'x',
			yName: 'opportunities',
			name: 'Opportunities',
			columnSpacing: 0.1,
		  },
		  {
			type: 'Line',
			dataSource: chartDataDays,
			xName: 'x',
			yName: 'days',
			name: 'Days',
			yAxisName: 'rightYAxis',
			marker: {
			  visible: true,
			  height: 10,
			  width: 10,
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
  
	  chartDays.appendTo('#chart-container-days');
  
	  // Code for the "Opportunity Value by User" chart
	  const apiUrlOpportunity = 'https://api.recruitly.io/api/dashboard/sales/data/opportunitymonthlyusermetrics?start=01%2F10%2F2022&end=01%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77';
	  const responseOpportunity = await fetch(apiUrlOpportunity);
	  const dataOpportunity = await responseOpportunity.json();
  
	  const users = ['Andy Barnes', 'Bob Shaw', 'Gary Williams'];
  
	  const chartDataOpportunity = users.map(userName => ({
		name: userName,
		data: dataOpportunity.map(item => ({
		  x: item.monthLabel,
		  y: item[userName]
		}))
	  }));
  
	  const chartOpportunity = new Chart({
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
		series: chartDataOpportunity.map(userData => ({
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
		tooltip: { enable: true, format: '${point.x}: ${point.y}' },
		width: '100%',
		height: '300px'
	  });
  
	  chartOpportunity.appendTo('#chart-container-opportunity');
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
	  <div id='chart-container-days'></div>
	</div>
  
	<div class="chart-card">
	  <h2>Opportunity Value by User</h2>
	  <div id='chart-container-opportunity'></div>
	</div>
  </body>
  