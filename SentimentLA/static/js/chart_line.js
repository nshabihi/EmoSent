//???

var dataSeries_emotions_line = [];
var seriesOptions_line = [];
var seriesOptions_emo_line = [];
var seriesOptions_senti_line = [];
var yaxis_text_line = "";

var chart_title_line = "";
var subtitle_text_line = "";
var chart_title_emotion_line = "";
var chart_title_sentiment_line = "";
var subtitle_text_emotion_line = "";
var subtitle_text_sentiment_line = "";

var clicked_line = "";


var myVar_line = document.getElementById("myVar_line").value;

intialization_line(function() {
    createChart_line()
});


// check if new student is been selected
var selected_student_index_line = 1;
var selected_student_line = "";
var new_student_clicked_line = false;
var new_student_clicked_chartedit_line = false;
$('#results').on('click','.student-list li',function(event){
    if (event.target.innerText != null)
    {
      selected_student_line = event.target.innerText;
      new_student_clicked_line = true;
      new_student_clicked_chartedit_line = true;
      console.log("new student selected: ");
      console.log(selected_student_line);
      
      //intialization();
      //createChart_line();
      intialization_line(function() {
          createChart_line()
      });

    }
})

///

// setting the required values for drawing the chart
function intialization_line(callback){

  var items = myVar_line.split(",&,");
  chart_title_emotion_line = items[0];
  chart_title_sentiment_line = items[1];
  subtitle_text_emotion_line = items[2];
  subtitle_text_sentiment_line = items[3];
  items = items.slice(4, items.length);

  // Finding start and end time
  var startTime = items[0];
  startTime = startTime.split("-");
  var sd = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]),0, 0, 0, 0);
  var startTime_epoch = Math.floor(sd.getTime());
  var endTime = items[1];
  endTime = endTime.split("-");
  var ed = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]),0, 0, 0, 0);
  var endTime_epoch = Math.floor(ed.getTime());
  var currentTime = startTime;
  ///

  //emotion and senti categories
  emotion_senti_categories = items[2].split(",");
  var senti_categories = [];
  var emotion_categories = [];

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
  students_info = items.slice(3,items.length);

  //find list of student
  var student_list = [];
  for (var i = 0; i<students_info.length ; i++)
  {
    std_temp = students_info[i];
    std_temp = std_temp.split(",/,");
    student_list.push(std_temp[0]);
    //student_list.push(std_temp[0]+"a");
    //student_list.push(std_temp[0]+"b");
    //student_list.push(std_temp[0]+"c");
    //student_list.push(std_temp[0]+"d");
  }
  student_list.push(""); // this is required to solve the bug in student selcetion list
  console.log('student list:')
  console.log(student_list)
  let students = student_list.toString()
  localStorage.setItem('studentList',students)


// set student index based on new selected student   
  if((new_student_clicked_line == true))
  {
    new_student_clicked_line = false;
    selected_student_index_line = student_list.indexOf(selected_student_line);
    console.log("set new student index");

  }
  else
  {
    selected_student_index_line = 1;
  }
///

  // set student data based on selected student
  std = students_info[selected_student_index_line];
  console.log(std);
  std = std.split(",/,");
  items = std;

  // find time intervals
  time_intervals = Math.floor((endTime_epoch-startTime_epoch)/3600000)+1;
  
  // set dataSeries_emotions_line values for the intervals
  var dataSeries_emotions_line = (new Array(emo_num)).fill().map(function(){ return new Array(time_intervals).fill(0);});
  var dataSeries_sentiments_line = (new Array(senti_num)).fill().map(function(){ return new Array(time_intervals).fill(0);});
  var item;
  for (j = 1; j < items.length ; j++)
  {
      item = String(items[j]);
      item = item.split(",");

     // time and date
      var date;
      var timeData = 0;
      date = item[0];
      date = date.split(" "); 
      if (date.length == 1) { break; }
      
      var time = date[1];
      date = date[0];
      date = date.split("-");
      time = time.split(":");

      var dt = new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]),parseInt(time[0]), parseInt(time[1]), parseInt(time[2]), 0);
      var epoch = Math.floor(dt.getTime());
      timeData = epoch;
      // END OF: time and date

      //assigning emotions to timeData
      timeData = (timeData - startTime_epoch)/3600000; // the number of hours in the chart
      timeData = Math.ceil(timeData);
      for (i=0 ; i<emo_num ; i++)
      {
        dataSeries_emotions_line[i][timeData]=4*parseFloat(item[i+1]);
      }

      for (i=0 ; i<senti_num ; i++)
      {
        dataSeries_sentiments_line[i][timeData]=4*parseFloat(item[emo_num +i+1]);
      }
  }

  // forming chart input data for sentiment data
  var color_categories_senti = [
                "#cc0000",//positive
                "#99cc00",//negative
                '#239090'//neutral
              ];

  for (i=0 ; i<senti_num ; i++)
  {
    seriesOptions_senti_line[i] = {
      name : senti_categories[i],
      data : dataSeries_sentiments_line[i],
      color : color_categories_senti[i],
      pointStart : Date.UTC(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2])),
      pointInterval : 3600*1000
    };
  }

  // forming chart input data for emotion data
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

  for (i=0 ; i<emo_num ; i++)
  {
    seriesOptions_emo_line[i] = {
      name : emotion_categories[i],
      data : dataSeries_emotions_line[i],
      color : color_categories_emo[i],
      pointStart : Date.UTC(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2])),
      pointInterval : 3600*1000
    };
  }

  // Initializing chart data based on emotion data
  seriesOptions_line = seriesOptions_emo_line;
  yaxis_text_line = "Emotion Score";
  chart_title_line = chart_title_emotion_line;
  subtitle_text_line = subtitle_text_emotion_line;

  callback();
}

function createChart_line() {
  const chart_line = Highcharts.stockChart('line_container', {
    chart: {
      renderTo: 'line_container',
      zoomType: 'xy',
      panning: true,
      panKey: 'shift',
      plotBorderWidth: 1,
      width: 1000
    },

    title: {
      text: chart_title_line,
      align: 'left',
      x: 40
    },

    subtitle: {
      text: subtitle_text_line,
      align: 'left',
      x: 40
    },


    yAxis: {
      title: {
        text: yaxis_text_line,
      },
      opposite: false,
      max:10,
      min:0

    },

    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },

    rangeSelector:{
        enabled: true,
        //inputEnabled: false,
        /*labelStyle: {
          display: 'none'
        },*/
        buttons: [{
          type: 'day',
          count: 1,
          text: '1d'
        },
        {
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

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },

      }
    },


    credits: {
      enabled: false
    },

    legend: {
      enabled: true,
      align: 'center',
      // backgroundColor: '#FCFFC5',
      // borderColor: 'black',
      // borderWidth: 2,
      layout: 'horizontal',
      verticalAlign: 'bottom',
      y: 0,
      //shadow: true
    },
    series: seriesOptions_line,
    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          // Make the labels less space demanding on mobile
          chartOptions: {
            legend: {
              align: 'center',              
              layout: 'horizontal',
              alignColumns: false
            },
              yAxis: {
                  labels: {
                      align: 'left',
                      x: 0,
                      y: -2
                  },
                  title: {
                      text: ''
                  }
              }
          }
      }]
  }       
  });

  if (new_student_clicked_chartedit_line == true)
  {
    new_student_clicked_chartedit_line = false;
    chart_line.series[0].setData(dataSeries_emotions_line);
    console.log("the chart updated");
    console.log(dataSeries_emotions_line)

  }

  if (clicked_line != "")
  {
    chart_line.series.setData(seriesOptions_line);
    clicked_line = "";
    console.log("the line chart updated");
    console.log(seriesOptions_line)
  }
}

$('#results').on('click','#title2 label',function(event){
  console.log('title2 '+ event.target.innerText)
  clicked_line = event.target.innerText;
  if (clicked_line == "Emotion")
  {
    seriesOptions_line = seriesOptions_emo_line;
    yaxis_text_line = "Emotion Score";
    chart_title_line = chart_title_emotion_line;
    subtitle_text_line = subtitle_text_emotion_line; 
  }
  else if (clicked_line == "Sentiment")
  {
    seriesOptions_line = seriesOptions_senti_line;
    yaxis_text_line = "Sentiment Score";
    chart_title_line = chart_title_sentiment_line;
    subtitle_text_line = subtitle_text_sentiment_line;  
  }
  createChart_line();
})