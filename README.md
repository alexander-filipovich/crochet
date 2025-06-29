# 🧶 MyCrochet - Visual Pattern Editor for Mosaic Crochet

A lightweight, user-friendly web editor for creating mosaic crochet patterns - optimized for beginners, fast enough for power users.

🔗 [Live demo](https://alexander-filipovich.github.io/crochet/)  
📘 [Feature walkthrough](https://www.notion.so/mycrochetlive/Say-Hello-to-MyCrochet-live-a8524264119846eca9782ad5489376f0)

## 🚩 Problem

Most beginners rely on Excel or pen-and-paper for mosaic pattern planning. Existing tools like StitchFiddle offer professional-grade features, but at the cost of a steep learning curve and complex UX.

## 🎯 Goal

Make a modern, intuitive crochet pattern editor that:

- Feels native even for Excel users
- Automates common tedious steps (e.g., cross placement)
- Designed as a pure frontend app - no backend logic, just lightweight static hosting
- Outputs clean, printable, and shareable patterns (PDF)

## ✨ Key Features

- 📥 **Excel Import** – Upload your draft as a spreadsheet  
- ⛓️ **Auto-Cross Placement** – One-click grid rendering  
- 📋 **Copy / Paste & Undo / Redo** – Familiar editing flow  
- 🖨️ **PDF Export with Preview** – Share-ready layouts  
- 🌀 **Smooth UX** – handles large 1000×1000 grids smoothly, no lag or loading delays
- 💾 **All in-browser** – No login, no data stored, just launch and create

## 📊 Market Test

- 🔗 Launched on r/knitting (2024)  
- 📈 17,000 views, 250+ upvotes, ~500 direct clicks  
- 💬 Positive feedback didn't translate into activation: beginner users preferred pre-made patterns; sellers leaned toward more complex tools  
- 🧮 LTV estimate too low to justify further dev -> MVP paused after public release

## 🛠 Stack

- Angular + TypeScript
- [Pixi.js](https://pixijs.com/) for WebGL-based rendering

## 💡 Lessons Learned

- A smooth UX isn't enough - users don't create patterns often enough to seek better tools
- Solving a pain doesn't mean solving a frequent pain
- Positive feedback != high-intent - even delighted users may not convert
- A working MVP is often more useful for killing an idea than growing it

## 🚧 Status

Paused. Code remains public, feel free to fork or extend.

