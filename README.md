# AEGIS Fraud SOC — Agentic Fraud Investigation & Next-Best-Action Platform

An autonomous, production-grade **Agentic Fraud Investigation & Next-Best-Action Platform** powered by TigerGraph, GraphRAG, Specialist Agent Swarm, Deterministic Policy Engine, Persistent Case Memory, and an **Awwwards-Level Cinematic Intelligence Workstation** interface.

---

## 🌟 Key Architecture & Features

1. **TigerGraph & GSQL Integration**:
   - Multi-hop graph traversal, shared device network detection, connected account discovery, and relationship pattern algorithms.
   - Includes automatic local in-memory graph adapter (`DEMO_MODE=true`) pre-seeded with rich graph nodes and edges.
2. **TigerGraph MCP Tool Layer**:
   - Exposes graph tools (`inspect_customer`, `inspect_device`, `traverse_entity_graph`, `detect_shared_device_network`).
3. **Specialist Multi-Agent Swarm**:
   - Investigation Agent, Evidence Agent, Fraud Pattern Agent, Risk Assessment Agent, Policy Agent, Next-Best-Action Agent, Case Memory Agent.
   - Safety bounds (`MAX_AGENT_STEPS=10`, `MAX_TOOL_CALLS=15`).
4. **Deterministic Policy Engine (`POL-101`..`POL-105`)**:
   - Strict compliance rules categorizing actions into `AUTONOMOUS_PERMITTED`, `APPROVAL_REQUIRED`, or `PROHIBITED`.
5. **Evidence Engine & Uncertainty Rationale**:
   - Ranks evidence relevance, calculates aggregate risk level, confidence score, and identifies missing evidence.
6. **Benchmark Suite**:
   - Evaluates 20 benchmark scenarios and exports JSON/CSV artifacts to `/outputs/`.
7. **Cinematic Glassmorphism Frontend**:
   - Dark charcoal base (`#07090C`), Sora + Geist + Geist Mono typography, interactive `vis-network` graph canvas, 3-Zone Workspace, floating `Cmd+K` Command Palette, and scroll-driven entry narrative.

---

## 🚀 Quick Start (Local Demo Mode)

### 1. Python Environment & Server
```bash
# Install backend dependencies
.venv\Scripts\pip install fastapi uvicorn pydantic pytest

# Run the FastAPI server
.venv\Scripts\python main.py
```
The server will start at `http://localhost:8000/`.

### 2. Analyst Frontend Build
```bash
cd frontend
npm install
npm run build
```

---

## 🧪 Automated Testing
```bash
.venv\Scripts\pytest backend/tests/
```
