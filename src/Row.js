/**
 * Created by xy on 15/4/13.
 */
const Cell = require('./Cell');
const classnames = require('classnames');
const assign = require('object-assign');
const Const = require('uxcore-const');
const deepEqual = require('deep-equal');
const deepcopy = require('deepcopy');
const CheckBox = require('./Cell/CheckBox');
const util = require('./util');

const React = require('react');
const ReactDOM = require('react-dom');

class Row extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: (this.props.level < this.props.levels) ? true : false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 需要考虑的 prop 包括
        // columns, rowIndex(s => simple), rowData, index(s), addRowClassName(f), rowSelection, subComp(no support), renderSubComp(f), actions
        // mode(s), renderModel(s), fixedColumn(s), levels(s), visible(s), expandedKeys, checkboxColumnKey(s)
        const me = this;
        let shouldUpdate = false;

        ['rowIndex', 'index', 'mode', 'renderModel', 'fixedColumn', 'levels', 'addRowClassName', 'renderSubComp', 'visible', 'checkboxColumnKey'].forEach((item) => {
            if (me.props[item] !== nextProps[item]) {
                shouldUpdate = true;
            }
        });
        if (!shouldUpdate) {
            ['columns', 'rowData', 'rowSelection', 'actions', 'expandedKeys'].forEach((item, index) => {
                if (!deepEqual(me.props[item], nextProps[item])) {
                    shouldUpdate = true;
                }
            })
        };
        if (!shouldUpdate) {
            shouldUpdate = (me.state.expanded !== nextState.expanded);
        }
        return shouldUpdate;
    }

    handleClick(rowData) {
        let me = this;
    }

    handleDoubleClick(rowData) {
        let table = this.props.root;
        if (table.props.doubleClickToEdit) {
            table.editRow(deepcopy(rowData));
        }
    }

    handleTreeCheckChange(e) {
        const me = this;
        me.props.root.changeTreeSelected(e.target.checked, me.props.dataIndex || me.props.index);
    }

    showSubCompFunc() {
        const me = this;
        me.props.root.toggleSubComp(me.props.rowData);
    }

    toggleExpanded(e) {
        e.stopPropagation();
        const me = this;
        const {rowData} = me.props;
        me.props.root.toggleTreeExpanded(rowData);
    }

    renderSubComp() {
        let props = this.props;

        if (props.renderModel == 'tree') {
            return false;
        } else {
            if (props.subComp) {
                if (props.rowData.showSubComp) {
                    let subComp = React.cloneElement(props.subComp, {
                        passedData: this.props.rowData,
                        parentHasCheckbox: !!this.props.rowSelection,
                        parentHasCheck: !!this.props.rowSelection /////
                    });
                    return (<div className="kuma-uxtable-subrow" ref="subRow">{subComp}</div>)
                }
                return false;
            } else if (props.renderSubComp) {
                let subComp = props.renderSubComp(deepcopy(props.rowData));
                if (subComp && props.rowData.showSubComp) {
                    return <div className="kuma-uxtable-subrow" ref="subRow">{subComp}</div>
                }
                return false;
            } else {
                return false;
            }
        }
    }

    renderChild() {

        let props = this.props,
            me = this,
            children = [];

        if (props.renderModel !== 'tree') {
            return children;
        }
        if (props.rowData.data) {
            props.rowData.data.forEach(function(node, index) {
                let renderProps = assign({}, props, {
                    level: me.props.level + 1,
                    dataIndex: (me.props.dataIndex ? me.props.dataIndex : me.props.index) + '-' + index,
                    rowData: node,
                    rowIndex: node.jsxid,
                    key: node.jsxid,
                    showSubComp: false,
                    visible: (props.expandedKeys.indexOf(props.rowData.jsxid) !== -1),
                });
                children.push(<Row  {...renderProps} />);
            });

            let renderProps = {
                key: "treeRow" + this.props.rowData.jsxid,
                className: "kuma-uxtable-tree-row"
            };

            children = <ul {...renderProps}>{children}</ul>;
        }

        return children;
    }

    renderExpandIcon(rowIndex) {

        let expandCollapseIcon;
        let _expandIconClass;
        const props = this.props;

        if (props.renderModel !== 'tree') {
            return false;
        }

        if (props.rowData.data) {
            _expandIconClass = {
                "kuma-icon": true,
                "kuma-icon-triangle-right": true,
                "expanded": (props.expandedKeys.indexOf(props.rowData.jsxid) !== -1),
            };
            expandCollapseIcon = (
                <span className="kuma-uxtable-expand-icon" data-type={props.fixedColumn} data-index={rowIndex}
                onClick={this.toggleExpanded.bind(this)}>
                    <i className={classnames(_expandIconClass)}></i>
              </span>
            );
        } else {
            expandCollapseIcon = (
                <span className="kuma-uxtable-emptyicon"></span>
            );
        }
        return expandCollapseIcon;
    }

    renderIndent() {
        let indents = [];
        if (this.props.renderModel == 'tree') {
            for (var i = 0; i < this.props.level - 1; i++) {
                let renderProps = {
                    className: "indent",
                    key: 'indent' + i
                }
                indents.push(<span {...renderProps} ></span>);
            }
        }

        return indents;
    }

    renderTreeRowSelector() {
        if (this.props.renderModel !== 'tree') {
            return false;
        }
        const me = this;
        const {rowData, checkboxColumnKey, prefixCls} = me.props;
        const isChecked = rowData[checkboxColumnKey];
        let isHalfChecked =  false;
        if (!isChecked) {
            isHalfChecked = util.isRowHalfChecked(rowData, checkboxColumnKey);
        }
        return <CheckBox checked={isChecked} 
                    halfChecked={isHalfChecked}
                    className={`${prefixCls}-tree-selector`} 
                    onChange={me.handleTreeCheckChange.bind(me)} />
    }

    render() {

        let props = this.props,
            _columns = [],
            _style = {},
            _data = props.data,
            me = this,
            otherCls = props.addRowClassName(_data[props.rowIndex]);

        if (!this.props.visible) {
            _style = {
                display: 'none'
            };
        }

        props.columns.forEach((column, index) => {
            if ("group" in column) {
                _columns = _columns.concat(column.columns);
            } else {
                _columns.push(column);
            }
        })

        let firstVisableColumn = 0;

        return (
            <li className={classnames({
                [this.props.prefixCls]: true,
                [otherCls]: !!otherCls,
                'even': (props.rowIndex % 2 == 1 ? true : false)
            })} style={_style}
            onClick={this.handleClick.bind(this, props.rowData)}
            onDoubleClick={this.handleDoubleClick.bind(this, props.rowData)}>
                <div className={`${this.props.prefixCls}-cells`}>
                    {_columns.map(function(item, index) {
                        const rowSelectorInTreeMode = (['checkboxSelector', 'radioSelector'].indexOf(item.type) !== -1) && (props.renderModel == 'tree');
                        if (item.hidden || rowSelectorInTreeMode) {
                            return null;
                        }
                        firstVisableColumn++;
                        let renderProps = {
                            column: item,
                            root: props.root,
                            rowData: props.rowData,
                            rowIndex: props.rowIndex,
                            index: props.index,
                            cellIndex: index,
                            hasSubComp: props.subComp ? true : (props.renderSubComp ? !!props.renderSubComp(deepcopy(props.rowData)) : false),
                            changeSelected: me.props.changeSelected,
                            showSubCompCallback: me.showSubCompFunc.bind(me),
                            rowSelection: props.rowSelection,
                            actions: props.actions,
                            mode: props.mode,
                            handleDataChange: props.handleDataChange,
                            attachCellField: props.attachCellField,
                            detachCellField: props.detachCellField,
                            key: "cell" + index
                        };

                        if (firstVisableColumn == 1) {
                            return <Cell {...renderProps} >
                                {me.renderIndent()}
                                {me.renderExpandIcon(props.rowIndex)}
                                {me.renderTreeRowSelector()}
                            </Cell>
                        }
                        //if have vertical data structure, how to process it
                        return <Cell {...renderProps} ></Cell>
                    })}
                </div>
                {me.renderChild()}
                {this.renderSubComp()}
            </li>
            );
    }

}
;

Row.propTypes = {
    prefixCls: React.PropTypes.string,
    showSubComp: React.PropTypes.bool
};

Row.defaultProps = {
    prefixCls: "kuma-uxtable-row",
    showSubComp: false
};

export default Row;
