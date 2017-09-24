
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link, Route, BrowserRouter as Router} from 'react-router-dom'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import Section5 from './Section5'
import Default from './Default'

class Application extends Component{
	render(){
		const {match} = this.props
		return <Router basename={match.url}>
		<div id="rbs_da_nwb_demo">
			<p>
				<Link to="/">Application Root</Link>
				<span> | <Link to="/section-1">Section 1 </Link></span>
				<span> | <Link to="/section-2">Section 2 </Link></span>
				<span> | <Link to="/section-3">Section 3 </Link></span>
				<span> | <Link to="/section-4">through library </Link></span>
				<span> | <Link to="/section-5">through library 2</Link></span>
			</p>
			<Route path="/" component={Default} />
			<Route path="/section-1" component={Section1} />
			<Route path="/section-2" component={Section2} />
			<Route path="/section-3" component={Section3} />
			<Route path="/section-4" component={Section4} />
			<Route path="/section-5" component={Section5} />
			<Route path="`/users/:id`" component={Section1} />

		</div>
		</Router>
	}
}

Application.PropTypes = {
	match: PropTypes.shape({
		url: PropTypes.string
	})
}

Application.defaultProps = {
	match: {
		url: '/'
	}
}
export default Application