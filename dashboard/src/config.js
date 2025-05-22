
const PRODUCTION = false

let TAXONIUM_BASE = null

if(!PRODUCTION) {
  TAXONIUM_BASE = 'http://localhost:8080/';
}else {
  TAXONIUM_BASE = window.location.origin + '/taxonium/'
}

const REF_FA = `${TAXONIUM_BASE}uploads/NC_045512v2.fa`
const REF_FAI = `${TAXONIUM_BASE}uploads/NC_045512v2.fa.fai`

const BAM = `${TAXONIUM_BASE}uploads/`

const PROJECTS = `${TAXONIUM_BASE}api/projects`

const RESULT = `${TAXONIUM_BASE}api/result/`

const UPLOAD = `${TAXONIUM_BASE}api/upload`

export default {
  TAXONIUM_BASE,
  REF_FA,
  REF_FAI,
  BAM,
  PROJECTS,
  RESULT,
  UPLOAD
};