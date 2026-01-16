---
name: Home Page UI Transformation
overview: Transform the home page from a "vibe code" prototype to a polished, real-world experience platform called "Bespoke" - emphasizing personalization, expert curation, and social travel with luxury/adventure imagery that adapts to user profiles.
todos:
  - id: farewell-commit
    content: Add goodbye comments to Ctrl+Alt+Dad branding and create commemorative commit
    status: completed
  - id: design-foundation
    content: Set up typography (Playfair Display, Outfit, Inter), color palettes, and CSS variables in globals.css and layout.tsx
    status: completed
  - id: theme-system
    content: Create lib/theme.ts for persona-based theme configuration
    status: completed
  - id: navbar-rebrand
    content: Update Navbar.tsx with new 'Bespoke' branding and cleaner design
    status: completed
  - id: hero-redesign
    content: Redesign home page hero with full-bleed imagery and persona-aware content
    status: completed
  - id: social-section
    content: Add new 'Travel with your people' community section
    status: completed
  - id: curators-section
    content: Add new 'Curated by experts' influencer/curator section
    status: completed
  - id: footer
    content: Add proper footer component
    status: completed
  - id: component-polish
    content: Refine button and card components with better transitions
    status: completed
  - id: image-assets
    content: Download and add open source hero images from Unsplash
    status: completed
---

# Bespoke Home Page UI Transformation

## Phase 0: Farewell Commit (Preserve History)

Create a commemorative commit with comments bidding farewell to the Ctrl+Alt+Dad branding before removing it.

Files to update with goodbye comments:

- `components/Navbar.tsx` - the main logo/branding
- `app/layout.tsx` - the page title metadata

---

## Phase 1: Design System Foundation

### 1.1 Typography System

Add premium Google Fonts that can flex between luxury and adventure personas:

- **Primary (Luxury):** Playfair Display - elegant serif for headlines
- **Primary (Adventure):** Outfit - modern geometric sans for energy
- **Body:** Inter - clean, highly readable sans-serif

Update `app/layout.tsx` to load fonts conditionally based on user persona.

### 1.2 Color Palette Enhancement

Update `app/globals.css` with:

- **Luxury palette:** Deep navy (#0a1628), champagne gold (#c9a959), ivory whites
- **Adventure palette:** Forest green (#1a4d3e), sunset orange (#e85d04), earth tones
- **Neutral base:** Slate grays that work with both

Add CSS custom properties for persona-based theming:

```css
:root {
  --accent-primary: /* derived from persona */
  --accent-secondary: /* derived from persona */
  --hero-overlay: /* gradient based on persona */
}
```

### 1.3 Reusable Theme Provider

Create `lib/theme.ts` to export persona-based theme configurations that components can consume.

---

## Phase 2: Home Page Transformation

### 2.1 Hero Section - Full Bleed Imagery

Replace gradient background with full-bleed hero images.

**Image Strategy (open source for now):**

- Luxury travelers: Unsplash high-end hotel/destination shots
- Adventure travelers: Unsplash outdoor/expedition imagery
- Default: Aspirational travel scenery

Structure:

```tsx
<section className="relative h-[85vh] overflow-hidden">
  <Image src={heroImage} fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
  <div className="relative z-10 ...">
    {/* Content */}
  </div>
</section>
```

### 2.2 New Branding - "Bespoke"

Replace Ctrl+Alt+Dad with clean, minimal branding:

```tsx
// Navbar logo concept
<span className="text-2xl font-serif tracking-wide">Bespoke</span>
<span className="text-xs uppercase tracking-widest text-muted">Experiences</span>
```

Update metadata in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Bespoke | Experiences Crafted for You",
  description: "Personalized travel experiences curated by experts and shaped by your community",
};
```

### 2.3 Value Proposition Messaging

Update hero copy to reflect the platform vision:

**Logged out users:**

- Headline: "Experiences Crafted for You"
- Subhead: "Discover journeys curated by experts and shaped by people who travel like you"

**Personalized (luxury):**

- Headline: "Welcome back, [Name]"
- Subhead: "Your next extraordinary experience awaits"

**Personalized (adventure):**

- Headline: "Ready for the next adventure, [Name]?"
- Subhead: "Discover trips designed for explorers like you"

### 2.4 Social/Community Section (New)

Add a section highlighting the social/influencer aspect:

```
"Travel with your people"

[Card: Join group trips] [Card: Follow curators] [Card: Create your own]
```

### 2.5 Featured Curators/Experts Section (New)

Add placeholder section for influencer/expert-curated experiences:

```
"Curated by those who know"

[Avatar + Name + Specialty] x 3-4
"Wine Country Expert" | "Adventure Seeker" | "Luxury Connoisseur"
```

### 2.6 Footer

Add a proper footer with links and refined branding.

---

## Phase 3: Component Polish

### 3.1 Button Refinements

Update `components/ui/button.tsx` with:

- Smoother transitions
- Subtle hover effects (scale, shadow)
- Persona-aware accent colors

### 3.2 Card Refinements

Ensure cards have:

- Subtle shadows and borders
- Hover states with lift effect
- Clean typography hierarchy

### 3.3 Navigation Bar

Update `components/Navbar.tsx`:

- Remove rainbow gradients
- Clean, minimal design
- Subtle hover states
- Mobile-responsive hamburger menu (stretch)

---

## Phase 4: Image Assets

### 4.1 Download Open Source Images

Add high-quality Unsplash images to `public/`:

- `hero-luxury.jpg` - luxury resort/destination
- `hero-adventure.jpg` - mountain/outdoor scene  
- `hero-default.jpg` - aspirational travel
- `curator-1.jpg`, `curator-2.jpg`, `curator-3.jpg` - placeholder avatars

### 4.2 Image Selection Logic

Update `lib/personalization.ts` to export hero image selection based on `personality.budgetLevel` and `personality.isAdventurer`.

---

## Files to Modify

| File | Changes |

|------|---------|

| `app/layout.tsx` | New fonts, updated metadata, theme provider |

| `app/globals.css` | Color palette, typography scale, persona variables |

| `app/page.tsx` | Complete hero redesign, new sections |

| `components/Navbar.tsx` | New branding, cleaner design |

| `components/ui/button.tsx` | Polish transitions |

| `lib/personalization.ts` | Add hero image selection |

| `lib/theme.ts` | New file - theme configuration |

| `public/*` | Add hero and placeholder images |

---

## Execution Order

1. **Farewell commit** - Add goodbye comments, commit
2. **Foundation** - Fonts, colors, theme system
3. **Navbar** - New branding first (visible everywhere)
4. **Hero** - Full redesign with imagery
5. **New sections** - Social, curators, footer
6. **Polish** - Button/card refinements
7. **Test** - Verify logged-in and logged-out states