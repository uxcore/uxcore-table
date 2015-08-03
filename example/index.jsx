var App = require('../lib/index.jsx');
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
                checked: faker.random.boolean(),
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


// title, width, type, hidden
var columns = [
    { name: 'checked', title: '', width: 30,type:'checkbox'},
    { name: 'id', title: 'ID', width: 50,hidden:true},
    { name: 'country', title:'国家', width: 200, type:'text'},
    { name: 'city',title:'城市', width: 150 },
    { name: 'firstName',title:"FristName" },  
    { name: 'lastName' ,title:"LastName",type:'text'},
    { name: 'email',title:"Email",width: 200 ,type:"text"}
]

var data= gen(20);
console.info(data);


// 通过 rowSelection 对象表明需要行选择
var rowSelection = {
  onSelect: function(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: function(selected, selectedRows) {
    console.log(selected, selectedRows);
  }
};

var onModifyRow= function(record){
    //console.info("onModifyRow:",record);
    //doValidate
    return true;
};

React.render((  //
    <App jsxcolumns={columns} jsxdata={data} rowSelection={rowSelection} onModifyRow={onModifyRow} columnPicker fixed />
), document.getElementById('content'))