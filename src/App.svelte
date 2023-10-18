<script>
	import { onMount } from 'svelte';
  import { DateRangePicker } from '@syncfusion/ej2-calendars';
	import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries, BarSeries } from '@syncfusion/ej2-charts';
	import { Browser } from '@syncfusion/ej2-base';
	Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries,BarSeries);
	import Card from './Card.svelte';
	import { format, parse, compareAsc } from 'date-fns';

  
	  const API_BASE_URL = 'https://api.recruitly.io/api/dashboard/sales';
    const API_KEY = 'TEST45684CB2A93F41FC40869DC739BD4D126D77';

  let data = null;
  let daterangepicker;
  let selectedStartDate = null;
  let selectedEndDate = null;

  onMount(() => {
    const daterangepicker = new DateRangePicker({
      placeholder: "Select a range",
      change: (args) => {
        if (args.value && args.value.length === 2) {
          selectedStartDate = args.value[0];
          selectedEndDate = args.value[1];
          fetchData(); // Call your API function here
          fetchOpportunityChartData();
          fetchOpportunityValueByUserChartData();
          fetchOpportunityStateReasonsChartData();
        }
      }
    });
    daterangepicker.appendTo('#daterangepicker');
  });

  async function fetchData() {
    if (!selectedStartDate || !selectedEndDate) {
      return; // Handle the case when the date range is not selected
    }

    const startDate = format(selectedStartDate, 'MM/dd/yyyy');
    const endDate = format(selectedEndDate, 'MM/dd/yyyy');

    try {
      // Use startDate and endDate in your API calls
      const response = await fetch(
        `${API_BASE_URL}/metrics?start=${startDate}&end=${endDate}&apiKey=${API_KEY}`,
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
  }
console.log(data);

  function generateMonthNames(data) {
  return data.map(item => {
    const dateParts = item.monthLabel.split('/');
    const month = parseInt(dateParts[0]) - 1;
    const year = parseInt(dateParts[1]);
    const date = new Date(year, month, 1);
    return format(date, 'MMMM yyyy');
  });
}

function sortChartDataByMonth(data) {
  return data.sort((a, b) => {
    const dateA = parse(a.monthLabel, 'MM/yyyy', new Date());
    const dateB = parse(b.monthLabel, 'MM/yyyy', new Date());
    return dateA - dateB;
  });
}

async function fetchOpportunityChartData() {
    // Use selectedStartDate and selectedEndDate in the API call
    const apiUrlDays = `${API_BASE_URL}/data/opportunitymonthlymetrics?start=${format(selectedStartDate, 'MM/dd/yyyy')}&end=${format(selectedEndDate, 'MM/dd/yyyy')}&apiKey=${API_KEY}`;
    const responseDays = await fetch(apiUrlDays);
    const dataDays = await responseDays.json();
    const chartDataDays = sortChartDataByMonth(dataDays).map(item => ({
        x: format(parse(item.monthLabel, 'MM/yyyy', new Date()), 'MMMM yyyy'),
        opportunities: item.opportunities,
        days: item.days
     }));
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
  }
  function sortChartDataOpportunity(chartDataOpportunity) {
  return chartDataOpportunity.map(userData => ({
    name: userData.name,
    data: userData.data.sort((a, b) => {
      const dateA = parse(a.x, 'MM/yyyy', new Date());
      const dateB = parse(b.x, 'MM/yyyy', new Date());
      return dateA - dateB;
    }),
  }));
}
  async function fetchOpportunityValueByUserChartData() {
    // Use selectedStartDate and selectedEndDate in the API call
    const apiUrlOpportunity = `${API_BASE_URL}/data/opportunitymonthlyusermetrics?start=${format(selectedStartDate, 'MM/dd/yyyy')}&end=${format(selectedEndDate, 'MM/dd/yyyy')}&apiKey=${API_KEY}`;
    const responseOpportunity = await fetch(apiUrlOpportunity);
    const dataOpportunity = await responseOpportunity.json();
    const users = ['Andy Barnes', 'Bob Shaw', 'Gary Williams'];
	  const chartDataOpportunity = users.map(userName => ({
		name: userName,
		data: dataOpportunity.map(item => ({
			  x: format(parse(item.monthLabel, 'MM/yyyy', new Date()), 'MMMM yyyy'),
		  y: item[userName]
		}))
	  }));
	  const sortedChartDataOpportunity = sortChartDataOpportunity(chartDataOpportunity);

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
		series: sortedChartDataOpportunity.map(userData => ({
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
	};
  
  async function fetchOpportunityStateReasonsChartData() {
    // Use selectedStartDate and selectedEndDate in the API call
    const apiUrlStateReasons = `${API_BASE_URL}/data/opportunity/statereasons?start=${format(selectedStartDate, 'MM/dd/yyyy')}&end=${format(selectedEndDate, 'MM/dd/yyyy')}&apiKey=${API_KEY}`;
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

.center-container {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 60px;
    position: absolute;
    top: 0;
    right: 0;
  }

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
    margin-top: 100px;
	}
  
	.card {
    flex: 1; /* Set the flex property to distribute the cards evenly */
    max-width: 300px; /* Set the maximum width for the cards */
    margin: 5px;
  }

  </style>
  <div class="center-container">
    <div id="wrapper">
      <input id="daterangepicker" type="text" /><br/><br/>
    </div>
  </div>
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

	<div class="chart-card">
		<h2>Opportunity State Reasons</h2>
		<div id='chart-container-state-reasons'></div>
	</div>
  </body>