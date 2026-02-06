import { useState, useRef } from 'react'
import PDFUploader from './components/PDFUploader'
import ExtractionResults from './components/ExtractionResults'

function App() {
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState(null)

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile)
        setError(null)
        setResults(null)
    }

    const handleRemoveFile = () => {
        setFile(null)
        setError(null)
        setResults(null)
    }

    const handleExtract = async () => {
        if (!file) return

        setIsLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        const API_URL = import.meta.env.VITE_API_URL

        try {
            const response = await fetch(`${API_URL}/api/extract/v2`, {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to extract data from PDF')
            }

            // V2 API returns success=false for low confidence, but still returns data
            if (data.success || (data.data && Object.keys(data.data).length > 0)) {
                setResults(data.data)

                // If it's a "manual review" case (success=false but data exists), we might want to show a gentle warning
                // but the user asked to hide confidence things, so we'll just treat it as a result.
                // Optionally we could set a non-intrusive "review needed" banner if requested, 
                // but strictly "dont show confidence related things" implies clean UI.
                // We'll reset error just in case.
                setError(null)
            } else {
                throw new Error(data.message || 'Extraction failed')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setFile(null)
        setResults(null)
        setError(null)
    }

    return (
        <div className="app">
            <header className="header">
                <h1>IRS Form 990 PDF Extractor</h1>
                <p>Extract financial and organizational data with precision</p>
            </header>

            <main className="main-container">
                <section className="upload-section">
                    <PDFUploader
                        file={file}
                        onFileSelect={handleFileSelect}
                        onRemoveFile={handleRemoveFile}
                        isLoading={isLoading}
                    />

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="button-group">
                        <button
                            className="btn btn-primary"
                            onClick={handleExtract}
                            disabled={!file || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                'Extract Data'
                            )}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                            <p className="progress-text">Analyzing PDF and extracting fields...</p>
                        </div>
                    )}
                </section>

                {results && (
                    <ExtractionResults results={results} />
                )}
            </main>
        </div>
    )
}

export default App
