import React from "react";
import MUIDataTable from "mui-datatables";

import CONSTANTS from "constants";


const getURLQuery = (qType, url, fields) => JSON.stringify(`${qType}(url:"${url}"){${fields}}`);

export function buildQueries(infoArrays) {
  const subQueriesArray = infoArrays.map(buildQuery);
  const subQueries = subQueriesArray.join();
  const query = `{"query": "query {${subQueries}}"}`;
  return query;
}

function buildQuery(qInfo) {
  const [ qType, url, fields ] = qInfo;
  const subQuery = getURLQuery(qType, url, fields).slice(1,-1);
  return subQuery;
}

const default_fields = '{url,title,feed,image,description,text,qs,}';

export default function buildPost(queries) {
    return ({
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: `${queries}`,
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