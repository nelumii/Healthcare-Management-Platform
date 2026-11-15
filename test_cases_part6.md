# CareLink Platform - Part 6 Test Specifications

This document outlines 5 critical test cases for each of the 6 core modules in the CareLink system.

---

## 1. System Administration & Security Module

| Test Case ID | Test Title | Description | Preconditions | Test Steps | Test Data | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SYS-01** | Multi-Factor Auth (OTP) | Verify identity verification via email OTP during login. | MFA enabled for admin user. | 1. Enter valid credentials.<br>2. Submit login form.<br>3. Check email for 6-digit OTP.<br>4. Enter correct OTP. | Email: admin@carelink.com<br>OTP: [from_email] | User is successfully redirected to the Admin Dashboard. | PENDING |
| **SYS-02** | Role-Based Access Control | Verify restricted access to settings for non-admin users. | User logged in as Doctor. | 1. Attempt to navigate to `/admin/system-config`. | URL: `/admin/system-config` | System denies access and redirects to 'Unauthorized' page or Doctor home. | PENDING |
| **SYS-03** | Supplier Registration Uniqueness | Block duplicate Company Name/Reg ID during registration. | Existing supplier 'Global Pharma' (Reg: BR123). | 1. Access Supplier Register.<br>2. Enter 'Global Pharma' and 'BR123'.<br>3. Submit. | Name: Global Pharma<br>ID: BR123 | UI shows 'Company already registered' error; record is not saved. | PENDING |
| **SYS-04** | National ID Format Validation | Enforce strict format for NIC/Passport (max 13, numeric + 'v'). | User on registration page. | 1. Enter '12345678901234' (14 chars).<br>2. Enter 'abc'.<br>3. Click Register. | ID: 993425021v | Input is truncated at 13 chars. Error 'Invalid Format' shown for alpha-chars other than 'v'. | PENDING |
| **SYS-05** | Secure Session Termination | Verify tokens are invalidated upon logout. | Active user session. | 1. Click 'Logout' button.<br>2. Attempt to navigate back to dashboard. | N/A | Session is destroyed; back navigation redirects to Login. | PENDING |

---

## 2. Doctor’s Clinical Dashboard & Prescriptions

| Test Case ID | Test Title | Description | Preconditions | Test Steps | Test Data | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DOC-01** | Patient Search | Find patients by partial name or phone number. | Patient database populated. | 1. Type "Ruchira" in search bar.<br>2. Select from list. | Query: "Ruchira" | Relevant patient profile is loaded in the dashboard. | PENDING |
| **DOC-02** | Digital Prescription Issuance | Create and save a multi-medicine prescription. | Patient profile active. | 1. Click 'Add Prescription'.<br>2. Add 'Amoxicillin' and 'Paracetamol'.<br>3. Set dosage/frequency.<br>4. Save. | Meds: Amoxicillin (500mg, 1x3), Paracetamol | Prescription is generated with a unique REF ID and saved to EMR. | PENDING |
| **DOC-03** | Medical License Uniqueness | Block registration with an existing license number. | Database has license 'MC-8890'. | 1. Register new doctor with license 'MC-8890'. | License: MC-8890 | Backend returns 409 Conflict; UI shows 'License already in use'. | PENDING |
| **DOC-04** | Vitals Logging | Record patient vitals in history. | Consult session active. | 1. Enter BP, Weight, Temp.<br>2. Submit. | BP: 120/80<br>Temp: 37C | Vitals appear in the patient timeline chart immediately. | PENDING |
| **DOC-05** | Laboratory Test Referral | Issue a diagnostic test request to the lab module. | Patient active. | 1. Select 'Refer Test'.<br>2. Select 'Full Blood Count'.<br>3. Submit. | Test: FBC | Test request becomes visible in the Lab Dashboard with 'Pending' status. | PENDING |
| **DOC-06** | Medicine Filtering by Category | Filter medicines by type (e.g., Antibiotic, Analgesic). | Prescription view open. | 1. Use the category dropdown to select 'Antibiotic'. | Category: Antibiotic | Only antibiotic drugs are shown in the searchable list. | PENDING |
| **DOC-07** | Past Prescription Duplication | Quickly re-issue a previous prescription for chronic patients. | Patient has a past prescription. | 1. View History.<br>2. Click 'Repeat' on an old prescription. | N/A | Current prescription fields are auto-filled with previous data. | PENDING |

---

## 3. Laboratory & Diagnostic Management

| Test Case ID | Test Title | Description | Preconditions | Test Steps | Test Data | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **LAB-01** | Test Queue Visibility | Verify incoming doctor referrals appear in real-time. | Doctor issued a referral. | 1. Login to Lab Dashboard.<br>2. Refresh queue. | N/A | Referral for patient appears at the top of the 'Pending Tests' list. | PENDING |
| **LAB-02** | Report PDF Upload | Attach diagnostic results to a patient record. | Pending test selected. | 1. Click 'Upload Result'.<br>2. Select PDF file.<br>3. Save. | File: report_001.pdf | File is stored in S3/Filesystem; entry marked 'Completed'. | PENDING |
| **LAB-03** | Result Summary Entry | Enter numeric results for dashboard trends. | Test in progress. | 1. Enter Hemoglobin: 14.5.<br>2. Save. | Hb: 14.5 g/dL | Result is saved and triggers any abnormal range alerts if applicable. | PENDING |
| **LAB-04** | Result Rejection Flow | Mark a sample as invalid/rejected with reasons. | Sample collected. | 1. Select 'Reject Sample'.<br>2. Enter reason "Sample clotted". | Reason: Clotted | Referral status changes to 'Rejected'; notification sent to clinician. | PENDING |
| **LAB-05** | Patient History Access | View past lab results for context. | Patient has prior tests. | 1. Open Lab History for Patient id: 5. | Patient ID: 5 | A chronological list of all past PDF reports and results is shown. | PENDING |
| **LAB-06** | Duplicate Result Prevention | Block re-uploading results for an already completed test. | Test status is 'Completed'. | 1. Attempt to upload a new PDF to a completed test. | File: new_report.pdf | System prevents upload and shows 'Test already completed' error. | PENDING |
| **LAB-07** | Lab Inventory Tracking | Decrement reagent stock after a successful test. | Reagent 'Hb-Reagent' has 10 units. | 1. Complete an FBC test for a patient. | N/A | 'Hb-Reagent' stock count reduces to 9 automatically. | PENDING |

---

## 4. Patient & Electronic Medical Record (EMR) Module

| Test Case ID | Test Title | Description | Preconditions | Test Steps | Test Data | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PAT-01** | Profile Information Update | Allow patient to update contact details. | Patient logged in. | 1. Navigate to Settings.<br>2. Change phone number.<br>3. Save. | New Phone: 0712345678 | Database updates; Success toast shown; Header profile updates. | PENDING |
| **PAT-02** | Appointment Booking | Verify slot reservation for a specific doctor. | Doctor schedule set. | 1. View /appointments.<br>2. Select Dr. Rukshan.<br>3. Pick 10:00 AM.<br>4. Confirm. | Doctor: Rukshan<br>Time: 10:00 | Slot is blocked; Appointment appears in 'Upcoming' list. | PENDING |
| **PAT-03** | Report Download Access | Patient downloads their own lab reports. | Completed lab test exists. | 1. Go to 'My Reports'.<br>2. Click Download on latest entry. | N/A | PDF file downloads successfully to the local device. | PENDING |
| **PAT-04** | Prescription View | Verify active and past prescriptions are visible. | Medication issued. | 1. Open 'My Medications'. | N/A | List shows dosage, frequency, and issued date for all medications. | PENDING |
| **PAT-05** | Account OTP Reset | Verify ability to recover account via verified email. | User forgot password. | 1. Click 'Forgot Password'.<br>2. Enter Email.<br>3. Verify OTP code. | Email: patient@care.com | User is prompted for new password creation. | PENDING |

---

## 5. Pharmaceutical Supplier & Inventory Network

| Test Case ID | Test Title | Description | Preconditions | Test Steps | Test Data | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SUP-01** | Medicine Stock Addition | Add new drug items to the global supply catalog. | Supplier logged in. | 1. Click 'New Product'.<br>2. Enter Name, Brand, Price.<br>3. Submit. | Name: Panadol<br>Price: 15.00 | Item appears in the inventory list and becomes searchable. | PENDING |
| **SUP-02** | Purchase Order Management | Receive and fulfill requests from pharmacies. | Pharmacy issued PO. | 1. View 'Active Orders'.<br>2. Click 'Ship'. | PO# 501 | Order status changes to 'Dispatched'; Stock qty is reduced. | PENDING |
| **SUP-03** | Low Stock Alert | System flags items under safety threshold. | Med: 'Aspent' Qty: 5 (Min: 10). | 1. Login to supplier dashboard. | N/A | Aspent appears highlighted in Red or in 'Low Stock' notifications. | PENDING |
| **SUP-04** | Batch Expiry Tracking | Identify batches nearing their expiry date. | Batch 001 expires May 2026. | 1. View 'Expiry Analytics'. | Batch: 001 | Graph/List shows Batch 001 in the 'Expiring Soon' category. | PENDING |
| **SUP-05** | Revenue Analytics Visualization | Verify revenue charts update based on fulfilled orders. | $500 PO fulfilled today. | 1. Check Dashboard Charts. | N/A | Bar/Line charts show a spike in revenue for the current day/month. | PENDING |
| **SUP-06** | Batch Number Validation | Track unique batch IDs for quality assurance. | Supplier adding new stock. | 1. Enter Batch: BN-2024.<br>2. Add stock. | Batch: BN-2024 | Stock is successfully linked to batch ID for traceability. | PENDING |
| **SUP-07** | Supplier Profile Verification | Ensure pharmacy users see correct supplier contact details. | Supplier profile is complete. | 1. Access 'Global Suppliers' from Pharmacy dashboard. | N/A | Supplier's email, phone, and address are correctly displayed. | PENDING |

---

## 6. Pharmacy Dispensing & Expiry Management Unit

| Test Case ID | Test Title | Description | Preconditions | Test Steps | Test Data | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PHA-01** | Prescription Sync - POS Lock | **Verify non-editable basket after prescription load.** | Active Prescription (REF: 101). | 1. Sync REF 101.<br>2. Attempt to add extra med. from grid.<br>3. Attempt to click +/- on cart. | REF: 101 | Addition is blocked (Warning shown). Cart quantity buttons are hidden. | PENDING |
| **PHA-02** | Inventory Auto-Scroll | Verify medicines grid handles large datasets without cutting text. | Inventory > 50 items. | 1. Scroll and view the last row of medicines in the POS grid. | N/A | Row is fully visible and not clipped by the basket container. | PENDING |
| **PHA-03** | Dispensing Transaction | Finalize sale and reduce pharmacy inventory. | Cart contains items. | 1. Click 'Finalize Dispensing'.<br>2. Confirm. | N/A | Inventory count drops; Receipt generated; Cart clears. | PENDING |
| **PHA-04** | Generic/Brand Search Search | Verify real-time filtering in the POS interface. | Medicines 'Amoxicillin' and 'Amox' exist. | 1. Type "Amox" in search box. | Query: "Amox" | Only matching items are displayed in the grid. | PENDING |
| **PHA-05** | Locked Customer Reset | Verify 'Reset' restores UI to searchable/editable mode. | Prescription Mode Active. | 1. Click 'Reset / Clear All' button. | N/A | Overlay disappears; Input becomes enabled; Cart is emptied. | PENDING |
| **PHA-06** | Out of Stock Visual Feedback | Verify unavailable medicines are grayed out/inactive. | 'Aspirin' stock is 0. | 1. Search for 'Aspirin' in POS. | Query: 'Aspirin' | Medicine card shows 'OUT OF STOCK' badge and '+' button is disabled. | PENDING |
| **PHA-07** | Multiple Prescription Selection | Handle cases where a patient has multiple pending orders. | Patient has 2 pending prescriptions. | 1. Load patient profile.<br>2. view 'Pending Orders' modal. | N/A | List shows both prescriptions with their respective REF IDs. | PENDING |
| **PHA-08** | Safety Stock Limit | Prevent adding more items to the cart than available in store. | 'Amoxicillin' stock is 5. | 1. Add 5 items to cart.<br>2. Attempt to add 6th item. | N/A | Alert: 'Safety stock limit reached' is shown; Quantity remains 5. | PENDING |
| **PHA-09** | Prescription Search Lock | Verify search bar prevents interactivity during sync mode. | Prescription Mode Active. | 1. Attempt to type in 'Inventory Search' bar. | Query: 'Panadol' | Input is disabled; Overlay 'PRESCRIPTION MODE ACTIVE' is visible. | PENDING |
