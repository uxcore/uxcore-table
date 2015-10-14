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
        { dataKey: 'check', type: 'checkbox', disable: false}, // custom checkbox column, dataKey can be anyone, true means checked.
	    { dataKey: 'id', title: 'ID', width: 50,hidden:true},
	    { dataKey: 'country', title:'国家', width: 200,ordered:true},
	    { dataKey: 'city',title:'城市', width: 150,ordered:true },
	    { dataKey: 'firstName',title:"FristName" },  
	    { dataKey: 'lastName' ,title:"LastName"},
	    { dataKey: 'email',title:"Email",width: 200,ordered:true }
	];


	let rowSelection = {
      onSelect: function(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: function(record, data) {
        console.log(record, data);
      }
    };

	renderProps={
        actionBar: {
           'new': function(type, actions){ alert(type); },  // type means 'new' in this line
           'import': function(type, actions){ alert(type); }, // actions contains all grid's APIs, such as actions.addEmptyRow()
           'export': function(type, actions){ alert(type); }
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



## Props

|Name            |Type                |Require |Default|Note |
|---             |---                 |---     |---    |---|
|jsxcolumns      |array               |required|null   |columns config|
|width           |number              |optional|1000   |grid width |
|height          |number              |optional|100%   |gird height |
|showColumnPicker|boolean             |optional|true   ||
|showPager       |boolean             |optional|true   ||
|showHeader      |boolean             |optional|true   ||
|headerHeight    |number              |optional|40     ||
|showMask        |boolean             |optional|true   ||
|showSearch      |boolean             |optional|false  || 
|pageSize        |number              |optional|10     ||
|queryKeys       |array               |optional|[]     |in subComp mode, it tells parent what datas need to pass to child, like a filter, the parent will pass all his data to his child if queryKey is undefined|
|jsxdata         |object              |optional|-      |grid data|
|fetchUrl        |string              |optional|""     |dynamic get data from server |
|fetchParams     |object              |optional|-      |in form-grid mode, form will pass fetch params for grid |
|actionBar       |object              |optional|null   |see Usage to get  |
|beforeFetch     |function(data, from)|optional|noop   |invoked before the grid fetch data, two params `data` and `from`, `data` is the one which will be passed as querys in ajax, `from` means where the fetch is invoked containing 3 preset values `search`,`order` & `pagination`.return the data you really want ajax to send.|
|processData     |function(data)      |optional|noop   |sometimes the data fetched via ajax is not the one which you or grid want, you can use this method to change the data and return it to grid. the param is the data which grid is ready to use for rendering|
|addRowClassName |function(rowData)   |optional|noop   |user can use this to add className to the Row, in order to custom the specific row.|

### Props you should not define by yourself

> Parent will pass this props to his child  

|props name       |  defalut Value  |  Note   | 
|-----------      |  ------         |  -----    |
|passedData       |  null           |  Data passed from parent|



### Columns


|Key Name       |  Require  |  Type       | Note   | 
|-----------    |  ------   |  ---------- | -----  |
|dataKey        |  required |  string     | use key |
|title          |  required |  string     | column display name |
|width          |  required |  number     |   |
|hidden         |  optional |  boolean    |   |
|order          |  optional |  boolean    | need order feature or not |
|type           |  optional |  string     | containing 'money', 'card', 'cnmobile', 'checkbox' & 'action' |
|disable        |  optional |  boolean    | disable a column, now only support type 'checkbox'|
|actions        |  required |  array      | when type =='action', we need this attr |
|[render](https://github.com/uxcore/uxcore-grid/issues/30)        |  optional |  function    | for custom cell |
|[beforeRender](https://github.com/uxcore/uxcore-grid/issues/30)  |  optional |  function    | for custom cell data |
|delimiter      |  optional |  string     | delimiter used in type 'money', 'card', 'cnmobile' formating|


```javascript

let columns = [
        { dataKey: 'check', type: 'checkbox', disable: false}, // custom checkbox column, dataKey can be anyone, true means checked.
        { dataKey: 'country', title:'国家', width: 200,ordered:true},
        { dataKey: 'city',title:'城市', width: 150,ordered:true },
        { dataKey: 'firstName',title:"FristName" },  
        { dataKey: 'lastName' ,title:"LastName", beforeRender: function(rowData){
        	//do logic , then return cell data
        	return 'abc';
        }},
        { dataKey: 'email',title:"Email",width: 200,ordered:true },
        { dataKey: 'action1', title:'操作1', width:100, type:"action",actions:{
            "编辑": function(rowData, actions) {
                me.refs.grid.toggleSubComp(rowData);
            },
            "删除": function(rowData, actions) {	
                me.refs.grid.delRow(rowData);
            }
         }},
        { dataKey: 'action', title:'链接', width:100,render: function(cellData,rowData){
           return <div><a href="#">{rowData.email}</a></div>
          }
        }
 ]

```



## Rules

 * return data format [here](http://gitlab.alibaba-inc.com/alinw/yosemite/issues/18) 



```javascript
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

> the above the data format which server should send, if you pass data via jsxdata, you just need passed the `content`, like below

```javascript
{
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
}
```

## API

* fetchData(from): call this method when you want the grid to fetch Data via ajax again. 
    * @param from {string} {optional}: the param will be passed to props.beforeFetch.
* getData()
* addEmptyRow()
* addRow(rowData)
* updataRow(rowData): used in inline edit
* delRow(rowData)
* toggleSubComp(rowData): show or hide sub comp