# Draggable Plugin Patterns

## Setup

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";

// Register at module level
gsap.registerPlugin(Draggable);

const DraggableComponent = () => {
  const dragRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!dragRef.current) return;

    const draggableInstance = Draggable.create(dragRef.current, {
      type: "x,y",
      bounds: window,
      inertia: true,
    });

    // Cleanup
    return () => {
      draggableInstance[0].kill();
    };
  }, []);

  return <div ref={dragRef}>Drag me!</div>;
};
```

## Core Patterns

### Basic Drag

```tsx
Draggable.create(elementRef.current, {
  type: "x,y",  // "x", "y", "x,y", "rotation"
  bounds: containerRef.current,
  inertia: true,
});
```

### Constrained Drag (Bounds)

```tsx
Draggable.create(elementRef.current, {
  type: "x,y",
  bounds: { minX: 0, maxX: 500, minY: 0, maxY: 300 },
});
```

### Snap to Grid

```tsx
Draggable.create(elementRef.current, {
  type: "x,y",
  snap: {
    x: (value) => Math.round(value / 50) * 50,
    y: (value) => Math.round(value / 50) * 50,
  },
});
```

### Drag Callbacks

```tsx
Draggable.create(elementRef.current, {
  type: "x,y",
  onDrag: function() {
    console.log(this.x, this.y);
  },
  onDragStart: function() {
    gsap.to(this.target, { scale: 1.1, duration: 0.2 });
  },
  onDragEnd: function() {
    gsap.to(this.target, { scale: 1, duration: 0.2 });
  },
});
```

### Rotation Drag

```tsx
Draggable.create(elementRef.current, {
  type: "rotation",
  inertia: true,
});
```

### Throw Props (Inertia)

```tsx
Draggable.create(elementRef.current, {
  type: "x,y",
  inertia: true,
  bounds: window,
  edgeResistance: 0.65,
  throwResistance: 3000,
});
```

## Advanced Patterns

### Draggable Slider

```tsx
const [sliderValue, setSliderValue] = useState(0);

useGSAP(() => {
  Draggable.create(thumbRef.current, {
    type: "x",
    bounds: trackRef.current,
    onDrag: function() {
      const progress = this.x / trackRef.current!.offsetWidth;
      setSliderValue(progress * 100);
    },
  });
}, []);
```

### Drag to Reorder List

```tsx
Draggable.create(".list-item", {
  type: "y",
  bounds: listRef.current,
  onDragEnd: function() {
    // Reorder logic
    const items = gsap.utils.toArray<HTMLElement>(".list-item");
    items.sort((a, b) => a.offsetTop - b.offsetTop);
  },
});
```

### Hit Test (Collision Detection)

```tsx
const draggable = Draggable.create(dragRef.current, {
  type: "x,y",
  onDrag: function() {
    if (this.hitTest(targetRef.current, "50%")) {
      gsap.to(targetRef.current, { scale: 1.2, duration: 0.2 });
    } else {
      gsap.to(targetRef.current, { scale: 1, duration: 0.2 });
    }
  },
});
```

## Common Mistakes

1. **Forgetting cleanup** - Always call `.kill()` on draggable instances
2. **Wrong bounds type** - Use element refs or objects, not CSS selectors
3. **No inertia registration** - InertiaPlugin must be registered for `inertia: true`
4. **Fighting with ScrollTrigger** - Disable scrolling on drag if needed
