<!-- DealLifeCycle.svelte -->

<script>
  import { onMount } from 'svelte';
  import { format, parse } from 'date-fns';
  import { Chart, ColumnSeries, SplineSeries } from '@syncfusion/ej2-charts';
  Chart.Inject(SplineSeries,ColumnSeries);

  let chartDataDays = [];
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



function sortChartDataByMonth(data) {
  return data.sort((a, b) => {
    const dateA = parse(a.monthLabel, 'MM/yyyy', new Date());
    const dateB = parse(b.monthLabel, 'MM/yyyy', new Date());
    return dateA - dateB;
  });
}

async function fetchOpportunityChartData() {
    // Use selectedStartDate and selectedEndDate in the API call
    const apiUrlDays = `${API_BASE_URL}/data/opportunitymonthlymetrics?start=${format(selectedStartDate, 'dd/MM/yyyy')}&end=${format(selectedEndDate, 'dd/MM/yyyy')}&apiKey=${API_KEY}`;
    const responseDays = await fetch(apiUrlDays);
    const dataDays = await responseDays.json();
    let currentYear = null;
    let yearChanged = false;

    const chartDataDays = sortChartDataByMonth(dataDays).map(item => {
        const monthDate = format(parse(item.monthLabel, 'MM/yyyy', new Date()), 'MMMM yyyy');
        const year = monthDate.split(' ')[1];

        if (currentYear !== year) {
            currentYear = year;
            yearChanged = true;
        } else {
            yearChanged = false;
        }

        return {
            x: yearChanged ? monthDate : monthDate.split(' ')[0], // Display full date only when the year changes
            opportunities: item.opportunities,
            days: item.days
        };
    });
      console.log(chartDataDays);
	  
	  const chartDays = new Chart({
		primaryXAxis: {
		  valueType: 'Category',
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
			dataSource: chartDataDays,
			xName: 'x',
			yName: 'opportunities',
			name: 'Opportunities',
			columnSpacing: 0.1,
		  },
		  {
			type: 'Spline',
			dataSource: chartDataDays,
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

<!-- HTML markup for the DealLifeCycle component -->
<div class="chart-card">
  <h2>Deal Lifecycle Days</h2>
  <div id='chart-container-days'></div>
</div>
