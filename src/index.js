import './index.css'


import React from 'react'
import {render} from 'react-dom'
import Application from './components/Application'
import Section1 from './components/Section1'
import Section2 from './components/Section2'
import Section3 from './components/Section3'
import Section4 from './components/Section4'
import Section5 from './components/Section5'
import Default from './components/Default'
export {
	Application,
	Section1,
	Section2,
	Section3,
	Section4,
	Section5,
	Default
}

render(<Application/>, document.querySelector('#app'));
export default Application