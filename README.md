# 🔬 Reproducible Research Snapshots

**One-click frozen workflow capsules for peer review — built for K-Dense Web scientists.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built for K-Dense Web](https://img.shields.io/badge/Built%20for-K--Dense%20Web-00c8e8)](https://kdenseweb.io)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org)

---

## The Problem

When a K-Dense Web workflow produces a 44-page report or a publishable figure, researchers can't easily hand it to a peer reviewer or co-author and say: **"re-run exactly this."** The agent used particular database versions, particular model calls, particular intermediate outputs — and none of that is packaged for replication.

K-Dense's own whitepaper acknowledges that in clinical or regulatory contexts, **stronger auditability and standardization are essential** — with clear provenance trails, reproducible actions, and human override mechanisms. This project makes that real.

---

## What It Does

**Reproducible Research Snapshots (RRS)** automatically generates a frozen, shareable research capsule at the end of any K-Dense Web workflow run:

| Feature | Description |
|---|---|
| 🔒 **Locked Workflow DAG** | Every skill invoked, with parameters and database query timestamps (e.g. "queried ChEMBL v34 on April 8, 2026 at 14:32 UTC") |
| 📊 **Reproducibility Score** | 0–100 rating. Static database = fully reproducible; live clinical feed = partial |
| 🔗 **Reviewer Link** | Read-only shareable URL — collaborators see every step and intermediate output, no K-Dense account needed |
| 📝 **Methods Section Draft** | Auto-generated, journal-ready methods text describing every database, version, and parameter — paste directly into a paper |
| 📈 **Team Dashboard** | Lab-wide analytics: score trends, research domains, workflow usage |

---

## Screenshots

The dashboard shows:
- Live **Reproducibility Score rings** (color-coded HIGH / PARTIAL / LOW)
- **Score trend charts** and **domain distribution** across the lab
- **Expandable workflow DAGs** with step-by-step provenance
- One-click **Reviewer Links** and **Methods drafts**

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Rabba-Meghana/Reproducible-Research-Snapshots.git
cd Reproducible-Research-Snapshots
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for production

```bash
npm run build
```

---

## Architecture

```
src/
├── components/
│   ├── SnapshotCard.jsx     # Main card: score ring, DAG, actions
│   ├── ScoreRing.jsx        # SVG reproducibility score ring
│   ├── WorkflowDAG.jsx      # Horizontal skill DAG visualization
│   ├── StatsBar.jsx         # Analytics dashboard (charts, stat boxes)
│   ├── MethodsModal.jsx     # Journal-ready methods text + copy
│   └── NewSnapshotModal.jsx # Capture new workflow snapshot
├── data/
│   └── mockData.js          # Example snapshots (replace with K-Dense API)
├── App.jsx                  # Root layout + routing
├── App.css                  # Layout styles
└── index.css                # Design tokens + global styles
```

---

## Reproducibility Score Methodology

The score (0–100) penalizes dependencies on live/dynamic data sources:

| Source Type | Penalty |
|---|---|
| Static versioned database (ChEMBL v34, AlphaFold DB v4) | 0 pts |
| Versioned model with deterministic output | 0 pts |
| Live API with snapshot caching | −8 pts |
| Live clinical/surveillance API (no cache) | −15 pts |
| User-uploaded data (unversioned) | −10 pts |

A score ≥85 is considered **fully reproducible** for peer review purposes.

---

## Integration with K-Dense Web

To wire this to a real K-Dense Web instance, replace `src/data/mockData.js` with API calls to K-Dense's workflow logging endpoint:

```js
// Example: fetch snapshots from K-Dense API
const response = await fetch('https://your-kdense-instance/api/v1/snapshots', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
const snapshots = await response.json();
```

K-Dense's agent framework generates a call graph for every run. RRS consumes that graph, computes the reproducibility score, and renders the capsule.

---

## Why This Matters for K-Dense

Academic labs are K-Dense's biggest wedge market (90% academic discount). But labs can't fully commit to a tool whose outputs they can't cite in a paper. **Reproducible snapshots turn every K-Dense run into something citable**, making the platform sticky in exactly the user base K-Dense targets.

Competitors like Kosmos already market full traceability — RRS closes that gap.

---

## Contributing

Pull requests welcome. Key areas for contribution:
- [ ] Live K-Dense API integration
- [ ] Execution replay layer (re-run a snapshot identically)
- [ ] DOI minting for snapshots (cite a specific run in a paper)
- [ ] Jupyter notebook export of methods + code
- [ ] Slack/email notifications when reviewer opens a link

---

## License

MIT © 2026 — Built with ❤️ for K-Dense Web
