<script>
 import Card from './Card.svelte';
  import { onMount,afterUpdate } from 'svelte';
  import { dateStore } from './DateStore.js'; // Import the store
  const API_BASE_URL = 'https://api.recruitly.io/api/dashboard/sales';
    const API_KEY = 'TEST45684CB2A93F41FC40869DC739BD4D126D77';

 
   let data = null; 
   let startDate = "";
   let endDate = "";

   function getDatesFromLocalStorage() {
  const storedStartDate = localStorage.getItem('startDate');
  const storedEndDate = localStorage.getItem('endDate');

  if (storedStartDate && storedEndDate) {
    startDate = storedStartDate;
    endDate = storedEndDate;
    fetchData(startDate, endDate); // Fetch data when dates are loaded from local storage
  }
}

    // Subscribe to the dateStore
    dateStore.subscribe((value) => {
  startDate = value.startDate;
  endDate = value.endDate;
  fetchData(startDate, endDate); // Fetch data whenever the date changes
});


async function fetchData(startDate, endDate) {

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
    onMount(() => {
      getDatesFromLocalStorage(); // Try to get dates from local storage
      fetchData(startDate, endDate); // Fetch data on component mount
    });
  
    afterUpdate(() => {
    
      localStorage.setItem('startDate', startDate);
      localStorage.setItem('endDate', endDate);
    });
 </script>
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
<style>
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
    margin-top: 50px;
	}
  .card {
    flex: 1;
    max-width: 300px;
    margin: 5px; /* Adjust this margin to control spacing */
  }
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