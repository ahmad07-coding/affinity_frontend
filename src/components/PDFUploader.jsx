import { useRef, useState } from 'react'

function PDFUploader({ file, onFileSelect, onRemoveFile, isLoading }) {
    const fileInputRef = useRef(null)
    const [isDragActive, setIsDragActive] = useState(false)

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)

        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && droppedFile.type === 'application/pdf') {
            onFileSelect(droppedFile)
        }
    }

    const handleClick = () => {
        if (!isLoading) {
            fileInputRef.current?.click()
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            onFileSelect(selectedFile)
        }
        // Reset input so same file can be selected again
        e.target.value = ''
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div>
            <div
                className={`dropzone ${isDragActive ? 'active' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div className="dropzone-icon">📄</div>
                <h3>Upload IRS Form 990 PDF</h3>
                <p>
                    Drag and drop your file here, or{' '}
                    <span className="highlight">browse</span> to select
                </p>
                <p>Supports PDF files only</p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
            />

            {file && (
                <div className="selected-file">
                    <div className="file-info">
                        <span className="file-icon">📑</span>
                        <div className="file-details">
                            <h4>{file.name}</h4>
                            <span>{formatFileSize(file.size)}</span>
                        </div>
                    </div>
                    {!isLoading && (
                        <button className="remove-file" onClick={onRemoveFile}>
                            ✕ Remove
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default PDFUploader
