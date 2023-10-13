<script>
    import { onMount } from 'svelte';
    import { Chart, ColumnSeries, LineSeries, Category, Legend, Tooltip } from '@syncfusion/ej2-charts';
    import { Browser } from '@syncfusion/ej2-base';
    Chart.Inject(ColumnSeries, LineSeries, Category, Legend, Tooltip);

    let opportunityData = [];
    let daysData = [];

    onMount(async () => {
        // Fetch data for Opportunity Chart
        const opportunityApiUrl = 'https://api.recruitly.io/api/dashboard/sales/data/opportunitymonthlyusermetrics?start=01%2F10%2F2022&end=01%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77';
        const opportunityResponse = await fetch(opportunityApiUrl);
        opportunityData = await opportunityResponse.json();
        const opportunityChartData = opportunityData.map(item => ({
            x: item.monthLabel,
            y: item['Andy Barnes'] + item['Bob Shaw'] + item['Gary Williams']
        }));

        // Fetch data for Days Chart
        const daysApiUrl = 'https://api.recruitly.io/api/dashboard/sales/data/opportunitymonthlymetrics?start=01%2F01%2F2023&end=11%2F10%2F2023&apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77';
        const daysResponse = await fetch(daysApiUrl);
        daysData = await daysResponse.json();
        const daysChartData = daysData.map(item => ({
            x: item.monthLabel,
            opportunities: item.opportunities,
            days: item.days
        }));

        // Create Opportunity Chart
        const opportunityChart = new Chart({
            primaryXAxis: {
                valueType: 'Category',
                majorGridLines: { width: 0 }
            },
            primaryYAxis: {
                labelFormat: '{value}',
                title: 'Opportunity Value',
                edgeLabelPlacement: 'Shift',
                majorTickLines: { width: 0 },
                lineStyle: { width: 0 },
            },
            series: [
                {
                    type: 'Column',
                    dataSource: opportunityChartData,
                    xName: 'x',
                    width: 2,
                    yName: 'y',
                    name: 'Opportunity Value',
                    columnSpacing: 0.1,
                }
            ],
            legendSettings: {
                visible: true,
            },
            tooltip: { enable: true, format: '${point.x}: ${point.y}' },
            width: '100%',
            height: '300px'
        });

        opportunityChart.appendTo('#opportunity-chart-container');

        // Create Days Chart
        const daysChart = new Chart({
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
                    dataSource: daysChartData,
                    xName: 'x',
                    yName: 'opportunities',
                    name: 'Opportunities',
                    columnSpacing: 0.1,
                },
                {
                    type: 'Line',
                    dataSource: daysChartData,
                    xName: 'x',
                    yName: 'days',
                    name: 'Days',
                    yAxisName: 'rightYAxis',
                    marker: {
                        visible: true,
                        height: 10,
                        width: 10,
                    }
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
            tooltip: { enable: true, format: '${point.x}: ${point.y}' },
            width: '100%',
            height: '300px'
        });

        daysChart.appendTo('#days-chart-container');
    });
</script>

<style>
    .chart-card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }
</style>

<body>
	<div class="chart-card">
        <h2>Deal Lifecycle Days</h2>
        <div id='days-chart-container'></div>
    </div>
    <div class="chart-card">
        <h2>Opportunity Value by User</h2>
        <div id='opportunity-chart-container'></div>
    </div>
</body>
