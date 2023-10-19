<!-- DateRangePicker.svelte -->
<script>
  import { onMount } from 'svelte';
  import { DateRangePicker } from '@syncfusion/ej2-calendars';

  let selectedStartDate = new Date();
  let selectedEndDate = new Date();
  let daterangepicker;

  // Initialize the date range
  selectedStartDate.setFullYear(selectedStartDate.getFullYear() - 1);

  onMount(async () => {
    // Check if a date range is stored in local storage
    const storedStartDate = localStorage.getItem('selectedStartDate');
    const storedEndDate = localStorage.getItem('selectedEndDate');

    if (storedStartDate && storedEndDate) {
      selectedStartDate = new Date(storedStartDate);
      selectedEndDate = new Date(storedEndDate);
    }

    // Initialize the DateRangePicker
    daterangepicker = new DateRangePicker({
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
          // You can add additional logic here if needed
        }
      },
    });

    // Append the DateRangePicker to the element with id 'daterangepicker'
    daterangepicker.appendTo('#daterangepicker');
  });
</script>
  
  <style>
    .center-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  </style>
  
  <div class="center-container">
    <div id="wrapper">
      <input id="daterangepicker" type="text" /><br/><br/>
    </div>
  </div>