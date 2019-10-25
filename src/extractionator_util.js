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
  return s.match(/([^\"\',]*((\'[^\']*\')*||(\"[^\"]*\")*))+/gm);
}
