---
name: gsap-animations
description: Create GSAP animations with ScrollTrigger, SplitText, and Lenis smooth scrolling in Next.js. Use when building scroll animations, text reveals, parallax effects, or any GSAP-based motion.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# GSAP Animations Skill

This skill provides patterns for creating performant GSAP animations in this Next.js 16 project.

## Project Stack

- **GSAP 3.14** with ScrollTrigger, SplitText plugins
- **@gsap/react** for React integration (useGSAP hook)
- **Lenis** for smooth scrolling (wrapped at layout level)
- **Next.js 16** App Router with React 19
- **Tailwind CSS v4**

## Required Component Setup

Every GSAP component MUST follow this structure:

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

// Register plugins ONCE at module level
gsap.registerPlugin(ScrollTrigger, SplitText);

const MyComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Guard clause for refs
    if (!containerRef.current) return;

    // Your animations here...

    // CRITICAL: Cleanup SplitText instances
    return () => {
      // splitInstance.revert();
    };
  }, []);

  return <div ref={containerRef}>...</div>;
};
```

## Core Patterns

### 1. ScrollTrigger with Pin & Scrub

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      pin: true,
      scrub: 1,        // Smooth scrubbing (1 = 1 second lag)
      // markers: true, // Enable for debugging
    },
  });

  tl.to(".element", { y: -100, opacity: 0 });
}, []);
```

### 2. SplitText Character Animation

```tsx
useGSAP(() => {
  const split = SplitText.create(textRef.current, {
    type: "chars",
  });

  gsap.from(split.chars, {
    yPercent: 100,
    opacity: 0,
    stagger: 0.035,
    ease: "power1.inOut",
  });

  // MUST revert on cleanup
  return () => split.revert();
}, []);
```

### 3. SplitText Word Animation with Overflow

```tsx
useGSAP(() => {
  const split = SplitText.create(paragraphRef.current, {
    type: "words",
    wordsClass: "overflow-hidden", // Tailwind class for reveal effect
  });

  gsap.from(split.words, {
    yPercent: 100,
    opacity: 0,
    stagger: 0.02,
    ease: "power1.inOut",
  });

  return () => split.revert();
}, []);
```

### 4. Reactive Animations (State-Dependent)

```tsx
const [isActive, setIsActive] = useState(false);

useGSAP(() => {
  gsap.to(".target", {
    opacity: isActive ? 1 : 0,
    y: isActive ? 0 : 20,
  });
}, { dependencies: [isActive] });
```

### 5. Scoped Animations

```tsx
useGSAP(() => {
  // ".heading" only selects within containerRef
  gsap.to(".heading", { opacity: 0 });
}, { scope: containerRef });
```

## Common Animation Recipes

### Fade In On Scroll

```tsx
gsap.from(elementRef.current, {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: elementRef.current,
    start: "top 80%",
  },
});
```

### Parallax Image

```tsx
gsap.to(imageRef.current, {
  yPercent: -20,
  ease: "none",
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});
```

### Staggered List Reveal

```tsx
gsap.from(".list-item", {
  opacity: 0,
  x: -30,
  stagger: 0.1,
  scrollTrigger: {
    trigger: listRef.current,
    start: "top 70%",
  },
});
```

### Scale + Blur Transition

```tsx
tl.to(".element", {
  scale: 0.9,
  filter: "blur(10px)",
  opacity: 0,
});
```

### Horizontal Scroll Section

```tsx
useGSAP(() => {
  const sections = gsap.utils.toArray<HTMLElement>(".panel");

  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: containerRef.current,
      pin: true,
      scrub: 1,
      end: () => "+=" + containerRef.current!.offsetWidth,
    },
  });
}, []);
```

## Timeline Position Parameters

| Parameter | Meaning |
|-----------|---------|
| `"<"` | Start at same time as previous |
| `">"` | Start at end of previous |
| `"+=0.5"` | Start 0.5s after previous ends |
| `"-=0.2"` | Start 0.2s before previous ends |
| `0` | Absolute position at 0 seconds |

## Performance Tips

1. **Use `will-change`** sparingly for heavy animations
2. **Prefer transforms** (x, y, scale, rotate) over layout properties (top, left, width)
3. **Use `gsap.set()`** for initial states instead of CSS
4. **Avoid animating `filter`** on large elements (GPU intensive)
5. **Use `scrub: 1`** instead of `scrub: true` for smoother scroll animations

## Debugging

```tsx
scrollTrigger: {
  markers: true,  // Shows start/end markers
}
```

## File Structure

```
src/components/
  smooth.tsx                 # Lenis wrapper (layout level)
  animated-input.tsx         # State-reactive animations
  sections/
    hero-section.tsx         # ScrollTrigger + SplitText
    project-section.tsx      # Pinned scroll sections
```

## Common Mistakes to Avoid

1. **Missing "use client"** - GSAP requires client-side execution
2. **Forgetting plugin registration** - Call `gsap.registerPlugin()` at module level
3. **No SplitText cleanup** - Always call `.revert()` in useGSAP return
4. **Animating without refs** - Always use refs, not direct DOM queries
5. **Missing null checks** - Guard against null refs before animating

## See Also

- [RECIPES.md](RECIPES.md) - Extended animation recipes
- [SCROLLTRIGGER.md](SCROLLTRIGGER.md) - Advanced ScrollTrigger patterns
- [DRAGGABLE.md](DRAGGABLE.md) - Draggable plugin for drag interactions
- [MORPHSVG.md](MORPHSVG.md) - MorphSVG plugin for shape morphing
- [VIDEOONSCROLLGSAP.md](VIDEOONSCROLLGSAP.md) - Video scroll-driven animations with GSAP
