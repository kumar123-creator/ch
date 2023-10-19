<script>
	import { onMount } from 'svelte';
	import { Chart, BarSeries, Category, Legend, Tooltip } from '@syncfusion/ej2-charts';
	import { Browser } from '@syncfusion/ej2-base';
	Chart.Inject(BarSeries, Category, Legend, Tooltip);
	

	let selectedStartDate = new Date(); // Today's date
  let selectedEndDate = new Date(); // Today's date

  // Calculate the start date (one year before today)
  selectedStartDate.setFullYear(selectedStartDate.getFullYear() - 1);

  onMount(async () => {
  // Check if a date range is stored in local storage
  const storedStartDate = localStorage.getItem('selectedStartDate');
  const storedEndDate = localStorage.getItem('selectedEndDate');

  if (storedStartDate && storedEndDate) {
    selectedStartDate = new Date(storedStartDate);
    selectedEndDate = new Date(storedEndDate);
  } else {
    // If no date range is found in local storage, use the default date range
    selectedStartDate = new Date();
    selectedEndDate = new Date();
    selectedStartDate.setFullYear(selectedStartDate.getFullYear() - 1);
  }

  const daterangepicker = new DateRangePicker({
    placeholder: 'Select a range',
    start: 'Year', 
        depth: 'Year', 
        format: 'MMM yyyy',
    value: [selectedStartDate, selectedEndDate],
    change: (args) => {
      if (args.value && args.value.length === 2) {
        selectedStartDate = args.value[0];
        selectedEndDate = args.value[1];
        localStorage.setItem('selectedStartDate', selectedStartDate);
        localStorage.setItem('selectedEndDate', selectedEndDate);
        fetchData();
        fetchOpportunityChartData();
        fetchOpportunityValueByUserChartData();
        fetchOpportunityStateReasonsChartData();
      }
    },
  });

  daterangepicker.appendTo('#daterangepicker');

  // Call data-fetching functions with the selected date range
  await fetchData();
  await fetchOpportunityChartData();
  await fetchOpportunityValueByUserChartData();
  await fetchOpportunityStateReasonsChartData();
});

	async function fetchOpportunityStateReasonsChartData() {
    // Use selectedStartDate and selectedEndDate in the API call
    const apiUrlStateReasons = `${API_BASE_URL}/data/opportunity/statereasons?start=${format(selectedStartDate, 'dd/MM/yyyy')}&end=${format(selectedEndDate, 'dd/MM/yyyy')}&apiKey=${API_KEY}`;
    const responseStateReasons = await fetch(apiUrlStateReasons);
    const dataStateReasons = await responseStateReasons.json();
    // Process the API response data for the Opportunity State Reasons chart
		const chartDataStateReasons = dataStateReasons.map(item => ({
			x: item.stateReason,
			y: item.count
		}));
    console.log(chartDataStateReasons);
		const chartStateReasons = new Chart({
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
					dataSource: chartDataStateReasons,
					xName: 'x',
					width: 2,
					yName: 'y',
					name: 'Count',
					columnSpacing: 0.1,
				},
			],
		});

		chartStateReasons.appendTo('#chart-container-state-reasons');
	};
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
