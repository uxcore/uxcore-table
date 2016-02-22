# History

---

# 1.3.9

`CHANGED` change output from src/ to build/

# 1.3.7

`FIXED` fix bug #109 in fetchData

# 1.3.6

`FIXED` fix action split bug
`CHANGED` add props showHeaderBorder 

# 1.3.5

`CHANGED add split in action column

# 1.3.4

`FIXED` fix BUG #103
`CHANGED` issue #99 #100 #101 #102 

# 1.3.3

`FIXED` Fix BUG #97
`NEW` add column config option `canEdit`

# 1.3.2

`CHANGED` delRow() can delete the last row now.

# 1.3.1

`NEW` add column config option `isDisable`
`NEW` add new prop `searchBarPlaceholder`
`FIXED` fix issue #93

# 1.3.0

`NEW` add support for column group
`CHANGED` column picker rebuild using uxcore-tree 

# 1.2.4

`FIXED` fix issue #83 #84 #87 #89

# 1.2.3

`FIXED` reduce column.render priority
`FIXED` getData() cannot be updated after delRow()

# 1.2.2

`FIXED` fix bug in onChange

# 1.2.1

`FIXED` fix issue #52 #59 #61 #72 #75 #78 #79 
`CHANGED` actionBar config now support custom render
`CHANGED` getData() will only send saved data
`NEW` add api saveAllRow & editAllRow，add new config getSavedData to tell getData() which data should be sent.

# 1.2.0

`CHANGED` inline edit mode reconstitution: see issue #67 for details.

# 1.1.5

`FIXED` fix issue #60 #64 #65 #66 #68 #69 #70 #71

# 1.1.4

`FIXED` fix issue #54 #55 #56 #57 #58

# 1.1.3

`FIXED` fix bug #53

# 1.1.2

`CHANGED` change uxcore-grid to uxcore-table, grid use for layout
`NEW` add fixed column for table, make table more powerful


# 1.1.1

`CHANGED` change react to ver. 0.14

# 1.1.0

`CHANGED` column config `itmes` => `actions`, usage changed.
`CHANGED` actionBar usage changed.
`NEW` add props addRowClassName, user can use this to add className to the special Row, in order to custom the specific row.
`FIXED` fix money formatting bug

# 1.0.7

`NEW` add the second param of props.beforeFetch which is 'from' to tell user where the fetch action is invoked.
`CHANGED` props.actionBar is powerup, now support custom text and callback.
`CHANGED` button in grid depends on uxcore-button now.

# 1.0.6

`NEW` fix issue #4 #5 #20 #21 #22 #23 #24

# 1.0.5

`NEW` fix issue #18 #19


# 1.0.4

`NEW` add ROW util for formating values
`NEW` add 3 new types for columns: "money", "card" & "cnmobile"

# 1.0.3

`ISSUE` fix the grid height issue

# 1.0.2

`CHANGE` __rowData change to passedData
`ISSUE` #6 #8 #9 #11 #12 #13 #14 #15 

# 1.0.1

`FEATURE` column order, actionbar, subComponent


# 1.0.0

`FEATURE` common grid (pagination, column picker)


