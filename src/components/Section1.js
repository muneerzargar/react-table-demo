import React, {Component} from 'react'
import moment from 'moment'

let actualData;
class Section1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      data: {}
    };
    this.invokeFilter = this.invokeFilter.bind(this);
    this.applySort = this.applySort.bind(this);
    this.cellClicked = this.cellClicked.bind(this);
  }

  componentDidMount() {

    const data = {
      columns: [
        { label: "userId", dataType: 'number', dataKey: 'id', sortable: true, width: 200, anchorClick: true },
        { label: "Name", dataType: 'text', dataKey: 'name', sortable: true, width: 300, clickable: true },
        { label: "Age", dataType: 'number', dataKey: 'age', sortable: true, width: 200 },
        { label: "Date Of Birth", dataType: 'date', dataKey: 'dateOfBirth', sortable: true, width: 200 },
        { label: "Relationship Status", dataType: 'select', dataKey: 'status', sortable: true,
          selectOptions: [{label: 'Married', value: 'Married'},{label: 'Single', value: 'Single'},{label: 'Divorced', value: 'Divorced'},{label: 'Complicated', value: 'Complicated'}]
        }
      ],
      rows: [
        { id: 1000, name: 'Vipin Vijayvargiya', age: 27, dateOfBirth: '04 Oct 2016', status: 'Married'},
        { id: 1001, name: 'Margaret', age: 30, job: 'None', dateOfBirth: '13 Oct 2016', status: 'Single'},
        { id: 1002, name: 'Lisa', age:34, job: 'IT', dateOfBirth: '3 Oct 2016', status: 'Married'},
        { id: 1003, name: 'Vipin2', age: 27, job: 'IT', dateOfBirth: '1 Nov 2015', status: 'Married'},
        { id: 1004, name: 'Margaret2', age: 30, job: 'None', dateOfBirth: '1 Oct 2012', status: 'Divorced' },
        { id: 1005, name: 'Lisa2', age:34, job: 'IT', dateOfBirth: '1 Oct 2019', status: 'Single'},
        { id: 1003, name: 'Vipin3', age: 27, job: 'IT', dateOfBirth: '1 Nov 2015', status: 'Married'},
        { id: 1004, name: 'Margaret3', age: 30, job: 'None', dateOfBirth: '1 Oct 2012', status: 'Divorced' },
        { id: 1005, name: 'Lisa3', age:34, job: 'IT', dateOfBirth: '1 Oct 2019', status: 'Single'},
        { id: 1003, name: 'Vipin4', age: 27, job: 'IT', dateOfBirth: '18 Sep 2017', status: 'Married'},
        { id: 1004, name: 'Margaret4', age: 30, job: 'None', dateOfBirth: '1 Oct 2012', status: 'Single' },
        { id: 1005, name: 'Lisa4', age:34, job: 'IT', dateOfBirth: '18 Sep 2017', status: 'Single'},
        { id: 1003, name: 'Vipin5', age: 27, job: 'IT', dateOfBirth: '1 Nov 2015', status: 'Married'},
        { id: 1004, name: 'Margaret5', age: 30, job: 'None', dateOfBirth: '1 Oct 2012', status: 'Divorced' },
        { id: 1005, name: 'Lisa5', age:34, job: 'IT', dateOfBirth: '1 Oct 2019', status: 'Single'}
      ],
      configuration: {

      }
    };

    this.setState({
      data: data
    });
  }

  getRows(items) {
    return items.map((item, i) => {
      return (<tr key={i}>
          {this.getRowContent(item)}
        </tr>);
    });
  }

  getRowContent(rowData){
    if(_.has(this.state, 'data.columns')){
      let tds = this.state.data.columns.map((item, i) => {

        let cellContent;

        if(!_.isUndefined(item.anchorClick) && item.anchorClick){
          cellContent = <td key={i}><a href='#'>{rowData[item.dataKey]}</a></td>;
        }

        else if(!_.isUndefined(item.clickable) && item.clickable){
          cellContent = <td key={i} onClick={() => {this.cellClicked(item)}}>{rowData[item.dataKey]}</td>;
        }else{
          cellContent = <td key={i}>{rowData[item.dataKey]}</td>;
        }

        return cellContent;
      });
      return tds
    }
  }

  getSelectOptions(options){
    let tds = options.map((item, i) => {
      return (<option key={i}>{item.label}</option>);
    });
    return tds
  }

  getColumns(items) {
    //class which can be used to give icon on sorting for below span
    //className={item.order === 'asc' ? 'glyphicon glyphicon-arrow-up' : 'glyphicon glyphicon-arrow-down'}
    var styles = {
      colStyle: {
        width: items.width
      },
      sortingStyle: {
        float: 'right'
      }
    }
    return items.map((item, i) => {
      let filterType = item.dataType !== 'select' ? 
            <input type={item.dataType} onChange={(e) => {this.invokeFilter(item, e)}}/> : 
            <select onChange={(e) => {this.invokeFilter(item, e)}}>
              <option value="">Select</option>
              {this.getSelectOptions(item.selectOptions)}
            </select>;
      return (<th key={i} style={{width: item.width}}>
        <div onClick={() => {this.applySort(item)}}>{item.label}<span style={styles.sortingStyle}>{item.order === 'asc' ? 'A' : (item.order === 'desc' ? 'D' : '')}</span></div>
        {filterType}
      </th>);
    });
  }

  getTable(data) {
    return (<table>
      <thead><tr>{this.getColumns(data.columns || [])}</tr></thead>
      <tbody>{this.getRows(data.rows || [])}</tbody>
    </table>);
  }

  cellClicked(){
    console.log();
  }

  invokeFilter(column, event){
    if(_.isUndefined(actualData)){
      actualData = this.state.data.rows;
    }

    let valueToFilter = column.dataType === 'date' ? moment(event.target.value).format('D MMM YYYY').toUpperCase() : event.target.value.toString().toUpperCase();

    let currentFilter = {};
    let currentCol = column.dataKey;

    let setFilter = function() {
      let returnObj = {};
      returnObj[column.dataKey] = valueToFilter;
         return returnObj;
    }.bind(event)();
    
    let key = _.find(this.state.data.filter, function(o){
      if(_.has(o, currentCol)){
        return  true;
      }
    });

    if(_.has(this.state, 'data.filter')){
      if(!_.isUndefined(key)){
        _.remove(this.state.data.filter, key);
      }
      _.merge(this.state.data.filter, setFilter);
      currentFilter = this.state.data.filter;
    }else{
      _.merge(currentFilter, setFilter);
    }

    let filteredData;

    let runFilter = function(key, val){
      console.log(key, val);

      filteredData = _.filter(filteredData || actualData, function(obj) {

        // if(obj[column.dataKey].toString().toUpperCase().indexOf(valueToFilter === 'INVALID DATE' ? '' : valueToFilter) > -1){
        //   return obj
        // }

        if(obj[key].toString().toUpperCase().indexOf(val === 'INVALID DATE' ? '' : val) > -1){
          return obj
        }
      });
    }

    var filterKeys = _.keys(currentFilter);
    var filterSize = filterKeys.length;

    _.each(filterKeys, function(key){
      runFilter(key, currentFilter[key]);
    });

    this.setState({ data: {
        rows: filteredData,
        columns: this.state.data.columns,
        filter: this.state.data.filter || currentFilter
      }
    });
  }

  applySort(item){
    item.order = _.isUndefined(item.order) ? 'asc' : (item.order === 'asc' ? 'desc' : 'asc');

    // _.map(this.state.data.columns, function(cols){
    //   if(cols.label !== item.label && _.has(cols,'order')){
    //     delete cols.order;
    //   }
    // });
    this.state.data.columns.map((cols) => {
      if(cols.label !== item.label && _.has(cols,'order')){
        delete cols.order;
      }
    });

    let filteredData = _.orderBy(this.state.data.rows, function(dateObj){
      let data = item.dataType === 'date' ? new Date(dateObj[item.dataKey]) : dateObj[item.dataKey];
      return data;
    }, [item.order]);
    
    this.setState({ data: {
        rows: filteredData,
        columns: this.state.data.columns
      }
    });
  }

  render() {
    return (<div>
      {this.getTable(this.state.data)}
    </div>);
  }

}

export default Section1