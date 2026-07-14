# Interactive Data Mesh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing subtle Canvas 2D background into a dense, responsive crimson data-wave mesh that reacts smoothly to pointer movement and clicks.

**Architecture:** Keep `InteractiveBackground` as the single decorative canvas owner. Add explicit desktop/mobile rendering profiles, extract reusable ribbon-point sampling, layer transverse mesh connections and telemetry spikes into the current renderer, and replace the pointer's binary influence with an eased strength value so departure is smooth.

**Tech Stack:** Next.js 16, React 19, TypeScript, Canvas 2D, Vitest

## Global Constraints

- Concentrate the mesh across the lower 40–45% of the desktop viewport.
- Keep the canvas behind all foreground content and do not change foreground geometry.
- Desktop uses the full layered mesh, particles, spikes, and a 30 FPS target.
- Mobile uses fewer layers, connections, particles, and spikes with a lower frame-rate target.
- Do not add WebGL or a new animation dependency.
- Reduced-motion mode renders one static frame and starts no animation loop.
- Preserve decorative `aria-hidden` canvas semantics.

---

### Task 1: Build and verify the responsive interactive data mesh

**Files:**
- Modify: `src/components/landing-structure.test.ts:90-105,243-247`
- Modify: `src/components/interactive-background.tsx:5-321`

**Interfaces:**
- Consumes: browser Canvas 2D APIs, pointer events, resize events, `prefers-reduced-motion`, and the existing `<InteractiveBackground />` component contract.
- Produces: the unchanged `InteractiveBackground(): JSX.Element` interface with profile-driven mesh rendering and eased pointer interaction.

- [ ] **Step 1: Write failing renderer-contract tests**

Extend `src/components/landing-structure.test.ts` with these assertions:

```ts
it("uses distinct desktop and mobile data-mesh profiles", () => {
  const background = source("src/components/interactive-background.tsx");

  expect(background).toContain("const DESKTOP_MESH_PROFILE");
  expect(background).toContain("layers: 13");
  expect(background).toContain("samples: 96");
  expect(background).toContain("particleCap: 168");
  expect(background).toContain("frameRate: 30");
  expect(background).toContain("const MOBILE_MESH_PROFILE");
  expect(background).toContain("layers: 6");
  expect(background).toContain("samples: 56");
  expect(background).toContain("particleCap: 72");
  expect(background).toContain("frameRate: 22");
});

it("draws a connected telemetry mesh with eased pointer influence", () => {
  const background = source("src/components/interactive-background.tsx");

  expect(background).toContain("function sampleRibbonPoint(");
  expect(background).toContain("function drawCrossConnections(");
  expect(background).toContain("function drawTelemetrySpikes(");
  expect(background).toContain("targetStrength");
  expect(background).toMatch(/pointer\.strength \+= \(pointer\.targetStrength - pointer\.strength\) \* 0\.08/);
  expect(background).toContain("pointer.targetStrength = 0");
});
```

Replace the existing nine-layer assertion with:

```ts
it("draws a profile-driven layered lower data mesh", () => {
  const background = source("src/components/interactive-background.tsx");
  expect(background).toContain("verticalOffset = 0");
  expect(background).toContain("layer < meshProfile.layers");
  expect(background).toContain("drawCrossConnections(motionTime");
  expect(background).toContain("drawTelemetrySpikes(motionTime");
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because the profiles, connection renderer, telemetry spikes, and eased pointer strength do not exist yet.

- [ ] **Step 3: Add explicit mesh profiles and pointer state**

Add this profile contract near the existing types in `src/components/interactive-background.tsx`:

```ts
type MeshProfile = {
  layers: number;
  samples: number;
  particleCap: number;
  crossStep: number;
  spikeStep: number;
  frameRate: number;
  opacityScale: number;
};

const DESKTOP_MESH_PROFILE: MeshProfile = {
  layers: 13,
  samples: 96,
  particleCap: 168,
  crossStep: 6,
  spikeStep: 11,
  frameRate: 30,
  opacityScale: 1,
};

const MOBILE_MESH_PROFILE: MeshProfile = {
  layers: 6,
  samples: 56,
  particleCap: 72,
  crossStep: 10,
  spikeStep: 18,
  frameRate: 22,
  opacityScale: 0.64,
};
```

Change the pointer state and frame interval to:

```ts
const pointer = {
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
  strength: 0,
  targetStrength: 0,
};
let meshProfile = DESKTOP_MESH_PROFILE;
let frameInterval = 1000 / meshProfile.frameRate;
```

Inside `reset()`, select the profile and density without changing the DPR cap:

```ts
meshProfile = width < 700 ? MOBILE_MESH_PROFILE : DESKTOP_MESH_PROFILE;
frameInterval = 1000 / meshProfile.frameRate;
const count = reduceMotion
  ? Math.min(38, meshProfile.particleCap)
  : Math.min(meshProfile.particleCap, Math.max(48, Math.floor(width / 9)));
```

- [ ] **Step 4: Extract ribbon sampling and build the connected surface**

Add a `sampleRibbonPoint` helper and make `drawRibbon` consume it:

```ts
function sampleRibbonPoint(
  time: number,
  side: -1 | 1,
  offset: number,
  verticalOffset: number,
  progress: number,
) {
  const x = width / 2 + side * progress * width * 0.68;
  const pointerFalloff = Math.max(0, 1 - Math.abs(x - pointer.x) / 360);
  const pointerLift =
    (pointer.y - height * 0.64) * 0.045 * pointerFalloff * pointer.strength;
  const wave =
    Math.sin(progress * 9 + time * 0.0009 + offset) * 34 +
    Math.sin(progress * 17 - time * 0.0007 + offset) * 12;

  return {
    x,
    y: height * 0.64 + wave * (0.24 + progress * 0.72) + pointerLift + verticalOffset,
  };
}
```

Iterate `meshProfile.samples` inside `drawRibbon`. Add transverse connections across each side:

```ts
function drawCrossConnections(time: number, side: -1 | 1) {
  const context = activeContext;
  context.save();
  context.strokeStyle = `rgba(255, 38, 44, ${0.09 * meshProfile.opacityScale})`;
  context.lineWidth = 0.42;

  for (let sample = meshProfile.crossStep; sample < meshProfile.samples; sample += meshProfile.crossStep) {
    const progress = sample / meshProfile.samples;
    context.beginPath();
    for (let layer = 0; layer < meshProfile.layers; layer += 1) {
      const verticalOffset = (layer - (meshProfile.layers - 1) / 2) * 30;
      const point = sampleRibbonPoint(time + layer * 180, side, layer * 0.39, verticalOffset, progress);
      if (layer === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }
    context.stroke();
  }

  context.restore();
}
```

- [ ] **Step 5: Add deterministic telemetry spikes**

Add sparse spikes anchored to the mesh so the reference's lower technical skyline remains stable across renders:

```ts
function drawTelemetrySpikes(time: number) {
  const context = activeContext;
  context.save();
  context.lineWidth = 0.7;

  for (let index = meshProfile.spikeStep; index < meshProfile.samples; index += meshProfile.spikeStep) {
    const side: -1 | 1 = index % 2 === 0 ? -1 : 1;
    const progress = index / meshProfile.samples;
    const point = sampleRibbonPoint(time, side, index * 0.17, 0, progress);
    const heightScale = 18 + ((index * 13) % 58);
    context.strokeStyle = `rgba(255, 48, 52, ${0.12 * meshProfile.opacityScale})`;
    context.beginPath();
    context.moveTo(point.x, point.y + 8);
    context.lineTo(point.x, point.y - heightScale);
    context.stroke();
    context.fillStyle = `rgba(255, 68, 72, ${0.32 * meshProfile.opacityScale})`;
    context.fillRect(point.x - 1, point.y - heightScale - 2, 2, 2);
  }

  context.restore();
}
```

- [ ] **Step 6: Integrate profile density and eased interaction**

In `render()`, update the pointer before drawing mesh geometry:

```ts
pointer.x += (pointer.tx - pointer.x) * 0.12;
pointer.y += (pointer.ty - pointer.y) * 0.12;
pointer.strength += (pointer.targetStrength - pointer.strength) * 0.08;
```

Replace fixed layer counts with `meshProfile.layers`, use `30px` vertical spacing, call both connection passes and telemetry spikes after the ribbons, and remove the former duplicate pointer-position update:

```ts
for (let layer = 0; layer < meshProfile.layers; layer += 1) {
  const verticalOffset = (layer - (meshProfile.layers - 1) / 2) * 30;
  context.lineWidth = layer % 3 === 0 ? 0.82 : 0.44;
  context.strokeStyle = `rgba(255, ${28 + layer * 2}, ${34 + layer * 2}, ${(0.07 + layer * 0.007) * meshProfile.opacityScale})`;
  drawRibbon(motionTime + layer * 180, -1, layer * 0.39, verticalOffset);
  drawRibbon(motionTime + layer * 180, 1, Math.PI + layer * 0.39, verticalOffset);
}
drawCrossConnections(motionTime, -1);
drawCrossConnections(motionTime, 1);
drawTelemetrySpikes(motionTime);
```

Replace binary pointer checks throughout particle influence and connection drawing with `pointer.strength`. Set interaction targets as follows:

```ts
function handlePointerMove(event: PointerEvent) {
  pointer.tx = event.clientX;
  pointer.ty = event.clientY;
  pointer.targetStrength = 1;
  document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
}

function handlePointerLeave() {
  pointer.targetStrength = 0;
}
```

Retain the existing click-pulse lifetime and four-pulse cap.

- [ ] **Step 7: Verify GREEN and tune against the reference**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: PASS with all landing structure tests passing.

Start the dev server and inspect `1536 × 1024`, `1280 × 720`, and `390 × 844`. Capture screenshots before and after pointer movement. Tune only mesh opacity, vertical base, and line spacing until:

- the lower field is clearly denser and brighter than the current version;
- foreground text and form borders remain visually dominant;
- desktop resembles the reference's flowing lower data landscape;
- mobile remains visibly lighter and smooth;
- zero error-level console logs occur.

- [ ] **Step 8: Run final verification**

Run: `npm test`

Expected: all test files and tests pass.

Run: `npm run lint`

Expected: exit 0 with no lint errors.

Run: `npm run build`

Expected: successful Next.js production build. Restore any build-generated `next-env.d.ts` change before committing.

Run: `git diff --check`

Expected: exit 0 with no whitespace errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/landing-structure.test.ts src/components/interactive-background.tsx
git commit -m "feat: intensify interactive data mesh"
```
