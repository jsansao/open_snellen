# OpenSnellen 👁️✨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-13_Passed-green)](https://vitest.dev/)

**OpenSnellen** is an open-source, clinical-grade digital visual acuity and ophthalmic examination suite built with React 18, TypeScript, Vite, and Tailwind CSS.

It provides calibrated visual acuity charts, specialized ophthalmic examination modules (Astigmatism, Contrast Sensitivity, Ishihara Color Vision, Amsler Grid, Worth 4-Dot, ETDRS), physical screen size calibration, wireless presenter hotkeys, and serverless smartphone remote control via WebRTC data channels.

---

## 🌟 Key Features

### 1. Visual Acuity & Optotype Engine
- **Sloan Letters**: Standard clinical 10-letter set (`C, D, E, F, L, N, O, P, Z, V`).
- **Snellen Letters**: Classic Snellen font set (`E, F, P, T, O, Z, L, D, C, P`).
- **Tumbling E**: Vector 5x5 grid optotypes with 4 directional angles ($0^\circ, 90^\circ, 180^\circ, 270^\circ$).
- **Landolt C**: Precision ring optotype with directional gaps.
- **LEA Pediatric Symbols**: Standard Dr. Lea Hyvärinen outline shapes (Apple, House, Square, Circle) with 1/5th stroke thickness ratio.
- **HOTV Chart**: Pediatric HOTV chart set.
- **Display Modes**: Full Chart Cascade, Single Line Isolation, Single Optotype Isolation.
- **Filters & Overlay**: Red-Green Duochrome split background, Crowding/Isolation bars, White/Black contrast inversion.

### 2. Clinical Examination Suite
- **Astigmatism Suite**: Astigmatic Clock Dial (Sunburst Fan with 12 radiating line pairs at $30^\circ$ intervals) and Jackson Cross Cylinder 48-Dot Matrix.
- **Pelli-Robson Contrast Sensitivity**: 16 contrast steps ranging from $100\%$ down to $0.5\%$ ($0.00$ to $2.25$ LogCS) with 3-letter triplets.
- **Authentic Ishihara Color Vision**: Canvas-assisted pixel mask stippling that maps pseudoisochromatic dots onto typographical font strokes. Hides answer keys on the patient display by default while showing full examiner keys on the smartphone remote.
- **Amsler Macular Grid**: $20 \times 20$ grid with central fixation dot for scotoma/metamorphopsia screening (supports White and Red grid line modes).
- **Worth 4-Dot Binocular Test**: Diamond 4-dot light arrangement (1 Red top, 2 Green left/right, 1 White bottom) for binocular suppression evaluation.
- **ETDRS Clinical Trial Chart**: Standardized 5-letter per line LogMAR chart with $0.1$ LogMAR geometric progression steps.

### 3. Physical Screen Calibration
- Interactive ID-1 standard card tool (Credit Card / Driver's License width: **85.6 mm**).
- Computes exact Pixels-Per-Millimeter (PPM) and screen DPI so optotypes subtend the exact 5-arcminute visual angle regardless of display size or resolution.

### 4. Zero-Setup Smartphone Remote Control
- P2P WebRTC data connection via PeerJS.
- Generates a QR code on the host screen. Scanning with any smartphone browser pairs the phone instantly as a wireless controller.
- Smartphone remote provides mode switching, line navigation, Ishihara examiner keys, contrast stepping, and pass/fail patient score recording.

---

## 📐 Mathematical & Optical Principles

### 5-Arcminute Visual Angle Formula
Standard 20/20 (LogMAR 0.0) optotypes subtend a total visual angle of 5 arcminutes ($0.08333^\circ = 0.00145444 \text{ rad}$) at a target viewing distance $D$.

$$\text{Height (mm)} = 2 \times D \times \tan\left(\frac{5 \text{ arcmin}}{2}\right) \times 10^{\text{LogMAR}}$$

- **At 6 meters**: 20/20 optotype height is $\approx 8.7266 \text{ mm}$.
- **At 20 feet**: 20/20 optotype height is $\approx 8.866 \text{ mm}$.
- **LogMAR Scaling**: $10^{\text{LogMAR}}$ (e.g., 20/200 LogMAR 1.0 is $10\times$ size; 20/10 LogMAR -0.3 is $0.5\times$ size).

### Pixels-Per-Millimeter (PPM) Calculation
Given on-screen calibration card width $W_{\text{px}}$ matching a physical card ($85.6 \text{ mm}$):

$$\text{PPM} = \frac{W_{\text{px}}}{85.6}$$

$$\text{Height (px)} = \text{Height (mm)} \times \text{PPM}$$

---

## 📁 Repository Structure

```
open_snellen/
├── public/
│   └── eye-icon.svg             # Application favicon
├── src/
│   ├── components/
│   │   ├── AmslerGridDisplay.tsx    # Amsler macular grid component
│   │   ├── AstigmatismDisplay.tsx   # Clock dial & dot matrix astigmatism component
│   │   ├── CalibrationModal.tsx     # Physical credit card screen calibration modal
│   │   ├── ContrastDisplay.tsx      # Pelli-Robson contrast sensitivity chart
│   │   ├── ETDRSChartDisplay.tsx    # ETDRS LogMAR clinical trial chart
│   │   ├── Header.tsx               # Navigation toolbar & exam mode selector
│   │   ├── IshiharaDisplay.tsx      # Canvas stippled color vision plates
│   │   ├── OptotypeDisplay.tsx      # Chart display router & layout renderer
│   │   ├── OptotypeItem.tsx         # Vector SVG optotype renderer (Sloan, Snellen, LEA, E, C)
│   │   ├── RemoteControllerView.tsx # Mobile phone remote control view
│   │   ├── RemoteModal.tsx          # QR code pairing modal
│   │   └── Worth4DotDisplay.tsx     # Worth 4-Dot binocular test
│   ├── hooks/
│   │   └── useHotkeys.ts            # Keyboard & wireless presenter shortcuts listener
│   ├── services/
│   │   └── peerService.ts           # PeerJS WebRTC P2P connection manager
│   ├── types/
│   │   └── snellen.ts               # TypeScript interfaces & types
│   ├── utils/
│   │   ├── calibration.ts           # Optical math formulas & PPM calculations
│   │   ├── optotypes.ts             # Optotype generators & line scaling
│   │   ├── testsData.ts             # Contrast steps, Ishihara plates & ETDRS lines
│   │   └── __tests__/               # Vitest automated unit tests
│   ├── App.tsx                      # Main application orchestrator & local storage state
│   ├── index.css                    # Tailwind CSS imports & global styles
│   └── main.tsx                     # React DOM root entry point
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## ⌨️ Keyboard & Presenter Shortcuts

| Key | Action |
| --- | --- |
| `↑` / `PageUp` | Increase line size / Prev contrast step |
| `↓` / `PageDown` | Decrease line size / Next contrast step |
| `←` / `→` / `Space` | Select previous / next optotype |
| `R` | Randomize chart optotypes |
| `D` | Toggle Red-Green Duochrome filter |
| `M` | Toggle Crowding / Isolation bars |
| `C` | Open Screen Calibration modal |
| `F` | Toggle Fullscreen mode |
| `1`, `2`, `3` | Switch display mode (Full, Line, Single) |

---

## 🛠️ Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/jsansao/open_snellen.git
cd open_snellen

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Automated Unit Tests

```bash
npm test
# or
npx vitest run
```

### Production Build

```bash
npm run build
```
The compiled production bundle will be generated in the `dist/` directory.

---

## 📄 License
MIT License. Built for open-source clinical ophthalmic research and visual acuity testing.
