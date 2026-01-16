# Extended Animation Recipes

## Text Animations

### Character Cascade (Typewriter Feel)

```tsx
const split = SplitText.create(textRef.current, { type: "chars" });

gsap.from(split.chars, {
  opacity: 0,
  y: 20,
  rotateX: -90,
  stagger: {
    each: 0.02,
    from: "start", // "end", "center", "edges", "random"
  },
  ease: "back.out(1.7)",
});
```

### Word-by-Word Reveal (Paragraph)

```tsx
const split = SplitText.create(textRef.current, {
  type: "words",
  wordsClass: "inline-block overflow-hidden",
});

gsap.from(split.words, {
  yPercent: 100,
  opacity: 0,
  stagger: 0.03,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: textRef.current,
    start: "top 80%",
  },
});
```

### Line-by-Line Reveal

```tsx
const split = SplitText.create(textRef.current, {
  type: "lines",
  linesClass: "overflow-hidden",
});

gsap.from(split.lines, {
  yPercent: 100,
  stagger: 0.1,
  duration: 1,
  ease: "power3.out",
});
```

### Scramble Text Effect

```tsx
gsap.to(textRef.current, {
  duration: 1,
  scrambleText: {
    text: "New Text Here",
    chars: "lowerCase",
    revealDelay: 0.5,
  },
});
```

## Image & Media Animations

### Image Reveal with Clip Path

```tsx
gsap.from(imageRef.current, {
  clipPath: "inset(0 100% 0 0)",
  duration: 1.2,
  ease: "power4.inOut",
});
```

### Ken Burns Effect

```tsx
gsap.fromTo(imageRef.current,
  { scale: 1 },
  {
    scale: 1.1,
    duration: 10,
    ease: "none",
    repeat: -1,
    yoyo: true,
  }
);
```

### Image Zoom on Scroll

```tsx
gsap.fromTo(imageRef.current,
  { scale: 1.5 },
  {
    scale: 1,
    scrollTrigger: {
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  }
);
```

### Video Background with Text Overlay

```tsx
// Darkened video background with animated text overlay
return (
  <section className="relative h-screen w-full overflow-hidden">
    {/* Video with brightness filter */}
    <video
      ref={videoRef}
      src="/video.mp4"
      className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
      autoPlay
      loop
      muted
      playsInline
    />

    {/* Gradient overlay for better text contrast */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

    {/* Content */}
    <div className="relative z-10 h-full flex items-end">
      <div className="p-16">
        <h1 className="text-white text-8xl font-bold">
          YOUR TITLE
        </h1>
      </div>
    </div>
  </section>
);
```

**Brightness variations:**

- `brightness-[0.3]` - Very dark (70% darker)
- `brightness-50` - Medium dark (50% darker)
- `brightness-75` - Subtle dark (25% darker)

**Overlay variations:**

- `bg-black/30` - Simple dark overlay
- `bg-gradient-to-t from-black/60 to-transparent` - Bottom-heavy gradient
- `bg-gradient-to-b from-black/40 via-transparent to-black/40` - Top and bottom vignette

### Scroll-Synced Video Background

```tsx
// Video that scrubs through on scroll with overlaid content
useGSAP(() => {
  const video = videoRef.current;
  if (!video) return;

  ScrollTrigger.create({
    trigger: sectionRef.current,
    start: "top top",
    end: "bottom top",
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      if (video.duration) {
        video.currentTime = video.duration * self.progress;
      }
    },
  });
}, []);

return (
  <section ref={sectionRef} className="relative h-screen">
    <video
      ref={videoRef}
      src="/video.mp4"
      className="absolute inset-0 w-full h-full object-cover brightness-50"
      muted
      playsInline
      preload="auto"
    />
    <div className="absolute inset-0 bg-black/20" />
    {/* Your content here */}
  </section>
);
```

## Page Transitions

### Overlay Reveal

```tsx
// Animate overlay to reveal content
gsap.to(overlayRef.current, {
  yPercent: -100,
  duration: 1,
  ease: "power4.inOut",
});
```

### Split Screen Reveal

```tsx
const tl = gsap.timeline();

tl.to(".left-panel", { xPercent: -100, duration: 1 }, 0)
  .to(".right-panel", { xPercent: 100, duration: 1 }, 0)
  .from(".content", { opacity: 0, y: 30, duration: 0.5 }, 0.5);
```

## Scroll-Based Animations

### Progress Bar

```tsx
gsap.to(progressRef.current, {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});
```

### Sticky Header Transform

```tsx
ScrollTrigger.create({
  start: "top -80",
  end: 99999,
  toggleClass: { targets: headerRef.current, className: "scrolled" },
});
```

### Snap Scrolling

```tsx
gsap.utils.toArray<HTMLElement>(".section").forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    pin: true,
    pinSpacing: false,
    snap: 1,
  });
});
```

## Interactive Animations

### Hover Magnetic Effect

```tsx
const handleMouseMove = (e: MouseEvent) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  const x = (e.clientX - left - width / 2) * 0.3;
  const y = (e.clientY - top - height / 2) * 0.3;

  gsap.to(element, { x, y, duration: 0.3 });
};

const handleMouseLeave = () => {
  gsap.to(element, { x: 0, y: 0, duration: 0.3 });
};
```

### Button Press Effect

```tsx
gsap.to(buttonRef.current, {
  scale: 0.95,
  duration: 0.1,
  ease: "power2.out",
});
```

### Cursor Follower

```tsx
useGSAP(() => {
  const cursor = cursorRef.current;

  const moveCursor = (e: MouseEvent) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  window.addEventListener("mousemove", moveCursor);
  return () => window.removeEventListener("mousemove", moveCursor);
}, []);
```

## 3D Transforms

### Card Flip

```tsx
const tl = gsap.timeline({ paused: true });

tl.to(cardRef.current, {
  rotateY: 180,
  duration: 0.6,
  ease: "power2.inOut",
});

// Trigger: tl.play() or tl.reverse()
```

### Perspective Tilt on Hover

```tsx
const handleMouseMove = (e: MouseEvent) => {
  const { left, top, width, height } = cardRef.current!.getBoundingClientRect();
  const x = (e.clientX - left) / width - 0.5;
  const y = (e.clientY - top) / height - 0.5;

  gsap.to(cardRef.current, {
    rotateY: x * 20,
    rotateX: -y * 20,
    duration: 0.5,
    ease: "power2.out",
  });
};
```

## Easing Reference

| Ease | Feel | Use Case |
|------|------|----------|
| `power1.out` | Gentle | Subtle fades |
| `power2.out` | Natural | General purpose |
| `power3.out` | Snappy | Button clicks |
| `power4.inOut` | Dramatic | Page transitions |
| `back.out(1.7)` | Bouncy overshoot | Attention-grabbing |
| `elastic.out(1, 0.3)` | Springy | Playful UI |
| `none` | Linear | Scroll-linked animations |

## Duration Guidelines

| Animation Type | Duration | Notes |
|---------------|----------|-------|
| Micro-interactions | 0.1-0.3s | Button presses, hovers |
| UI transitions | 0.3-0.5s | Modals, menus |
| Page transitions | 0.6-1.0s | Route changes |
| Scroll animations | Scrub-based | No fixed duration |
| Text reveals | 0.8-1.2s | Character staggers |
