# History

---

## 7.3.0

* `CHANGED` only select cell text when the cell is double clicked

## 7.2.0

* `CHANGED` style adjustment

## 7.1.2

* `CHANGED` more robust `checkBodyHScroll`
* `FIXED` more reliable check logic

## 7.1.0

* `CHANGED` hide pager if totalCount is lower than pageSize and sizeChanger is hiden.
* `CHANGED` update CellField to `^0.2.0`, support `errMsg`
* `CHANGED` collapsed Button style adjustment
* `CHANGED` add a new theme type `ghost` for the nested table.
* `FIXED` group table column picker bug when toggle an item's visibility in common group.
* `FIXED` group fixed table border bug

## 7.0.0

* `FIXED` fixed table height React warning
* `CHANGED` use popover instead of column picker dropdown
* `CHANGED` new column picker trigger icon
* `CHANGED` style: mask color & fixed table box-shadow
* `CHANGED` add animation when toggling sub component 

## 6.5.0

* `CHANGED` hide vertical scrollBar if body can not scroll vertically.

## 6.4.0

* `NEW` support a new type `split-line`.

## 6.3.0

* `CHANGED` `resetRow` & `resetAllRow` will do validate
* `FIXED` fixed Row height not equal to main table if multiline row mode is on

## 6.2.2

* `FIXED` `checkBodyHScroll` may throw error if `rightFixedTable` is not defined
* `FIXED` rightFixedTable position bug if table width is too large to scroll.

## 6.2.1

* `FIXED` `action.isDisable` fail to work.
* `CHANGED` pass rowData to `action.isDisable`

## 6.2.0

* `NEW` support new prop `shouldResetExpandedKeys`

## 6.1.0

* `NEW` add new method `viewAllRow`, `resetAllRow` and `resetAndViewAllRow`.
* `FIXED` DateCellField icon style

## 6.0.1

* `FIXED` undefined bug if column is fixed in `Header`

## 6.0.0

* `CHANGED` update `uxcore-pagiantion` to ~0.6.0

## 5.1.1

* `FIXED` copyData can be changed by `addValuesInData` method

## 5.0.1

* `FIXED` default width of rowSelector is not equal in every case.

## 5.0.0

* `CHANGED` update `uxcore-date-cell-field` to ^0.4.0
* `CHANGED` update `uxcore-pagiantion` to ~0.5.0

## 4.1.0

* `FIXED` method `getCheckStatus` & `selectAll` bug when `rowSelection.isDisabled` is used

## 4.0.0

* `CHANGED` update `uxcore-pagiantion` to ~0.4.0

## 3.0.0

* `FIXED` scrolling to right end will cause unaligned header & body

## 2.0.3

* `FIXED` fix left fixed table style bug

## 2.0.2

* `FIXED` remove useless code in `Cell` componentDidMount 

## 2.0.1

* `CHANGED` show emptyData if fetch errors
* `CHANGED` action hoverMenu will be hiden if a menu item is clicked.

## 2.0.0

* `CHANGED` update `uxcore-date-cell-field` to ^0.3.0

## 1.14.4

* `CHANGED` add margin-bottom to the empty data cell

## 1.14.3

* `CHANGED` `moveRowUp` & `moveRowDown` support tree mode.

## 1.14.2

* `CHANGED` `subComp` logic is removed, use `renderSubComp` instead.

## 1.14.1

* `CHANGED` only show fixedTable when data exists

## 1.14.0

* `NEW` support `column.rightFixed`
* `CHANGED` refactor fixed column render logic

## 1.13.1

* `NEW` inline edit API support callback.

## 1.13.0

* `NEW` new animation

## 1.12.22

* `CHANGED` rowData will be passed in selectCellField's `beforeFetch` & `afterFetch` method.

## 1.12.21

* `FIXED` set `this.data` in constructor
* `CHANGED` abnormal `this.data` will be concerned in `getData` method

## 1.12.20

* `NEW` add new prop `onSave`

## 1.12.18

* `NEW` `column.actions` can be a function

## 1.12.16

* `CHANGED` move prop `isRowSelectorDisabled` to `rowSelection.isDisabled`

## 1.12.15

* `NEW` add new prop `isRowSelectorDisabled`

## 1.12.14

* `FIXED` `column.rules` fail to work in `SelectCellField`

## 1.12.11

* `NEW` add type `check` to support inline checkbox editing

## 1.12.10

* `CHANGED` `SelectCellField` support `searchDelay` in order to optimize search performance

## 1.12.9

* `NEW` add new API `moveRowUp` & `moveRowDown`

## 1.12.8

* `CHANGED` move all APIs to `methods.js`
* `NEW` new API `createCellField`

## 1.12.7

* `CHANGED` RadioCellField support `config.data`

## 1.12.6

* `CHANGED` more powerful SelectCellField
* `CHANGED` add DateCellField
* `CHANGED` depend on `uxcore-cell-field`

## 1.12.5

* `FIXED` onPagerChange fail to be triggered in fetchLocalData mode.

## 1.12.4

* `FIXED` setState may be triggered in componentWillMount

## 1.12.3

* `FIXED` rowData passed in method `addRowClassName` may be undefined

## 1.12.2

* `FIXED` SelectCellField: bug when value is undefined
* `FIXED` multiline reset is not thorough

## 1.12.1

* `CHANGED` set default labelInValue in SelectCellField 

## 1.12.0

* `CHANGED` new empty data

## 1.11.4

* `CHANGED` action will not render if render function return false [#158](https://github.com/uxcore/uxcore-table/issues/158)
* `FIXED` props `levels` fail to work [#157](https://github.com/uxcore/uxcore-table/issues/157)

## 1.11.0

* `CHANGED` actionBar button type (the first is outline  & others are secondary)
* `CHANGED` change header title font-size to 14px
* `CHANGED` lint (reduce errors number to 24)

## 1.10.5

* `CHANGED` change tree icon in subComp mode.
* `FIXED` columnPicker can hide all columns.

## 1.10.4

* `CHANGED` `column.collapseNum` will support string

## 1.10.3

* `FIXED` treeIcon cell should not has right border when className is kuma-uxtable-border-line.

## 1.10.0

* `FIXED` body width calculation bug when there is fixed columns & width is not defined.

* `CHANGED` new action column

* `CHANGED` new column picker

* `CHANGED` js style standardization `Cell/index`, `ActionBar`, `SearchBar`

* `CHANGED` replace `deepcopy` with `lodash/cloneDeep`

* `CHANGED` order icon change

* `NEW` add link bar

## 1.9.6

* `FIXED` bodyHeight calculation bug [#132](https://github.com/uxcore/uxcore-table/issues/132)
* `FIXED` emptyText lineHeight calculation bug [#133](https://github.com/uxcore/uxcore-table/issues/133)

## 1.9.5

* `CHANGED` change default fitResponse 

## 1.9.4

* `CHANGED` support column.collapseNum

## 1.9.3

* `CHANGED` table will listen props.fetchParams change.

## 1.9.2

* `FIXED` fetchData caused by fetchParams change will pass the out-dated params.

## 1.9.1

* `FIXED` saveRow bug [#155](https://github.com/uxcore/uxcore-table/issues/155)
* `FIXED` missing deepcopy protect when passing parma in column.action. [#154](https://github.com/uxcore/uxcore-table/issues/154)

## 1.9.0

* `FIXED` jsxdata.currentPage bug (#153)
* `FIXED` table will fetch data from previous url instead of new url. (#153)
* `FIXED` mask style (break change)  

## 1.8.7

* `FIXED` unmount bug

## 1.8.6

* `FIXED` toggleSubComp bug

## 1.8.5

* `FIXED` Table.js is missing in build

## 1.8.4

* `FIXED` currentPage is useless when using jsxdata (#152)

## 1.8.3

* `CHANGED` jQuery free!

## 1.8.2

* `CHANGED` column.renderChildren will pass rowData to user.

## 1.8.1

* `FIX` fix header title bug when column.title is a function.

## 1.8.0

* `NEW` support column group
* `NEW` support column tilte custom render 

## 1.7.0

* `CHANGED` update `uxcore-select2` to ~0.3.0

## 1.6.10

* `CHANGED` recover the logic about passedData in fetchData method.

## 1.6.9

* `NEW` add new prop `isMiniPager` & `showPagerSizeChanger`

## 1.6.8

* `FIXED` fix bug that columnPicker can make all coloumns hidden (#140)
* `FIXED` fix bug that columnPicker will show checkbox row when checkbox is user-defined.

## 1.6.7

* `FIXED` fix bug in `column.isDisable`

## 1.6.6

* `CHANGED` replace half-checked icon with svg

## 1.6.4

* `FIX` even row calculation bug

## 1.6.3

* `CHANGED` little change in tree mode style

## 1.6.2

* `NEW` add new prop `onSearch` `onOrder` `onPagerChange`
* `FIX` fix upperCase

## 1.6.1

* `CHANGED` tree mode style improve
* `CHANGED` remove props.passedData support

## 1.6.0

* `NEW` new tree select mode (support checked/unchecked/halfchecked)

## 1.5.1

* `CHANGED` update radiogroup to ~1.2.0.

## 1.5.0

* `FIX` replace `column.children` with `column.renderChildren` in edit mode to improve the render performance.

## 1.4.11

* `FIX` fix tree mode
* `NEW` add prop `pagerSizeOptions`
* `FIX` fix checkbox status bug when no data

## 1.4.10

* `FIX` select error not shown in inline edit mode (#128)
* `FIX` multiline mode reset is not complete (#127)
* `FIX` reset selectAll status when data source is changed. (#125)
* `FIX` showMask bug (#125)

## 1.4.9

* `CHANGED` change defaultProps in `prototype.js`

## 1.4.8

* `CHANGED` add defaultProps in `prototype.js`

## 1.4.7

* `CHANGED` merge feature/style branch 

## 1.4.6

* `NEW` add visual engine support
* `CHANGED` fetchData if url changes

## 1.4.5

* `NEW` change picker to new standard

## 1.4.4

* `NEW` add new prop `loadingText`

## 1.4.3

* `CHANGED` change popover to tooltip

## 1.4.2

* `FIX` fix the checkbox column margin & action bar button style

## 1.4.1

* `FIX` fix the action menu won't disappear when clicked.

## 1.4.0

* `CHANGED` new style 

## 1.3.21

* `HOTFIX` change the warning text of using type:checkbox.

## 1.3.20

* `NEW` add new prop `rowSelector` to support radio row selector

## 1.3.19

* `HOTFIX` fix ie checkout style bug

## 1.3.18

* `NEW` app props `fetchDataOnMount` to control whether table will fetch data when mount.
* `FIXED` fix style bug of checkbox in IE.
* `CHANGED` abort the ajax if next ajax request comes.
* `CHANGED` server render support

## 1.3.17

* `NEW` i18n support zh-cn/en-us
* `FIXED` fix issue #111 #113 #114 #115

## 1.3.16

* `FIX` fix issue #110

## 1.3.15

* `NEW` add new props `renderSubComp`

## 1.3.14

* `CHANGED` change output from src/ to build/

## 1.3.7

* `FIXED` fix bug #109 in fetchData

## 1.3.6

* `FIXED` fix action split bug
* `CHANGED` add props showHeaderBorder 

## 1.3.5

* `CHANGED` add split in action column

## 1.3.4

* `FIXED` fix BUG #103
* `CHANGED` issue #99 #100 #101 #102 

## 1.3.3

* `FIXED` Fix BUG #97
* `NEW` add column config option `canEdit`

## 1.3.2

* `CHANGED` delRow() can delete the last row now.

## 1.3.1

* `NEW` add column config option `isDisable`
* `NEW` add new prop `searchBarPlaceholder`
* `FIXED` fix issue #93

## 1.3.0

* `NEW` add support for column group
* `CHANGED` column picker rebuild using uxcore-tree 

## 1.2.4

* `FIXED` fix issue #83 #84 #87 #89

## 1.2.3

* `FIXED` reduce column.render priority
* `FIXED` getData() cannot be updated after delRow()

## 1.2.2

* `FIXED` fix bug in onChange

## 1.2.1

* `FIXED` fix issue #52 #59 #61 #72 #75 #78 #79 
* `CHANGED` actionBar config now support custom render
* `CHANGED` getData() will only send saved data
* `NEW` add api saveAllRow & editAllRow，add new config getSavedData to tell getData() which data should be sent.

## 1.2.0

* `CHANGED` inline edit mode reconstitution: see issue #67 for details.

## 1.1.5

* `FIXED` fix issue #60 #64 #65 #66 #68 #69 #70 #71

## 1.1.4

* `FIXED` fix issue #54 #55 #56 #57 #58

## 1.1.3

* `FIXED` fix bug #53

## 1.1.2

* `CHANGED` change uxcore-grid to uxcore-table, grid use for layout
* `NEW` add fixed column for table, make table more powerful


## 1.1.1

* `CHANGED` change react to ver. 0.14

## 1.1.0

* `CHANGED` column config `itmes` => `actions`, usage changed.
* `CHANGED` actionBar usage changed.
* `NEW` add props addRowClassName, user can use this to add className to the special Row, in order to custom the specific row.
* `FIXED` fix money formatting bug

## 1.0.7

* `NEW` add the second param of props.beforeFetch which is 'from' to tell user where the fetch action is invoked.
* `CHANGED` props.actionBar is powerup, now support custom text and callback.
* `CHANGED` button in grid depends on uxcore-button now.

## 1.0.6

* `NEW` fix issue #4 #5 #20 #21 #22 #23 #24

## 1.0.5

* `NEW` fix issue #18 #19


## 1.0.4

* `NEW` add ROW util for formating values
* `NEW` add 3 new types for columns: "money", "card" & "cnmobile"

## 1.0.3

* `ISSUE` fix the grid height issue

## 1.0.2

* `CHANGE` __rowData change to passedData
* `ISSUE` #6 #8 #9 #11 #12 #13 #14 #15 

## 1.0.1

* `FEATURE` column order, actionbar, subComponent


## 1.0.0

* `FEATURE` common grid (pagination, column picker)


