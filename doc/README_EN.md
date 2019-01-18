# uxcore-table

---

uxcore table, will including checkbox, edit text field, column pick etc


![](demo/screenshot.png)

## How to run

```sh
$ git clone https://github.com/uxcore/uxcore-table
$ cd uxcore-table
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
           'import': function(type, actions){ alert(type); }, // actions contains all table's APIs, such as actions.addEmptyRow()
           'export': function(type, actions){ alert(type); }
        },
        fetchUrl:"http://localhost:3000/demo/data.json",
        jsxcolumns:columns,
        subComp:(<Table {...renderSubProps}  ref="subTable"/>),
        rowSelection: rowSelection
	},

	renderSubProps={
        jsxcolumns:columns,
        fetchUrl:"http://localhost:3000/demo/data.json",
        queryKeys:["dataKey","firstName"],
        onModifyRow: this.onModifyRow
	};

	<Table {...renderProps} />

```



## Props

|Name            |Type                |Require   |Default|Note |
|---             |---                 |---       |---    |---|
|jsxcolumns      |array               |required  |null   |columns config|
|width           |number              |optional  |1000   |table width |
|height          |number              |optional  |100%   |table height |
|showColumnPicker|boolean             |optional  |true   ||
|showPager       |boolean             |optional  |true   ||
|showHeader      |boolean             |optional  |true   ||
|headerHeight    |number              |optional  |40     ||
|showMask        |boolean             |optional  |true   ||
|showSearch      |boolean             |optional  |false  ||
|pageSize        |number              |optional  |10     ||
|queryKeys       |array               |optional  |[]     |in subComp mode, it filters the data which will be passed to the sub component.|
|jsxdata         |object              |optional  |-      |used as the default data when ajax has not been done|
|fetchUrl        |string              |optional  |""     |dynamic get data from server |
|fetchParams     |object              |optional  |-      |in form-table  mode, form will pass fetch params for table |
|actionBar       |object              |optional  |null   |see Usage to get  |
|beforeFetch     |function(data, from)|optional  |noop   |invoked before the table fetch data, two params `data` and `from`, `data` is the one which will be passed as querys in ajax, `from` means where the fetch is invoked containing 3 preset values `search`,`order` & `pagination`.return the data you really want ajax to send.|
|processData     |function(data)      |optional  |noop   |sometimes the data fetched via ajax is not the one which you or table want, you can use this method to change the data and return it to table. the param is the data which table is ready to use for rendering|
|addRowClassName |function(rowData)   |optional  |noop   |user can use this to add className to the Row, in order to custom the specific row.|
|renderModel     |string              |optional  |'tree' |render to tree model |
|levels          |number              |optional  |1      |tree model, default expand level number |
|defaultEditable |boolean             |optional  |false  | |

### Props you should not define by yourself

> Parent will pass this props to his child

|props name       |  defalut Value  |  Note   |
|-----------      |  ------         |  -----    |
|passedData       |  null           |  Data passed from parent|



### Columns Config


|Key Name       |  Require  |  Type       | Note   |
|-----------    |  ------   |  ---------- | -----  |
|dataKey        |  required |  string     | which key in data will be shown in view mode |
|editKey        |  optional |  string     | which key in data will be used in edit mode, equal to dataKey if not specified |
|title          |  required |  string     | table head name |
|width          |  required |  number     |        |
|hidden         |  optional |  boolean    |        |
|order          |  optional |  boolean    | show the built-in sorter |
|type           |  optional |  string     | containing 'money', 'card', 'cnmobile', 'checkbox', 'action', 'radio', 'text', 'select' & 'custom' |
|actions        |  optional |  array      | when type =='action', we need this attr |
|customField    |  optional |  React Component| when type is 'custom', pass your custom Field extended from CellField to Table|
|render         |  optional |  function   | render the cell as you want, return a react element |
|fixed          |  optional |  boolean    | set the column fixed or not |
|delimiter      |  optional |  string     | delimiter used in type 'money', 'card', 'cnmobile' formating|
|align          |  optional |  string     | text-align, default: 'left' |


```javascript

let columns = [
        { dataKey: 'check', type: 'checkbox', disable: false}, // custom checkbox column, dataKey can be anyone, true means checked.
        { dataKey: 'country', title:'国家', width: 200,ordered:true},
        { dataKey: 'city',title:'城市', width: 150,ordered:true },
        { dataKey: 'firstName',title:"FristName" },
        { dataKey: 'lastName' ,title:"LastName"},
        { dataKey: 'email',title:"Email",width: 200, ordered:true },
        { dataKey: 'action1', title:'操作1', width:100, type:"action",actions: [
            {
                title: '编辑',
                callback: (rowData) => {
                    me.refs.grid.editRow(rowData);
                },
                mode: Constants.MODE.VIEW
            },
            {
                title: '保存',
                callback: (rowData) => {
                    me.refs.grid.saveRow(rowData);
                },
                mode: Constants.MODE.EDIT
            }
        ]},
        { dataKey: 'action', title:'链接', width:100, render: function(cellData,rowData) {
            return <div><a href="#">{rowData.email}</a></div>
        }}
 ]

```



## Rules

* return data format [here](http://gitlab.alibaba-inc.com/alinw/yosemite/issues/18)



```javascript
   {
	"content":{
		"data":[
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
	"success": true,
	"errorCode": "",
	"errorMsg": ""
	}

```

> the data format above is what server should send. If you pass data via jsxdata, you just need passed the `content`, like below

```javascript
{
    "data":[
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

### Row Editing

* getData(): return cellData & do Validation
* addEmptyRow(): add an empty Row in 'edit' mode
* addRow(rowData): add an row with specified data in 'edit' mode.
* delRow(rowData): delete specified row by jsxid
* editRow(rowData): make the specified row in 'edit' mode.
* viewRow(rowData): make the specified row in 'view' mode.
* saveRow(rowData): save the row change.
* resetRow(rowData): cancel the row change before saveRow() is called.

### Data Fetching

* fetchData(from): call this method when you want the table to fetch Data via ajax again.
    * @param from {string} {optional}: this param will be passed to props.beforeFetch.

### Other

* toggleSubComp(rowData): show or hide sub comp
