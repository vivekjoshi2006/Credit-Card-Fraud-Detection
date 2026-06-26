# Credit Card Fraud Detection Dashboard

An interactive, real-time credit card validation and fraud detection dashboard. Built entirely on the client side (on-device) to ensure PCI-DSS alignment, it utilizes behavioral telemetry, user-input biometrics, and a deep BIN database to calculate transactional risk scores.

---

## 🌟 Key Features

*   **Heuristic Risk Scoring Engine:** Analyzes multiple parameters (including checksums, behavioral patterns, placeholder checks, and geographic data) to score transactions from 0 to 100.
*   **Behavioral Telemetry (Biometrics):** Detects if the card number was copy-pasted (suggesting bot or script automation) vs. typed manually, and tracks rapid submit velocities (card testing attacks).
*   **Deep Indian BIN Lookup:** Maps the first 4 to 6 digits to identify specific Indian banks (SBI, HDFC, ICICI, Axis) and domestic networks like **RuPay**, dynamically updating the brand card colors, bank text, and logos.
*   **On-the-Fly Expiry Validation:** Enforces strict date validations in real-time. Automatically appends a `/` after the second month digit, caps months at `12` (never allowing `00`), and binds the year selection strictly between the current year (2026) and a 14-year future limit (2040).
*   **Interactive 3D Virtual Card:** A visual card mockup featuring EMV chip circuitry details, diagonal light-sheen reflections, and smooth 180° rotation when the CVV field gains focus.
*   **Security Privacy Shield:** A toggle button to hide sensitive numbers (e.g., `XXXX XXXX XXXX 1234`) on the visual card for privacy in public spaces.
*   **Interactive Field Disabling:** Input fields remain locked until a bank is selected from the dropdown, ensuring clean entry flows.
*   **Persistent Local Wallet:** Allows saving valid, approved cards to a locally stored wallet memory (`localStorage`) without duplicate records or saving blank inputs.

---

## 🛠️ Tech Stack

*   **Frontend:** React 18
*   **Styling & FX:** CSS3 (Custom Glassmorphism, 3D CSS Transforms, Variable Keyframe Animations)
*   **Icons:** Lucide React

---

## 🚀 Local Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vivekjoshi2006/Credit-Card-Fraud-Detection.git
   cd credit-card-fraud-detect
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   # OR
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Presentation Test Scenarios

Use these test values during demonstrations or reviews to showcase how the risk engine evaluates inputs:

### Scenario 1: Clean Approved Transaction
*   **Action:** Select **SBI (Visa)** from the dropdown. **Manually type** the remaining digits: `4591 7192 8371 6258`. Input the name `Aarav Patel`.
*   **Expected Result:** **Safe (0/100)**. Card turns SBI blue. Clicking "Add Card to Wallet" successfully saves the card.

### Scenario 2: Copy-Paste / Bot Telemetry
*   **Action:** Copy the number `4055123456789015` (ICICI) and **paste** it into the card input field.
*   **Expected Result:** **Suspicious (20/100)**. The dashboard highlights the copy-paste action as a bot marker.

### Scenario 3: Placeholders / Medium Risk
*   **Action:** Copy-paste a valid card, then type the cardholder name as `test` or `admin`.
*   **Expected Result:** **Suspicious (60/100)**. Triggers cumulative penalties for both copy-pasting and suspicious default names.

### Scenario 4: High-Risk Blocked Transaction
*   **Action:** Type a mathematically invalid number (e.g., `4591 7192 8371 6253`).
*   **Expected Result:** **High Risk (80/100+)**. Flagged for "Failed mathematical checksum". Clicking the submit button triggers a security alert and blocks saving to the wallet.
