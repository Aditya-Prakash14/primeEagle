# 🎬 Animation Features

This project uses **Framer Motion** and **GSAP** to create smooth, professional animations throughout the website.

## 🎨 Animation Libraries

- **Framer Motion**: For React component animations, transitions, and gestures
- **GSAP (with ScrollTrigger)**: For advanced scroll-based animations and timeline sequences

## 📄 Landing Page Animations

### Navigation Bar
- **Slide down** animation on page load (y: -100 to 0)
- Smooth fade-in effect

### Hero Section
- **Staggered animations** for content elements:
  - Badge: Scale and fade-in
  - Heading: Slide up with fade
  - Description: Slide up with fade (delayed)
  - CTA buttons: Slide up with fade (delayed)
  - Feature checklist: Slide up with fade (delayed)
- **Hero Image**: Slides in from right with fade
- **Floating T-Shirt Icon**: Continuous rotation and scale animation
- **Certification Badge**: Rotates in from bottom-left corner

### Features Section
- **GSAP ScrollTrigger**: Feature cards animate when scrolling into view
- Cards slide up with fade and stagger effect

### Product Cards
- **On Scroll**: Cards fade and slide up when entering viewport
- **Hover Effect**: Cards lift up (-10px) on hover
- Each card has a delayed animation for staggered appearance

### CTA Section
- **Scale animation**: Grows from 0.9 to 1.0 on scroll
- Smooth fade-in effect

## 🔐 Login Page Animations

- **Container**: Fades in and slides up on load
- **Logo**: Rotates 360° after appearing
- **Form**: Slides up with delayed fade-in
- **Social buttons**: Fade in with delay

## ✍️ Sign Up Page Animations

- **Container**: Fades in and slides up on load
- **Logo**: Rotates 360° after appearing
- **Form**: Slides up with delayed fade-in
- All form fields maintain consistent spacing and timing

## 📊 Dashboard Animations

### Sidebar
- **Slide in** from left on page load (x: -264 to 0)
- Smooth transition for mobile toggle

### Content Tabs
- **AnimatePresence**: Smooth transitions between tabs
- Each tab fades and slides when switching

### Overview Tab
- **Stats Cards**: 
  - Scale from 0.8 to 1.0
  - Staggered appearance (0.1s delay between cards)
  - Hover effect: Scale to 1.05
- **Activity Feed**: Loads with tab transition

### Products Tab
- **Product Cards**:
  - Scale from 0.9 to 1.0 with fade-in
  - Staggered appearance (0.05s delay)
  - Hover effect: Lift up by 8px
- **Search/Filter Bar**: Slides in with tab
- **No Products Message**: Conditional rendering with smooth transition

### Orders & Customers Tabs
- Smooth fade and slide transitions
- Consistent animation timing

## 🎯 Animation Timing

- **Fast animations**: 0.2-0.3s (hover effects, quick interactions)
- **Medium animations**: 0.4-0.6s (page load, content reveal)
- **Slow animations**: 0.8-1.0s (hero section, complex sequences)
- **Continuous**: Infinite loops for floating elements

## 🚀 Performance Features

- **AnimatePresence**: Proper unmounting animations
- **Viewport detection**: Animations only trigger when in view
- **Hardware acceleration**: Transform and opacity animations
- **Stagger optimization**: Prevents layout thrashing
- **Once-only animations**: Use `viewport={{ once: true }}` for scroll animations

## 🎛️ Customization

To adjust animation speeds, modify the `transition` props:
```jsx
transition={{ duration: 0.6, delay: 0.2 }}
```

To change animation types, update the `initial` and `animate` props:
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

## 📦 Dependencies

```json
{
  "framer-motion": "^11.x.x",
  "gsap": "^3.x.x"
}
```

All animations are optimized for 60fps performance and smooth user experience! 🎉
