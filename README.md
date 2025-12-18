# Workflow Playground

This repo is a miniature, TypeScript-first take on n8n-style workflows. Nodes are self-contained classes, connectors describe the wiring, and `executeWorkflow` orchestrates the run by walking the connector graph.

## Getting Started

```bash
git clone <repo-url>
cd iv
npm install
```

### Run the sample workflow

```
npm run start
```

This boots `src/run.ts`, which uses `WorkflowBuilder` to wire up the Receive Email → If/Else → Sort example and logs the execution trace.

### Execute the test suite

```
npm test
```

Jest runs every colocated `*.spec.ts`, keeps coverage at 100%, and uses the mocks under `src/mocks/` for fast doubles.

## Architecture Overview

| Layer | Purpose |
| ----- | ------- |
| `src/core/classes/BaseNode` | Abstract node definition (`executeNode` contract, typed inputs/outputs). |
| `src/core/classes/BaseConnector` | Normalizes connector inputs and provides `toJSON`. |
| `src/core/classes/BaseWorkflow` | Holds nodes/connectors/start-node behind immutable getters. |
| `src/core/Workflow.ts` | Concrete `Workflow` plus a fluent `WorkflowBuilder` so nodes/connectors can be swapped or reordered before building. |
| `src/core/executeWorkflow.ts` | Engine that pops nodes off a stack, executes them, and pushes downstream work based on connector outputs. |
| `src/nodes/*` | Domain nodes (ReceiveEmail, IfElse, Sort) extending `BaseNode`. |
| `src/mocks/*` | `CallbackNode` and `PassthroughNode` test doubles shared across Jest suites. |

## How nodes behave and stay “smart”

Each node inherits from `BaseNode<TInput, TOutput>` and implements a single `executeNode` method:

- **ReceiveEmailNode** validates or synthesizes the `email` payload before forwarding it.
- **IfElseNode** evaluates a declarative condition (path, operator, target) and routes data to `output0` or `output1`.
- **SortNode** inspects the input (`items`, optional `key`, and `order`) and performs JSON-aware sorting.

This keeps domain logic inside the node, so workflows simply compose behaviors. Because inputs/outputs are JSON objects and every node declares its types, nodes remain reusable and easy to swap.

## Why this is modular/SOLID

- **Single Responsibility:** Nodes only worry about their own transformation; `executeWorkflow` only schedules execution.
- **Open/Closed & Strategy:** Adding a new node means extending `BaseNode`—no central switch statements.
- **Liskov:** Nodes implement the same contract, so workflows can swap implementations freely: https://en.wikipedia.org/wiki/Liskov_substitution_principle
- **Interface Segregation:** Helper types (`INode`, `Connector`) are tiny, purpose-built interfaces.
- **Dependency Inversion:** The engine depends on the `BaseWorkflow` abstraction. Workflows are constructed via `WorkflowBuilder`, so orchestration never needs to know concrete classes.

The builder exposes `addNode`, `replaceNode`, `addConnector`, `setStartNode`, and `build`, which makes it trivial to rewire or replace nodes before running or testing. Combined with the mocks (which cover callback-based and pass-through behaviors), the ecosystem stays extensible while keeping the code surface approachable.

PS not sure why git decided to go with the old master naming convention but i didn't feel like wrestling with it
