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

  let chartData = []; // Initialize with an empty array
    let startDate = '';
    let endDate = '';
    let userNames = []; // Array to hold user names
 

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
        fetchOpportunityValueByUserChartData(startDate, endDate); // Fetch data whenever the date changes
    });

    onMount(() => {
        getDatesFromLocalStorage();
        fetchOpportunityValueByUserChartData(startDate, endDate);
    });

    afterUpdate(() => {
        fetchOpportunityValueByUserChartData(startDate, endDate);
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);
    });
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
  async function fetchOpportunityValueByUserChartData(startDate, endDate) {
    // Use selectedStartDate and selectedEndDate in the API call
    const apiUrlOpportunity = `${API_BASE_URL}/data/opportunitymonthlyusermetrics?start=${startDate}&end=${endDate}&apiKey=${API_KEY}`;
    const responseOpportunity = await fetch(apiUrlOpportunity);
    const dataOpportunity = await responseOpportunity.json();

    // Extract user names dynamically from the data
    const users = Object.keys(dataOpportunity[0]).filter(key => key !== 'monthLabel');

    // Create a map to organize data by year and month
    const dataByYearMonth = new Map();
    dataOpportunity.forEach(item => {
      const monthYear = format(parse(item.monthLabel, 'MM/yyyy', new Date()), 'MMM yyyy');
      if (!dataByYearMonth.has(monthYear)) {
        dataByYearMonth.set(monthYear, { x: monthYear });
      }
      users.forEach(user => {
        if (!dataByYearMonth.get(monthYear).hasOwnProperty(user)) {
          dataByYearMonth.get(monthYear)[user] = 0;
        }
        dataByYearMonth.get(monthYear)[user] += item[user];
      });
    });

    // Sort the data and prepare it for the chart
    const sortedData = Array.from(dataByYearMonth.values()).sort((a, b) => {
      const dateA = parse(a.x, 'MMM yyyy', new Date());
      const dateB = parse(b.x, 'MMM yyyy', new Date());
      return dateA - dateB;
    });

    
  
    // Initialize variables for tracking the last year and storing the transformed data
    let lastYear = null;
    let transformedChartData = [];

    // Process the data and format the x values
    const chartDataOpportunity = users.map(userName => ({
        name: userName,
        data: sortedData.map(item => {
            const dateParts = item.x.split(' ');
            const monthAbbreviation = dateParts[0];
            const year = dateParts[1];

            // Append the year to the abbreviation only if it's different from the last year or the first data point
            const formattedDate = (lastYear !== year || transformedChartData.length === 0) ? `${monthAbbreviation} ${year}` : monthAbbreviation;

            if (lastYear !== year) {
                lastYear = year; // Reset lastYear to the current year if it changes
            }

            return {
                x: formattedDate,
                y: item[userName],
            };
        }),
    }));

    // Sort the data for the chart
    const sortedChartDataOpportunity = sortChartDataOpportunity(chartDataOpportunity);

    // Create and configure the chart
    const chartOpportunity = new Chart({
      primaryXAxis: {
        valueType: 'Category',
        majorGridLines: { width: 0 },
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
      tooltip: {
        enable: true,
        format: '${point.x}: ${point.y}',
      },
      width: '100%',
      height: '300px',
    });

    chartOpportunity.appendTo('#chart-container-opportunity');
  }




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
  h2 {
    font-weight: bold;
    font-size: large;
  }
</style>
<body>
<div class="chart-card">
  <h2>Opportunity Value by User</h2>
  <div id='chart-container-opportunity'></div>
</div>
</body>
