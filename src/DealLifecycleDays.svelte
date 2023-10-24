<script>
  import { onMount } from 'svelte';
import { DateRangePicker } from '@syncfusion/ej2-calendars';
import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries, BarSeries, DateTime } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';
Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries,BarSeries, DateTime);
import Card from './Card.svelte';
import { format, parse, compareAsc } from 'date-fns';

const API_BASE_URL = 'https://api.recruitly.io/api/dashboard/sales';
    const API_KEY = 'TEST45684CB2A93F41FC40869DC739BD4D126D77';
    let selectedStartDate = new Date(); // Today's date
  let selectedEndDate = new Date(); // Today's date

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
       
        fetchOpportunityChartData();
        
      }
    },
  });

  daterangepicker.appendTo('#daterangepicker');

  // Call data-fetching functions with the selected date range

  await fetchOpportunityChartData();
 
});


async function fetchOpportunityChartData() {
    // Use selectedStartDate and selectedEndDate in the API call
    const apiUrlDays = `${API_BASE_URL}/data/opportunitymonthlymetrics?start=${format(selectedStartDate, 'dd/MM/yyyy')}&end=${format(selectedEndDate, 'dd/MM/yyyy')}&apiKey=${API_KEY}`;
    const responseDays = await fetch(apiUrlDays);
    const dataDays = await responseDays.json();


    const data = dataDays.map(item => {
  const month = parseInt(item.monthLabel.split('/')[0]) - 1;
  const year = parseInt(item.monthLabel.split('/')[1]);
  const monthLabel = new Date(year, month, 1);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short'
  }).format(monthLabel);

  return {
    x: formattedDate, // Format as "Jan 2023" (month name and year)
    opportunities: item.opportunities,
    days: item.days
  };
});

// Sort the data by the 'x' property (which represents formatted month and year)
data.sort((a, b) => {
  const dateA = new Date('01 ' + a.x);
  const dateB = new Date('01 ' + b.x);
  return dateA - dateB;
});


      console.log(data);
	  
	  const chartDays = new Chart({
		primaryXAxis: {
		  valueType: 'DateTime',
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
			dataSource: data,
			xName: 'x',
			yName: 'opportunities',
			name: 'Opportunities',
			columnSpacing: 0.1,
		  },
		  {
			type: 'Spline',
			dataSource: data,
			xName: 'x',
			yName: 'days',
			name: 'Avg Days to Deal',
			yAxisName: 'rightYAxis',
      fill: 'blue',
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
		tooltip: {
       enable: true, 
      format: '${point.x}: ${point.y}' },
		width: '100%',
		height: '300px'
	  });
  
	  chartDays.appendTo('#chart-container-days');
  }
</script>


<div class="chart-card">
  <h2>Deal Lifecycle Days</h2>
  <div id='chart-container-days'></div>
</div>
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