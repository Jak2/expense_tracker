# Financial Statement Parser — Project Report

> A privacy-first web application that extracts transactions from bank statements using Artificial Intelligence (AI) and exports them to spreadsheets and reports.

**Author:** Jaya Arun Kumar Tulluri
**Version:** 1.3.1 — June 2026
**Project:** Financial Statement Parser

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem & Motivation](#2-problem--motivation)
3. [How It Works — Plain English](#3-how-it-works--plain-english)
4. [System Architecture](#4-system-architecture)
5. [Core Technical Components](#5-core-technical-components)
6. [Privacy & Security Design](#6-privacy--security-design)
7. [Usage Guide](#7-usage-guide)
8. [Tech Stack & Key Design Decisions](#8-tech-stack--key-design-decisions)

---

## 1. Executive Summary

The Financial Statement Parser is a free, browser-based tool that turns bank statement images and Portable Document Format (PDF) files into structured, exportable data. Upload a scan or PDF of any bank statement, and the app reads it using Optical Character Recognition (OCR) — a technology that converts printed text in images into machine-readable characters — then passes the extracted text to Google's Gemini AI for transaction identification and categorisation. Within seconds, every transaction appears in an editable table ready to download as a Comma-Separated Values (CSV) file, a multi-sheet Excel workbook, or a formatted PDF report.

The defining characteristic of the project is its privacy-first architecture: the original file never leaves the user's browser. No server receives your financial documents. No account is required. The only external call the app makes is sending the OCR-extracted text (not the file itself) to Google's Gemini Application Programming Interface (API) — and even that requires the user to supply their own free API key, keeping the app entirely stateless and cost-free to run.

The tool is aimed at small business owners reconciling monthly expenses, freelancers preparing tax records, accountants processing client statements, and anyone who has ever spent an afternoon manually re-typing transactions from a scanned PDF.

---

## 2. Problem & Motivation

### The Manual Problem

Every bank issues statements. Most arrive as PDFs or scanned images. For individuals reviewing a single monthly statement, this is manageable. For a freelancer reconciling three months of transactions before filing taxes, or an accountant processing twenty client PDFs in a week, it becomes a significant time sink: open the file, read each row, type the date, description, and amount into a spreadsheet, repeat. A typical bank statement has thirty to one hundred rows. Errors creep in. Numbers get transposed. The work is tedious and not where skilled time should go.

### Why Existing Approaches Fall Short

Several tools attempt to solve this problem, but each carries a meaningful trade-off:

- **Manual entry** is free but slow and error-prone at scale.
- **Bank-provided data exports** (where available) are inconsistently formatted, not available for older statements, and do not work for scanned paper documents.
- **Paid parsing services** such as Docparser or Tabula require subscriptions, handle limited formats, and — crucially — require uploading the document to a third-party server.
- **General-purpose AI tools** (ChatGPT, Gemini web interface) can extract transactions when given a PDF, but produce unstructured text that still needs manual reformatting before it can be used as data.

The common problem across all paid and server-based tools is privacy: financial statements contain account numbers, balances, transaction histories, and merchant details. Sending that data to an external service, even a reputable one, is a risk many users — and most compliance-conscious businesses — are unwilling to accept.

### The Gap This Project Fills

The Financial Statement Parser was built to close this gap: fully automated extraction with zero document upload, zero subscription cost, and AI-quality output. The Bring Your Own Key (BYOK) model means the user provides a free Google Gemini API key; the app itself has no server, no database, and no mechanism to receive or store anyone's data. Every document stays in the user's browser. The result is a tool that delivers the convenience of a paid SaaS product with the privacy guarantees of a local desktop app.

---
