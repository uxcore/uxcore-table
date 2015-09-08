# uxcore-grid

---

uxcore gird, will including checkbox, edit text field, column pick etc
![](demo/screenshot.png)

## how to run

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
     	headerHeight:50,
        width:1000,
        height:500,
        actionBar: {
           'new': function(){ alert('new'); },
           'import': function(){ alert('import'); },
           'export': function(){ alert('export'); },
           'search': true,
           'subComp':'' //TODO
        },
        fetchUrl:"http://localhost:3000/demo/data.json",
        jsxdata:null,
        jsxcolumns:columns,
        pagination:true,
        columnPicker: true,
        mask: true,
        subComp:(<Grid {...renderSubProps}  ref="subGrid"/>),
        rowSelection: rowSelection
	};

	<Grid {...renderProps} />
```

### API

 * TODO

