
const DEV = false

let API_BASE = null
let TAXONIUM_BASE = null

if(DEV) {
  API_BASE = 'http://localhost:8000';
  TAXONIUM_BASE = 'http://localhost:8080';
}else {
  API_BASE = window.location.origin + '/api';
  TAXONIUM_BASE = window.location.origin + '/taxonium/'
}

export default {
  API_BASE,
  TAXONIUM_BASE
};