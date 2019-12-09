import CONSTANTS from "./constants";

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

export function axiosBuildPost(url, queries) {
  return ({
    method: 'post',
    url: url,
    data: queries,
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

export function axiosBuildQueryPost(infoArrays) {
  const queries = buildQueries(infoArrays);
  const url = CONSTANTS.ENDPOINT.GRAPHQL;
  return axiosBuildPost(url, queries);
}

export function makeFullQueryArray(url) {
  var queryInfo = [];
  for (let [key, value] of Object.entries(CONSTANTS.TYPES)) {
    queryInfo.push([key, value, url]);
  }
  return queryInfo;
}

export function axiosFullQueryPost(url) {
  const queryInfo = makeFullQueryArray(url);
  return axiosBuildQueryPost(queryInfo);
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

export function objectToArray (obj) {
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
            counter++,
            fields[idx],
            item[it],
          ]);
        }
      }
      else if (JSON.stringify(item) !== '[]') {
        dataset.push([
          counter++,
          fields[idx],
          item,
        ]);
      }
    }
  }
  return dataset;
}

export function indexArray (a) {
  var results = [];
  for (var i in a) {
    results.push([i, ...a[i]]);
  }
  return results;
}
