$(function() {

  $.getJSON("/", function(rounds) {
    chartRounds(rounds);
  });

});

function chartRounds(rounds) {
  rounds = rounds.map(function(r) {
    var date = r.Date;
    if (r.Date.split(',').length === 1) {
      date = date + ', ' + new Date().getYear()%100;
    }
    r._moment = moment(date, 'MMM D, YY')
    r.Date = r._moment.format('YYYY-MM-DD');
    return r;
  }).filter(function(r) {
    return r.Score > 59;
  }).sort(function(a, b) {
    return a._moment - b._moment;
  });
  var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "marginRight": 40,
    "marginLeft": 40,
    "autoMarginOffset": 20,
    "dataDateFormat": "YYYY-MM-DD",
    "valueAxes": [{
      "id": "v1",
      "axisAlpha": 0,
      "position": "left",
      "ignoreAxisWidth":true
    }],
    "balloon": {
      "borderThickness": 1,
      "shadowAlpha": 0
    },
    "graphs": [{
      "id": "g1",
      "balloon":{
        "drop":true,
        "adjustBorderColor":false,
        "color":"#ffffff"
      },
      "bullet": "round",
      "bulletBorderAlpha": 1,
      "bulletColor": "#FFFFFF",
      "bulletSize": 5,
      "connect": false,
      "fillAlphas": 0.5,
      "hideBulletsCount": 50,
      "lineThickness": 2,
      "title": "red line",
      "useLineColorForBulletBorder": true,
      "valueField": "Score",
      "balloonText": "<div style='font-size:18px;'>[[Score]]</div><div style='font-size:12px;'>[[Course]]</div>"
    }],
    "chartScrollbar": {
      "graph": "g1",
      "oppositeAxis":false,
      "offset":30,
      "scrollbarHeight": 80,
      "backgroundAlpha": 0,
      "selectedBackgroundAlpha": 0.1,
      "selectedBackgroundColor": "#888888",
      "graphFillAlpha": 0,
      "graphLineAlpha": 0.5,
      "selectedGraphFillAlpha": 0,
      "selectedGraphLineAlpha": 1,
      "autoGridCount":true,
      "color":"#AAAAAA"
    },
    "chartCursor": {
      "pan": true,
      "valueLineEnabled": true,
      "valueLineBalloonEnabled": true,
      "cursorAlpha":1,
      "cursorColor":"#258cbb",
      "limitToGraph":"g1",
      "valueLineAlpha":0.2
    },
    "categoryField": "Date",
    "categoryAxis": {
      "equalSpacing": true,
      "parseDates": true,
      "dashLength": 1,
      "minorGridEnabled": true
    },
    "dataProvider": rounds
  });
  chart.addListener("rendered", zoomChart);
  zoomChart();
  function zoomChart() {
    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
  }
}
