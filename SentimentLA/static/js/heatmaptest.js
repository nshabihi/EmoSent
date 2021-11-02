var myVar = "2020-05-02,&,2020-05-28,&,anger,anticipation,disgust,fear,joy,negative,positive,sadness,surprise,trust,&,student-1,/,2020-05-05,1,1.43,&,student-3,/,2020-05-03,2,5.71,/,2020-05-25,2,1.43,/,2020-05-27,2,6.99,/,2020-05-28,2,5.71,/,2020-05-05,2,5.71,/,2020-05-04,2,6.99,/,2020-05-24,2,6.99,/,2020-05-26,2,5.71,&,student-2,/,2020-05-16,3,6.99,/,2020-05-17,3,5.86,/,2020-05-08,3,1.43,/,2020-05-09,3,0.0,/,2020-05-15,3,5.71,/,2020-05-11,3,5.71,/,2020-05-12,3,5.71,/,2020-05-18,3,6.43,/,2020-05-28,3,6.99,/,2020-05-26,3,6.99,/,2020-05-04,3,1.43,/,2020-05-03,3,5.71,/,2020-05-02,3,5.71,/,2020-05-10,3,3.14,/,2020-05-13,3,1.43,/,2020-05-14,3,6.99,/,2020-05-27,3,5.71,/,2020-05-07,3,5.71";

var items = myVar.split(",&,");
var startTime = items[0];
startTime = startTime.split("-");
var sd = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]),0, 0, 0, 0);
var startTime_epoch = Math.floor(sd.getTime());
var endTime = items[1];
endTime = endTime.split("-");
var ed = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]),0, 0, 0, 0);
var endTime_epoch = Math.floor(ed.getTime());

var emotion_categories = items[2].split(",");
var emo_num = emotion_categories.length;
//document.write("emotion_categories");
//document.write(emotion_categories);
//document.write("emo_num");
//document.write(emo_num);
var students_info = items.slice(3,items.length);
var studens_num = students_info.length;
var total_days = (endTime_epoch - startTime_epoch)/(24*60*60*1000) +1;
    
//document.write("all: ");
//document.write(students_info);
var std = [];

var arrayToPush = [];
var dataArray = [];
var seriesArray = [];


var current = startTime_epoch;

var std_day_array = (new Array(studens_num)).fill().map(function(){ return new Array(total_days).fill([]);});


for (i= 0 ; i<studens_num; i++)
{
  std = students_info[i].split(",/,");
  document.write("++++++");
  document.write(std);
  for (j = 1 ; j < std.length ; j++)
  {
    items = std[j].split(",");
    c_time = items[0].split("-");
    var ct = new Date(parseInt(c_time[0]), parseInt(c_time[1])-1, parseInt(c_time[2]),0, 0, 0, 0);
    var c_epoch = Math.floor(ct.getTime());
    day_index = (c_epoch - startTime_epoch)/(24*60*60*1000);
    arrayToPush = [day_index,i,items[2]];
    std_day_array[i][day_index] = arrayToPush;
    dataArray.push(arrayToPush);
    document.write("///////");
    document.write(arrayToPush);
  }

  seriesArray.push({data:dataArray});
  dataArray = [];
}


/*seriesArray = [];
    for (i= 0 ; i<6; i++)
    {
      for (j = 0 ; j < 3 ; j++)
      {
        arrayToPush = [i,j,i+j];
        dataArray.push(arrayToPush);
        document.write("///////");
        document.write(arrayToPush);
      }

      seriesArray.push({data:dataArray});
      dataArray = [];
    }*/


  createChart();

  function createChart() {
    Highcharts.chart(   'heatmap_container', {


        //data: {
        //    csv: document.getElementById('csv').innerHTML
        //},

        chart: {
            type: 'heatmap'
        },

        boost: {
            useGPUTranslations: true
        },

        title: {
            text: 'Highcharts heat map',
            align: 'left',
            x: 40
        },

        subtitle: {
            text: 'This is subtitle',
            align: 'left',
            x: 40
        },

        legend:{
          borderWidth: 1,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                   // floating: true,
                    width: 400,
                    symbolWidth: 390,


                    enabled: true,
            align: 'center',
            layout: 'horizontal',
            verticalAlign: 'bottom',
            y: 0,



        },
        colorAxis: {
              min: 0,
              max: 3,
              width: 400,
              tickLength: 100,
              stops: [
                [0, '#FF9F9F'],
                [0.25, '#FF1111'],
                [0.25001, '#9FABFF'],
                [0.5, '#1432FF'],
                [0.5001, '#FDFF9E'],
                [0.75, '#FBFF14'],
                [0.75001, '#B3FF9E'],
                [0.9, '#15FC54']
              ],

              startOnTick: false,
              endOnTick: false,
              categories: ['Happy', 'Sad' ,'Excited', 'Bored'],

              labels: {
                  formatter: function () {
                      return this.value;
                  },
                  allowOverlap:false,
                  symbolWidth: 200,
                  style:{
                      fontSize:"12px"
                  }
              }
        },


        xAxis: {
            categories: ['2013-04-01', '2013-04-02', '2013-04-03'],
            labels: {
                rotation: 90
            }
        },


        yAxis: {
            title: {
                text: null
            },
            labels: {
                enabled: true
            },
            categories: ['std1', 'std2', 'std3'],
            min: 0,
            max: 2,
            reversed: true

        },

        series: seriesArray

    });

}
