app.component('chartbox_test',{
    
    template:
    /*html*/
    `<div id="charts" class="container charts" >
        <div v-for="(x, index) in charts" class="row chart card"> 
            <h2 :id="x.header_id" class="card-header">{{x.title}}
            
                <i class="fas fa-angle-up"></i>
            </h2>
            <div class="btn-group" data-toggle="buttons">
                <label class="btn btn-primary form-check-label active">
                    <input class="form-check-input emotion-button" type="radio" name="options"  autocomplete="off" checked>
                    Emotion
                </label>
                <label class="btn btn-primary form-check-label">
                    <input class="form-check-input sentiment-button" type="radio" name="options"  autocomplete="off"> Sentiment
                </label>
            </div>
            <div class="card-body">
                <div class="chart-body" :id="x.div_id" :style="{width:x.width, height:x.height}"></div>
                <div class="student-list form-group" v-if="x.hasStudentList">
                    <i class="fas fa-search"></i><input type="text" class="searchInput form-control" @focus="searchFocused" @blur="searchBlurred" onkeyup="limitSearch()" placeholder="Search for names...">
                    <ul class="list list-group hidden">
                        <li v-for="student in students" @click="studentClicked" class="list-group-item">{{student}}</li>
                    </ul> 
                </div>
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
            this.$emit('change-student',event.target.innerText)
        }        
    }
})