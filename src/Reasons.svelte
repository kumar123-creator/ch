<script>
	import { onMount } from 'svelte';
	import { Chart, BarSeries, Category, Legend, Tooltip } from '@syncfusion/ej2-charts';
	import { Browser } from '@syncfusion/ej2-base';
	Chart.Inject(BarSeries, Category, Legend, Tooltip);
	
	onMount(async () => {
		// Fetch data from the API and update the chartData
		const apiUrl = 'https://api.recruitly.io/api/dashboard/sales/data/opportunity/statereasons?start=01%2F01%2F2023&end=17%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77';
		const response = await fetch(apiUrl);
		const data = await response.json();
		
		// Process the API response data to format it for the chart
		const chartData = data.map(item => ({
			x: item.stateReason,
			y: item.count
		}));
		console.log(chartData);
		
		const chart = new Chart({
			primaryXAxis: {
				valueType: 'Category',
				majorGridLines: { width: 0 }
			},
			primaryYAxis: {
				labelFormat: '{value}',
				edgeLabelPlacement: 'Shift',
				majorTickLines: { width: 0 },
				lineStyle: { width: 0 },
			},
			series: [
				{
					type: 'Bar',
					dataSource: chartData,
					xName: 'x',
					width: 2,
					yName: 'y',
					name: 'Count',
					columnSpacing: 0.1,
				},
			],
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
		<h2>Opportunity State Reasons</h2>
		<div id='chart-container'></div>
	</div>
</body>
