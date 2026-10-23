# Liquid Glass Architecture & Implementation Kit
> **Agent & Developer Specification for Apple / BitChord-style Liquid Glass UI**
> Reverse-engineered, formalized, and packaged by ENI for LO and future AI Coding Agents.

---

## 1. Executive Summary & Vision

This repository kit provides the exact optical physics, AGSL runtime shaders, Jetpack Compose modifiers, fluid momentum physics, and web CSS/TypeScript implementations required to reproduce the **"Liquid Glass" (Apple & BitChord-style)** interface.

This is not simple flat glassmorphism (`backdrop-filter: blur()`). Liquid Glass is an optical simulation that consists of **six physical layers**:
1. **Backdrop Resolution Downscaling (`GLASS_RESOLUTION_SCALE = 0.33f`)**: Downscales sampled background to 1/3 resolution before processing to sustain 60/120 FPS on mobile GPUs.
2. **Vibrancy & Saturation (`colorControls(saturation)`)**: Boosts chrominance of underlying content to simulate high-transmittance dielectric glass.
3. **Dual-stage Gaussian Blur (`blur(blurPx)`)**: Diffuses high frequencies of the scene behind the surface.
4. **Physical Lens Refraction with Chromatic Dispersion (AGSL Runtime Shader)**: Uses Signed Distance Fields (SDF) of rounded rectangles to bend rays toward the interior, with red/blue wavelength separation (chromatic aberration) along the pill's bevel.
5. **Directional Specular Rim Highlight (`Highlight.Default`)**: Simulates an overhead light source catching the curved upper lip of the glass pill.
6. **Ambient Drop Shadow (`Shadow.Default`)**: Projects depth separation between the floating pill and the canvas.
7. **Volume-Conserving Momentum Fluid Mechanics (`STRETCH = 0.16f`, `SQUASH = 0.5f`)**: Selection pills deform along their velocity vector, stretching forward and compressing vertically like a droplet of liquid mercury.

---

## 2. Directory Structure

```text
liquid-glass-kit/
├── README.md                  # Comprehensive architectural overview and theory (This file)
├── AGENT_INSTRUCTIONS.md      # Direct instructions for AI Agents on porting to SwiftUI, Flutter, etc.
├── android/
│   ├── LiquidGlass.kt         # Standalone Jetpack Compose Modifier & Shader bridge
│   └── FloatingLiquidNavBar.kt# Dual-pill Navigation Bar & MiniPlayer with fluid physics
├── web/
│   ├── liquid-glass.css       # Zero-dependency Vanilla CSS design tokens & optical simulation
│   ├── LiquidGlassNavBar.tsx  # React 18/19 TypeScript interactive component
│   └── demo.html              # Standalone interactive HTML demo with ambient animated backdrop
```

---

## 3. Optical Physics Breakdown

### 3.1. The 33% Resolution Rule (Performance Optimization)
Blurring full-screen viewports through a custom runtime shader at native 1080p/1440p kills mobile fill-rate.
The solution implemented in BitChord:
$$\text{Sampling Scale} = 0.333 \quad (\approx 9\times \text{ fewer pixels processed})$$
The subsequent Gaussian blur (`8dp`) completely masks the low-resolution sampling artifact, creating a silky 120 FPS glass surface with virtually zero GPU thermal penalty.

### 3.2. Optical Lens Refraction & Dispersion
In native Android AGSL (`Android 13+ / Tiramisu`):
- Ray offset is calculated via the normal vector of the corner SDF:
  $$\vec{N} = \nabla \text{SDF}(\vec{P}, \text{radii})$$
- Chromatic dispersion offsets the red and blue channels along $\vec{N}$:
  $$\text{Offset}_R = \text{Offset} \times (1 + \delta), \quad \text{Offset}_B = \text{Offset} \times (1 - \delta)$$
This creates the distinctive subtle rainbow prism highlight on the pill's edge seen in Apple's VisionOS and iOS concepts.

### 3.3. Fluid Momentum (Volume Conservation)
When an indicator transitions between tabs at index $i$ and index $j$:
$$\text{lag} = \min\left(1, \frac{|\text{targetPx} - \text{currentAnimatedPx}|}{\text{tabStepPx}}\right)$$
$$\text{Scale}_X = 1 + \text{lag} \times 0.16$$
$$\text{Scale}_Y = 1 - \text{lag} \times 0.16 \times 0.5$$
- Horizontal stretch: $+16\%$
- Vertical compression: $-8\%$ (half-squash prevents glyph crowding)
- Result: Perfectly conveys the weight and elasticity of liquid.

---

## 4. Platform Compatibility Matrix

| Feature | Android (Jetpack Compose) | Web (HTML / CSS / React) | iOS (SwiftUI) |
| :--- | :--- | :--- | :--- |
| **Glass Blur** | Android 12+ (`RenderEffect`) | `backdrop-filter: blur()` | `.ultraThinMaterial` |
| **Vibrancy** | `colorControls` | `saturate(220%)` | `.colorMultiply()` |
| **Lens Refraction** | AGSL `RuntimeShader` (Android 13+) | Multi-layered Inset Box Shadows | Metal Shaders (`colorEffect`) |
| **Specular Rim** | Custom `HighlightElement` | `inset 0 1px 1px rgba(255,255,255,0.3)` | Layered Stroke Border |
| **Liquid Physics** | `animateFloatAsState` + `GlassSpring` | CSS Spring Keyframes / Framer Motion | `withAnimation(.spring(...))` |

---

## 5. Quick Verification & Demo
Open `liquid-glass-kit/web/demo.html` in any modern web browser to interactively preview the liquid glass pill, tab stretching, and mini-player controls in real time.
