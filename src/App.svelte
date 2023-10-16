<script>
	import { onMount } from 'svelte';
	import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries } from '@syncfusion/ej2-charts';
	import { Browser } from '@syncfusion/ej2-base';
	Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries);
	import Card from './Card.svelte';
  
	const API_BASE_URL = 'https://api.recruitly.io/api/dashboard/sales/data';
    const API_KEY = 'TEST45684CB2A93F41FC40869DC739BD4D126D77';

  let data = null;

  onMount(async () => {
	try {
	  const response = await fetch(
		'https://api.recruitly.io/api/dashboard/sales/metrics?start=01%2F01%2F2023&end=11%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77',
		{
		  headers: {
			'Cookie': 'SESSION=NTkwN2VlOWQtZjRlNi00NmQ4LWE4MTUtOTJhNT71YjA0ZWMx',
		  },
		}
	  );
	  data = await response.json();
	} catch (error) {
	  console.error('Error fetching data:', error);
	}
  });
	onMount(async () => {
	  // Code for the "Deal Lifecycle Days" chart
	  const apiUrlDays = `${API_BASE_URL}/opportunitymonthlymetrics?start=01%2F01%2F2023&end=11%2F10%2F2023&apiKey=${API_KEY}`;
	  const responseDays = await fetch(apiUrlDays);
	  const dataDays = await responseDays.json();
	  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	  const chartDataDays = dataDays.map(item => ({
		x: monthNames[parseInt(item.monthLabel.split('/')[0]) - 1],
		opportunities: item.opportunities,
		days: item.days
	  }));
	      // Sort the chart data by month order
		  chartDataDays.sort((a, b) => monthNames.indexOf(a.x) - monthNames.indexOf(b.x));
      console.log(chartDataDays);
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
			type: 'Spline',
			dataSource: chartDataDays,
			xName: 'x',
			yName: 'days',
			name: 'Avg Days to Deal',
			yAxisName: 'rightYAxis',
			marker: {
			  visible: true,
			  height: 10,
			  width: 10,
			},
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
	  const apiUrlOpportunity = `${API_BASE_URL}/opportunitymonthlyusermetrics?start=01%2F10%2F2022&end=01%2F10%2F2023&apiKey=${API_KEY}`;
	  const responseOpportunity = await fetch(apiUrlOpportunity);
	  const dataOpportunity = await responseOpportunity.json();
  
	  const users = ['Andy Barnes', 'Bob Shaw', 'Gary Williams'];
  
	  const chartDataOpportunity = users.map(userName => ({
		name: userName,
		data: dataOpportunity.map(item => ({
			x: monthNames[parseInt(item.monthLabel.split('/')[0]) - 1], 
		  y: item[userName]
		}))
	  }));
        // Sort the chart data by month order
		  chartDataOpportunity.sort((a, b) => monthNames.indexOf(a.x) - monthNames.indexOf(b.x));
     console.log(chartDataOpportunity);
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

	main {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: center;
	}
  
	.card {
	  width: 200px; /* Set the width to the desired size */
	  height: 200px; /* Set the height to the desired size */
	  margin: 10px; /* Add some margin between cards if needed */
	}
  </style>
  
  <body>
	<main>
	{#if data}
	  <div class="card">
		<Card title="Leads Converted" value={data.leadsConverted} icon="fal fa-lg fa-check-square" />
	  </div>
	  <div class="card">
		<Card title="Opportunities" value={data.opportunityCountOpen} icon="fal fa-lg fa-fire" />
	  </div>
	  <div class="card">
		<Card title="Won from {data.opportunityCountWon} deals" value=" GBP {data.opportunityValueWon}"icon="fas fa-dollar-sign" />
	  </div>
	  <div class="card">
		<Card title="Avg. Deal Cycle" value={data.avgDealCycleDays} icon="fal fa-lg fa-stopwatch" />
	  </div>
	  <div class="card">
		<Card title="Avg.Deal Value" value="GBP{data.avgDealValue}" icon="fas fa-dollar-sign"/>
	  </div>
	  <div class="card">
		<Card title="Leads/Opportunity" value={data.leadsPerOpportunity} icon="fal fa-lg fa-crosshairs" />
	  </div>
	  <!-- Add more cards for other data points as needed -->
	{:else}
	  <p>Loading data...</p>
	{/if}
  </main>
	<div class="chart-card">
	  <h2>Deal Lifecycle Days</h2>
	  <div id='chart-container-days'></div>
	</div>
  
	<div class="chart-card">
	  <h2>Opportunity Value by User</h2>
	  <div id='chart-container-opportunity'></div>
	</div>
  </body>
  