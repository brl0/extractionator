const CONSTANTS = {};

CONSTANTS.ERROR_MESSAGE = {};

CONSTANTS.ERROR_MESSAGE.GRID_GET = "Request to get grid text failed:";

CONSTANTS.ERROR_MESSAGE.LIST_DELETE = "Request to delete list item failed:";
CONSTANTS.ERROR_MESSAGE.LIST_ADD = "Request to add list item failed:";
CONSTANTS.ERROR_MESSAGE.LIST_GET = "Request to get list items failed:";
CONSTANTS.ERROR_MESSAGE.LIST_EMPTY_MESSAGE = "Please enter a valid message";

CONSTANTS.ERROR_MESSAGE.MASTERDETAIL_GET =
  "Request to get master detail text failed:";

CONSTANTS.ENDPOINT = {};

CONSTANTS.ENDPOINT.GRID = "/api/grid";

CONSTANTS.ENDPOINT.LIST = "/api/list";

CONSTANTS.ENDPOINT.MASTERDETAIL = "/api/masterdetail";

CONSTANTS.ENDPOINT.JSON_LINKS = "/json_links/";
CONSTANTS.ENDPOINT.JSON = "/api/json";
CONSTANTS.ENDPOINT.GRAPHQL = "/graphql";

const websiteFields = 'url,title,feed,image,description,text,qs';
const urlQueryFields = 'url,qs,ext,domain,tld,check,qp';
const textInfoFields = 'url,links,summary,text';
const nlpInfoFields = 'url,objects';
const linksFields = 'url,links';
const requestInfoFields = 'url,requestInfo';
const htmlContentFields = 'html';
const tagInfoFields = 'tagCols,tagData';

CONSTANTS.TYPES = {
  'website': websiteFields,
  'urlQuery': urlQueryFields,
  'textInfo': textInfoFields,
  'nlpInfo': nlpInfoFields,
  'links': linksFields,
  'requestInfo': requestInfoFields,
  'htmlContent': htmlContentFields,
  'tagInfo': tagInfoFields,
};

export default CONSTANTS;
