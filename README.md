# uxcore-table

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url]
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-table.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-table
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-table.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-table
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-table.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-table?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-table.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-table
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-table.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-table#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-table.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-table.svg
[sauce-url]: https://saucelabs.com/u/uxcore-table

Table UI Component based on React. working for many modes such as sub table, tree table and inline editing table.

## How to run

```sh
$ git clone https://github.com/uxcore/uxcore-table
$ cd uxcore-table
$ npm install
$ npm start
```


## API

### 行内编辑用

* getData(): 返回表格的数据，并作校验。
* addEmptyRow(): 添加一个空的新行。
* addEmptyRowFromTop(): 从顶部添加一个空的新行。
* addRow(rowData): 以指定数据添加一个新行。
* addRowFromTop(rowData): 以指定数据从顶部添加一个新行。
* addSubRow(subRowData, rowData, cb): 树形表格模式下从底部插入一个子树节点行
* addSubRomFromTop(subRowData, rowData, cb): 树形表格模式下从顶部插入一个子树节点行
* delRow(rowData): 删除一个新行。
* editRow(rowData): 使指定的行切换到编辑模式。
* editAllRow(): 使所有行切换到编辑模式。
* viewRow(rowData): 使指定的行切换到查看模式。
* viewAllRow(): 使所有行切换到查看模式。
* saveRow(rowData): 保存行的数据(同时切换至查看模式)。
* saveAllRow(): 保存所有行的数据(同时切换至查看模式)。
* resetRow(rowData): 重置行到数据（若保存过，则为保存过后的数据）。
* resetAllRow(): 重置所有行的数据（若保存过，则为保存过后的数据）。
* resetAndViewAllRow(): 重置所有行数据（若保存过，则为保存过后的数据）并切换至查看模式。


### 获取数据

* fetchData(from): 使表格重新请求一次数据。
    * @param from {string} {optional}: 这个参数会传入到 beforeFetch 的回调中。

### 创建一个 CellField

* createCellField(options)

|Name                |Type                |Require   |Default     |Since Ver. |Note |
|---                 |---                 |---       |---         |---        |---|
|options.component           |React Element       |yes       |input       |1.12.8     |被包裹的组件，需要提供 value 和 onChange，或相同功能的 API |
|options.valuePropName       |string              |No        |value       |1.12.8     |与 value 对应的 prop 名字 |
|options.changePropName      |string              |No        |onChange    |1.12.8     |与 onChange 对应的 prop 名字|
|options.processValue        |func                |No        | -          |1.12.8     |针对 value（editKey 对应字段）的处理函数|
|options.processText         |func                |No        | -          |1.12.8     |针对 text (dataKey 对应字段) 的处理函数|

### 其他

* toggleSubComp(rowData): 使指定的行显示或隐藏二级组件(subComp)。
* moveRowUp(rowData): 使指定的行向上移动一行
* moveRowDown(rowData): 使指定的行向下移动一行





## Props

|Name                |Type                |Require   |Default     |Since Ver. |Note |
|---                 |---                 |---       |---         |---        |---|
|jsxcolumns          |array               |required  |null        | -         |表格列配置项，具体见[这里](#jsxcolumns)|
|width               |number              |optional  |1000        | -         |表格的宽度|
|height              |number              |optional  |100%        | -         |表格的高度|
|showColumnPicker    |boolean             |optional  |true        | -         |是否显示列筛选按钮|
|showPager           |boolean             |optional  |true        | -         |是否显示分页|
|showPagerTotal      |boolean             |optional  |false       | 1.3.17    |是否显示分页的总数部分|
|showPagerSizeChanger|boolean             |optional  |true        | 1.6.9     |是否可以改变分页的pageSize|
|isMiniPager         |boolean             |optional  |false        | 1.6.9     |分页是否是mini的|
|showHeader          |boolean             |optional  |true        | -         |是否显示表格头部|
|showHeaderBorder    |boolean             |optional  |false       | 1.3.6     |是否显示头部列之间的分割线|
|showMask            |boolean             |optional  |true        | -         |是否在 loading 的时候显示蒙层|
|showSearch          |boolean             |optional  |false       | -         |是否显示内置的搜索栏|
|doubleClickToEdit   |boolean             |optional  |true        | -         |是否开启双击编辑|
|fetchDataOnMount    |boolean             |optional  |true        | 1.3.18    |是否在组件 Mount 时立刻获取一次数据|
|rowSelector         |string              |optional  |复选        | 1.3.20    |行选择是复选还是单选，支持 checkboxSelector 和 radioSelector|
|locale              |string              |optional  |zh-cn       | 1.3.17    |国家化，目前支持 zh-cn/en-us|
|emptyText           |string or element   |optional  |"暂无数据"   | -         |当没有数据时 Table 展示的文案|
|searchBarPlaceholder|string              |optional  |"搜索表格内容"| 1.3.0     |searchBar 的占位符|
|loadingText         |string              |optional  |"loading"   | 1.4.4     |加载数据时的文案|
|headerHeight        |number              |optional  |40          | -         |表格头部的高度|
|pageSize            |number              |optional  |10          | -         |每页显示多少条数据|
|pagerSizeOptions    |array               |optional  |[10,20,30,40] | -       |显示的可选 pageSize|
|queryKeys           |array               |optional  |[]          | -         |有哪些数据会传递给 subComp|
|jsxdata             |object              |optional  |-           | -         |在远端数据还没有返回时用作默认数据|
|fetchUrl            |string              |optional  |""          | -         |表格的数据源|
|fetchParams         |object              |optional  |-           | -         |表格在请求数据时，会额外附带的参数，具有最高的优先级|
|fetchWithCredentials|bool                |optional  |-   | 7.8.0     | 同 [NattyFetch](https://github.com/jias/natty-fetch/blob/master/docs/options.md#withcredentials) 配置
|actionBar           |object/array        |optional  |null        | -         |表格内置的操作条配置，详细[见此](#actionbar)|
|beforeFetch         |function(data, from)|optional  |noop        | -         |两个参数，data 表示表格请求数据时即将发送的参数，from 表示这次请求数据的行为从哪里产生，内置的有 `search`(搜索栏),`order`(排序) & `pagination`(分页)，该函数需要返回值，返回值为真正请求所携带的参数。|
|processData         |function(data)      |optional  |noop        | -         |有时源返回的数据格式，并不符合 Table 的要求，可以通过此函数进行调整，参数 data 是返回数据中 content 字段的 value，该函数需要返回值，返回值为符合 content 字段 value 的数据结构。|
|onFetchError        |function(result)    |optional  |noop        | 1.3.7     |在返回数据中 success 不是 true 的情况下触发，返回所有请求得到的数据|
|onSearch            |function(searchTxt) |optional  |noop        | 1.6.1     |未配置 fetchUrl 的情况下触发，传回搜索的关键词|
|onOrder             |function(column, orderType) | optional | noop | 1.6.1   |未配置 fetchUrl 的情况下触发，传回排序的列和排序方式|
|onPagerChange       |function(current, pageSize) | optional | noop | 1.6.1   |未配置 fetchUrl 的情况下触发，传回要到达的分页和每页条数|
|onColumnPick        |function(columns)   |optional  |noop        | 7.6.0     |勾选自定义列时触发，参数为勾选后的 columns |
|onFilter            |function(filters)   |optional  |noop        | 9.0.0     |未配置 fetchUrl 的情况下触发，传回需要进行过滤的参数|
|addRowClassName     |function(rowData)   |optional  |noop        | -         |用于为特定的某几行添加特殊的 class，用于样式定制|
|rowSelection        |object              |optional  |noop        | -         |选中复选框时触发的回调，rowSelection 是由回调函数组成的对象，包括 onSelect 和 onSelectAll，例子见此|
|rowGroupKey         |string              |optional  |            | 8.2.0     |用于行分组，可选值为 columns 设置中 dataKey，使用对应的列内容做行分组 |
|defaultEditable     |boolean             |optional  |false       | 10.4.16   |默认开启行编辑模式|
|useListActionBar    |boolean             |optional  |false       | 10.5.0    |新版listActionBar开关，actionBar配置，详细[见此](#actionbar)|
|getTooltipContainer |function()          |optional  |null        | 10.5.2    |单元格编辑状态下，tooltip位置可控
|columnResizeable    |boolean             |optional  |false       | 10.5.3    |表格列可拖拽


### 折叠展开专用
|Name            |Type                |Require   |Since Ver. |Default|Note |
|---             |---                 |---       |---        |---    |---|
|renderSubComp   |function(rowData)   |optional  |1.3.15     | -     |传入二级组件，该函数需要返回值，返回 false，表示不渲染二级，返回 jsx，则渲染该 jsx|
| toggleSubCompOnRowClick | boolean   |optional  |8.5.0      |false  |在点击行的时候，展开和收起折叠面板，操作列不受影响。其他区域如果不想触发需要自行 stopPropagation |


### Tree 模式专用

|Name            |Type                |Require   |Since Ver. |Default|Note |
|---             |---                 |---       |---        |---    |---|
|renderModel     |string              |optional  |-          |''     |使用 tree 模式时，此项为 'tree'|
|levels          |number              |optional  |-          |0      |tree 模式默认展开的级数|
|toggleTreeExpandOnRowClick | boolean |optional  |9.1.0      |false  |在点击行的时候，展开和收起对应的树节点，操作列不受影响。
|loadTreeData    |function            |optional  |9.1.1      |---    |异步加载子数据，返回值可以是一个promise对象(格式:{data: [...]},也可以是一个对象(格式: {data: [...]})}|

### 行内编辑表格专用

|Name            |Type                |Require   |Since Ver. |Default|Note |
|---             |---                 |---       |---        |---    |---|
|onChange        |function(data)      |optional  |-          |noop   |有表格编辑行为触发，参数的数据格式为 {data: 表格的所有数据, changedData: 变动行的数据, dataKey: xxx, editKey: xxx, pass: 正在编辑的域是否通过校验} |
|getSavedData    |boolean             |optional  |-          |true   |getValues() 和 onChange 返回的数据是否是保存之后的数据(通过了 saveRow() 的数据)|


### 页底（Footer）

页底是固定在表格底部的一个特殊行，可用于统计合计等场景。

|Name            |Type                |Require   |Since Ver. |Default|Note |
|---             |---                 |---       |---        |---    |---|
|showFooter      |boolean             |optional  |8.4.0      |true   |在配置了 footer 参数后，是否显示页底|
|showRowGroupFooter|boolean           |optional  |8.4.0      |false  |是否显示行分组中的 footer |
|footer          |function({data, column, rowGroupData, from})|optional|8.4.0| - | 页底渲染函数，data 为表格数据（一个数组），column 为当前列配置，rowGroupData 和 from 在 showRowGroupFooter 为 true 时生效，分别返回当前行分组的所有数据，和一个标志位 'rowGroup' |


### 列配置项(jsxcolumns)

|Key Name        |Type              |Since Ver.|Require  |Note   |
|-----------     |----------        |---       |------   |-----  |
|dataKey         |string            |-         |required |表格的数据中用于查看模式展示的字段|
|editKey         |string            |-         |optional |表格的数据中用于编辑模式的字段，如对于 select 来说，此项应为选项里的 key|
|align           |string            |-         |optional |文字居中方式，默认 'left'|
|title           |string/func       |-         |required |列头标题，可以是个函数，根据返回值进行渲染|
|width           |number            |-         |required |列宽，支持 100px, 100, '30%'(7.7.0 之后支持)|
|hidden          |boolean           |-         |optional |是否隐藏，默认为 false|
|ordered         |boolean           |-         |optional |是否显示内置的排序，默认为 false|
|type            |string            |-         |optional |包含 'money', 'card', 'cnmobile', 'checkboxSelector', 'action', 'radio', 'text', 'select' 和 'custom'|
|actions         |array             |-         |optional |当 type 是 action 的时候会用到，用于定义具体有哪些操作，格式见下方[说明](#actions)|
|collapseNum     |number            |1.9.4     |optional |当 type 是 action 的时候会用到，默认 3，指定超过多少个 action 时折叠|
|actionType      |string            |1.9.4     |optional |当 type 是 action 的时候会用到，默认 link，枚举值：link/button|
|customField     |React Element     |-         |optional |当 type 是 custom 的时候会用到，用于传入自定义的 Field，用于行内编辑|
|render          |function          |-         |optional |在查看模式下，用户定制渲染的方式，返回一个 jsx 格式|
|fixed           |boolean           |-         |optional |是否固定在左侧，固定列不可以和折叠展开面板混合使用|
|rightFixed      |boolean           |1.14.0    |optional |是否固定在右侧，固定列不可以和折叠展开面板混合使用|
|delimiter       |string            |-         |optional |在 type 是 'money', 'card', 'cnmobile' 的时候会用到，用于传入格式化的分隔符|
|disable         |boolean           |-         |optional |在 type 为 checkboxSelector 时使用，是否禁用 checkbox，优先级高于 isDisable|
|isDisable       |function(rowData) |1.3.1     |optional |在 tpye 为 checkboxSelector 时使用，为一个回调函数，用于根据 rowData 去判断是否禁用该行的 checkbox|
|canEdit         |function(rowData) |1.3.3     |optional |在 type 为可编辑表格的类别时使用，为一个回调函数，用于根据 rowData 去判断该行该列是否可以编辑|
|config          |object            |1.5.0     |optional |在 type 为 text/select/radio 时使用，传入对应的配置项，配置项与对应的组件(uxcore-selelct2)相同|
|renderChildren  |function          |1.5.0     | -       |在 type 为 select/radio 时使用，通过返回 jsx 传入选项。|
|filters         |array             |9.0.0     |optional |表头的筛选菜单项。具体格式见下方|



### 列配置项的例子
```javascript

let columns = [
    // 定制 checkbox 列，dataKey 对应的应是一个 bool 值，表明是否被选中，可以用于控制行选中。
    { dataKey: 'check', type: 'checkbox' },
    // 定制渲染的例子
    { dataKey: 'name', render: (cellData) => (<a>{cellData}</a>) },
    // filters 配置的例子
    {
        dataKey: 'firstName',
        title: 'FristName',
        width: '15%',
        filters: [{
          text: 'Joe',
          value: 'Joe',
        }, {
          text: 'Jim',
          value: 'Jim',
        }, {
          text: 'Submenu',
          value: 'Submenu',
          children: [{
            text: 'Green',
            value: 'Green',
          }, {
            text: 'Black',
            value: 'Black',
          }],
        }],
        message: '这是一个提示',
        ordered: true,
      },
    }
 ]

```

## 列配置项的例子2（带列群组, since ver. 1.3.0）
```javascript

let columns = [
        { dataKey: 'check', type: 'checkbox', disable: false}, // custom checkbox column, dataKey can be anyone, true means checked.
        {
            group: "国家",
            columns: [
                { dataKey: 'country', title:'国家', width: 200,ordered:true},
                { dataKey: 'country2', title:'国家2', width: 200,ordered:true},
            ]
        }
 ]

```

## rowSelection 的例子

```javascript

let rowSelection = {
      onSelect: function(record, selected, selectedRows) {
          console.log(record, selected, selectedRows);
      },
      onSelectAll: function(record, data) {
          console.log(record, data);
      },
      isDisabled: function(rowData) {
          return false;
      }
};

```


## 返回的数据格式

* 数据格式的约定[见此](http://gitlab.alibaba-inc.com/alinw/yosemite/issues/18)

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

> 上面的数据格式是 ajax 返回的数据格式要求，如果你通过 jsxdata 传值，只需要 content 里面的内容。

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

### ActionBar 配置的例子

```javascript

// actionBar 支持传入一个对象
actionBar: {
    "新增行": () => { // 点击回调
        me.refs.grid.addEmptyRow();
    },
    "编辑所有行": () => {
        me.refs.grid.editAllRow();
    }
}

// 或者定制能力更加强大的数组
actionBar: [
    {
        title: '新增行', // 显示名称
        callback: () => { // 点击回调
            me.refs.grid.addEmptyRow();
        },
        render: (title) => { // 定制渲染
            return <Button>{title}</Button>
        }
    },
    {
        title: "编辑所有行",
        callback: () => {
            me.refs.grid.editAllRow();
        }
    },
    {
        title: "保存所有行",
        callback: () => {
            me.refs.grid.saveAllRow();
        }
    }

]

// 当启用useListActionBar时，actionBar上的所有功能将在`actionBar`内完成
actionBar: {
    className: 'my-list-action-bar',
    // 是否显示全选
    showSelectAll: true,
    // 按钮配置
    buttons: [
      {
        title: 'Action Button',
        render() {
          return (
            <Button type={'primary'}>切换子表格状态</Button>
          )
        },
        keepActiveInCustomView: false,
        callback: () => {
          this.forceUpdate();
          console.log(me.table.getData());
          me.table.toggleSubComp(me.table.getData().data.datas);
        },
      },
      {
        title: '按钮',
        keepActiveInCustomView: false,
        // size: 'large',
        type: 'primary',
        // className: 'xxxxx',
        callback: () => {
          me.table.selectAll(true);
        }
      }
    ],
    // 文案提示
    actionBarTip: '已经为您找到记录123条',
    // 自定义内容
    customBarItem: {
      render() {
        return (
          <p style={{color: 'red'}} onClick={(e) => {console.log(e)}}>自定义内容</p>
        )
      }
    },
    // 行排序
    rowOrder: {
      iconName: 'paixu-jiangxu',
      // keepActiveInCustomView: true,
      defaultValue: {
        text: '排序方式一',
        value: '123'
      },
      items: [
        {
          text: '排序方式一',
          value: '123'
        },
        {
          text: '排序方式二',
          value: '456'
        }
      ],
      onChange(data) {
        console.log(data)
      }
    },
    // 列排序
    columnsOrder: {
      iconName: 'huxiangguanzhu',
      // keepActiveInCustomView: true,
      title: '列排序',
      includeActionColumn: false,  // 优先级低于fixed和rightFixed
      onChange(dragInfo, data) {
        console.log(data)
      }
    },
    // 列选择
    columnsPicker: {
      iconName: 'zidingyilie',
      title: '自定义列',
      keepActiveInCustomView: true,
      onChange(data) {
        console.log(data)
      }
    },
    // 自定义视图，支持返回promise和component
    customView: {
      render(data, currentPage) {
        console.log(data, currentPage);
        // return (
        //   <Test name={'自定义的View'}/>
        // )
        return new Promise(function(resolve) {
          setTimeout(() => {
            resolve(<Test name={'自定义的View'}/>)
          })
        })
      }
    },
    // 是否显示翻页器
    showMiniPager: true,
    search: {
      // placeholder: '请输入搜索关键字',
      onSearch() {
        console.log(234234)
      }
    },
    // 在自定义视图下移出翻页器
    removePagerInCustomView: true,
    linkBar: [
      {
        title: '修改columns',
        callback: () => {
          this.setState({
            columns: this.state.columns.filter(item => {
              return item.title === 'LastName'
                || item.title === 'Email'
                || item.title === '操作1'
            })
          })
        },
      },
      {
        title: '操作外链二',
        callback: () => {
          alert(2);
        },
      },
    ],
}
```




### actions 配置的例子

```javascript
actions: [
    {
        title: '编辑', // 操作名称
        callback: (rowData) => { // 操作回调
            me.refs.grid.editRow(rowData);
        },
        mode: Constants.MODE.VIEW // 非必要参数，只在何种模式下显示
    },
    {
        title: '保存',
        callback: (rowData) => {
            me.refs.grid.saveRow(rowData);
        },
        mode: Constants.MODE.EDIT,
        render: (title, rowData) => { // 定制渲染
            return title + '1'
        }
    }
]
```

### 对于多行的支持

> 正常情况下，Table 中每个单元格按照一行缩略的方式展示，根据业务需要，有时可能需要展示多行，对此，Table 通过 prop `addRowClassName` 配合专属类名 `multiline` 来实现。示例如下：

```
addRowClassName: function(rowData) {
    return 'multiline';
}
```

> 需要注意：当配置为 multiline 时，用户需自己处理上下间距的问题，处理的方式应为在 multiline 或其他专属类名作用域下进行设置，避免影响其他非 multiline 设置的行。当 **多行 和 固定列 同时开启** 时，表格需要经过比较大量的计算去调整固定列中行的高度，对 **性能** 产生一定的影响。

