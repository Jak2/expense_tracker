/**
 * PDF Export utility for generating formatted financial reports
 * Uses jsPDF for PDF generation and html2canvas for chart capture
 */

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'
import { calculateStats, generateSummaryText, formatCurrency } from './analytics'

/**
 * Capture a DOM element as an image
 */
async function captureElement(elementId) {
  const element = document.getElementById(elementId)
  if (!element) return null

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    })
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.warn(`Failed to capture ${elementId}:`, error)
    return null
  }
}

/**
 * Generate a formatted PDF report with charts
 */
export async function exportToPDF(transactions, bankName = null, period = null, filename = 'financial-report') {
  const doc = new jsPDF()
  const stats = calculateStats(transactions)
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  let yPos = 20

  // === HEADER ===
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Financial Summary Report', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  // Bank name and period
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  const subtitle = bankName ? `${bankName} | ${period || 'Statement Period'}` : (period || 'Bank Statement Analysis')
  doc.text(subtitle, pageWidth / 2, yPos, { align: 'center' })
  yPos += 5

  // Generated date
  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // === EXECUTIVE SUMMARY ===
  doc.setTextColor(0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 14, yPos)
  yPos += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const summaryText = generateSummaryText(stats, bankName, period)
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 28)
  doc.text(splitSummary, 14, yPos)
  yPos += splitSummary.length * 5 + 10

  // === KEY METRICS TABLE ===
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Key Metrics', 14, yPos)
  yPos += 7

  const metricsData = [
    ['Total Income', formatCurrency(stats.totalCredit)],
    ['Total Expenses', formatCurrency(stats.totalDebit)],
    ['Net Cash Flow', formatCurrency(stats.netFlow)],
    ['Daily Burn Rate', formatCurrency(stats.dailyBurnRate) + '/day'],
    ['Transactions', stats.transactionCount.toString()],
    ['Period', `${stats.periodDays} days`]
  ]

  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: metricsData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { halign: 'right', cellWidth: 50 }
    },
    margin: { left: 14, right: pageWidth / 2 + 10 }
  })

  // Fixed vs Variable (right side)
  const fixedVarData = [
    ['Fixed Costs', formatCurrency(stats.costBreakdown.fixed.total), `${stats.costBreakdown.fixedPercent.toFixed(1)}%`],
    ['Variable Costs', formatCurrency(stats.costBreakdown.variable.total), `${stats.costBreakdown.variablePercent.toFixed(1)}%`]
  ]

  doc.autoTable({
    startY: yPos,
    head: [['Cost Type', 'Amount', '% of Total']],
    body: fixedVarData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' }
    },
    margin: { left: pageWidth / 2 + 5, right: 14 }
  })

  yPos = doc.lastAutoTable.finalY + 15

  // === CHARTS (if visible in DOM) ===
  const categoryChartImage = await captureElement('category-chart')
  const costChartImage = await captureElement('cost-breakdown-chart')

  if (categoryChartImage || costChartImage) {
    // Check if we need a new page
    if (yPos > 170) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0)
    doc.text('Visual Analytics', 14, yPos)
    yPos += 10

    const chartWidth = 85
    const chartHeight = 55

    if (categoryChartImage) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Spending by Category', 14, yPos)
      doc.addImage(categoryChartImage, 'PNG', 14, yPos + 3, chartWidth, chartHeight)
    }

    if (costChartImage) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Fixed vs Variable', pageWidth / 2 + 5, yPos)
      doc.addImage(costChartImage, 'PNG', pageWidth / 2 + 5, yPos + 3, chartWidth, chartHeight)
    }

    yPos += chartHeight + 20
  }

  // === CATEGORY BREAKDOWN TABLE ===
  if (yPos > 200) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0)
  doc.text('Spending by Category', 14, yPos)
  yPos += 7

  const categoryData = stats.categoryTotals
    .filter(c => c.amount > 0)
    .slice(0, 10)
    .map(c => {
      const percent = stats.totalDebit > 0 ? ((c.amount / stats.totalDebit) * 100).toFixed(1) : '0'
      return [c.category, formatCurrency(c.amount), `${percent}%`]
    })

  if (categoryData.length > 0) {
    doc.autoTable({
      startY: yPos,
      head: [['Category', 'Amount', '% of Total']],
      body: categoryData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { halign: 'right', cellWidth: 50 },
        2: { halign: 'right', cellWidth: 40 }
      },
      margin: { left: 14, right: 14 }
    })
    yPos = doc.lastAutoTable.finalY + 15
  }

  // === TRANSACTIONS TABLE ===
  doc.addPage()
  yPos = 20

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Transaction Details', 14, yPos)
  yPos += 7

  const txnData = transactions.map(t => [
    t.date || '-',
    (t.description || '').substring(0, 30),
    t.category || 'Other',
    t.debit ? formatCurrency(t.debit) : '-',
    t.credit ? formatCurrency(t.credit) : '-'
  ])

  doc.autoTable({
    startY: yPos,
    head: [['Date', 'Description', 'Category', 'Debit', 'Credit']],
    body: txnData,
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 55 },
      2: { cellWidth: 35 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 28 }
    },
    margin: { left: 14, right: 14 },
    didDrawPage: () => {
      // Footer on each page
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }
  })

  // === FOOTER ===
  const finalY = doc.lastAutoTable.finalY + 15
  if (finalY < pageHeight - 20) {
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('Generated by Financial Statement Parser', 14, finalY)
    doc.text('This report is for informational purposes only.', 14, finalY + 4)
  }

  // Save the PDF
  doc.save(`${filename}.pdf`)
}
