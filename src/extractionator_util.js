const getURLQuery = (qType, fields, url) => JSON.stringify(`${qType}(url:"${url}"){${fields}}`);

export function buildQueries(infoArrays) {
  const subQueriesArray = infoArrays.map(buildQuery);
  const subQueries = subQueriesArray.join();
  const query = `{"query": "query {${subQueries}}"}`;
  return query;
}

function buildQuery(qInfo) {
  const [ qType, fields, url ] = qInfo;
  const subQuery = getURLQuery(qType, fields, url).slice(1,-1);
  return subQuery;
}


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

export function objectToArray (obj){
  const subqs = Object.keys(obj);
  var counter = 0;
  var dataset = [];
  for (var subq in subqs) {
    var data = obj[subqs[subq]];
    var fields = Object.keys(data);
    for (var idx in fields) {
      var item = data[fields[idx]];
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
  }
  console.log("Dataset:");
  console.log(dataset);
  return dataset;
}
