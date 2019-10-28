var React = require('react');
var ReactDOM = require('react-dom');
var DataTable = require('react-data-components').DataTable;

var columns = [
  { title: 'Name', prop: 'name'  },
  { title: 'City', prop: 'city' },
  { title: 'Address', prop: 'address' },
  { title: 'Phone', prop: 'phone' }
];

var data = [
  { name: 'name value', city: 'city value', address: 'address value', phone: 'phone value' },
  { name: 'name value2', city: 'city value2', address: 'address value2', phone: 'phone value2' },
  // It also supports arrays
  // [ 'name value', 'city value', 'address value', 'phone value' ]
];

export default function RData() {
  return (
    ReactDOM.render((
        <DataTable
          keys="name"
          columns={columns}
          initialData={data}
          initialPageLength={5}
          initialSortBy={{ prop: 'city', order: 'descending', }}
        />
      ), document.getElementById('root'),)
  )
}