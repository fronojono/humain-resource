import React, { Component } from "react"
import { cls } from "reactutils"

export default class GroupedColumn extends Component {
  render() {
    return (
      <div className="ams-data-table-grouped-column-container">
        <div
          ref={this.props.provided.innerRef}
          style={this.props.provided.draggableStyle}
        >
          <div
            className="ams-data-table-grouped-columns-header"
            {...this.props.provided.dragHandleProps}
            onClick={this.props.provided.dragHandleProps.onClick}
          >
            {this.props.config.name}
          </div>
          <div className="ams-data-table-grouped-columns-container">
            {this.props.config.columns.map((columnConfig, index) => (
              <div
                key={index}
                className="ams-data-table-grouped-column"
                style={{ width: columnConfig.width }}
              >
                <div className="ams-data-table-grouped-column-header">
                  {columnConfig.name}
                </div>
                {this.props.splittedData.map((data, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={cls(
                      "ams-data-table-cell ams-data-table-body",
                      rowIndex % 2
                        ? "ams-data-table-row-odd"
                        : "ams-data-table-row-even",
                      rowIndex === this.props.selectedRowIndex &&
                        "ams-data-table-row-selected",
                    )}
                    onClick={this.props.handleCellClick(index - 1, rowIndex)}
                  >
                    {columnConfig.renderContent != null
                      ? columnConfig.renderContent(data)
                      : data[columnConfig.dataKey]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
