import { useState } from 'react'

// Field definitions with labels
const PAGE1_FIELDS = [
    { key: 'employer_identification_number', label: 'Item D: EIN' },
    { key: 'gross_receipts', label: 'Item G: Gross Receipts' },
    { key: 'total_contributions', label: 'Row 8: Total Contributions' },
    { key: 'total_revenue', label: 'Row 12: Total Revenue' },
    { key: 'grants_and_similar_amounts_paid', label: 'Row 13: Grants Paid' },
    { key: 'salaries_compensation_benefits', label: 'Row 15: Salaries & Benefits' },
    { key: 'professional_fundraising_fees', label: 'Row 16a: Fundraising Fees' },
    { key: 'total_fundraising_expenses', label: 'Row 16b: Fundraising Expenses' },
    { key: 'total_assets', label: 'Row 20: Total Assets' },
    { key: 'total_liabilities', label: 'Row 21: Total Liabilities' },
    { key: 'net_assets_or_fund_balances', label: 'Row 22: Net Assets' },
]

const PART_VIII_FIELDS = [
    { key: 'federated_campaigns', label: 'Row 1a: Federated Campaigns' },
    { key: 'membership_dues', label: 'Row 1b: Membership Dues' },
    { key: 'fundraising_events', label: 'Row 1c: Fundraising Events' },
    { key: 'related_organizations', label: 'Row 1d: Related Organizations' },
    { key: 'government_grants', label: 'Row 1e: Government Grants' },
    { key: 'all_other_contributions', label: 'Row 1f: Other Contributions' },
    { key: 'noncash_contributions', label: 'Row 1g: Noncash Contributions' },
    { key: 'contributions_total', label: 'Row 1h: Contributions Total' },
    { key: 'program_service_revenue_total', label: 'Row 2g: Program Service Revenue' },
    { key: 'investment_income', label: 'Row 3: Investment Income' },
    { key: 'tax_exempt_bond_income', label: 'Row 4: Tax Exempt Bond Income' },
    { key: 'royalties', label: 'Row 5: Royalties' },
    { key: 'gross_rents_real', label: 'Row 6a(i): Gross Rents (Real)' },
    { key: 'gross_rents_personal', label: 'Row 6a(ii): Gross Rents (Personal)' },
    { key: 'rental_expenses_real', label: 'Row 6b(i): Rental Expenses (Real)' },
    { key: 'rental_expenses_personal', label: 'Row 6b(ii): Rental Expenses (Personal)' },
    { key: 'rental_income_real', label: 'Row 6c(i): Rental Income (Real)' },
    { key: 'rental_income_personal', label: 'Row 6c(ii): Rental Income (Personal)' },
    { key: 'net_rental_income', label: 'Row 6d: Net Rental Income' },
    { key: 'gross_sales_securities', label: 'Row 7a(i): Gross Sales (Securities)' },
    { key: 'gross_sales_other', label: 'Row 7a(ii): Gross Sales (Other)' },
    { key: 'cost_basis_securities', label: 'Row 7b(i): Cost Basis (Securities)' },
    { key: 'cost_basis_other', label: 'Row 7b(ii): Cost Basis (Other)' },
    { key: 'gain_loss_securities', label: 'Row 7c(i): Gain/Loss (Securities)' },
    { key: 'gain_loss_other', label: 'Row 7c(ii): Gain/Loss (Other)' },
    { key: 'net_gain_loss', label: 'Row 7d: Net Gain/Loss' },
    { key: 'fundraising_gross_income', label: 'Row 8a: Fundraising Gross Income' },
    { key: 'fundraising_8a_other', label: 'Row 8a(ii): Fundraising Other' },
    { key: 'fundraising_direct_expenses', label: 'Row 8b: Fundraising Expenses' },
    { key: 'fundraising_net_income', label: 'Row 8c: Fundraising Net Income' },
    { key: 'gaming_gross_income', label: 'Row 9a: Gaming Gross Income' },
    { key: 'gaming_direct_expenses', label: 'Row 9b: Gaming Expenses' },
    { key: 'gaming_net_income', label: 'Row 9c: Gaming Net Income' },
    { key: 'inventory_gross_sales', label: 'Row 10a: Inventory Gross Sales' },
    { key: 'inventory_cost_of_goods', label: 'Row 10b: Cost of Goods' },
    { key: 'inventory_net_income', label: 'Row 10c: Inventory Net Income' },
    { key: 'other_revenue_total', label: 'Row 11e: Other Revenue Total' },
    { key: 'total_revenue', label: 'Row 12: Total Revenue' },
]

const PART_IX_FIELDS = [
    { key: 'grants_domestic_organizations', label: 'Row 1: Grants to Domestic Orgs' },
    { key: 'professional_fundraising_services', label: 'Row 11e: Professional Fundraising' },
    { key: 'affiliate_payments', label: 'Row 21: Payments to Affiliates' },
    { key: 'total_functional_expenses_a', label: 'Row 25(A): Total Expenses' },
    { key: 'total_functional_expenses_b', label: 'Row 25(B): Program Service' },
    { key: 'total_functional_expenses_c', label: 'Row 25(C): Management & General' },
    { key: 'total_functional_expenses_d', label: 'Row 25(D): Fundraising' },
    { key: 'joint_costs', label: 'Row 26: Joint Costs' },
]

function ExtractionResults({ results }) {
    const [activeTab, setActiveTab] = useState('page1')

    const formatValue = (value) => {
        if (!value) return <span className="field-value">0</span>
        // Strip non-digits to show raw numbers without formatting
        const cleaned = value.toString().replace(/[$,]/g, '').split('.')[0]
        return <span className="field-value">{cleaned}</span>
    }

    const getFieldsForTab = () => {
        switch (activeTab) {
            case 'page1':
                return { fields: PAGE1_FIELDS, data: results.page1 }
            case 'part_viii':
                return { fields: PART_VIII_FIELDS, data: results.part_viii }
            case 'part_ix':
                return { fields: PART_IX_FIELDS, data: results.part_ix }
            default:
                return { fields: [], data: {} }
        }
    }

    const handleExportJSON = () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], {
            type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${results.filename.replace('.pdf', '')}_extracted.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleExportCSV = () => {
        const allFields = [...PAGE1_FIELDS, ...PART_VIII_FIELDS, ...PART_IX_FIELDS]
        const allData = { ...results.page1, ...results.part_viii, ...results.part_ix }

        const headers = ['Field', 'Value']
        const rows = allFields.map((field) => [
            field.label,
            // Clean value for CSV as well
            (allData[field.key] || '').toString().replace(/[$,]/g, '').split('.')[0],
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${results.filename.replace('.pdf', '')}_extracted.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const { fields, data } = getFieldsForTab()

    return (
        <section className="results-section">
            <div className="results-header">
                <div>
                    <h2>Extraction Results</h2>
                    <p style={{ color: 'var(--neutral-400)', marginTop: '0.5rem' }}>
                        {results.filename}
                    </p>
                </div>
                <div className="results-meta">
                    <div className="export-buttons">
                        <button className="btn btn-secondary btn-export" onClick={handleExportJSON}>
                            📥 JSON
                        </button>
                        <button className="btn btn-secondary btn-export" onClick={handleExportCSV}>
                            📊 CSV
                        </button>
                    </div>
                </div>
            </div>

            {results.errors && results.errors.length > 0 && (
                <div className="error-message" style={{ marginBottom: '1.5rem' }}>
                    <span className="error-icon">⚠️</span>
                    <span>Some fields could not be extracted: {results.errors.join(', ')}</span>
                </div>
            )}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'page1' ? 'active' : ''}`}
                    onClick={() => setActiveTab('page1')}
                >
                    Page 1 Summary
                </button>
                <button
                    className={`tab ${activeTab === 'part_viii' ? 'active' : ''}`}
                    onClick={() => setActiveTab('part_viii')}
                >
                    Part VIII - Revenue
                </button>
                <button
                    className={`tab ${activeTab === 'part_ix' ? 'active' : ''}`}
                    onClick={() => setActiveTab('part_ix')}
                >
                    Part IX - Expenses
                </button>
            </div>

            <div className="fields-grid">
                {fields.map((field) => (
                    <div className="field-card" key={field.key}>
                        <div className="field-label">{field.label}</div>
                        {formatValue(data?.[field.key])}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ExtractionResults
