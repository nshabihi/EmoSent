var clicked_polar = "";
var seriesArray = [];
var seriesArray_emo = [];
var seriesArray_senti = [];
var items = [];
var item_str = [];
var item_num = [];
var names = ["joy","trust","fear","surprise","sadness","disgust","anger","anticipation","s-negative","s-positive","s-neutral"];
var temp = [];
var myVar = document.getElementById("myVar_polar").value;


items = myVar.split(",&,");
//chart titles
var chart_title_polar = "";
var chart_subtitle_polar = "";
var chart_title_emotion_polar = items[0];
var chart_title_sentiment_polar = items[1];
var subtitle_emotion_polar = items[2];
var subtitle_sentiment_polar = items[3];
items = items.slice(4, items.length);

var senti_categories_polar = [];
var emotion_categories_polar = [];

var emotions_num;
var senti_num;



intialization_polar(function() {
    createChart_polar()
}); 

function intialization_polar(callback){

  var emotion_senti_categories = items[0].split(",");
  for (i=0; i<emotion_senti_categories.length; i++)
  {
    e_s = emotion_senti_categories[i];
    if(e_s.substring(0,2) =="s-")
    {
      senti_categories_polar.push(e_s.substring(2,e_s.length));
    }
    else
    {
      emotion_categories_polar.push(e_s);
    }
  }

  emotions_num = emotion_categories_polar.length;
  senti_num = senti_categories_polar.length;

  var dataSeries_emotions_polar = (new Array(emotions_num)).fill().map(function(){ return new Array(items.length-1).fill(0);});
  var dataSeries_sentiment_polar =  (new Array(senti_num)).fill().map(function(){ return new Array(items.length-1).fill(0);});

  var color_categories_senti = [
                "#99cc00",//positive
                "#cc0000",//negative
                '#239090'//neutral
              ];

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
  //not working
    // i iterates on activities, j iterates on emotions
    for (var i=0; i< items.length-1 ; i++){
      activity = items[i+1].split(",");
      for (var j=0; j<emotions_num;j++){
        dataSeries_emotions_polar[j][i] = parseInt(activity[j]) - 0.1;
      } 
      for (var j = emotions_num ; j < emotions_num+senti_num ; j++){
        dataSeries_sentiment_polar[j-emotions_num][i] = parseInt(activity[j]) - 0.1;
      }
    }
      console.log("dataSeries_emotions for polar:");
      console.log(dataSeries_emotions_polar);
      console.log("dataSeries_senti for polar:");
      console.log(dataSeries_sentiment_polar);
      
    for (var i=0; i< emotions_num ; i++){
      seriesArray_emo.push({name: emotion_categories_polar[i],data:dataSeries_emotions_polar[i], color: color_categories_emo[i]});
    }

    for (var i=0; i< senti_num ; i++){
      seriesArray_senti.push({name: senti_categories_polar[i],data:dataSeries_sentiment_polar[i], color: color_categories_senti[i]});
    }
    //NOT working

    console.log(seriesArray_emo);
    console.log(seriesArray_senti);

    seriesArray = seriesArray_emo
    chart_title_polar = chart_title_emotion_polar;
    chart_subtitle_polar = subtitle_emotion_polar;

    callback();
  }   

function createChart_polar() {
  const polar_chart = Highcharts.chart('polar_container', {

    chart: {
      polar: true,
      type: 'column'
    },

    xAxis: {
      type: 'category',
      categories: [
        "category-1","category-2","category-3","category-4","category-5"
          ],
    },

    title: {
      text: chart_title_polar,
      align: 'left',
      x: 40
    },

    subtitle: {
      text: chart_subtitle_polar,
      align: 'left',
      x: 40
    },

    credits: {
      enabled: false
    },
    
    series: seriesArray,

    responsive: {
        rules: [{
            condition: {
                maxWidth: 676
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                },
            }
        }]
    }
      //series: seriesArray      
  });

  if (clicked_polar != "")
  {
    polar_chart.series.setData(seriesArray);
    clicked_polar = "";
    console.log("the polar chart updated");
    console.log(seriesArray)

  }
}


$('#results').on('click','#title3 label',function(event){
  console.log('title3 '+ event.target.innerText)
  clicked_polar = event.target.innerText;
  if (clicked_polar == "Emotion")
  {
    seriesArray = seriesArray_emo
    chart_title_bubble = chart_title_emotion_polar;
    chart_subtitle_bubble = subtitle_emotion_polar
  }
  else if (clicked_polar == "Sentiment")
  {
    seriesArray = seriesArray_senti;
    chart_title_bubble = chart_title_sentiment_polar;
    chart_subtitle_bubble = subtitle_sentiment_polar;
  }
  createChart_polar();
})



