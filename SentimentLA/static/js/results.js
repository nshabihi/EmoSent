$('#results').on('click','#charts .fas',function(){
    console.log('toggle')
    $(this).parent().siblings('.card-body').slideToggle();
    $(this).parent().siblings('.btn-group').slideToggle();
    $(this).toggleClass('flip');
})

function limitSearch() {
    // Declare variables
    var input = event.target;
    var filter, ul, li, a, i, txtValue;    
    filter = input.value.toUpperCase();
    ul = $(event.target).siblings('ul')[0]    
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i]
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
  
function studentChanged(newStudent){
    console.log('newStudent is: ' + newStudent)
}
$(document).on('change-student',function(){
    console.log('change student event fired')
})
$(document).ready(function () {    
    for (const i in Highcharts.charts) {          
        Highcharts.charts[i].setSize(null)
    }    
});
const bigDevice = window.matchMedia("(min-width: 1200px)");
$('#results').ready(function(){
    bigDevice.addEventListener('devicechange',handleDeviceChange);
    handleDeviceChange(bigDevice);
    chartData =$("input[name='variable']")
    chartDiv =$(".card")
    for (let index = 0; index < chartData.length; index++) {
        if(chartData[index].value===""){
            $(chartDiv[index]).hide()
            $($('.nav-link')[index]).hide()
        }
    }
})
function handleDeviceChange(e) {
    if (e.matches) {
        console.log('big device')
        for (let i=0;i<Highcharts.charts.length;i++) {
            // Highcharts.charts[i].setSize(900,600)
        }  
    }
    else{
        console.log('not big device')
        for (let i=0;i<Highcharts.charts.length;i++) {   
            Highcharts.charts[i].setSize(null)
        }
    }
}

// $(window).resize(function(){
//     console.log($(window).width())
//     if($(window).width()>1200){
//         for (const chart of Highcharts.charts) {
//             if(chart){
//                 // chart.setSize(900,600)
//             }
//         }
//     }else{
//         for (const chart of Highcharts.charts) {
//             if(chart){
//                 chart.setSize(null)
//             }
//         }
//         Highcharts.charts[4].legend.options.symbolWidth = 500
//     }
// })