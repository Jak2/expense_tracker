import { useState, useCallback } from 'react'
import { RotateCcw } from 'lucide-react'

// Components
import ApiKeyInput from './components/ApiKeyInput'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import ProcessingStatus from './components/ProcessingStatus'
import Summary from './components/Summary'
import TransactionTable from './components/TransactionTable'
import ExportButtons from './components/ExportButtons'
import SettingsModal from './components/SettingsModal'
import { AnalyticsDashboard } from './components/charts'

// Utils
import { hasApiKey, getApiKey } from './utils/storage'
import { performOCR } from './utils/ocr'
import { extractTransactions } from './utils/gemini'

/**
 * Main App Component
 * Orchestrates the entire application flow
 */
export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(hasApiKey())

  // UI state
  const [showSettings, setShowSettings] = useState(false)

  // Processing state
  const [status, setStatus] = useState('idle') // idle, reading, ocr, extracting, complete, error
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  // Data state
  const [transactions, setTransactions] = useState([])
  const [bankName, setBankName] = useState(null)
  const [period, setPeriod] = useState(null)

  /**
   * Process uploaded file
   */
  const processFile = useCallback(async (file) => {
    // Reset state
    setStatus('reading')
    setProgress(10)
    setError(null)
    setTransactions([])
    setBankName(null)
    setPeriod(null)

    try {
      // Step 1: OCR
      setStatus('ocr')
      const ocrText = await performOCR(file, (p) => {
        setProgress(10 + Math.round(p * 0.4)) // 10-50%
      })
      setProgress(50)

      // Step 2: Extract with AI
      setStatus('extracting')
      setProgress(55)

      const apiKey = getApiKey()
      if (!apiKey) {
        throw new Error('API key not found. Please add your key.')
      }

      const result = await extractTransactions(ocrText, apiKey)
      setProgress(90)

      // Validate results
      if (!result.transactions || result.transactions.length === 0) {
        throw new Error('No transactions found. Please try a clearer image.')
      }

      // Success
      setTransactions(result.transactions)
      setBankName(result.bankName)
      setPeriod(result.period)
      setStatus('complete')
      setProgress(100)

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }, [])

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setTransactions([])
    setBankName(null)
    setPeriod(null)
  }, [])

  /**
   * Update a transaction
   */
  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    )
  }, [])

  /**
   * Delete a transaction
   */
  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  /**
   * Handle API key removed
   */
  const handleKeyRemoved = useCallback(() => {
    setIsAuthenticated(false)
    reset()
  }, [reset])

  // Show API key input if not authenticated
  if (!isAuthenticated) {
    return <ApiKeyInput onSuccess={() => setIsAuthenticated(true)} />
  }

  const isProcessing = status !== 'idle' && status !== 'complete' && status !== 'error'
  const hasResults = status === 'complete' && transactions.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* Upload Section */}
        {status === 'idle' && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Upload Bank Statement
              </h1>
              <p className="text-gray-600">
                Drop your bank statement image to extract transactions
              </p>
            </div>
            <FileUpload onFileSelect={processFile} disabled={isProcessing} />
          </div>
        )}

        {/* Processing Section */}
        {isProcessing && (
          <ProcessingStatus status={status} progress={progress} error={error} />
        )}

        {/* Error with Retry */}
        {status === 'error' && (
          <div className="max-w-md mx-auto text-center">
            <ProcessingStatus status={status} progress={progress} error={error} />
            <button
              onClick={reset}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Results Section */}
        {hasResults && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Extracted Transactions
                </h1>
                <p className="text-sm text-gray-500">
                  Review, edit, then export
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Upload
                </button>
                <ExportButtons transactions={transactions} bankName={bankName} period={period} />
              </div>
            </div>

            {/* Analytics Dashboard */}
            <AnalyticsDashboard
              transactions={transactions}
              bankName={bankName}
              period={period}
            />

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 overflow-hidden">
              <TransactionTable
                transactions={transactions}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
              />
            </div>

            {/* Help text */}
            <p className="text-center text-sm text-gray-500">
              Click the pencil icon to edit any transaction. Changes are included in exports.
            </p>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onKeyRemoved={handleKeyRemoved}
        />
      )}
    </div>
  )
}
