<script>
    import { onMount } from 'svelte';
    import { Chart, ColumnSeries, Category, Legend, Tooltip } from '@syncfusion/ej2-charts';
    import { Browser } from '@syncfusion/ej2-base';
    Chart.Inject(ColumnSeries, Category, Legend, Tooltip);
  
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
        fetchOpportunityChartData();
        fetchOpportunityValueByUserChartData();
        fetchOpportunityStateReasonsChartData();
      }
    },
  });

  daterangepicker.appendTo('#daterangepicker');

  // Call data-fetching functions with the selected date range
  await fetchData();
  await fetchOpportunityChartData();
  await fetchOpportunityValueByUserChartData();
  await fetchOpportunityStateReasonsChartData();
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
async function fetchOpportunityValueByUserChartData() {
  // Use selectedStartDate and selectedEndDate in the API call
  const apiUrlOpportunity = `${API_BASE_URL}/data/opportunitymonthlyusermetrics?start=${format(selectedStartDate, 'dd/MM/yyyy')}&end=${format(selectedEndDate, 'dd/MM/yyyy')}&apiKey=${API_KEY}`;
  const responseOpportunity = await fetch(apiUrlOpportunity);
  const dataOpportunity = await responseOpportunity.json();
  const users = ['Andy Barnes', 'Bob Shaw', 'Gary Williams'];

  // Create a map to organize data by year and month
  const dataByYearMonth = new Map();
  dataOpportunity.forEach(item => {
    const monthYear = format(parse(item.monthLabel, 'MM/yyyy', new Date()), 'MMMM yyyy');
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

  const sortedData = Array.from(dataByYearMonth.values()).sort((a, b) => {
    const dateA = parse(a.x, 'MMMM yyyy', new Date());
    const dateB = parse(b.x, 'MMMM yyyy', new Date());
    return dateA - dateB;
  });

  const chartDataOpportunity = users.map(userName => ({
    name: userName,
    data: sortedData.map(item => ({
      x: item.x,
      y: item[userName],
    })),
  }));

  const sortedChartDataOpportunity = sortChartDataOpportunity(chartDataOpportunity);

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
    .chart-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  </style>
  
  <body>
    <div class="chart-card">
      <h2>Opportunity Value by User</h2>
      <div id='chart-container'></div> <!-- Place the chart inside the card container -->
    </div>
  </body>
  