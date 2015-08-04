# uxcore-grid

---

uxcore gird, will including checkbox, edit text field, column pick etc
![](example/screenshot.png)

## how to run

```sh
$ git clone https://github.com/uxcore/grid
$ cd grid
$ npm install
$ npm run dev
```

## Best Practice

```javascript
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
	<Grid {...renderProps} />
```


