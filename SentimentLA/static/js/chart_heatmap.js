var clicked_heatmap = "";
var legend_width = 0;
var my_symbolWidth = 0;
var colorAxis_min = 0;
var colorAxis_max = 0;
var color_axis_stop_categories = [];
var color_axis_stop_categories_emo = [];
var color_axis_stop_categories_senti = [];
var color_axis_categories = [];
var senti_categories = [];
var emotion_categories = [];
var xAxis_categories = [];
var yAxis_categories = [];
var seriesArray_heatmap = [];
var seriesArray_heatmap_emo = [];
var seriesArray_heatmap_senti = [];
var myVar = document.getElementById("myVar_heatmap").value;
var items = myVar.split(",&,");

var chart_title_heatmap = "";
var subtitle_heatmap = "";
var chart_title_emotion_heatmap = items[0];
var chart_title_sentiment_heatmap = items[1];
var subtitle_text_emotion_heatmap = items[2];
var subtitle_text_sentiment_heatmap = items[3];
items = items.slice(4, items.length);



console.log("heatmap data:");
console.log(items);


intialization(function() {
    createChart_heatmap()
});


function intialization(callback){

    var startTime = items[0];
    console.log("heatmap data:::::");
    startTime = startTime.split("-");
    var sd = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]),0, 0, 0, 0);
    var startTime_epoch = Math.floor(sd.getTime());
    var endTime = items[1];
    endTime = endTime.split("-");
    var ed = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]),0, 0, 0, 0);
    var endTime_epoch = Math.floor(ed.getTime());
    var emotion_senti_categories_heatmap = items[2].split(",");
    var students_info = [];
    var studens_num = 0;



    for (i=0; i<emotion_senti_categories_heatmap.length; i++)
    {
      e_s = emotion_senti_categories_heatmap[i];
      if(e_s.substring(0,2) =="s-")
      {
        //senti_categories.push(e_s.substring(2,e_s.length));
        senti_categories.push("negative");
        senti_categories.push("neutral");
        senti_categories.push("positive");
      }
      else
      {
        emotion_categories.push(e_s);
      }
    }

    var emo_num = emotion_categories.length;
    var senti_num = senti_categories.length;
    color_axis_stop_categories_emo = [
        [0, '#FDFF9E'],
        [0.125, "#ffff00"],//joy
        [0.12501, "#e6ff99"],
        [0.25, "#99cc00"],//trust
        [0.25001, '#b3ffb3'],
        [0.375, '#00cc00'],//fear
        [0.37501, '#c1f0f0'],
        [0.5, '#239090'],//suprise
        [0.50001, '#9999ff'],
        [0.625, '#0000e6'],//sadness
        [0.62501, '#ff99ff'],
        [0.75, '#b300b3'],//disgust
        [0.75001, '#ff9999'],
        [0.875, '#cc0000'],//anger
        [0.87501, '#ffb380'],
        [0.99, '#ff8000']//anticipation
      ];

    color_axis_stop_categories_senti = [
        [0, "#cc0000"],
        [0.45, "#ff9999"],//negative
        [0.48, '#D0D0D0'],
        //[0.47001, '#D0D0D0'],
        [0.52, '#D0D0D0'],//neutral
        [0.55, '#e6ff99'],
        [0.99, "#99cc00"],//positive
      ];


    students_info = items.slice(3,items.length);
    studens_num = students_info.length;
    total_days = (endTime_epoch - startTime_epoch)/(24*60*60*1000) +1;

    var std = [];

    var arrayToPush_emo = [];
    var arrayToPush_senti = [];
    var dataArray_emo = [];
    var dataArray_senti = [];
    var std_items = [];


    var current = startTime_epoch;

    //var std_day_array_emo = (new Array(studens_num)).fill().map(function(){ return new Array(total_days).fill([]);});
    //var std_day_array_senti = (new Array(studens_num)).fill().map(function(){ return new Array(total_days).fill([]);});

    
    for (i= 0 ; i<studens_num; i++)
    {
      std = students_info[i].split(",/,");

      yAxis_categories.push(std[0]);

      for (j = 1 ; j < std.length ; j++)
      {
        std_items = std[j].split(",");
        c_time = std_items[0].split("-");
        var ct = new Date(parseInt(c_time[0]), parseInt(c_time[1])-1, parseInt(c_time[2]),0, 0, 0, 0);
        var c_epoch = Math.floor(ct.getTime());
        day_index = (c_epoch - startTime_epoch)/(24*60*60*1000);
        //arrayToPush_emo = [day_index,i,items[2]];
        //arrayToPush_senti = [day_index,i,items[3]];
        dataArray_emo.push([day_index,i,std_items[2]]);
        dataArray_senti.push([day_index,i,(parseFloat(std_items[3])+1)]);
      }

      seriesArray_heatmap_emo.push({data:dataArray_emo});
      seriesArray_heatmap_senti.push({data:dataArray_senti});
      dataArray_emo = [];
      dataArray_senti = [];
    }

      
      for (var i = 0 ; i<total_days; i++)
      {
          var date_category = new Date(startTime_epoch+ i * (24*60*60*1000) );
          xAxis_categories.push(String(date_category).substr(4,6));
      }


      // initial chart data based on Emotion Data
      seriesArray_heatmap = seriesArray_heatmap_emo;
      chart_title_heatmap = chart_title_emotion_heatmap;
      subtitle_heatmap = subtitle_text_emotion_heatmap;


      if(window.innerWidth>1200){
          legend_width = 100*emo_num;
      }
      else if (window.innerWidth > 625){
          legend_width = 73*emo_num;
      }
      if(window.innerWidth<625){
          legend_width = window.innerWidth - 32;        
      }


      colorAxis_max = emo_num-1;
      colorAxis_min = 0
      color_axis_stop_categories = color_axis_stop_categories_emo;
      color_axis_categories = emotion_categories;

      //console.log(document.getElementById("yourDiv").clientWidth);
      //console.log(document.getElementById("yourDiv").clientWidth);
      


  callback();
}


  function createChart_heatmap() {
    const heatmap_chart = Highcharts.chart(   'heatmap_container', {

        chart: {
            type: 'heatmap'
        },

        boost: {
            useGPUTranslations: true
        },

        title: {
            text: chart_title_heatmap,
            align: 'left',
            x: 40
        },

        subtitle: {
            text: subtitle_heatmap,
            align: 'left',
            x: 40
        },

        legend:{
          borderWidth: 1,
          backgroundColor: 'rgba(255,255,255,0.85)',
         // floating: true,
          width: legend_width, //'99%', //heatmap_chart.width,//legend_width,
          symbolWidth: legend_width - 10, //window.innerWidth/2,
          enabled: true,
          align: 'center',
          layout: 'horizontal',
          verticalAlign: 'bottom',
          y: 0,
        },

        colorAxis: {
              min: colorAxis_min,
              max: colorAxis_max,
              width: 400,
              tickLength: 50,
              stops: color_axis_stop_categories,

              startOnTick: false,
              endOnTick: false,
              categories: color_axis_categories,

              labels: {
                  formatter: function () {
                      return this.value;
                  },
                  allowOverlap:false,
                  symbolWidth: 150,
                  style:{
                      fontSize:"12px"
                  }
              }
        },


        xAxis: {
            categories: xAxis_categories, //['2013-04-01', '2013-04-02', '2013-04-03'],
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
            categories: yAxis_categories, //['std1', 'std2', 'std3'],
            min: 0,
            max: (yAxis_categories.length -1),
            reversed: true

        },

        series: seriesArray_heatmap

    });

    //heatmap_chart.legend.options.symbolWidth= heatmap_chart.legend.options.width;

    if (clicked_heatmap != "")
    {
      
      clicked_heatmap = "";
      console.log("the heatmap chart updated");
      console.log(seriesArray_heatmap)
      //heatmap_chart.series.setData(seriesArray_heatmap);      

      if(window.innerWidth>1200){
        if (chart_title_heatmap == chart_title_emotion_heatmap)
          legend_width = 100*emo_num;
        if (chart_title_heatmap == chart_title_sentiment_heatmap)
          legend_width = 100*3;
      }
      else if (window.innerWidth > 625){
        if (chart_title_heatmap == chart_title_emotion_heatmap)
          legend_width = 75*emo_num;
        if (chart_title_heatmap == chart_title_sentiment_heatmap)
          legend_width = 100*3;
      }
      if(window.innerWidth<625){
          legend_width = window.innerWidth - 32;        
      }

      heatmap_chart.series.update(seriesArray_heatmap);
    }
}

$('#results').on('click','#title5 label',function(event){
    console.log('title5 '+ event.target.innerText)
    clicked_heatmap = event.target.innerText;
    if (clicked_heatmap == "Emotion")
    {
      seriesArray_heatmap = seriesArray_heatmap_emo;
      chart_title_heatmap = chart_title_emotion_heatmap;
      subtitle_heatmap = subtitle_text_emotion_heatmap;
      if(window.innerWidth > 825){
        legend_width = 100*emo_num;
      }
      else{
        legend_width = (window.innerWidth-25);
      }
      colorAxis_max = emo_num-1;
      colorAxis_min = 0;
      color_axis_stop_categories = color_axis_stop_categories_emo;
      color_axis_categories = emotion_categories;      
    }
    else if (clicked_heatmap == "Sentiment")
    {
      seriesArray_heatmap = seriesArray_heatmap_senti;
      chart_title_heatmap = chart_title_sentiment_heatmap;
      subtitle_heatmap = subtitle_text_sentiment_heatmap;
      if(window.innerWidth>400){
        legend_width = 100*3;
      }
      else{
        legend_width = (window.innerWidth-125);
      }
      //legend_width = 100*3; // three categories for sentiment data
      colorAxis_max = 2; // max for compound in sentiment is: 1
      colorAxis_min = 0; // min for compound in sentiment is: -1
      color_axis_stop_categories = color_axis_stop_categories_senti;
      color_axis_categories = senti_categories;
    }
    createChart_heatmap();   
  })