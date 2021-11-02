const app = Vue.createApp({
    data: function() {
        return {
            charts: [
                {order:1, div_id: 'bubble_container', header_id:'bubble_container_header', title:'title1', height: '450px', width: '800px', hasStudentList:false, hasPrevAndNext:false},
                {order:2, div_id: 'line_container', header_id:'line_container_header', title:'title2', height: '600px', width: '1000px', hasStudentList:true, hasPrevAndNext:false},
                {order:3, div_id: 'polar_container', header_id:'polar_container_header', title:'title3', height: '600px', width: '1000px', hasStudentList:false, hasPrevAndNext:false},
                {order:4, div_id: 'stackedbar_container', header_id:'stackedbar_container_header', title:'title4', height: '600px', width: '1000px', hasStudentList:false, hasPrevAndNext:false },
                {order:5, div_id: 'heatmap_container', header_id:'heatmap_container_header', title:'title5', height: '600px', width: '1000px', hasStudentList:false, hasPrevAndNext:false}
            ], 
            students: []
        }   
    },
    methods: {        
        makeHeaderLink: function(s){
            return '#'+s
        },
        getStudentList: function(){                        
            if(this.students.length>0)
                return
            let list = localStorage.getItem('studentList')            
            if(!list)
                return
            this.students = list.split(',')
        }
    },
    computed: {
                
    }
    
})
