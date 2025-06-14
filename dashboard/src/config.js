import { useMemo } from "react";

export default function useDashboardConfig(projectName) {
  const isProd = import.meta.env.PROD; 

  let TAXONIUM_BASE = import.meta.env.VITE_TAXONIUM_BASE || "";

  if (isProd && TAXONIUM_BASE.startsWith('/')) {
    TAXONIUM_BASE = window.location.origin + TAXONIUM_BASE;
  }

  var project_name = projectName['project_name']

  return useMemo(() => {
    return {
      TAXONIUM_BASE,
      REF_NAME: projectName['reference_name'],
      PROJECT_NAME: project_name,
      REF_FA: `${TAXONIUM_BASE}uploads/${project_name}/${projectName['ref_file']}`,
      REF_FAI: `${TAXONIUM_BASE}uploads/${project_name}/${projectName['ref_file']}.fai`,
      BAM: `${TAXONIUM_BASE}uploads/${project_name}/`,
      PROJECTS: `${TAXONIUM_BASE}api/projects`,
      RESULT: `${TAXONIUM_BASE}api/result/`,
      UPLOAD: `${TAXONIUM_BASE}api/upload`,
      START: projectName['start'],
      END: projectName['end'],
      LOAD_TAX: `${TAXONIUM_BASE}load/`
    };
  }, [TAXONIUM_BASE, projectName]);
}
