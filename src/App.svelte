<script>
	import { onMount } from 'svelte';
  import { DateRangePicker } from '@syncfusion/ej2-calendars';
	import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries, BarSeries, DateTime } from '@syncfusion/ej2-charts';
	import { Browser } from '@syncfusion/ej2-base';
	Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip, SplineSeries,BarSeries, DateTime);
	import Card from './Card.svelte';
	import { format, parse, compareAsc } from 'date-fns';
  import DealLifeCycleDays from './DealLifeCycleDays.svelte';
  import OppurtunityValue from './OppurtunityValue.svelte';
  import StateReasons from './StateReasons.svelte';

  
	  const API_BASE_URL = 'https://api.recruitly.io/api/dashboard/sales';
    const API_KEY = 'TEST45684CB2A93F41FC40869DC739BD4D126D77';

  let data = null;
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
      }
    },
  });

  daterangepicker.appendTo('#daterangepicker');

  // Call data-fetching functions with the selected date range
  await fetchData();
});


  async function fetchData() {
    if (!selectedStartDate || !selectedEndDate) {
      return; // Handle the case when the date range is not selected
    }

    const startDate = format(selectedStartDate, 'dd/MM/yyyy');
    const endDate = format(selectedEndDate, 'dd/MM/yyyy');

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
    margin: 5px; /* Adjust this margin to control spacing */
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
  
  <div class="center-container">
    <div id="wrapper">
      <input id="daterangepicker" type="text" /><br/><br/>
    </div>
  </div>
  <body>
    <main>
      {#if data}
        <div class="card tooltip">
          <Card title="Leads Converted" value={data.leadsConverted} icon="fal fa-lg fa-check-square" />
          <span class="tooltiptext">Leads Converted</span>
        </div>
  
        <div class="card tooltip">
          <Card title="Opportunities" value={data.opportunityCountOpen} icon="fal fa-lg fa-fire" />
          <span class="tooltiptext">Opportunities</span>
        </div>
  
        <div class="card tooltip">
          <Card title={`Won from ${data.opportunityCountWon} deals`} value={`GBP ${data.opportunityValueWon}`} icon="fas fa-dollar-sign" />
          <span class="tooltiptext">Oppurtunity Deal Value</span>
        </div>
  
        <div class="card tooltip">
          <Card title="Avg. Deal Cycle" value={data.avgDealCycleDays} icon="fal fa-lg fa-stopwatch" />
          <span class="tooltiptext">Avg. Deal Cycle Days</span>
        </div>
  
        <div class="card tooltip">
          <Card title="Avg. Deal Value" value={`GBP ${data.avgDealValue}`} icon="fas fa-dollar-sign" />
          <span class="tooltiptext">Avg. Deal Value</span>
        </div>
  
        <div class="card tooltip">
          <Card title="Leads/Opportunity" value={data.leadsPerOpportunity} icon="fal fa-lg fa-crosshairs" />
          <span class="tooltiptext">Avg.Leads Per Opportunity</span>
        </div>
      {:else}
        <p>Loading data...</p>
      {/if}
    </main>
  <DealLifeCycleDays/>
  <OppurtunityValue/>
  <StateReasons/>
  </body>