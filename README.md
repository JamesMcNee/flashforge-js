Flashforge JS
=============

A small TypeScript/Node.js library for communicating with Flashforge 3D printers.

Currently focused on the Flashforge Adventurer 5M (and 5M Pro) over the built‑in TCP interface. Contributions to support more models and features are very welcome.

• NPM package name: flashforge-js
• License: ISC
• Status: Early alpha

Features
- Connect to a printer by IP/hostname
- Query printer info (name, model, firmware, serial, MAC, position)
- Query print progress (bytes and layers, with percentages)
- Fully typed API with Zod-backed parsing

Installation
- npm install flashforge-js
- or: pnpm add flashforge-js
- or: yarn add flashforge-js

Requirements
- Node.js 18+ recommended (uses modern Node APIs)

Quick start
import { PrinterFactory } from "flashforge-js"

async function main() {
  // Replace with your printer's IP or a resolvable hostname
  const printer = await PrinterFactory.create("Adventurer 5M", { ip: "192.168.1.42" })

  const info = await printer.getInfo()
  console.log("Printer info:", info)

  const progress = await printer.getProgress()
  console.log("Print progress:", progress)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

API overview
Top-level export
- PrinterFactory

Creating a printer
const printer = await PrinterFactory.create("Adventurer 5M", { ip: "192.168.1.42" })
// or
const printer = await PrinterFactory.create("Adventurer 5M", { host: "my-printer.local" })

FlashforgePrinter interface
Properties
- id: string — identifier for the connection target (IP/host)

Methods
- getInfo(): Promise<PrinterInfo>
  Returns basic printer metadata and current head position.

- getProgress(): Promise<PrinterProgress>
  Returns current print progress by bytes and by layer, with precomputed percentages.

Types
PrinterInfo
- name: string
- model: string
- firmwareVersion: string
- serialNumber: string
- macAddress: string
- position: { x: number; y: number; z: number }

PrinterProgress
- bytes: { completedBytes: number; totalBytes: number; percentage: number }
- layer: { currentLayer: number; totalLayers: number; percentage: number }

Supported printers
- Adventurer 5M / 5M Pro (via TCP, port 8899)

Notes and limitations
- This is an early release and the API may change.
- Only read/query operations are provided at the moment.
- Network communication uses a plain TCP socket and the printer’s text protocol. Ensure your printer is on the same network and allows access.
- Timeouts and parsing errors will be surfaced as thrown errors. Wrap calls in try/catch if needed.

Error handling example
try {
  const progress = await printer.getProgress()
  console.log(progress)
} catch (e) {
  console.error("Failed to get progress:", e)
}

TypeScript
This library is written in TypeScript and ships its type declarations. Zod schemas validate responses from the printer and help keep the runtime data in sync with the types.

Development
Prereqs
- Node 18+
- pnpm or npm

Scripts
- npm run build — compile TypeScript to dist/ (also copies package.json and README.md)
- npm run lint — format with Prettier and lint with ESLint

Project layout
- src/index.ts — library entry point (exports PrinterFactory)
- src/factory.ts — model factory
- src/printer/ — core types and model-specific implementations
  - impls/ad5m/printer.ts — Adventurer 5M implementation

Roadmap
- Add more read operations (temperatures, status, etc.)
- Add control commands where safe and well-understood
- Support additional Flashforge models
- Improve connection and retry logic

Contributing
Contributions are welcome! If you want to help:
1. Open an issue to discuss your idea, printer model, or bug.
2. Fork the repo and create a feature branch.
3. Run linting and build locally.
4. Include tests or example snippets when possible.
5. Open a PR with a clear description and rationale.

Please keep changes focused and well-documented. If you have access to other Flashforge models, contributions to add and verify support are especially appreciated.

License
ISC © James McNee

Acknowledgements
- This project is community-driven and not affiliated with Flashforge. Protocol behavior and parsing are based on observed device responses.
