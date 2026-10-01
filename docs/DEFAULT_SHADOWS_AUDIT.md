# Audit: Default Shadow Buttons by Page

> **Scope:** Buttons ONLY (Cards, containers, inputs, and modals excluded)  
> **Target:** Identify every page with buttons that render a default resting shadow, with clickable links.

---

## 🎯 Executive Summary & The Single Source of Truth

**88% of all buttons with default shadows across the entire website originate from a single file:**
👉 **[src/components/ui/Button.tsx](file:///t:/Project/mec-cc/frontend/src/components/ui/Button.tsx#L21-L30)**

```tsx
// Lines 23 & 25 in src/components/ui/Button.tsx:
primary: "... shadow-[3px_3px_0px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_0px_var(--accent-primary)] ..."
secondary: "... shadow-[3px_3px_0px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_0px_var(--border-default)] ..."
```

Every page that uses standard `<Button>` or `<Button variant="secondary">` inherits this 3px hard brutalist shadow.  
Only **2 components** add an explicit custom hard-coded shadow override:
1. **[EventRegisterButton.tsx](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L43)** (`shadow-[4px_4px_0px_0px_var(--border-brutalist)]`)
2. **[AboutEditButton.tsx](file:///t:/Project/mec-cc/frontend/src/app/about/components/AboutEditButton.tsx#L15)** (`shadow-[4px_4px_0px_0px_var(--text-primary)]`)

---

## 📑 Page-by-Page Button Inventory

### 1. [Home Page](http://localhost:3001/)
- **Page File:** [src/app/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/page.tsx)
- **Route:** `/`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Become a Member"** (Hero CTA) | [src/app/page.tsx:L85](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L85) | `<Button>` (primary) | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Become a Sponsor"** (Hero CTA) | [src/app/page.tsx:L88](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L88) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"View all events →"** (Events Queue) | [src/app/page.tsx:L150](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L150) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"View full gallery archive →"** | [src/components/home/HomeGallery.tsx:L121](file:///t:/Project/mec-cc/frontend/src/components/home/HomeGallery.tsx#L121) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Become a Sponsor"** (Sponsors Section) | [src/components/home/HomeSponsors.tsx:L120](file:///t:/Project/mec-cc/frontend/src/components/home/HomeSponsors.tsx#L120) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"View all sponsors"** (Sponsors Section) | [src/components/home/HomeSponsors.tsx:L123](file:///t:/Project/mec-cc/frontend/src/components/home/HomeSponsors.tsx#L123) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"View all posts →"** (Blogs Section) | [src/components/home/HomeBlogs.tsx:L36](file:///t:/Project/mec-cc/frontend/src/components/home/HomeBlogs.tsx#L36) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"About Club"** (Glimpse Section) | [src/components/home/AboutContactGlimpse.tsx:L134](file:///t:/Project/mec-cc/frontend/src/components/home/AboutContactGlimpse.tsx#L134) | `<Button>` (primary) | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Get in Touch"** (Glimpse Section) | [src/components/home/AboutContactGlimpse.tsx:L137](file:///t:/Project/mec-cc/frontend/src/components/home/AboutContactGlimpse.tsx#L137) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 2. Global Navigation Bar (All Pages Header)
- **Component File:** [src/components/layout/Navbar.tsx](file:///t:/Project/mec-cc/frontend/src/components/layout/Navbar.tsx)
- **Appears On:** All pages

| Button Label | Location & Line | Type | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Join Club"** (Desktop Navbar CTA) | [src/components/layout/Navbar.tsx:L452](file:///t:/Project/mec-cc/frontend/src/components/layout/Navbar.tsx#L452) | `<Button size="sm">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **Mobile Hamburger Toggle Button** | [src/components/layout/Navbar.tsx:L228](file:///t:/Project/mec-cc/frontend/src/components/layout/Navbar.tsx#L228) | CSS `.navbar__hamburger-btn` | `box-shadow: 2px 2px 0px 0px var(--text-primary)` |

---

### 3. [Join / Membership Page](http://localhost:3001/join)
- **Page File:** [src/app/join/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/join/page.tsx)
- **Route:** `/join`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Unlock Registration Form"** | [src/app/join/page.tsx:L144](file:///t:/Project/mec-cc/frontend/src/app/join/page.tsx#L144) | `<Button type="submit" size="lg">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 4. [Events Listing Page](http://localhost:3001/events) & [Event Detail Pages](http://localhost:3001/events/some-event)
- **Listing File:** [src/app/events/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/events/page.tsx)
- **Details File:** [src/app/events/[slug]/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/page.tsx)
- **Route:** `/events`, `/events/[slug]`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Register for Event →"** (Internal Form) | [EventRegisterButton.tsx:L43](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L43) | `<Button>` + custom class | `shadow-[4px_4px_0px_0px_var(--border-brutalist)]` |
| **"Register on External Portal ↗"** | [EventRegisterButton.tsx:L54](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L54) | `<Button>` + custom class | `shadow-[4px_4px_0px_0px_var(--border-brutalist)]` |
| **"Register for Event →"** (Modal Trigger) | [EventRegisterButton.tsx:L63](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L63) | `<Button>` + custom class | `shadow-[4px_4px_0px_0px_var(--border-brutalist)]` |

---

### 5. [About Page](http://localhost:3001/about)
- **Page File:** [src/app/about/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/about/page.tsx)
- **Route:** `/about`

| Button Label | Location & Line | Type | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"View Executive Committee & Advisors"** | [src/app/about/page.tsx:L457](file:///t:/Project/mec-cc/frontend/src/app/about/page.tsx#L457) | `<Link className="... shadow-xs">` | `shadow-xs` |
| **"Edit Page (Admin/Moderator)"** | [AboutEditButton.tsx:L15](file:///t:/Project/mec-cc/frontend/src/app/about/components/AboutEditButton.tsx#L15) | Floating `<Link>` button | `shadow-[4px_4px_0px_0px_var(--text-primary)]` |

---

### 6. [Become a Sponsor Page](http://localhost:3001/collaborate/sponsor) & [Partners Page](http://localhost:3001/collaborate/partners)
- **Sponsor File:** [src/app/collaborate/sponsor/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/page.tsx)
- **Partners File:** [src/app/collaborate/partners/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/collaborate/partners/page.tsx)
- **Route:** `/collaborate/sponsor`, `/collaborate/partners`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Become a Sponsor →"** (Partners CTA) | [partners/page.tsx:L116](file:///t:/Project/mec-cc/frontend/src/app/collaborate/partners/page.tsx#L116) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Download Prospectus"** | [SponsorView.tsx:L55](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L55) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Contact Partnerships"** | [SponsorView.tsx:L61](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L61) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Choose Tier" (e.g. Choose Gold)** | [SponsorView.tsx:L236](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L236) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Download PDF Kit"** | [SponsorView.tsx:L355](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L355) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Custom Partnership"** | [SponsorView.tsx:L361](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L361) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 7. [Contact Page](http://localhost:3001/contact)
- **Page File:** [src/app/contact/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/contact/page.tsx)
- **Route:** `/contact`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Send Message"** (Contact Form Submit) | [ContactForm.tsx:L291](file:///t:/Project/mec-cc/frontend/src/app/contact/components/ContactForm.tsx#L291) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 8. [Blog Pages](http://localhost:3001/blog)
- **Listing File:** [src/app/blog/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/blog/page.tsx)
- **Editor File:** [src/app/blog/write/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/blog/write/page.tsx)
- **Route:** `/blog`, `/blog/write`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Post a Blog"** (Header CTA) | [BlogPageClient.tsx:L209](file:///t:/Project/mec-cc/frontend/src/app/blog/BlogPageClient.tsx#L209) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Log In"** (Guest Prompt) | [BlogPageClient.tsx:L294](file:///t:/Project/mec-cc/frontend/src/app/blog/BlogPageClient.tsx#L294) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Write your first blog"** (Empty State) | [BlogPageClient.tsx:L321](file:///t:/Project/mec-cc/frontend/src/app/blog/BlogPageClient.tsx#L321) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Publish Post"** (Write Page) | [write/page.tsx:L966](file:///t:/Project/mec-cc/frontend/src/app/blog/write/page.tsx#L966) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Save Draft"** (Write Page) | [write/page.tsx:L981](file:///t:/Project/mec-cc/frontend/src/app/blog/write/page.tsx#L981) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 9. [Competitive Programming Hub](http://localhost:3001/cp-hub)
- **Page File:** [src/app/cp-hub/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/page.tsx)
- **Route:** `/cp-hub`, `/cp-hub/docs/[id]`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Add Club Doc"** | [CPHubView.tsx:L726](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L726) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Add Achievement"** | [CPHubView.tsx:L917](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L917) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Download PDF"** (Doc View) | [docs/[id]/page.tsx:L159](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L159) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Open Full Screen"** (Doc View) | [docs/[id]/page.tsx:L170](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L170) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Launch Resource Link"** | [docs/[id]/page.tsx:L228](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L228) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 10. [Projects Pages](http://localhost:3001/projects)
- **Listing File:** [src/app/projects/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/projects/page.tsx)
- **Details File:** [src/app/projects/[slug]/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/projects/[slug]/page.tsx)
- **Route:** `/projects`, `/projects/[slug]`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Add Project"** (Header CTA) | [ProjectsClient.tsx:L203](file:///t:/Project/mec-cc/frontend/src/app/projects/components/ProjectsClient.tsx#L203) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Submit First Project"** (Empty State) | [ProjectsClient.tsx:L280](file:///t:/Project/mec-cc/frontend/src/app/projects/components/ProjectsClient.tsx#L280) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Live Demo ↗"** (Project Detail) | [projects/[slug]/page.tsx:L81](file:///t:/Project/mec-cc/frontend/src/app/projects/[slug]/page.tsx#L81) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"GitHub ↗"** (Project Detail) | [projects/[slug]/page.tsx:L100](file:///t:/Project/mec-cc/frontend/src/app/projects/[slug]/page.tsx#L100) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 11. [Verification Page](http://localhost:3001/verify) & Auth Pages
- **Verify File:** [src/app/verify/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx)
- **Auth Files:** [src/app/login/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/login/page.tsx), [src/app/forgot-password/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/forgot-password/page.tsx)
- **Route:** `/verify`, `/login`, `/forgot-password`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Verify Credential"** (Search Form) | [verify/page.tsx:L203](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx#L203) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Copy Verification Link"** | [verify/page.tsx:L408](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx#L408) | `<Button variant="secondary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"View Member Activity"** | [verify/page.tsx:L422](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx#L422) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Return to Login"** | [forgot-password/page.tsx:L54](file:///t:/Project/mec-cc/frontend/src/app/forgot-password/page.tsx#L54) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Send Reset Instructions"** | [forgot-password/page.tsx:L82](file:///t:/Project/mec-cc/frontend/src/app/forgot-password/page.tsx#L82) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |

---

### 12. [Admin Dashboard](http://localhost:3001/dashboard)
- **Dashboard File:** [src/app/dashboard/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/dashboard/page.tsx)
- **Route:** `/dashboard`

| Button Label | Location & Line | Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Write New Article"** (Blog Management) | [blogs/page.tsx:L309](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/blogs/page.tsx#L309) | `<Button>` + custom class | `shadow-[3px_3px_0px_var(--border-brutalist)]` |
| **"Create Event"** (Event Management) | [manage-events/page.tsx:L285](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/page.tsx#L285) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Add Member"** (Member Directory) | [members/page.tsx:L340](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/members/page.tsx#L340) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
| **"Create Form"** (Form Builder) | [forms/page.tsx:L210](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/forms/page.tsx#L210) | `<Button variant="primary">` | `shadow-[3px_3px_0px_0px_var(--text-primary)]` |
