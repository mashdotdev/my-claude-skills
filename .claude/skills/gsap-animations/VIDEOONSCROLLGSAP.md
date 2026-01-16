# Video OnScroll GSAP Skill

This skill helps you implement a scroll-controlled video animation using GSAP ScrollTrigger in React/Next.js projects.

## What this skill does

Creates a reusable video scroll animation where:
- Video playback is synced to scroll position
- Video is pinned during scroll
- Supports responsive scroll triggers
- Uses GSAP ScrollTrigger for smooth performance

## Implementation Steps

When this skill is invoked, you should:

1. **Check for existing hook**
   - Look for `src/hooks/useVideoOnScrollGSAP.ts`
   - If it exists, use it; if not, create it

2. **Create the custom hook** (if it doesn't exist)
   - Create `src/hooks/useVideoOnScrollGSAP.ts` with the following functionality:
     - Accept options: `start`, `end`, `pin`, `trigger`, `scrub`, `markers`
     - Return a video ref
     - Use `useGSAP` hook for GSAP animations
     - Create ScrollTrigger that syncs video.currentTime with scroll progress
     - Handle video metadata loading
     - Pause video initially

3. **Create hooks index file** (if it doesn't exist)
   - Create `src/hooks/index.ts` to export the hook

4. **Implement in component**
   - Import the hook: `import { useVideoOnScrollGSAP } from "@/hooks"`
   - Use the hook with responsive configuration:
   ```tsx
   const isMobile = useMediaQuery({ maxWidth: 767 });
   const startValue = isMobile ? "top 50%" : "center 60%";
   const endValue = isMobile ? "120% top" : "bottom top";

   const videoRef = useVideoOnScrollGSAP({
     start: startValue,
     end: endValue,
     pin: true,
     trigger: "video"
   });
   ```
   - Attach ref to video element

5. **Required video element setup**
   - Add these attributes to the video element:
     - `muted`
     - `playsInline`
     - `preload="auto"`

## Dependencies Required

- `gsap` - Main GSAP library
- `@gsap/react` - React integration for GSAP
- `gsap/ScrollTrigger` - ScrollTrigger plugin

## Hook Interface

```typescript
interface UseVideoOnScrollGSAPOptions {
  start?: string;        // Default: "center 60%"
  end?: string;          // Default: "bottom top"
  pin?: boolean;         // Default: true
  trigger?: string | Element;  // Default: "video"
  scrub?: boolean;       // Default: true
  markers?: boolean;     // Default: false (use for debugging)
}
```

## Example Usage

```tsx
import { useVideoOnScrollGSAP } from "@/hooks";

const VideoSection = () => {
  const videoRef = useVideoOnScrollGSAP({
    start: "top 50%",
    end: "120% top",
    pin: true
  });

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        src="/videos/my-video.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
};
```

## Tips

- Use `markers: true` option during development to visualize ScrollTrigger points
- Adjust `start` and `end` values based on when you want the animation to begin/end
- For mobile responsive animations, use `useMediaQuery` to set different trigger points
- Ensure video is optimized for web (compressed, proper format)
- The video will automatically pause and only play via scroll

## Video Optimization for Smooth Scrubbing

For buttery-smooth scroll-based video playback, optimize your video with **all I-frames** (keyframes):

### Using FFmpeg

```bash
ffmpeg -i input.mp4 \
  -vcodec libx264 \
  -g 1 \
  -x264-params keyint=1:scenecut=0 \
  -preset slow \
  -crf 18 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  output-optimized.mp4
```

**What this does:**
- `-g 1` and `keyint=1:scenecut=0` - Creates a keyframe on every single frame
- `-preset slow -crf 18` - High quality encoding
- `-movflags +faststart` - Optimizes for web streaming
- `-an` - Removes audio (not needed for muted videos)

**Trade-offs:**
- File size increases (3-4x larger)
- Scrubbing becomes frame-perfect with no lag
- Browser can seek instantly to any frame

### When to Optimize

✅ **Use optimized video when:**
- Video is short (< 30 seconds)
- Smooth scrubbing is critical to the experience
- Video is central to the design

❌ **Skip optimization when:**
- Video is very long (> 1 minute)
- File size is a concern
- Video is background decoration only

## Layout Patterns

### Single Page (No Scroll Extension)

For video that stays within one viewport:

```tsx
<section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
  <video
    ref={videoRef}
    src="/video.mp4"
    className="absolute inset-0 w-full h-full object-cover"
    muted
    playsInline
    preload="auto"
  />
</section>
```

### Extended Scroll Height

For video that requires more scroll distance to play through:

```tsx
<section ref={sectionRef} className="relative h-[200vh] w-full">
  <video
    ref={videoRef}
    src="/video.mp4"
    className="w-screen h-screen object-cover"
    muted
    playsInline
    preload="auto"
  />
</section>
```

- Use `h-[200vh]` or `h-[300vh]` to extend scroll area
- Video stays pinned while section scrolls
- Longer scroll = slower video playback

## Video as Background with Text Overlay

Combine video scroll with text animations:

```tsx
"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const VideoBackgroundSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Pause video initially
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => video.pause();
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  // Video scroll sync
  useGSAP(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    ScrollTrigger.create({
      trigger: section,
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

  // Text reveal animation
  useGSAP(() => {
    const title = titleRef.current;
    if (!title) return;

    const split = SplitText.create(title, {
      type: "chars",
      charsClass: "inline-block",
    });

    gsap.from(split.chars, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: "power3.out",
    });

    return () => split.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Video with darkened brightness */}
      <video
        ref={videoRef}
        src="/video.mp4"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        muted
        playsInline
        preload="auto"
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Text content */}
      <div className="absolute bottom-16 left-16 z-10">
        <div className="overflow-hidden">
          <h1 ref={titleRef} className="text-white text-7xl font-bold">
            YOUR TITLE
          </h1>
        </div>
      </div>
    </section>
  );
};
```

**Key techniques:**
- `brightness-50` - Darkens video to 50% for background feel
- `bg-black/30` - Additional overlay for text contrast
- `overflow-hidden` on text wrapper for clean SplitText reveal
- Absolute positioning for layered content

## Troubleshooting

- If video doesn't sync: Check that video metadata is loaded (preload="auto")
- If animation is choppy: Ensure `scrub: 1` is set AND video is optimized with all I-frames
- If video doesn't pin: Verify the `trigger` selector matches your element
- If nothing happens: Check browser console for GSAP plugin registration errors
- If scrubbing is laggy: Optimize video with ffmpeg (see above)
- If text doesn't reveal: Ensure parent has `overflow-hidden` and SplitText cleanup is in place
