import React from 'react'
//import Pager from 'react-pager';
import FilterableTable from 'react-filterable-table';
import "react-filterable-table/dist/style.css";

function Section4(){

    //let FilterableTable = require('react-filterable-table');

    // Data for the table to display; can be anything
    let data = [
        { name: "Steve", age: 27, job: "Sandwich Eater" },
        { name: "Gary", age: 35, job: "Falafeler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" },
        { name: "Greg", age: 24, job: "Jelly Bean Juggler" },
        { name: "Jeb", age: 39, job: "Burrito Racer" },
        { name: "Jeff", age: 48, job: "Hot Dog Wrangler" }
    ];

    // Fields to show in the table, and what object properties in the data they bind to
    let fields = [
        { name: 'name', displayName: "Name", inputFilterable: true, sortable: true },
        { name: 'age', displayName: "Age", inputFilterable: true, exactFilterable: true, sortable: true },
        { name: 'job', displayName: "Occupation", inputFilterable: true, exactFilterable: true, sortable: true }
    ];

    return <FilterableTable namespace='People' initialSort='name' data={data} fields={fields} noRecordsMessage="There are no people to display"
    noFilteredRecordsMessage="No people match your filters!"/>
}

export default Section4

