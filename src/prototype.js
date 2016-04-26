
const React = require('react');
const {Bundle} = require('engine');
const {BoolSetter, TextSetter, ChoiceSetter, JsonSetter, NumberSetter} = require('engine-utils');

module.exports = Bundle.createPrototype({
    title: "表格",
    category: "*",
    icon: require("./logo.svg"), // todo: require("./logo.svg"),
    componentName: "Table",
    canHovering: true,
    canSelecting: true,
    canDraging: true,
    isInline: false,
    isContainer: false,
    canDropto: true,
    conDroping: false,
    configure: [{
            name: "locale",
            title: "国际化",
            defaultValue: "zh-cn",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "jsxcolumns",
            title: "列配置",
            defaultValue: [],
            required: false,
            fieldStyle: "accordion",
            fieldCollapsed: false,
            setter: <JsonSetter />
        }, {
            name: "width",
            title: "表格宽度",
            defaultValue: "auto",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "height",
            title: "表格高度",
            defaultValue: "auto",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "headerHeight",
            title: "表头高度",
            defaultValue: null,
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <NumberSetter />
        }, {
            name: "pageSize",
            title: "每页显示条数",
            defaultValue: 10,
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <NumberSetter />
        }, {
            name: "fetchDataOnMount",
            title: "是否在初始化时请求数据",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "doubleClickToEdit",
            title: "是否双击进入编辑模式",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "showColumnPicker",
            title: "是否显示列选择器",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "showPager",
            title: "是否显示分页",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "showPagerTotal",
            title: "分页中是否显示总条数",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "showHeader",
            title: "是否显示表格头",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "showSearch",
            title: "是否显示搜索框",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "searchBarPlaceholder",
            title: "搜索框占位符",
            defaultValue: "搜索表格内容",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "loadingText",
            title: "加载中文案",
            defaultValue: "loading",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "emptyText",
            title: "无数据时的文案",
            defaultValue: "暂无数据",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "jsxdata",
            title: "数据源（手动）",
            defaultValue: {},
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <JsonSetter />
        }, {
            name: "fetchUrl",
            title: "数据源（url）",
            defaultValue: "",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "fetchParams",
            title: "请求携带的参数",
            defaultValue: {},
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <JsonSetter />
        }, {
            name: "rowSelector",
            title: "列选择器的类型",
            defaultValue: 'checkboxSelector',
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "actionBar",
            title: "操作栏配置",
            defaultValue: [],
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <JsonSetter />
        }, {
            name: "getSavedData",
            title: "getData 获取的是否是保存之后的数据",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }]
});
