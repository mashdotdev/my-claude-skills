# Advanced ScrollTrigger Patterns

## ScrollTrigger Configuration

### Full Options Reference
```tsx
ScrollTrigger.create({
  trigger: elementRef.current,      // Element that triggers
  start: "top center",              // trigger-start viewport-start
  end: "bottom top",                // trigger-end viewport-end

  // Behavior
  scrub: true,                      // Link to scroll (true, number for lag)
  pin: true,                        // Pin the trigger element
  pinSpacing: true,                 // Add space for pinned element

  // Callbacks
  onEnter: () => {},                // Scrolling down, enters viewport
  onLeave: () => {},                // Scrolling down, leaves viewport
  onEnterBack: () => {},            // Scrolling up, re-enters
  onLeaveBack: () => {},            // Scrolling up, leaves
  onUpdate: (self) => {},           // Every scroll update
  onToggle: (self) => {},           // Enter or leave
  onRefresh: (self) => {},          // After refresh

  // Advanced
  markers: true,                    // Debug markers
  toggleClass: "active",            // Toggle CSS class
  toggleActions: "play pause resume reset",
  anticipatePin: 1,                 // Prevent jump when pinning
  snap: 0.5,                        // Snap to progress points
});
```

### Start/End Position Values
```
"top top"       - Element top at viewport top
"top center"    - Element top at viewport center
"top 80%"       - Element top at 80% from viewport top
"top bottom"    - Element top at viewport bottom
"center center" - Element center at viewport center
"bottom top"    - Element bottom at viewport top
"+=500"         - 500px after calculated position
```

## Pinning Patterns

### Basic Pin
```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top top",
  end: "+=1000",            // Pin for 1000px of scroll
  pin: true,
});
```

### Pin Without Extra Spacing
```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: false,        // No gap after pinned section
});
```

### Pin Specific Element (Not Trigger)
```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top top",
  end: "bottom top",
  pin: headerRef.current,   // Pin different element
});
```

### Nested Pins (Use pinReparent)
```tsx
ScrollTrigger.create({
  trigger: nestedRef.current,
  start: "top top",
  end: "+=500",
  pin: true,
  pinReparent: true,        // Fixes nested pin issues
});
```

## Scrub Patterns

### Instant Scrub
```tsx
scrollTrigger: {
  scrub: true,              // Instant response
}
```

### Smooth Scrub (Recommended)
```tsx
scrollTrigger: {
  scrub: 1,                 // 1 second catch-up
}
```

### Very Smooth Scrub
```tsx
scrollTrigger: {
  scrub: 2,                 // 2 seconds catch-up
}
```

## Snap Scrolling

### Snap to Sections
```tsx
ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top top",
  end: "bottom bottom",
  snap: 1 / (sections.length - 1),  // Snap to each section
});
```

### Snap with Easing
```tsx
scrollTrigger: {
  snap: {
    snapTo: 0.5,            // Snap to halfway
    duration: 0.5,          // Snap duration
    ease: "power2.inOut",
    delay: 0.1,             // Wait before snapping
  },
}
```

### Snap to Labels
```tsx
const tl = gsap.timeline({
  scrollTrigger: {
    snap: {
      snapTo: "labels",
      duration: 0.5,
    },
  },
});

tl.addLabel("section1")
  .to(".el1", { x: 100 })
  .addLabel("section2")
  .to(".el2", { x: 100 });
```

## Horizontal Scrolling

### Horizontal Scroll Section
```tsx
useGSAP(() => {
  const container = containerRef.current!;
  const panels = gsap.utils.toArray<HTMLElement>(".panel");

  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      end: () => "+=" + container.scrollWidth,
    },
  });
}, []);
```

### Horizontal with Lenis
```tsx
// Lenis handles vertical, GSAP transforms horizontal
gsap.to(tracksRef.current, {
  x: () => -(tracksRef.current!.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top top",
    end: () => `+=${tracksRef.current!.scrollWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  },
});
```

## Callback Patterns

### Progress-Based Updates
```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top bottom",
  end: "bottom top",
  onUpdate: (self) => {
    // self.progress = 0 to 1
    gsap.set(elementRef.current, {
      opacity: self.progress,
      y: self.progress * 100,
    });
  },
});
```

### Video Scrubbing with Progress
```tsx
// Sync video playback to scroll progress
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: "top top",
  end: "bottom top",
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = video.duration * self.progress;
    }
  },
});
```

**Important for video:**
- Always check `video.duration` exists before setting `currentTime`
- Use `scrub: 1` (not `true`) for smoother playback
- Set `preload="auto"` on video element
- Pause video initially (see VIDEOONSCROLLGSAP.md)

### Direction Detection
```tsx
ScrollTrigger.create({
  trigger: sectionRef.current,
  onUpdate: (self) => {
    if (self.direction === 1) {
      // Scrolling down
    } else {
      // Scrolling up
    }
  },
});
```

### Toggle Actions
```tsx
gsap.from(elementRef.current, {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: elementRef.current,
    // onEnter, onLeave, onEnterBack, onLeaveBack
    toggleActions: "play none none reverse",
  },
});
```

**Toggle Action Values:**
- `play` - Play from start
- `pause` - Pause
- `resume` - Resume from paused
- `reverse` - Reverse animation
- `restart` - Restart from beginning
- `reset` - Reset to start (no animation)
- `complete` - Jump to end
- `none` - Do nothing

## Batch Animations

### Stagger on Scroll (Batch)
```tsx
ScrollTrigger.batch(".card", {
  onEnter: (batch) => {
    gsap.from(batch, {
      opacity: 0,
      y: 50,
      stagger: 0.1,
    });
  },
  start: "top 80%",
});
```

### Batch with Interval
```tsx
ScrollTrigger.batch(".item", {
  interval: 0.1,            // Check every 0.1s
  batchMax: 3,              // Max 3 items per batch
  onEnter: (batch) => {
    gsap.to(batch, {
      opacity: 1,
      stagger: 0.05,
    });
  },
});
```

## Responsive ScrollTriggers

### Match Media
```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Desktop animations
    gsap.to(".hero", {
      y: -100,
      scrollTrigger: {
        trigger: ".hero",
        scrub: true,
      },
    });
  });

  mm.add("(max-width: 767px)", () => {
    // Mobile animations (simpler)
    gsap.to(".hero", {
      opacity: 0.5,
      scrollTrigger: {
        trigger: ".hero",
        scrub: true,
      },
    });
  });

  return () => mm.revert();
}, []);
```

### Refresh on Resize
```tsx
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
});
```

## Debugging Tips

### Enable Markers
```tsx
scrollTrigger: {
  markers: true,
  // Or with custom colors
  markers: {
    startColor: "green",
    endColor: "red",
    fontSize: "12px",
  },
}
```

### Get All ScrollTriggers
```tsx
console.log(ScrollTrigger.getAll());
```

### Kill Specific ScrollTrigger
```tsx
const st = ScrollTrigger.create({ ... });
st.kill();
```

### Refresh After DOM Changes
```tsx
ScrollTrigger.refresh();
```

## Integration with Lenis

This project uses Lenis at the layout level. Key considerations:

1. **Lenis handles smooth scroll** - Don't fight it with GSAP scroll
2. **Use transforms** - Let Lenis scroll, animate with transforms
3. **Pin works normally** - ScrollTrigger pin is compatible
4. **Scrub is smooth** - Lenis smoothing + scrub = very smooth

### Get Scroll Progress with Lenis
```tsx
import { useLenis } from "lenis/react";

useLenis((lenis) => {
  // lenis.progress = 0 to 1
  // lenis.velocity = current velocity
  // lenis.direction = 1 (down) or -1 (up)
});
```

## Performance Optimization

### Lazy Loading ScrollTriggers
```tsx
ScrollTrigger.config({
  limitCallbacks: true,     // Fewer callbacks
});
```

### Use `fastScrollEnd`
```tsx
ScrollTrigger.config({
  fastScrollEnd: true,      // Snap faster on fast scroll
});
```

### Disable on Mobile (If Needed)
```tsx
ScrollTrigger.matchMedia({
  "(min-width: 768px)": function() {
    // Only create on desktop
    gsap.to(".heavy-animation", { ... });
  },
});
```
