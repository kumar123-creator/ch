<script>
  import { onMount, afterUpdate } from 'svelte';
  import { dateStore } from './DateStore.js'; // Import the store
import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries, BarSeries, DateTime } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';
Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries,BarSeries, DateTime);
import Card from './MetricsCard.svelte';
import { format, parse, compareAsc } from 'date-fns';

const API_BASE_URL = 'https://api.recruitly.io/api/dashboard/sales';
  const API_KEY = 'TEST45684CB2A93F41FC40869DC739BD4D126D77';

  let chartData = [];
  let chart = null; // Initialize chart with null
  

  let startDate = '';
  let endDate = '';

  // Function to check if local storage has date information
  function getDatesFromLocalStorage() {
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');

    if (storedStartDate && storedEndDate) {
      startDate = storedStartDate;
      endDate = storedEndDate;
    }
  }

  // Subscribe to the dateStore
  dateStore.subscribe((value) => {
    startDate = value.startDate;
    endDate = value.endDate;
    fetchOpportunityStateReasonsChartData(startDate, endDate); // Fetch data whenever the date changes
  });

  onMount(() => {
    getDatesFromLocalStorage(); // Try to get dates from local storage
    fetchOpportunityStateReasonsChartData(startDate, endDate); // Fetch data on component mount
  });

  afterUpdate(() => {
    fetchOpportunityStateReasonsChartData(startDate, endDate); // Fetch data after updates
    // Store the dates in local storage for future use
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
  });
async function fetchOpportunityStateReasonsChartData(startDate, endDate) {
  // Use selectedStartDate and selectedEndDate in the API call
  const apiUrlStateReasons = `${API_BASE_URL}/data/opportunity/statereasons?start=${startDate}&end=${endDate}&apiKey=${API_KEY}`;
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
  h2 {
    font-weight: bold;
    font-size: large;
  }
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
    margin: 10px; /* Add margin to create space between the charts */
  }

	main {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: center;
    margin-top: 100px;
	}
  
  .card {
    flex: 1;
    max-width: 300px;
    margin: 5px;
  }

  /* Tooltip container style */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltiptext {
    visibility: hidden;
    width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position the tooltip above the card */
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
  
 
</style>
<body>
<div class="chart-card">
  <h2>Opportunity State Reasons</h2>
  <div id='chart-container-state-reasons'></div>
</div>
</body>
