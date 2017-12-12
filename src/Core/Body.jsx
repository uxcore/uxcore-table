import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Animate from 'uxcore-animate';
import EmptyData from 'uxcore-empty-data';
import isEqual from 'lodash/isEqual';
import { hasClass } from 'rc-util/lib/Dom/class';
import Mask from './Mask';
import Row from './Row';
import i18n from '../i18n';

class Body extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    locale: PropTypes.string,
    loadingText: PropTypes.string,
    emptyText: PropTypes.string,
    height: PropTypes.number,
    showMask: PropTypes.bool,
    isFixedTable: PropTypes.bool,
    style: PropTypes.object,
    data: PropTypes.array,
    columns: PropTypes.array,
    fixedColumn: PropTypes.string,
    mainBody: PropTypes.node,
  }

  componentDidMount() {
    const me = this;
    me.scrollHandler = me.onScroll.bind(me);
    me.scrollListener = addEventListener(me.root, 'scroll', me.scrollHandler);
    this.adjustMultilineFixedRowHeight();
  }

  componentDidUpdate(prevProps) {
    const isFixedTable = ['fixed', 'rightFixed'].indexOf(this.props.fixedColumn) !== -1;
    if (isFixedTable && !isEqual(prevProps.data, this.props.data)) {
      this.adjustMultilineFixedRowHeight();
    }
  }

  onScroll() {
    const me = this;
    const { fixedColumn } = me.props;
    if (me.scrollEndTimer) {
      clearTimeout(me.scrollEndTimer);
    }
    me.scrollEndTimer = setTimeout(() => {
      me.props.onScroll(me.root.scrollLeft, me.root.scrollTop, fixedColumn);
    }, 500);
    me.props.onScroll(me.root.scrollLeft, me.root.scrollTop, fixedColumn);
  }

  getRow(index) {
    return this[`row${index}`];
  }

  adjustMultilineFixedRowHeight() {
    const { mainBody, isFixedTable } = this.props;
    if (isFixedTable && mainBody) {
      if (mainBody) {
        this.props.data.forEach((item, index) => {
          const mainTableRow = mainBody.getRow(index);
          if (mainTableRow) {
            const mainTableRowNode = mainTableRow.getDom();

            if (hasClass(mainTableRowNode, 'multiline')) {
              const height = mainTableRowNode.clientHeight;
              const row = this.getRow(index);
              const rowNode = row.getInnerBox();
              rowNode.style.height = `${height}px`;
            }
          }
        });
      }
    }
  }

  renderEmptyData() {
    if (this.props.data.length === 0 && !this.props.showMask) {
      const style = {};
      if (typeof this.props.height === 'number') {
        style.lineHeight = `${this.props.height - 10}px`;
      }
      const defaultEmptyText = <div style={{ lineHeight: 2 }}>{i18n[this.props.locale]['default-empty-text']}</div>;
      return (
        <EmptyData style={{ marginTop: '20px', marginBottom: '20px' }}>
          {this.props.emptyText || defaultEmptyText}
        </EmptyData>
      );
    }
    return null;
  }

  renderMask() {
    return (
      <Animate showProp="visible" transitionName="tableMaskFade">
        <Mask visible={this.props.showMask} text={this.props.loadingText} />
      </Animate>
    );
  }
  render() {
    const { style, className, data, columns } = this.props;
    const rows = data.map((item, index) => {
      const renderProps = {
        data: data[index],
        columns,
        key: index,
        ref: (c) => {
          this[`row${index}`] = c;
        },
      };
      return <Row {...renderProps} />;
    });
    return (
      <div
        className={classnames('kuma-uxtable-body-wrapper', {
          [className]: !!className,
        })}
        style={style}
        ref={(c) => { this.root = c; }}
      >
        <div>
          {this.renderEmptyData()}
          {data.length > 0 ? <ul className={'kuma-uxtable-body'}>
            {rows}
          </ul> : null}
        </div>
        {this.renderMask()}
      </div>
    );
  }
}

export default Body;
