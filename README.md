# 💊 SaltSaver × MedPrior AI

### Generic Medicine Substitute Finder & Intelligent Refill Prioritization

**Making Healthcare Affordable, Accessible and Intelligent.**

SaltSaver × MedPrior AI is a mobile-first healthcare UI/UX prototype designed to simplify generic medicine discovery, price comparison, savings tracking, and medicine refill prioritization.

The platform combines two interconnected solutions:

- **SaltSaver:** A medicine discovery and savings platform that helps users identify lower-cost generic alternatives with matching active ingredients, strength, and dosage form.
- **MedPrior AI:** A supporting refill prioritization workflow that simulates AI-assisted medicine delivery priority suggestions for pharmacy staff.

Our vision is to make affordable medicines easier to discover while improving the organization of medicine refill and delivery requests.

---

## 🚨 1. Problem Statement

Many patients and caregivers purchase expensive branded medicines without knowing whether lower-cost generic alternatives with identical active ingredients, strength, and dosage form are available.

Finding suitable alternatives involves:
- Understanding medicine compositions.
- Comparing active pharmaceutical ingredients.
- Checking medicine prices.
- Calculating potential monthly savings.
- Managing regular medicine supplies.
- Organizing timely refill requests.

SaltSaver addresses the affordability problem, while MedPrior AI extends the platform with a refill prioritization workflow.

---

## 💡 2. Our Solution

### 🟢 SaltSaver — Primary Product

SaltSaver focuses on affordable medicine discovery and financial optimization.

**Key Features:**

- Search medicines by branded name or active ingredient.
- View complete active ingredient composition.
- Identify matching generic alternatives.
- Compare branded and generic medicine prices.
- Calculate unit price and potential savings.
- Estimate monthly medicine savings.
- Maintain a personal My Medicines list.
- Track remaining medicine supply.
- Find sample Jan Aushadhi Kendras.
- Provide a pharmacist-oriented medicine data editor.

### 🔵 MedPrior AI — Supporting Feature

MedPrior AI integrates with SaltSaver through its medicine refill workflow.

When users request a refill from My Medicines, the system generates simulated delivery priority suggestions based on patient vulnerability and remaining medicine supply.

**Key Features:**

- Automatically populated refill requests.
- Client-side priority scoring simulation.
- Emergency, High and Normal priority categories.
- Priority explanation factors.
- Interactive pharmacist queue.
- Priority confirmation and override functionality.
- Audit trail for pharmacist overrides.
- Emergency escalation alert.

---

## ✨ 3. Core Features

| Feature | Description |
|---|---|
| Medicine Search | Search by brand name or active ingredient |
| Salt Identification | Display active ingredients and strengths |
| Generic Matching | Match medicines using strict criteria |
| Price Comparison | Compare reference and alternative prices |
| Savings Calculator | Calculate potential monthly savings |
| My Medicines | Save and manage regular medicines |
| Refill Requests | Initiate refill requests from saved medicines |
| Jan Aushadhi Finder | Browse sample Kendra information |
| Medicine Data Editor | Add or edit medicine records |
| Priority Prediction | Simulate refill priority classification |
| Pharmacist Queue | Review and manage refill requests |
| Audit Trail | Record pharmacist priority overrides |

---

## 🧪 4. Generic Medicine Matching Logic

SaltSaver uses deterministic matching rather than approximate medicine recommendations.

An alternative is considered a confirmed match only when all three conditions are satisfied:

1. **Active Ingredient Composition:** Every active ingredient must match exactly.
2. **Strength:** The strength of every active ingredient must match exactly.
3. **Dosage Form:** The dosage form must be identical.

For example:

| Reference Medicine | Alternative | Result |
|---|---|---|
| Atorvastatin 10 mg Tablet | Atorvastatin 10 mg Tablet | Matching |
| Atorvastatin 10 mg Tablet | Atorvastatin 20 mg Tablet | Not Matching |
| Atorvastatin 10 mg Tablet | Atorvastatin 10 mg Capsule | Not Matching |

If the matching information is incomplete or ambiguous, the application displays:

**"Matching alternative could not be verified."**

---

## 💰 5. Price Comparison & Savings

SaltSaver calculates potential savings using equivalent medicine quantities.

**Potential Savings**

Reference Medicine Price − Alternative Medicine Price

**Percentage Savings**

(Potential Savings / Reference Medicine Price) × 100

**Monthly Savings Estimate**

Daily Dosage × 30 × (Reference Unit Price − Alternative Unit Price)

The objective is to make medicine price comparisons easier and more transparent.

---

## 🤖 6. MedPrior AI — Priority Classification

MedPrior AI provides simulated delivery priority suggestions using a deterministic JavaScript decision engine.

The simulation evaluates nine request features:

1. Patient Age
2. Chronic Conditions
3. Medicine Category
4. Time-Critical Medicine Flag
5. Days of Supply Left
6. Request Type
7. Symptom Level
8. Limited Mobility
9. Distance

### Priority Categories

| Priority | Proposed Dispatch Window |
|---|---|
| 🔴 EMERGENCY | Within 1 hour |
| 🟠 HIGH | Within 4 hours |
| 🟢 NORMAL | Within 24 hours |

A severe symptom selection triggers an emergency alert:

**"If this is a medical emergency, call 112 now."**

Priority suggestions are non-binding. Pharmacy staff must review and confirm or override suggestions.

---

## 🔄 7. End-to-End Workflow

The application follows this workflow:

1. **Search:** The user searches for a branded medicine.
2. **Review:** SaltSaver displays medicine composition, strength and price.
3. **Match:** The system identifies matching generic alternatives.
4. **Compare:** The user reviews potential savings.
5. **Save:** The user adds the medicine to My Medicines.
6. **Request Refill:** The user initiates a refill when medicine supply is running low.
7. **Prioritization:** MedPrior AI generates a simulated priority suggestion.
8. **Pharmacist Review:** The dispatcher reviews the request in the pharmacist queue.
9. **Confirmation:** The pharmacist confirms or overrides the priority with a recorded reason.

---

## 🛠️ 8. Technology Stack

### Frontend

- React 18
- Vite
- HTML5
- CSS3
- Bootstrap 5.3
- JavaScript

### UI & Icons

- Lucide React Icons
- Bootstrap 5 Grid System
- Custom Flexbox Layout

### State Management & Storage

- React Context API
- Browser localStorage
- Client-side JSON data

### AI Simulation

- JavaScript Decision Engine
- Simulated XGBoost Priority Scoring
- Priority Probabilities
- Factor Contribution Visualization

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Figma (UI/UX planning)

---

## 🏗️ 9. System Architecture

SaltSaver × MedPrior AI follows a pure front-end architecture.

The entire application runs inside the browser without requiring backend servers or database infrastructure.

**Architecture Components:**

- React 18 handles the component-based user interface.
- Vite provides the development and build environment.
- Bootstrap and custom CSS handle responsive layouts.
- Lucide React provides interface iconography.
- React Context API manages application state.
- localStorage maintains saved medicines and demonstration requests.
- Client-side JavaScript handles medicine matching, savings calculations and priority simulation.

**Architecture:**

User Interface  
↓  
React Components  
↓  
React Context API  
↓  
Client-Side Business Logic  
↓  
JSON Medicine Data + localStorage  
↓  
Interactive UI Results

**Architecture Type: 100% Client-Side | Zero Backend**

---

## 📱 10. Application Screens

The PRD defines the following major screens and workflows:

| Screen | Functionality |
|---|---|
| SaltSaver Home | Medicine search and suggestions |
| Medicine Comparison | Reference medicine and generic alternatives |
| Show to Pharmacist | Full-screen medicine information |
| My Medicines | Saved medicines and savings tracking |
| Jan Aushadhi Finder | Sample store directory |
| Refill Form | Pre-filled medicine refill request |
| Priority Result | Priority badge and explanation factors |
| Pharmacist Queue | Delivery request management |
| Request Details | Individual request information |
| Medicine Data Editor | Medicine record management |

---

## 🔐 11. Safety & Trust

Healthcare information requires accuracy and responsible handling.

Our application follows these safety principles:

- Strict medicine matching criteria.
- No automatic prescription substitutions.
- No independent medical diagnosis.
- Pharmacist confirmation for priority changes.
- Mandatory override reason logging.
- Emergency escalation alert for severe symptoms.
- Clear identification of illustrative medicine and store data.

**Mandatory Safety Disclaimer:**

"Same salt and strength. Ask your doctor or pharmacist before switching."

---

## 🚀 12. Getting Started

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- Modern web browser

### Installation

**Step 1: Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**Step 2: Open the project directory**

```bash
cd YOUR_PROJECT_FOLDER
```

**Step 3: Install dependencies**

```bash
npm install
```

**Step 4: Start the development server**

```bash
npm run dev
```

**Step 5: Open the local development URL**

Vite will display the local URL in your terminal.

Open that URL in your browser to access the application.

*These commands assume a standard Vite project with the corresponding npm scripts configured.*

---

## 🎯 13. Project Goals

Our primary objectives are:

1. Improve awareness of affordable generic medicines.
2. Simplify medicine composition and price comparisons.
3. Provide transparent potential savings calculations.
4. Simplify regular medicine management.
5. Integrate refill prioritization into medicine management.
6. Provide an interactive pharmacist review workflow.
7. Demonstrate how modern frontend technologies can support healthcare applications.

---

## ⚠️ 14. Limitations & Disclaimer

SaltSaver × MedPrior AI is a front-end UI/UX demonstration prototype.

- Medicine and store information may contain illustrative sample data.
- No live medicine inventory or GPS integration is provided.
- No backend server or database is implemented.
- MedPrior AI uses simulated JavaScript decision logic rather than a live deployed XGBoost model.
- Priority suggestions are not clinically validated medical assessments.
- The application does not replace healthcare professionals.

All priority decisions require appropriate human review.

---

## 👨‍💻 15. Team

**Project:** SaltSaver × MedPrior AI

**Institution:** Polaris School of Technology

**Program:** B.Tech CSE with Applied AI

**Batch:** A1 (2026–2030)

### Developers

**Vijo J** — Team Member 1

**Felton John SM** — Team Member 2

---

## 🌟 16. Our Vision

We believe healthcare innovation should make essential medicines more affordable and healthcare services more accessible.

SaltSaver focuses on helping people discover affordable medicine alternatives and understand their potential savings.

MedPrior AI extends this experience through an interactive, human-reviewed medicine refill prioritization workflow.

Together, they demonstrate how technology can contribute towards a more affordable, accessible and organized healthcare ecosystem.

---

### Made with 💚 for Affordable Healthcare

**SaltSaver × MedPrior AI**
