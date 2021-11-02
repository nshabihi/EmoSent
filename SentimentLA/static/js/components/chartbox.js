app.component('chartbox',{
    
    template:
    /*html*/
    `
        <div v-for="(x, index) in charts" class="row chart card" :id="x.title"> 
            <h2 :id="x.header_id" class="card-header">{{x.title}}            
                <i class="fas fa-angle-up"></i>
            </h2>
            <div class="btn-group" data-toggle="buttons">
                <label class="btn btn-primary form-check-label active" :chart="x.title">
                    <input class="form-check-input emotion-button" type="radio" name="options"  autocomplete="off" owner="x.title" checked>
                    Emotion
                </label>
                <label class="btn btn-primary form-check-label"   :chart="x.title">
                    <input class="form-check-input sentiment-button" type="radio" name="options"  autocomplete="off"  owner="x.title"> 
                    Sentiment
                </label>
            </div>
            <div class="card-body">
                <div class="student-list form-group" v-if="x.hasStudentList">
                    <i class="fas fa-search"></i>
                    <input type="text" class="searchInput form-control" @focus="searchFocused" @blur="searchBlurred" onkeyup="limitSearch()" placeholder="Search students...">
                    <ul class="list list-group hidden">
                        <li v-for="student in students" @click="studentClicked" class="list-group-item">{{student}}</li>
                    </ul> 
                </div>
                <div class="chart-body" :id="x.div_id"></div>
                <div class="btn-group" data-toggle="buttons" v-if="x.hasPrevAndNext">
                    <label class="btn btn-primary form-check-label active" :chart="x.title">
                        <input class="form-check-input emotion-button" type="radio" name="options"  autocomplete="off" owner="x.title" checked>
                        Next month
                    </label>
                    <label class="btn btn-primary form-check-label"   :chart="x.title">
                        <input class="form-check-input sentiment-button" type="date" name="options"  autocomplete="off"  owner="x.title"> 
                        Previous month
                    </label>
                </div>  
            </div>           
            
        </div>`,
    data: function(){
        return {
             
        }
    },
    props: {
        charts: Array,
        students: Array
    },
    methods: {
        searchFocused: function(event){
            $(event.target).siblings('.list').slideToggle()
            this.$emit('search-focused')
        },
        searchBlurred: function(event){
            $(event.target).siblings('.list').slideToggle()
        },
        studentClicked: function(event){
            $(event.target).parent().siblings('input')[0].value=event.target.innerText
            this.$emit('change-student',event.target.innerText)
        }
    }
})
//