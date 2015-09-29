# uxcore-grid

---

uxcore gird, will including checkbox, edit text field, column pick etc

![](demo/screenshot.png)

## How to run

```sh
$ git clone https://github.com/uxcore/uxcore-grid
$ cd grid
$ npm install
$ gulp server
```

## Best Practice

```javascript

	let columns = [
	    { dataKey: 'id', title: 'ID', width: 50,hidden:true},
	    { dataKey: 'country', title:'国家', width: 200,ordered:true},
	    { dataKey: 'city',title:'城市', width: 150,ordered:true },
	    { dataKey: 'firstName',title:"FristName" },  
	    { dataKey: 'lastName' ,title:"LastName"},
	    { dataKey: 'email',title:"Email",width: 200,ordered:true }
	],


	rowSelection = {
	  onSelect: function(record, selected, selectedRows) {
	    console.log(record, selected, selectedRows);
	  },
	  onSelectAll: function(selected, selectedRows) {
	    console.log(selected, selectedRows);
	  }
	},

	renderProps={
        actionBar: {
           'new': function(type){ alert(type); },
           'import': function(type){ alert(type); },
           'export': function(type){ alert(type); }
        },
        fetchUrl:"http://localhost:3000/demo/data.json",
        jsxcolumns:columns,
        subComp:(<Grid {...renderSubProps}  ref="subGrid"/>),
        rowSelection: rowSelection
	},
	
	renderSubProps={
        jsxcolumns:columns,
        fetchUrl:"http://localhost:3000/demo/data.json",
        queryKeys:["dataKey","firstName"],
        onModifyRow: this.onModifyRow
	};

	<Grid {...renderProps} />

```



### Props

props name       |  defalut Value  |  Note   | 
-----------      |  ------         | -----    |
width            |  100%           | grid width |
height           |  100%           | gird height |
showColumnPicker |  true           |   |
showPager        |  true           |   |
pageSize         |  10             |   |
showHeader       |  true           |   |
headerHeight     |  50             |   |
showMask         |  true           |   |
showSearch       |  true           | action bar search  | 
queryKeys        |  []             | in subComp mode, it tell parent what datas need to pass to child, like a filter, the parent will pass all his data to his child if queryKey is undefined|
fetchUrl         |  ""             | dynamic get data from server |
fetchParams      |  ""             | in form-grid mode, form will pass fetch params for grid |
actionBar        |  null           | actionBar configuration |
jsxcolumns       |  null           | columns config |
jsxdata          |  null           | grid data |


### Props you should define by yourself

> Parent will pass this props to his child  

props name       |  defalut Value  |  Note   | 
passedData       |  null           |  Data passed from parent|



### Columns


Key Name       |  require  |  value type  | Note   | 
-----------    |  ------   |   ---------- | -----  |
dataKey        |  yes      |  string      | use key |
title          |  yes      |  string      | column display name |
width          |  yes      |  number      |   |
hidden         |  optional |  boolean     |   |
order          |  optional |  boolean     | need order feature or not |
type           |  optional |  string      | containing 'money', 'card', 'cnmobile' & 'action' |
items          |  yes      |  array       | when type =='action', we need this attr |
render         |  optional |  function    | for custom cell |
delimiter      |  optional |  string      | delimiter used in type 'money', 'card', 'cnmobile' formating|


```

let columns = [
            { dataKey: 'id', title: 'ID', width: 50,hidden:true},
            { dataKey: 'country', title:'国家', width: 200,ordered:true},
            { dataKey: 'city',title:'城市', width: 150,ordered:true },
            { dataKey: 'firstName',title:"FristName" },  
            { dataKey: 'lastName' ,title:"LastName"},
            { dataKey: 'email',title:"Email",width: 200,ordered:true },
            { dataKey: 'action1', title:'操作1', width:100, type:"action",items:[
              {title:'编辑', type:"inlineEdit", cb: function(rowData){console.info(rowData)}},
              {title:'删除', type:"del", cb: function(rowData){console.info(rowData)}}
            ]},
            { dataKey: 'action', title:'链接', width:100,render: function(rowData){
               return <div><a href="#">{rowData.email}</a></div>
              }
            }
     ]

```



### Rules

 * return data format [here](http://gitlab.alibaba-inc.com/alinw/yosemite/issues/18) 
 ```
   {
	"content":{
			"datas":[
				{	
					"id":'1'
					"grade":"grade1",
					"email":"email1",
					"firstName":"firstName1",
					"lastName":"lastName1",
					"birthDate":"birthDate1",
					"country":"country1",
					"city":"city1"
				}
				...
		
			],
			"currentPage":1,
			"totalCount":30
		},
		"success":true,
		"errorCode":"",
		"errorMsg":""
	}

 ```

### API

* getData
* insertData(objAux)
* removeData(objAux)
* fetchData()
