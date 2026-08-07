export const SEVERITY_ORDER = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW', 'UNKNOWN']

export function normalizeSeverity(raw) {
  const value = (raw || '').toString().trim().toUpperCase()
  if (SEVERITY_ORDER.includes(value)) return value
  if (value.includes('CRIT')) return 'CRITICAL'
  if (value.includes('HIGH')) return 'HIGH'
  if (value.includes('MED') || value.includes('MODERATE')) return 'MODERATE'
  if (value.includes('LOW')) return 'LOW'
  return 'UNKNOWN'
}

// Backend returns vulnerabilities nested under each dependency; the report UI
// lists one row per vulnerability, so flatten and tag each with its package.
export function buildFindings(dependencies) {
  const findings = []
  for (const dep of dependencies) {
    for (const vuln of dep.vulnerabilities || []) {
      findings.push({
        ...vuln,
        severity: normalizeSeverity(vuln.severity),
        packageName: dep.name,
        packageVersion: dep.version,
        scope: dep.type,
      })
    }
  }
  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
  return findings
}

export function summarizeStats(dependencies, findings) {
  const bySeverity = { CRITICAL: 0, HIGH: 0, MODERATE: 0, LOW: 0, UNKNOWN: 0 }
  for (const f of findings) bySeverity[f.severity] += 1
  return {
    totalDependencies: dependencies.length,
    totalVulnerabilities: findings.length,
    bySeverity,
  }
}
