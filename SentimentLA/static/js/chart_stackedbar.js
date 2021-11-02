
var myVar = document.getElementById("myVar_stackedbar").value;
var yaxis_text = "";
var senti_categories = [];
var emotion_categories = [];
var emo_num;
var senti_num;
var seriesOptions = [];
var seriesOptions_emo = [];
var seriesOptions_senti = [];
var xAxis_categories = [];
var clicked_stackedbar = [];

var chart_title_stackedbar = "";
var subtitle_text_stackedbar = "";
var chart_title_emotion_stackedbar = "";
var chart_title_sentiment_stackedbar = "";
var subtitle_text_emotion_stackedbar = "";
var subtitle_text_sentiment_stackedbar = "";



intialization(function() {
    createChart_stackedbar()
});

function intialization(callback){

  var items = myVar.split(",&,");
  chart_title_emotion_stackedbar = items[0];
  chart_title_sentiment_stackedbar = items[1];
  subtitle_text_emotion_stackedbar = items[2];
  subtitle_text_sentiment_stackedbar = items[3];
  items = items.slice(4, items.length);

  var startTime = items[0];
  startTime = startTime.split("-");
  var sd = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]),0, 0, 0, 0);
  var startTime_epoch = Math.floor(sd.getTime());
  var endTime = items[1];
  endTime = endTime.split("-");
  var ed = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]),0, 0, 0, 0);
  var endTime_epoch = Math.floor(ed.getTime());

  //emotion categories
  var emotion_senti_categories = items[2].split(",");



  for (i=0; i<emotion_senti_categories.length; i++)
  {
    e_s = emotion_senti_categories[i];
    if(e_s.substring(0,2) =="s-")
    {
      senti_categories.push(e_s.substring(2,e_s.length));
    }
    else
    {
      emotion_categories.push(e_s);
    }
  }
  emo_num = emotion_categories.length;
  senti_num = senti_categories.length;  


  items = items.slice(3,items.length);
  time_intervals = Math.floor((endTime_epoch-startTime_epoch)/(24*3600000))+1;


  var dataSeries_emotions = (new Array(emo_num)).fill().map(function(){ return new Array(time_intervals).fill(0);});
  var dataSeries_senti = (new Array(senti_num)).fill().map(function(){ return new Array(time_intervals).fill(0);});
  
  var item;
  for (j = 1; j < items.length ; j++)
    {
        item = String(items[j]);
        item = item.split(",");

       // time and date
        timeData = 0;
        date = item[0];
        date = date.split("-");

        var dt = new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]),0, 0, 0, 0);
        var epoch = Math.floor(dt.getTime());
        timeData = epoch;
        // END OF: time and date

        //assigning emotions to timeData
        timeData = (timeData - startTime_epoch)/(24*3600000); // the number of days in the chart
        timeData = Math.ceil(timeData);
        for (i=0 ; i<emo_num ; i++)
        {
          dataSeries_emotions[i][timeData]=parseInt(item[i+1]);
        }
        for (i=0 ; i< senti_num ; i++)
        {
          dataSeries_senti[i][timeData]=parseFloat(item[emo_num+i+1]);
          console.log("item");
          console.log(parseFloat(item[i+1]));
        }
    }


    var color_categories_emo = [
                '#ffff00',//joy
                '#99cc00',//trust
                '#00cc00',//fear
                '#239090',//suprise
                '#0000e6',//sadness
                '#b300b3',//disgust
                '#cc0000',//anger
                '#ff8000',//anticipation
                '#cc12e0',//anger
                '#fc8000'//anticipation
              ];

    var color_categories_senti = [
                '#cc0000',//positive
                '#99cc00',//negative
                '#0000e6'//neutral
              ];



// forming chart input data for both sentiment and emotion data
    for (i=0 ; i<senti_num ; i++)
    {
      seriesOptions_senti[i] = {
        id : i,
        name : senti_categories[i],
        data : dataSeries_senti[i],
        stack : "average",
        color: color_categories_senti[i],
        //pointStart : Date.UTC(2020, 4, 2,0,0,0),
        pointStart: Math.floor(new Date(2020, 4, 2,0, 0, 0, 0).getTime()),
        pointInterval : 3600*24*1000
      };
    }

    for (i=0 ; i<emo_num ; i++)
    {
      seriesOptions_emo[i] = {
        id : i,
        name : emotion_categories[i],
        data : dataSeries_emotions[i],
        stack : "average",
        color: color_categories_emo[i],
        //pointStart : Date.UTC(2020, 4, 2,0,0,0),
        pointStart : Math.floor(new Date(2020, 4, 2,0, 0, 0, 0).getTime()),
        pointInterval : 3600*24*1000
      };
    }

    
    var total_days = (endTime_epoch - startTime_epoch)/(24*60*60*1000) +1; 
    for (var i = 0 ; i<total_days; i++)
    {
        var date_category = new Date(startTime_epoch+ i * (24*60*60*1000) );
        xAxis_categories.push(String(date_category).substr(4,6));
    }
//initialization of chart data based on emotion data
  yaxis_text = "Emotion Score";
  chart_title_stackedbar = chart_title_emotion_stackedbar;
  subtitle_text_stackedbar = subtitle_text_emotion_stackedbar;
  seriesOptions = seriesOptions_emo;
  
  callback();
  }

  function createChart_stackedbar() {
    const chart_stackedbar = Highcharts.chart('stackedbar_container', {

    chart: {
      type: 'column'
    },

    title: {
      text: chart_title_stackedbar,
      align: 'left',
      x: 40
    },

    rangeSelector:{
        enabled: true,
        //inputEnabled: false,
        labelStyle: {
          display: 'none'
        },
        buttons: [{
          type: 'day',
          count: 7,
          text: '7d'
        },
        {
          type: 'month',
          count: 1,
          text: '1m'
        },
        {
          type: 'month',
          count: 3,
          text: '3m'
        },
        {
          type: 'month',
          count: 6,
          text: '6m'
        },
        {
          type: 'year',
          count: 1,
          text: '1y'
        },
        {
          type: 'all',
          text: 'All'
        },
        /*{
          type: 'all',
          text: 'Latest',
          events: {
              click: () => {
               
               alert('in real app I scroll to latest results');

                return false;

              }
              }
        }*/]
            },

    subtitle: {
      text: subtitle_text_stackedbar,
      align: 'left',
      x: 40
    },

    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },

      labels: {
            rotation: 90
        },

      title: {
        text: 'Date'
      }
    },
    /*
    xAxis: {
        categories: xAxis_categories, //['2013-04-01', '2013-04-02', '2013-04-03'],
        labels: {
            rotation: 90
        }
    },*/

    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: yaxis_text
      }
    },

    tooltip: {
      formatter: function () {
        return '<b>' + this.x + '</b><br/>' +
          this.series.name + ': ' + this.y + '<br/>' +
          'Total: ' + this.point.stackTotal;
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },

    series: seriesOptions,
    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          // Make the labels less space demanding on mobile
          chartOptions: {
            
              yAxis: {
                  labels: {
                      align: 'left',
                      x: 0,
                      y: -2
                  },
                  title: {
                      text: ''
                  }
              },legend: {
                align: 'center',             
                layout: 'horizontal',
                alignColumns: false
            }
          }
      }]
  }  
  });
  
  if (clicked_stackedbar != "")
    {
      chart_stackedbar.series.setData(seriesOptions);
      clicked_stackedbar = "";
      console.log("the stackedbar chart updated");
      console.log(seriesOptions)

    }
}


  
  
$('#results').on('click','#title4 label',function(event){
  console.log('title4 '+ event.target.innerText)
  clicked_stackedbar = event.target.innerText;
  if (clicked_stackedbar == "Emotion")
  {
    seriesOptions = seriesOptions_emo;
    yaxis_text = "Emotion Score";
    chart_title_stackedbar = chart_title_emotion_stackedbar;
    subtitle_text_stackedbar = subtitle_text_emotion_stackedbar;
  }
  else if (clicked_stackedbar == "Sentiment")
  {
    seriesOptions = seriesOptions_senti;
    yaxis_text = "Sentiment Score";
    chart_title_stackedbar = chart_title_sentiment_stackedbar;
    subtitle_text_stackedbar = subtitle_text_sentiment_stackedbar;
  }
  createChart_stackedbar();
})