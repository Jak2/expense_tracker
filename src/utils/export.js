/**
 * Export utilities for CSV and Excel
 */

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * Format currency for display
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '-'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/**
 * Calculate summary from transactions
 */
export function calculateSummary(transactions) {
  const totalDebit = transactions.reduce((sum, t) => sum + (t.debit || 0), 0)
  const totalCredit = transactions.reduce((sum, t) => sum + (t.credit || 0), 0)

  return {
    totalDebit,
    totalCredit,
    netFlow: totalCredit - totalDebit,
    count: transactions.length,
  }
}

/**
 * Export transactions to CSV
 */
export function exportToCSV(transactions, filename = 'transactions') {
  const headers = ['Date', 'Description', 'Debit', 'Credit', 'Balance', 'Reference']

  const rows = transactions.map(t => [
    t.date,
    t.description,
    t.debit ?? '',
    t.credit ?? '',
    t.balance ?? '',
    t.reference ?? '',
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => {
        const str = String(cell)
        return str.includes(',') || str.includes('"')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, `${filename}.csv`)
}

/**
 * Export transactions to Excel
 */
export function exportToExcel(transactions, filename = 'transactions') {
  const data = transactions.map(t => ({
    Date: t.date,
    Description: t.description,
    Debit: t.debit,
    Credit: t.credit,
    Balance: t.balance,
    Reference: t.reference,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

  // Set column widths
  ws['!cols'] = [
    { wch: 12 },  // Date
    { wch: 40 },  // Description
    { wch: 12 },  // Debit
    { wch: 12 },  // Credit
    { wch: 12 },  // Balance
    { wch: 20 },  // Reference
  ]

  // Add totals row
  const summary = calculateSummary(transactions)
  XLSX.utils.sheet_add_aoa(ws, [
    ['', 'TOTAL', summary.totalDebit, summary.totalCredit, '', '']
  ], { origin: -1 })

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  saveAs(blob, `${filename}.xlsx`)
}
