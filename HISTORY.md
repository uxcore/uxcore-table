# History

---

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


