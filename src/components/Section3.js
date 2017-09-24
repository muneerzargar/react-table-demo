// import React from 'react'
// function Default(){
// 	return <div>This content will display common over all the views</div>
// }

// export default Default

import React from 'react'
import _ from 'lodash'
import moment from 'moment'

const users = [
  { name: 'Vipin', DOB: 'October 4th, 1990', age: 27, job: 'IT', id: 1, company: 'Royal Bank Of Scotland'},
  { name: 'Margaret', DOB: 'October 4th, 1992', age: 30, job: 'None', id: 2, company: 'NA'},
  { name: 'Lisa', DOB: 'October 4th, 1989', age:34, job: 'IT', id: 3, company: 'Royal Bank Of Scotland'},
  { name: 'Vipin2', DOB: 'October 4th, 1988', age: 27, job: 'IT', id: 4, company: 'Royal Bank Of Scotland'},
  { name: 'Margaret2', DOB: 'October 5th, 1990', age: 30, job: 'None', id: 5, company: 'NA'},
  { name: 'Lisa2', DOB: 'October 14th, 1989', age:34, job: 'IT', id: 6, company: 'Royal Bank Of Scotland'}
];

function recursive (collection, callback, recursiveIndexCb) {
  var indexed = (recursiveIndexCb) ? recursive.recursiveIndex(collection, recursiveIndexCb) : false
  var meta = (recursiveIndexCb) ? recursive.meta(indexed) : false
  function wrapper (callback) {
    return function () {
      var args = _.values(arguments)
      var id = args[1]
      var recursiveId = (this.id === 0) ? id.toString() : id + '.' + this.id
      args.push(recursiveId)
      return callback.apply({'meta': meta, 'indexed': indexed}, args)
    }.bind(this)
  }
  var recursed = false
  function _recursive (collection, callback) {
    recursed = (recursed === false) ? 0 : recursed + 1
    return callback(collection, _.partialRight(_recursive, callback), wrapper.bind({'id': recursed}))
  }
  return _recursive(collection, callback)
}

recursive.compare = function (n1, n2) {
  var path1 = n1.split('.')
  var path2 = n2.split('.')
  var maxLen = Math.max(path1.length, path2.length)
  var i = 0
  while (i < maxLen) {
    if (!path1[i] || +path1[i] < +path2[i]) {
      return -1
    }
    if (!path2[i] || +path1[i] > +path2[i]) {
      return 1
    }
    i++
  }
  return 0
}

recursive.subset = function (ids, id) {
  return _.filter(ids, function (_id) {
    var _idArr = _id.split('.')
    var idArr = id.split('.')
    var _idChop = _.take(_idArr, _idArr.length - 1).join('.')
    var idChop = _.take(idArr, idArr.length - 1).join('.')
    if (_idChop === idChop) return true
    return false
  })
}

// wrapper(function (node, id, nodes, recursiveId) {
//   if (node.children) recursive(node.children)
//   result[recursiveId] = node
// }

recursive.recursiveIndex = function (nodes, recursiveIndexCb) {
  var result = {}
  recursive.recursive(nodes, function (node, recursive, wrapper) {
    _.each(node, function (value, key, values, rId) {
      var args = _.values(arguments)
      var val = recursiveIndexCb.apply(null, args)
      result[rId] = val
    })
  }, true)
  return result
}

recursive.meta = function (indexed) {
  var ids = _.keys(indexed)
  return function (id, distance) {
    distance = (distance) ? distance : 1
    ids = ids.sort(recursive.compare)
    var idIndex = ids.indexOf(id)
    var meta = {}
    meta.prev = (ids[idIndex - distance]) ? ids[idIndex - distance] : false
    meta.next = (ids[idIndex + distance]) ? ids[idIndex + distance] : false
    var idsSubset = recursive.subset(ids, id)
    var idSubsetIndex = idsSubset.indexOf(id)
    meta.prevSibling = (idsSubset[idSubsetIndex - distance]) ? idsSubset[idSubsetIndex - distance] : false
    meta.nextSibling = (idsSubset[idSubsetIndex + distance]) ? idsSubset[idSubsetIndex + distance] : false
    return meta
  }
}

var st = {}

/** ensure children or reactFragment is an array of reactElements */
st.ensureChildrenArray = function (children) {
  var results = []
  React.Children.forEach(children, function (child) {
    results.push(child)
  })
  return results
}

// I know this is bad practice but I'm not sure of an alternative
/** map children and clone with props assign random key */
st.cloneChildren = function (children) {
  return React.Children.map(children, function (child, i) {
  	console.log(React);
    return React.cloneElement(child, {'key': i})
  })
}

/** sorts chilren based on column property */
st.sortChildren = function (children, column, format, direction) {
  children = st.ensureChildrenArray(children)
  var results = _.sortBy(children, function (item) {
    var match = _.find(item.props.children, function (child) {
      return (child.props.column === column)
    })
    if (format) return moment(match.props.children, format).toDate()
    return match.props.children
  })
  if (direction === 'asc') results = results.reverse()
  return st.cloneChildren(results)
}

/** filters array of children based on value */
st.filterChildren = function (children, filterValue, caseSensitive) {
  children = st.ensureChildrenArray(children)
  var results = recursive(children, function (children, recursion, wrapper) {
    return _.filter(children, wrapper(function (child) {
      if (typeof child.props.children !== 'string') {
        var result = recursion(child.props.children)
        return Boolean(result.length)
      } else {
        var flag = (caseSensitive) ? '' : 'i'
        var pattern = new RegExp(filterValue, flag)
        var value = child.props.children.match(pattern)
        return value
      }
    }))
  })
  return st.cloneChildren(results)
}

st.objectWithOneProp = function (prop, val) {
  var temp = {}
  temp[prop] = val
  return temp
}

st.invokeSort = function (column, dateFormat) {
  return function (event) {
    var data = {}
    data.stateCycle = ['desc', 'asc']
    data.column = 'header_' + column
    data.headerState = this.state[data.column]
    data.index = _.indexOf(data.stateCycle, data.headerState)
    data.nextState = (data.index !== (data.stateCycle.length - 1)) ? data.stateCycle[data.index + 1] : data.stateCycle[0]
    data.setState = st.objectWithOneProp('header_' + column, data.nextState)
    data.sortedChildren = st.sortChildren(this.refs.tbody.state.children, column, dateFormat, data.headerState)
    this.setState(data.setState)
    this.refs.tbody.setState({
      children: data.sortedChildren
    })
  }.bind(this)
}

st.invokeFilter = function (event) {
  var data = {}
  data.filteredChildren = st.filterChildren(this.refs.tbody.props.children, event.target.value, false)
  this.refs.tbody.setState({
    children: data.filteredChildren
  })
}

st.onMountOrder = function (elm) {
  return _.sortBy(elm.state.children, function (item) {
    return item.props.column
  })
}

var StatefulChildren = React.createClass({
  displayName: 'StatefulChildren',
  propTypes: {
    children: React.PropTypes.node,
    element: React.PropTypes.string,
    defaultElement: React.PropTypes.string,
    modify: React.PropTypes.array || React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      defaultElement: 'span'
    }
  },
  getInitialState: function () {
    return {
      children: this.props.children
    }
  },
  componentWillMount: function () {
    if (typeof this.props.modify === 'function') {
      this.setState({
        children: this.props.modify(this)
      })
    } else if (this.props.modify) {
      this.props.modify.forEach(function (mod) {
        this.setState({
          children: mod(this)
        })
      }.bind(this))
    }
  },
  render: function () {
    var props = _.omit(this.props, ['element', 'defaultElement', 'children'])
    if (this.props.element) {
      return React.createElement(
        this.props.element,
        props,
        this.state.children
      )
    } else if (typeof this.state.children === 'string' || !React.isValidElement(this.state.children)) {
      return React.createElement(
        this.props.defaultElement,
        props,
        this.state.children
      )
    } else {
      return this.state.children
    }
  }
})

function getUsers(){
  const user = users.map((user, i) =>
      <tr key={i}>
        <td>{user.name}</td>
        <td>{user.age}</td>
        <td>{user.job}</td>
        <td>{user.company}</td>
      </tr>
  );
  return user
}

var Table = React.createClass({
  getInitialState: function () {
    return {
      'header_date': 'desc',
      'header_name': 'desc'
    }
  },
  invokeFilter : function (event) {
    var data = {}
    data.filteredChildren = st.filterChildren(this.refs.tbody.props.children, 'Velma', false)
    this.refs.tbody.setState({
      children: data.filteredChildren
    })
  },
  render: function () {
    //<input type='text' value={this.state.value} onChange={() => {this.invokeFilter(this)}}/>
    return (
    <div>
      <input type='text' onChange={st.invokeFilter.bind(this)}/>
      <table>
        <StatefulChildren element='thead' modify={[st.onMountOrder.bind(this)]}>
          <th column='date' onClick={st.invokeSort.bind(this)('date', 'MMMM Do, YYYY')}>Date</th>
          <th column='name' onClick={st.invokeSort.bind(this)('name')}>Name</th>
        </StatefulChildren>
        <StatefulChildren element='tbody' ref='tbody'>
          <StatefulChildren element='tr' modify={[st.onMountOrder.bind(this)]}>
            <td column='name'>Velma</td>
            <td column='date'>October 28th, 2014</td>
          </StatefulChildren>
          <StatefulChildren element='tr' modify={[st.onMountOrder.bind(this)]}>
            <td column='date'>October 4th, 2015</td>
            <td column='name'>Julie</td>
          </StatefulChildren>
          <StatefulChildren element='tr' modify={[st.onMountOrder.bind(this)]}>
            <td column='date'>December 1th, 2011</td>
            <td column='name'>Becky</td>
          </StatefulChildren>
          <StatefulChildren element='tr' modify={[st.onMountOrder.bind(this)]}>
            <td column='date'>January 4th, 2015</td>
            <td column='name'>Ashley</td>
          </StatefulChildren>
        </StatefulChildren>
      </table>
    </div>
    )
  }
})


function Default(){
	return <Table/>
}

export default Default