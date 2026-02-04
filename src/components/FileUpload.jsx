import { useState, useCallback } from 'react'
import { Upload, Image, FileText, AlertCircle } from 'lucide-react'

/**
 * File Upload Component
 * Drag and drop or click to upload bank statement images or PDFs
 */
export default function FileUpload({ onFileSelect, disabled }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const validateFile = (file) => {
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const isValidImage = validImageTypes.includes(file.type)

    if (!isValidImage && !isPDF) {
      return 'Please upload a PNG, JPG, WEBP image or PDF file.'
    }
    if (file.size > 20 * 1024 * 1024) {
      return 'File too large. Maximum size is 20MB.'
    }
    return null
  }

  const handleFile = useCallback((file) => {
    setError('')
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [disabled, handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = '' // Reset to allow same file selection
  }, [handleFile])

  return (
    <div className="w-full">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          flex flex-col items-center justify-center w-full
          min-h-[280px] sm:min-h-[320px]
          border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-200
          ${disabled
            ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
            : isDragging
            ? 'bg-blue-50 border-blue-400 scale-[1.02]'
            : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className={`
            p-4 rounded-2xl mb-4 transition-colors
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <Upload className={`
              w-8 h-8
              ${isDragging ? 'text-blue-600' : 'text-gray-400'}
            `} />
          </div>

          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragging ? 'Drop your file here' : 'Drop your bank statement here'}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            or click to browse files
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Image className="w-4 h-4" />
              PNG, JPG, WEBP
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              PDF
            </span>
            <span>•</span>
            <span>Max 20MB</span>
          </div>
        </div>

        <input
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf,.pdf"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </label>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
