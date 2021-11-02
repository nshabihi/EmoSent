$(document).on('click','#hamburger',function(){
    $('#desktop-menu').toggleClass('show')  
    console.log('hamburger clicked')  
})
$('#page-analyze').load(function () {
  console.log("page analyze loaded")
  if($('#page-analyze').length>0 && $('#file-error').text().trim()!==''){
    $('#file-error').show()
  }
});