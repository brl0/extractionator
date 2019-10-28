import React from "react";
import MUIDataTable from "mui-datatables";

import CONSTANTS from "constants";


const getURLQuery = (url, fields) => `{website(url:"${url}") ${fields}}`;

const buildQuery = (url, fields) => `{"query": ${JSON.stringify(getURLQuery(url, fields))}}`;

const default_fields = '{url,title,feed,image,description,text,qs,}';

export default function buildPost(url, fields = default_fields) {
    return ({
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: `${buildQuery(url, fields)}`,
  });
}

export function strArray(s) {
  // s.match(/([^\"\',]*((\'[^\']*\')*||(\"[^\"]*\")*))+/gm);
  return s.match(/([^"',]*(('[^']*')*||("[^"]*")*))+/gm);
}

export function fetchData(url, parts, title) {
  const post = buildPost(url, parts);
  const fetch_request = [CONSTANTS.ENDPOINT.GRAPHQL, post];
  fetch(...fetch_request)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(result => {
      const data = result.data.website;
      console.log(data.description);
      const table_cols = [{title: "index"}, {title: "field"}, {title: "value"}];
      const fields = Object.keys(data);
      var dataset = [];
      var counter = 0;
      for (var idx in fields) {
        var item = data[fields[idx]];
        console.log(item.length);
        console.log(typeof(item));
        
        if (item instanceof Array
            && item.length >= 1 ) {
          for (var it in item) {
            dataset.push([
              counter, 
              fields[idx],
              item[it],
            ]);
            counter += 1;
          }
        }
        else {
          dataset.push([
            counter, 
            fields[idx],
            item,
          ]);
          counter += 1;
        }
      }
      const options = {
        filterType: 'checkbox',
      };
      return (
        <MUIDataTable
          title={title}
          data={dataset}
          columns={table_cols}
          options={options}
        />
      );
    })
    .catch(error =>
      this.setState({
        WarningMessageOpen: true,
        WarningMessageText: `${CONSTANTS.ERROR_MESSAGE.MASTERDETAIL_GET} ${error}`
      })
    );
}