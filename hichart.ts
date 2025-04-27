import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  Highcharts: typeof Highcharts = Highcharts; // <-- important
  chartOptions: Highcharts.Options = {}; // <-- your chart options

  ngOnInit() {
    // Your backend data
    const backendData = [
      { assetNumber: 'SPF74312A0146', eventType: 'Clean', yAxisValue: 85 },
      { assetNumber: 'SPF74312A0390', eventType: 'Dirty', yAxisValue: 65 },
      { assetNumber: 'SPF74312A0255', eventType: 'Clean', yAxisValue: 55 },
      { assetNumber: 'SPF74312A0599', eventType: 'Dirty', yAxisValue: 77 },
    ];

    const cleanData: (number | null)[] = [];
    const dirtyData: (number | null)[] = [];
    const categories: string[] = [];

    backendData.forEach((item) => {
      categories.push(item.assetNumber);
      if (item.eventType === 'Clean') {
        cleanData.push(item.yAxisValue);
        dirtyData.push(null);
      } else if (item.eventType === 'Dirty') {
        dirtyData.push(item.yAxisValue);
        cleanData.push(null);
      }
    });

    this.chartOptions = {
      chart: {
        type: 'bar',
        marginLeft: 200,
      },
      title: {
        text: 'Asset Clean vs Dirty Status',
      },
      xAxis: {
        categories: categories,
        title: {
          text: null,
        },
        min: 0,
        max: 3, // show 4 at a time
        scrollbar: {
          enabled: true,
        },
        tickLength: 0,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percentage (%)',
          align: 'high',
        },
      },
      tooltip: {
        pointFormatter: function () {
          return this.series.name + ': <b>' + this.y + '%</b><br/>';
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y + '%';
            },
          },
          grouping: true,
        },
      },
      legend: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Clean',
          type: 'bar',
          color: 'blue',
          data: cleanData,
        },
        {
          name: 'Dirty',
          type: 'bar',
          color: 'red',
          data: dirtyData,
        },
      ],
    };
  }
}
