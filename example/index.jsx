import '../style/kuma/dist/uxcore-kuma.css';
var Grid = require('../lib/index.jsx');
var faker= require('faker');
var gen = (function(){

    var cache = {}

    return function(len){

        if (cache[len]){
            // return cache[len]
        }

        var arr = []

        for (var i = 0; i < len; i++){
            arr.push({
                //jsxchecked: faker.random.boolean(),
                id       : i + 1,
                // id: Guid.create(),
                grade      : Math.round(Math.random() * 10),
                email    : faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName : faker.name.lastName(),
                birthDate: faker.date.past(),
                country  : faker.address.country(),
                city  : faker.address.city()
            })
        }

        cache[len] = arr

        return arr
    }
})()


// title, width, type, hidden,dataKey
var columns = [
    { dataKey: 'id', title: 'ID', width: 50,hidden:true},
    { dataKey: 'country', title:'国家', width: 200, type:'text'},
    { dataKey: 'city',title:'城市', width: 150 },
    { dataKey: 'firstName',title:"FristName" },  
    { dataKey: 'lastName' ,title:"LastName",type:'text'},
    { dataKey: 'email',title:"Email",width: 200 ,type:"text"}
]

var data= gen(20);

// 通过 rowSelection 对象表明需要行选择
var rowSelection = {
  onSelect: function(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: function(selected, selectedRows) {
    console.log(selected, selectedRows);
  }
};



var App = React.createClass({

      getInitialState: function(){
        return {
            data:this.props.data
        }
      },
      onPageChange: function(pageIndex) {
          this.setState({
             data: gen(20)
          })
      },
      onModifyRow: function(record) {
        //doValidate
        return true;
      },
      render: function() {
        var renderProps={
            headerHeight:50,
            width:700,
            height:500,
            columnPicker: true,
            onPageChange: this.onPageChange,
            onModifyRow: this.onModifyRow,
            rowSelection: rowSelection,
            jsxdata:this.state.data,
            jsxcolumns:columns
        };
        return (<Grid {...renderProps}  ref="grid"/>);
      }
});

React.render(<App  data={data}/>, document.getElementById('content'))

