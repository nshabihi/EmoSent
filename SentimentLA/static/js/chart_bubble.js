var chart_type = "";
var clicked_bubble = "";
var teamName;
var bubblesize = 27;
var arraytoPush = [];
var dataArray_emo = [];
var dataArray_senti = [];
var seriesArray = [];
var seriesArray_bubble_emo = [];
var seriesArray_bubble_senti = [];
var teamCounter = 1;
var xaxis_categories = [];
var emotion_categories_bubble = [];
var senti_categories_bubble = [];
var myVar = document.getElementById("myVar_bubble").value;
var items = myVar.split(",&,");

//chart titles
var chart_title_emotion_bubble = items[0];
var chart_title_sentiment_bubble = items[1];
var subtitle_emotion_bubble = items[2];
var subtitle_sentiment_bubble = items[3];
items = items.slice(4, items.length);

var emotion_senti_categories = items[0].split(",");
var yaxis_text = "";
var xaxis_text = "";
var xaxis_max;
var chart_title_bubble = "";
var chart_subtitle_bubble = "";

for (i=0; i<emotion_senti_categories.length; i++)
{
  e_s = emotion_senti_categories[i];
  if(e_s.substring(0,2) =="s-")
  {
    senti_categories_bubble.push(e_s.substring(2,e_s.length));
  }
  else
  {
    emotion_categories_bubble.push(e_s);
  }
}
emotions_num = emotion_categories_bubble.length;
senti_num = senti_categories_bubble.length;

intialization(function() {
    createChart_bubble()
});



function intialization(callback){
  

  var groups = items.length;
  // emotion series data
  average_emo = new Array(emotions_num).fill(0);
  average_senti = new Array(senti_num).fill(0);
  dataArray_senti_average = [];
  dataArray_emo_average = [];

  for (j = 1; j < groups ; j++)
  {
    data = items[j].split(",");
    teamName = data[0];
    var i;
    for (i = 0; i <emotions_num ; i++){
      arrayToPush = [i,parseFloat(data[i+1]),bubblesize,j,teamName];
      dataArray_emo.push(arrayToPush);
      average_emo[i] += parseFloat(data[i+1])/(groups-1);

    }

    for (i = 0; i <senti_num ; i++){
      arrayToPush = [i,parseFloat(data[emotions_num+i+1]),bubblesize,j,teamName];
      dataArray_senti.push(arrayToPush); 
      average_senti[i] += parseFloat(data[emotions_num+i+1])/(groups-1)
    }
    seriesArray_bubble_emo.push({type:"bubble",color:randomColor(),data:dataArray_emo, name: teamName });
    seriesArray_bubble_senti.push({type:"bubble",color:randomColor(),data:dataArray_senti, name: teamName});
    dataArray_emo = [];
    dataArray_senti = [];

  }

  // for spline: average data
  for (i = 0; i <emotions_num ; i++){
      arrayToPush = [i,average_emo[i],bubblesize,1,teamName];
      dataArray_emo_average.push(arrayToPush);
    }

    for (i = 0; i <senti_num ; i++){
      arrayToPush = [i,average_senti[i],bubblesize,1,teamName];
      dataArray_senti_average.push(arrayToPush); 
    }
  // average data for spline chart
  seriesArray_bubble_emo.push({type:"spline",name:"Average",data:dataArray_emo_average, color: "orange", marker: {lineWidth: 2,lineColor:"orange",fillColor: 'white'}});
  seriesArray_bubble_senti.push({type:"spline",name:"Average",data:dataArray_senti_average, color: "orange",marker: {lineWidth: 2,lineColor:"orange",fillColor: 'white'}});

//default chart is emotion chart:
  seriesArray = seriesArray_bubble_emo;
  xaxis_text = "Emotion Categories";
  yaxis_text = "Emotion Score";
  xaxis_max = emotions_num - 1;
  chart_title_bubble = chart_title_emotion_bubble;
  chart_subtitle_bubble = subtitle_emotion_bubble
  xaxis_categories = emotion_categories_bubble;


  callback();
}   

function randomColor(){
  var symbols, color;
  symbols = "0123456789ABCDEF";

  color = "#";
  for (var i = 0;i<6;i++){
    color = color + symbols[Math.floor(Math.random() * 16)];
  }
  console.log(color);
  return color;
}


function createChart_bubble() {
  console.log("chart_bubble")
  const bubble_chart = Highcharts.chart('bubble_container', {


    /*chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zoomType: 'xy'
    },*/

    legend: {
      enabled: false
    },

    title: {
      text: chart_title_bubble,
      align: 'left',
      x: 40
    },

    subtitle: {
      text: chart_subtitle_bubble,
      align: 'left',
      x: 40
    },

    accessibility: {
      point: {
        valueDescriptionFormat: '{index}. {point.name}, Catagory: {point.x}, Score: {point.y},'
      }
    },

    xAxis: {
      startOnTick: true,
      endOnTick: true,
      gridLineWidth: 1,
      min: 0,
      max: xaxis_max,
      title: {
        text: xaxis_text
      },
      categories: xaxis_categories,

      tickInterval: 1,

      accessibility: {
        rangeDescription: ''
      }
    },

    yAxis: {
      startOnTick: true,
      endOnTick: true,
      //min: 0,
      title: {
        text: yaxis_text
      },
      labels: {
        format: '{value} '
      },
      maxPadding: 0.2,

      accessibility: {
        rangeDescription: ''
      }
    },
    legend: {
      // layout: 'vertical',
      // align:'left',
      // verticalAlign:'top',
      // x: 100,
      // y: 70,
      // floating: true,
      backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
      borderWidth: 1,
      layout: 'horizontal',
      align: 'center', 
      verticalAlign: 'bottom',
      borderWidth: 0
    },

    tooltip: {
      useHTML: true,
      headerFormat: '<table>',
      pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +

        '<tr><th>Score:</th><td>{point.y}</td></tr>',
      footerFormat: '</table>',
      followPointer: true
    },

    plotOptions: {
      series: {
        keys:['x','y','z','studentNum','name'],

        dataLabels: {
          enabled: true,
          format: '{point.studentNum}'
        }
      }
    },

    credits: {
      enabled: false
    },
    series:seriesArray,
    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },          
          chartOptions: {            
              yAxis: {
                  labels: {
                      align: 'left',
                      x: 0,
                      y: -2
                  },
                  title: {
                      text: ''
                  },
                  legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                }
              }
          }
      }]
  }  
  });

  if (clicked_bubble != "")
  {
    bubble_chart.series.setData(seriesArray);
    clicked_bubble = "";
    console.log("the bubble chart updated");
    console.log(seriesArray)

  }
}

/*function emotionClicked(){
  console.log($(event.target).attr('chart'))//Check if this has the title of current chart, then change the chart
  chart_type = "emo";
  clicked = true;
  seriesArray = seriesArray_bubble_emo;
  createChart_bubble();
}
function sentimentClicked(){
  console.log($(event.target).attr('chart'))//Check if this has the title of current chart, then change the chart
  chart_type = "senti";
  clicked = true;
  seriesArray = seriesArray_bubble_senti;
  createChart_bubble();
}*/



$('#results').on('click','#title1 label',function(event){
  console.log('title1 '+ event.target.innerText)
  clicked_bubble = event.target.innerText;
  if (clicked_bubble == "Emotion")
  {
    seriesArray = seriesArray_bubble_emo;
    xaxis_text = "Emotion Categories";
    yaxis_text = "Emotion Score";
    xaxis_max = emotions_num - 1;
    chart_title_bubble = chart_title_emotion_bubble;
    chart_subtitle_bubble = subtitle_emotion_bubble
    xaxis_categories = emotion_categories_bubble;
  }
  else if (clicked_bubble == "Sentiment")
  {
    seriesArray = seriesArray_bubble_senti;
    xaxis_text = "Sentiment Categories";
    yaxis_text = "Sentiment Score";
    xaxis_max = senti_num - 1;
    chart_title_bubble = chart_title_sentiment_bubble;
    chart_subtitle_bubble = subtitle_sentiment_bubble
    xaxis_categories = senti_categories_bubble;
  }
  createChart_bubble();
})