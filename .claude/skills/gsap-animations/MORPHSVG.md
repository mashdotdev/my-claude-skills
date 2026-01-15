# MorphSVG Plugin Patterns

## Setup

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useRef } from "react";

// Register at module level
gsap.registerPlugin(MorphSVGPlugin);

const MorphComponent = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!pathRef.current) return;

    gsap.to(pathRef.current, {
      morphSVG: "#targetShape",
      duration: 1,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <svg viewBox="0 0 100 100">
      <path ref={pathRef} d="M10,10 L90,10 L90,90 L10,90 Z" />
      <path id="targetShape" d="M50,10 L90,50 L50,90 L10,50 Z" visibility="hidden" />
    </svg>
  );
};
```

## Core Patterns

### Basic Shape Morphing

```tsx
useGSAP(() => {
  gsap.to(circleRef.current, {
    morphSVG: squareRef.current,
    duration: 1.5,
    ease: "power2.inOut",
  });
}, []);
```

### Morph to Path String

```tsx
gsap.to(pathRef.current, {
  morphSVG: "M50,10 L90,50 L50,90 L10,50 Z",
  duration: 1,
});
```

### Morph with ScrollTrigger

```tsx
useGSAP(() => {
  gsap.to(shapeRef.current, {
    morphSVG: targetRef.current,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
  });
}, []);
```

### Timeline Morphing Sequence

```tsx
useGSAP(() => {
  const tl = gsap.timeline({ repeat: -1, yoyo: true });

  tl.to(pathRef.current, {
    morphSVG: "#shape1",
    duration: 1,
    ease: "power1.inOut",
  })
    .to(pathRef.current, {
      morphSVG: "#shape2",
      duration: 1,
      ease: "power1.inOut",
    })
    .to(pathRef.current, {
      morphSVG: "#shape3",
      duration: 1,
      ease: "power1.inOut",
    });
}, []);
```

### Shape Index (Control Point Rotation)

```tsx
// Align shapes differently using shapeIndex
gsap.to(pathRef.current, {
  morphSVG: {
    shape: targetRef.current,
    shapeIndex: 5,  // Rotates starting point
  },
  duration: 1,
});
```

## Advanced Patterns

### Auto Shape Index (Find Best Match)

```tsx
gsap.to(pathRef.current, {
  morphSVG: {
    shape: targetRef.current,
    shapeIndex: "auto",  // GSAP finds optimal alignment
  },
  duration: 1,
});
```

### Morph Multiple Paths

```tsx
useGSAP(() => {
  const paths = gsap.utils.toArray<SVGPathElement>(".morph-path");

  paths.forEach((path, i) => {
    gsap.to(path, {
      morphSVG: `#target${i}`,
      duration: 1,
      delay: i * 0.1,
    });
  });
}, []);
```

### Morph with Type (Rotate/Scale Origin)

```tsx
gsap.to(pathRef.current, {
  morphSVG: {
    shape: targetRef.current,
    type: "rotational",  // "rotational" | "linear"
  },
  duration: 1,
});
```

### Morph with Color Fill

```tsx
gsap.to(pathRef.current, {
  morphSVG: targetRef.current,
  fill: "#ff0000",      // Animate fill color simultaneously
  duration: 1.5,
});
```

### Reverse Morph (Back to Original)

```tsx
const [isMorphed, setIsMorphed] = useState(false);

useGSAP(() => {
  if (isMorphed) {
    gsap.to(pathRef.current, {
      morphSVG: targetRef.current,
      duration: 1,
    });
  } else {
    gsap.to(pathRef.current, {
      morphSVG: originalPathRef.current,
      duration: 1,
    });
  }
}, { dependencies: [isMorphed] });
```

## ScrollTrigger Integration

### Morph On Scroll (Scrubbed)

```tsx
useGSAP(() => {
  gsap.to(iconRef.current, {
    morphSVG: "#expanded-icon",
    scrollTrigger: {
      trigger: containerRef.current,
      start: "top center",
      end: "center center",
      scrub: 1,
    },
  });
}, []);
```

### Sequential Morphs on Scroll

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: true,
    },
  });

  tl.to(pathRef.current, {
    morphSVG: "#shape1",
    duration: 1,
  })
    .to(pathRef.current, {
      morphSVG: "#shape2",
      duration: 1,
    })
    .to(pathRef.current, {
      morphSVG: "#shape3",
      duration: 1,
    });
}, []);
```

### Trigger Morph on Enter

```tsx
useGSAP(() => {
  gsap.to(logoRef.current, {
    morphSVG: "#animated-logo",
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: logoRef.current,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
}, []);
```

## Complex Morphing

### Morph SVG Groups (Multiple Elements)

```tsx
useGSAP(() => {
  const fromPaths = gsap.utils.toArray<SVGPathElement>("#group1 path");
  const toPaths = gsap.utils.toArray<SVGPathElement>("#group2 path");

  fromPaths.forEach((path, i) => {
    gsap.to(path, {
      morphSVG: toPaths[i],
      duration: 1,
      ease: "power2.inOut",
    });
  });
}, []);
```

### Combine Morph with Transform

```tsx
gsap.to(pathRef.current, {
  morphSVG: targetRef.current,
  scale: 1.2,
  rotation: 45,
  x: 100,
  duration: 1.5,
  ease: "power2.inOut",
});
```

### Staggered Group Morph

```tsx
useGSAP(() => {
  gsap.to(".icon-path", {
    morphSVG: (i) => `#target-${i}`,
    duration: 1,
    stagger: 0.1,
    ease: "power2.inOut",
  });
}, []);
```

## Interactive Patterns

### Hover Morph

```tsx
const [isHovered, setIsHovered] = useState(false);

useGSAP(() => {
  gsap.to(buttonRef.current, {
    morphSVG: isHovered ? "#hover-shape" : "#default-shape",
    duration: 0.3,
    ease: "power1.out",
  });
}, { dependencies: [isHovered] });

return (
  <svg
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <path ref={buttonRef} d="..." />
  </svg>
);
```

### Click to Morph

```tsx
const handleClick = () => {
  gsap.to(pathRef.current, {
    morphSVG: nextShapeRef.current,
    duration: 0.8,
    ease: "back.out(1.7)",
  });
};
```

### Continuous Loop Morph

```tsx
useGSAP(() => {
  gsap.to(pathRef.current, {
    morphSVG: targetRef.current,
    duration: 2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}, []);
```

## Optimization Tips

### Use Shape Index for Better Morphs

```tsx
// Find best shapeIndex value
MorphSVGPlugin.convertToPath("circle, rect, ellipse, line, polygon, polyline");

// Then use optimal shapeIndex
gsap.to(path, {
  morphSVG: { shape: target, shapeIndex: "auto" },
});
```

### Convert Basic Shapes to Paths

```tsx
useGSAP(() => {
  // Convert circles/rects to paths for better morphing
  MorphSVGPlugin.convertToPath(".circle, .rect");

  // Now morph them
  gsap.to(".circle", {
    morphSVG: ".rect",
    duration: 1,
  });
}, []);
```

### Pre-calculate Path Data

```tsx
// Store original path for reverting
const originalPath = pathRef.current?.getAttribute("d");

const morphToTarget = () => {
  gsap.to(pathRef.current, { morphSVG: "#target", duration: 1 });
};

const morphToOriginal = () => {
  gsap.to(pathRef.current, { morphSVG: originalPath, duration: 1 });
};
```

## SVG Structure Best Practices

### Hidden Target Shapes

```tsx
<svg viewBox="0 0 100 100">
  {/* Visible morphing shape */}
  <path ref={morphRef} d="..." fill="#333" />

  {/* Hidden target shapes */}
  <g visibility="hidden">
    <path id="target1" d="..." />
    <path id="target2" d="..." />
    <path id="target3" d="..." />
  </g>
</svg>
```

### Matching ViewBox

```tsx
// Ensure all shapes use the same viewBox
<svg viewBox="0 0 100 100">
  <path ref={shape1} d="M10,10 L90,90" />
  <path ref={shape2} d="M10,90 L90,10" />
</svg>
```

### Path Point Count

```tsx
// Complex shapes: GSAP auto-subdivides for smooth morphs
// Simple shapes: Keep similar point counts for best results

// Good: Similar complexity
const circle = "M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10";
const square = "M10,10 L90,10 L90,90 L10,90 Z";

// Better: Use shapeIndex: "auto" for different complexities
gsap.to(path, {
  morphSVG: { shape: target, shapeIndex: "auto" },
});
```

## Common Use Cases

### Logo Animation

```tsx
useGSAP(() => {
  const tl = gsap.timeline();

  tl.from(logoRef.current, {
    morphSVG: "#logo-simple",
    duration: 1.5,
    ease: "power2.out",
  });
}, []);
```

### Icon State Changes

```tsx
// Menu icon -> Close icon
gsap.to(menuIconRef.current, {
  morphSVG: isOpen ? "#close-icon" : "#menu-icon",
  duration: 0.4,
  ease: "power2.inOut",
});
```

### Loading Animation

```tsx
useGSAP(() => {
  gsap.to(spinnerRef.current, {
    morphSVG: "#spinner-alt",
    duration: 0.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}, []);
```

### Progress Indicator

```tsx
useGSAP(() => {
  gsap.to(progressRef.current, {
    morphSVG: `#progress-${Math.floor(progress / 20)}`,
    duration: 0.5,
    ease: "power1.out",
  });
}, { dependencies: [progress] });
```

## Common Mistakes to Avoid

1. **Not registering MorphSVGPlugin** - Must call `gsap.registerPlugin(MorphSVGPlugin)`
2. **Missing "use client"** - MorphSVG requires client-side execution
3. **Different viewBox values** - All shapes must share same coordinate system
4. **Forgetting visibility: hidden** - Target shapes should be hidden
5. **No shape index optimization** - Use `shapeIndex: "auto"` for complex shapes
6. **Mixing stroke and fill** - Convert stroked paths to filled shapes first
7. **Path not closed** - Ensure paths close properly with `Z` command
8. **No null checks** - Always guard refs before morphing

## Performance Tips

1. **Limit simultaneous morphs** - Morph one shape at a time when possible
2. **Use will-change: transform** - Add CSS hint for GPU acceleration
3. **Simplify paths** - Fewer points = smoother performance
4. **Reuse target shapes** - Don't recreate path strings on every morph
5. **Use ease for smoothness** - `power2.inOut` or `sine.inOut` work well

## Debugging

### Visualize All Shapes

```tsx
// Temporarily show all target shapes
<g visibility="visible" opacity="0.3">
  <path id="target1" d="..." />
  <path id="target2" d="..." />
</g>
```

### Check Path Complexity

```tsx
// Log path data to inspect
console.log(pathRef.current?.getAttribute("d"));
```

### Test Shape Index Values

```tsx
// Try different shapeIndex values to find best alignment
[0, 1, 2, 3, 4, 5].forEach((index) => {
  console.log(`Testing shapeIndex: ${index}`);
  gsap.to(path, {
    morphSVG: { shape: target, shapeIndex: index },
    duration: 1,
  });
});
```

## See Also

- [SKILL.md](SKILL.md) - Core GSAP patterns
- [SCROLLTRIGGER.md](SCROLLTRIGGER.md) - ScrollTrigger integration
- [RECIPES.md](RECIPES.md) - Animation recipes
