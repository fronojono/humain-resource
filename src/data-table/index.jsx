import React, { PureComponent } from "react"
import {
  Paper,
  Button,
  Collapse,
  TextField,
  FontIcon,
  MenuButton,
  ListItemControl,
  Checkbox,
} from "react-md"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { debounce, memoize, sortBy } from "lodash-es"
import { cls } from "reactutils"

import SortArrows from "./sort-arrows"
import GroupedColumn from "./grouped-column"

import "./styles.scss"

export default class DataTable extends PureComponent {
  static defaultProps = {
    showControls: false,
    recordsPerPage: 10,
    disableCellFlexibleWidth: false,
  }

  static defaultCellWidth = 80

  static columnVisibilityKey = Symbol("Key of control column visibility")

  static defaultAscendingOrder = false

  state = {
    /**
     * only when component instance initializing,
     * it's generated by props.columnConfig,
     * in other component life cycle,
     * it's generated by state.filteredColumns
     */
    orderedColumn: [...this.props.columnConfig],

    /**
     * this is only for column filter menu,
     * doesn't control column visibility directly
     */
    filteredColumns: this.props.columnConfig.map(column => ({
      ...column,
      [DataTable.columnVisibilityKey]: true,
    })),

    currentPage: 1,

    isSearching: false,

    searchKeyWords: null,

    orderByField: null,

    ascendingOrder: DataTable.defaultAscendingOrder,
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.columnConfig !== this.props.columnConfig ||
      nextProps.data !== this.props.data
    ) {
      // reset this.state
      this.setState({
        orderedColumn: [...this.props.columnConfig],
        filteredColumns: this.props.columnConfig.map(column => ({
          ...column,
          [DataTable.columnVisibilityKey]: true,
        })),
      })

      // clear search cache
      this.getSearchedData.cache.clear()
      // clear visible columns width cache
      this.getAllVisibleColumnsConfigWidth.cache.clear()
    }
  }

  handleDragStart() {
    document.body.classList.add("ams-data-table-dragging")
  }

  handleDragEnd = result => {
    this.reorderColumn(result)
    document.body.classList.remove("ams-data-table-dragging")
  }

  reorderColumn(result) {
    if (result.destination != null) {
      const sourceIndex = result.source.index
      const destinationIndex = result.destination.index
      const config = [...this.state.orderedColumn]
      const [movingItem] = config.splice(sourceIndex, 1)
      config.splice(destinationIndex, 0, movingItem)
      this.setState({
        orderedColumn: config,
      })
    }
  }

  getData() {
    const searchedData = this.getSearchedData()
    const orderedData = this.getOrderedData(searchedData)
    return orderedData
  }

  getSearchedData = memoize(() => {
    if (
      !this.state.isSearching ||
      this.state.searchKeyWords == null ||
      !this.state.searchKeyWords.length
    ) {
      return this.props.data
    }
    const availableFields = this.state.filteredColumns
      .filter(column => column[DataTable.columnVisibilityKey])
      .map(column => column.dataKey)
    return this.props.data.filter(data => {
      for (const key of availableFields) {
        const value = data[key]
        if (typeof value === "number") {
          if (value === +this.state.searchKeyWords) {
            return true
          }
        }
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(this.state.searchKeyWords.toLowerCase())
        ) {
          return true
        }
      }
      return false
    })
  }, () => this.state.searchKeyWords)

  getOrderedData = data => {
    if (this.state.orderByField == null || !this.state.orderByField.length) {
      return data
    }
    const sortedData = sortBy(data, item => item[this.state.orderByField])
    if (!this.state.ascendingOrder) {
      return sortedData.reverse()
    }
    return sortedData
  }

  handleSearchButtonClick = () => {
    if (this.state.isSearching) {
      this.setState({
        isSearching: false,
        searchKeyWords: null,
      })
    } else {
      this.setState({
        isSearching: true,
      })
    }
  }

  handleSearchTextChange = debounce(keywords => {
    this.setState({
      searchKeyWords: keywords,
      currentPage: 1,
    })
    if (this.props.onRowSelect != null) {
      this.props.onRowSelect(null, null, null)
    }
  }, 600)

  handleColumnVisibilityChange = columnIndex => visibility => {
    const toggledColumn = this.state.filteredColumns[columnIndex]
    const newFilteredColumns = [
      ...this.state.filteredColumns.slice(0, columnIndex),
      {
        ...toggledColumn,
        [DataTable.columnVisibilityKey]: visibility,
      },
      ...this.state.filteredColumns.slice(columnIndex + 1),
    ]
    if (this.state.orderByField === toggledColumn.dataKey) {
      this.setState({
        orderByField: null,
        ascendingOrder: DataTable.defaultAscendingOrder,
      })
    }
    this.setState({
      orderedColumn: newFilteredColumns.filter(
        column => column[DataTable.columnVisibilityKey],
      ),
      filteredColumns: newFilteredColumns,
    })
    this.getAllVisibleColumnsConfigWidth.cache.clear()
  }

  handleHeaderCellClick = column => {
    if (this.state.orderByField !== column.dataKey) {
      this.setState({
        orderByField: column.dataKey,
        ascendingOrder: DataTable.defaultAscendingOrder,
      })
    } else {
      this.setState(prevState => ({
        ascendingOrder: !prevState.ascendingOrder,
      }))
    }
    if (this.props.onRowSelect != null) {
      this.props.onRowSelect(null, null, null)
    }
  }

  handleCellClick = (columnIndex, rowIndex) => () => {
    if (this.props.onRowSelect != null) {
      const data = this.splitDataByPagination()[rowIndex]
      const dataIndex = this.props.data.indexOf(data)
      this.props.onRowSelect(data, rowIndex, dataIndex)
    }
  }

  getTotalPages() {
    const data = this.getData()
    return Math.ceil(data.length / this.props.recordsPerPage)
  }

  splitDataByPagination() {
    const data = this.getData()
    const skippedItems =
      (this.state.currentPage - 1) * this.props.recordsPerPage
    return data.slice(skippedItems, skippedItems + this.props.recordsPerPage)
  }

  handlePageClick = pageNumber => () => {
    this.setState({
      currentPage: pageNumber,
    })
  }

  getAllVisibleColumnsConfigWidth = memoize(() => {
    const listOfVisibleColumn = this.state.filteredColumns.filter(
      column => column[DataTable.columnVisibilityKey],
    )
    const countOfWidth = listOfVisibleColumn.reduce(
      (count, column) =>
        count +
        (column.width != null ? column.width : DataTable.defaultCellWidth),
      0,
    )

    return countOfWidth
  })

  getCellWidth(configWidth, containerWidth, useFlexileWidth) {
    const width = configWidth != null ? configWidth : DataTable.defaultCellWidth
    if (!useFlexileWidth) {
      return width
    }
    return `${width / containerWidth * 100}%`
  }

  renderControls() {
    if (this.props.showControls) {
      return (
        <div className="ams-data-table-controls">
          <Collapse collapsed={!this.state.isSearching}>
            <TextField
              className="ams-data-table-search-input"
              id="data-table-search"
              label="search"
              type="text"
              leftIcon={<FontIcon>search</FontIcon>}
              size={18}
              fullWidth={false}
              onChange={this.handleSearchTextChange}
            />
          </Collapse>
          <Button icon onClick={this.handleSearchButtonClick}>
            {this.state.isSearching ? "close" : "search"}
          </Button>
          <MenuButton
            id="column-visibility"
            icon
            repositionOnScroll={false}
            simplifiedMenu={false}
            anchor={{
              x: MenuButton.HorizontalAnchors.INNER_RIGHT,
              y: MenuButton.VerticalAnchors.BOTTOM,
            }}
            menuItems={this.renderColumnFilterMenu()}
          >
            more_vert
          </MenuButton>
        </div>
      )
    } else {
      return null
    }
  }

  renderColumnFilterMenu() {
    return this.state.filteredColumns.map((column, index) => (
      <ListItemControl
        key={column.dataKey || column.name}
        primaryAction={
          <Checkbox
            id={`data-table-column-filter-${column.name}`}
            name="column-visibility-control"
            label={column.name}
            labelBefore
            checked={column[DataTable.columnVisibilityKey]}
            onChange={this.handleColumnVisibilityChange(index)}
          />
        }
      />
    ))
  }

  renderPages() {
    // NOTE: `threshold` must be an odd number, at least 7
    const threshold = 7
    const ellipsis = {
      left: "ellipsis-left",
      right: "ellipsis-right",
    }
    const totalPages = this.getTotalPages()
    const { currentPage } = this.state
    let listOfPages
    if (totalPages <= threshold) {
      listOfPages = Array.from({ length: totalPages }, (_, index) => index + 1)
    } else if (currentPage <= (threshold - 1) / 2) {
      listOfPages = [
        ...Array.from({ length: threshold - 2 }, (_, index) => index + 1),
        ellipsis.right,
        totalPages,
      ]
    } else if (currentPage >= totalPages - (threshold - 1) / 2 + 1) {
      listOfPages = [
        1,
        ellipsis.left,
        ...Array.from(
          { length: threshold - 2 },
          (_, index) => totalPages - threshold + 3 + index,
        ),
      ]
    } else {
      listOfPages = [currentPage]
      for (let i = 1; i <= (threshold - 1) / 2 - 2; ++i) {
        listOfPages.push(currentPage + i)
        listOfPages.unshift(currentPage - i)
      }
      listOfPages.push(ellipsis.right)
      listOfPages.unshift(ellipsis.left)
      listOfPages.push(totalPages)
      listOfPages.unshift(1)
    }

    return listOfPages.map(pageNumber => {
      if (pageNumber === ellipsis.left || pageNumber === ellipsis.right) {
        return (
          <span
            key={pageNumber}
            className="ams-data-table-pagination-page ams-data-table-pagination-ellipsis"
          >
            ...
          </span>
        )
      }
      if (pageNumber === currentPage) {
        return (
          <span
            key={pageNumber}
            className="ams-data-table-pagination-page ams-data-table-pagination-current-page"
          >
            {currentPage}
          </span>
        )
      }
      return (
        <button
          key={pageNumber}
          className="ams-data-table-pagination-page ams-data-table-pagination-button"
          onClick={this.handlePageClick(pageNumber)}
        >
          {pageNumber}
        </button>
      )
    })
  }

  renderFooter(splittedData) {
    return (
      <div className="ams-data-table-footer">
        <div className="ams-data-table-footer-info">
          Showing {splittedData.length} of {this.props.data.length} records
        </div>
        <div className="ams-data-table-pagination">{this.renderPages()}</div>
      </div>
    )
  }

  render() {

    if (this.props.data == null) {
      return null
    }
    const splittedData = this.splitDataByPagination()

    // wether to use flexile width for each cell
    let useFlexileWidth
    let containerWidth
    if (!this.props.disableCellFlexibleWidth && this.$container != null) {
      containerWidth = this.$container.getBoundingClientRect().width
      const countOfColumnConfigWidth = this.getAllVisibleColumnsConfigWidth()
      if (containerWidth > countOfColumnConfigWidth) {
        useFlexileWidth = true
      } else {
        useFlexileWidth = false
      }
    } else {
      useFlexileWidth = false
    }

    return (
      <Paper
        className={cls(
          "ams-data-table-paper",
          this.props.withPadding && "ams-data-table-paper-with-padding",
          this.props.className,
        )}
        zDepth={this.props.zDepth}
      >
        <div className='ams-data-table-paper-header'>
          <h3>{this.props.title && this.props.title}</h3>
          {this.renderControls()}
        </div>
        <DragDropContext
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        >
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={container => {
                  this.$container = container
                  provided.innerRef(container)
                }}
                className="ams-data-table-container"
              >
                {this.state.orderedColumn.map((column, columnIndex) => (
                  <Draggable
                    key={column.dataKey || column.name}
                    draggableId={column.dataKey || column.name}
                  >
                    {(provided, snapshot) => {
                      if (column.columns == null) {
                        return (
                          <div
                            className="ams-data-table-column-container"
                            style={{
                              width: this.getCellWidth(
                                column.width,
                                containerWidth,
                                useFlexileWidth,
                              ),
                            }}
                          >
                            <div
                              ref={provided.innerRef}
                              style={provided.draggableStyle}
                              className="ams-data-table-column"
                            >
                              <div
                                className="ams-data-table-cell ams-data-table-header"
                                {...provided.dragHandleProps}
                                onClick={event => {
                                  if (provided.dragHandleProps != null) {
                                    provided.dragHandleProps.onClick(event)
                                  }
                                  this.handleHeaderCellClick(column)
                                }}
                              >
                                {column.name}
                                <SortArrows
                                  type={
                                    this.state.orderByField !== column.dataKey
                                      ? "other"
                                      : this.state.ascendingOrder
                                        ? "top"
                                        : "bottom"
                                  }
                                />
                              </div>
                              {splittedData.map((data, rowIndex) => (
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
                                  onClick={this.handleCellClick(
                                    columnIndex,
                                    rowIndex,
                                  )}
                                >
                                  {column.renderContent != null
                                    ? column.renderContent(data)
                                    : data[column.dataKey]}
                                </div>
                              ))}
                            </div>
                            {provided.placeholder}
                          </div>
                        )
                      } else {
                        return (
                          <GroupedColumn
                            provided={provided}
                            snapshot={snapshot}
                            config={column}
                            splittedData={splittedData}
                            handleCellClick={this.handleCellClick}
                          />
                        )
                      }
                    }}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {this.renderFooter(splittedData)}
      </Paper>
    )
  }
}
