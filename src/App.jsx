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

        const API_URL = import.meta.env.VITE_API_URL || ''
        
        try {
            const response = await fetch(`${API_URL}/api/extract`, {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to extract data from PDF')
            }

            if (data.success) {
                setResults(data.data)
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
                                '🔍 Extract Data'
                            )}
                        </button>

                        {(file || results) && (
                            <button className="btn btn-secondary" onClick={handleReset}>
                                🔄 Reset
                            </button>
                        )}
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
