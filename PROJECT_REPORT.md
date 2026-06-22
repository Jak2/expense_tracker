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
