import React, { PureComponent } from "react"
import { cls } from "reactutils"

export default class SortArrows extends PureComponent {
  render() {
    return (
      <div className="ams-data-table-sort-arrows">
        <div
          className={cls(
            "ams-data-table-sort-arrow",
            "ams-data-table-sort-arrow-top",
            this.props.type === "top" && "ams-data-table-sort-arrow-active",
          )}
        />

        <div
          className={cls(
            "ams-data-table-sort-arrow",
            "ams-data-table-sort-arrow-bottom",
            this.props.type === "bottom" && "ams-data-table-sort-arrow-active",
          )}
        />
      </div>
    )
  }
}
