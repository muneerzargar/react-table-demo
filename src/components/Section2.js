import React from 'react'
import {Link, Route, BrowserRouter as Router} from 'react-router-dom'

const users = [
  { name: 'Vipin', age: 27, job: 'IT', id: 1, company: 'Royal Bank Of Scotland'},
  { name: 'Margaret', age: 30, job: 'None', id: 2, company: 'NA'},
  { name: 'Lisa', age:34, job: 'IT', id: 3, company: 'Royal Bank Of Scotland'},
  { name: 'Vipin2', age: 27, job: 'IT', id: 4, company: 'Royal Bank Of Scotland'},
  { name: 'Margaret2', age: 30, job: 'None', id: 5, company: 'NA'},
  { name: 'Lisa2', age:34, job: 'IT', id: 6, company: 'Royal Bank Of Scotland'}
];

function Td({ children, to }) {
  // Conditionally wrapping content into a link
  const content = to ? (
    <Link to={to}>{children}</Link>
  ) : (
    <div>{children}</div>
  );

  return (
    <td>
      {content}
    </td>
  );
}

const user = users.map((user, i) =>
	
  	<tr key={i}>
      <Td to={`/users/${user.id}`}>{user.id}</Td>
  		<td>{user.name}</td>
  		<td>{user.age}</td>
  		<td>{user.job}</td>
      <td>{user.company}</td>
  	</tr>
);

const Section2 = () => (
  <table>
  	<thead>
  	  <tr>
  			<th><b>UniqueId</b></th>
  			<th><b>Name</b></th>
  			<th><b>Age</b></th>
  			<th><b>Job</b></th>
        <th><b>Company</b></th>
  		</tr>
    </thead>
    <tbody>
    	{user}
    </tbody>
  </table>
)

export default Section2