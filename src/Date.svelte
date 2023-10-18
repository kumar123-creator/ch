<script>
    import { onMount } from 'svelte';
    import { DateRangePicker } from '@syncfusion/ej2-calendars';
  
    let daterangepicker;
  
    onMount(() => {
      daterangepicker = new DateRangePicker({
        placeholder: "Select a range",
      });
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