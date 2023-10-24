<script>
  import { onMount,afterUpdate } from 'svelte';
  import { dateStore } from './DateStore.js'; // Import the store
  import Calendar from './DateRangePicker.svelte';
  import MetricsCard from './MetricsCard.svelte';
  import DealLifeCycleDays from './DealLifeCycleDays.svelte';
  import OppurtunityValue from './OppurtunityValue.svelte';
  import StateReasons from './StateReasons.svelte';
  

  </script>

  <body>
   <Calendar/>
  <MetricsCard/>
  <DealLifeCycleDays/>
  <OppurtunityValue/>
  <StateReasons/>
  </body>
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