<script>
  import Calendar from './DateRangePicker.svelte';
  import MetricsCard from './MetricsCard.svelte';
  import DealLifeCycleDays from './DealLifeCycleDays.svelte';
  import OppurtunityValue from './OppurtunityValue.svelte';
  import StateReasons from './StateReasons.svelte';

  export let appData;
  </script>

  <body>
   <Calendar/>
  <MetricsCard/>
  <DealLifeCycleDays/>
  <OppurtunityValue/>
  <StateReasons/>
  </body>
  