//Function to normalize the data from the API to a more usable format for the frontend
export function normalizeTrials(studies) {
  return studies.map(study => {
    const p = study.protocolSection

    return {
      nctId:       p.identificationModule?.nctId ?? '',
      title:       p.identificationModule?.briefTitle ?? 'Untitled',
      status:      p.statusModule?.overallStatus ?? 'Unknown',
      phase:       p.designModule?.phases?.[0] ?? 'N/A',
      conditions:  p.conditionsModule?.conditions ?? [],
      eligibility: p.eligibilityModule?.eligibilityCriteria ?? '',
      locations:   p.contactsLocationsModule?.locations?.map(l => l.city) ?? []
    }
  })
}