import { useCallback, useState } from 'react'
import Header from './components/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import ScanningPage from './pages/ScanningPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import { scanManifest, ScanError } from './api/scan.js'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'scanning' | 'report'
  const [manifestInput, setManifestInput] = useState('')
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)

  const handleScan = useCallback(async (fileContent) => {
    setError(null)
    setManifestInput(fileContent)
    setView('scanning')
    try {
      const data = await scanManifest(fileContent)
      setReport(data)
      setView('report')
    } catch (err) {
      setError(err instanceof ScanError ? err.message : 'Something went wrong while scanning. Please try again.')
      setView('home')
    }
  }, [])

  const handleReset = useCallback(() => {
    setReport(null)
    setError(null)
    setManifestInput('')
    setView('home')
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header showNewScan={view === 'report'} onNewScan={handleReset} />
      <main className="flex flex-1 flex-col">
        {view === 'home' && <HomePage onScan={handleScan} initialValue={manifestInput} error={error} />}
        {view === 'scanning' && <ScanningPage />}
        {view === 'report' && report && <ReportPage report={report} onNewScan={handleReset} />}
      </main>
    </div>
  )
}
