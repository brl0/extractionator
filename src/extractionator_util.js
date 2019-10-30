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

