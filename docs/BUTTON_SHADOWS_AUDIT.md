# Audit: All Default Shadow Buttons by Page

> **Audit Scope:** Buttons only (Cards, inputs, and containers excluded)
> **Total Buttons with Default Shadow:** 148

This report lists **every page** in the website, providing a clickable link to the page file, the live route URL, and **all the specific buttons** on that page that currently render with a default shadow.

## Crucial Insight: The Central `<Button>` Component

Over 80% of the buttons listed below get their default shadow from a single shared definition in **[src/components/ui/Button.tsx](file:///t:/Project/mec-cc/frontend/src/components/ui/Button.tsx#L21-L30)**:
- **`primary` variant** (default variant when no variant is passed): `shadow-[3px_3px_0px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_0px_var(--accent-primary)]`
- **`secondary` variant**: `shadow-[3px_3px_0px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_0px_var(--border-default)]`

*(Removing those two default shadow classes in [Button.tsx](file:///t:/Project/mec-cc/frontend/src/components/ui/Button.tsx#L23-L25) instantly cleans up almost all standard buttons across all pages below at once!)*

---

## 📄 [Blog Listing Page](http://localhost:3001/blog)
- **Page File:** [src/app/blog/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/blog/page.tsx)
- **Route:** `/blog`
- **Total Default Shadow Buttons:** 6

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"} > Post a Blog"** | [BlogPageClient.tsx:L209](file:///t:/Project/mec-cc/frontend/src/app/blog/BlogPageClient.tsx#L209) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Log In"** | [BlogPageClient.tsx:L294](file:///t:/Project/mec-cc/frontend/src/app/blog/BlogPageClient.tsx#L294) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} > Write your first blog"** | [BlogPageClient.tsx:L321](file:///t:/Project/mec-cc/frontend/src/app/blog/BlogPageClient.tsx#L321) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"handleSubmit(true)} variant="primary" size="lg"..."** | [page.tsx:L966](file:///t:/Project/mec-cc/frontend/src/app/blog/write/page.tsx#L966) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"handleSubmit(false)} variant="secondary" size="..."** | [page.tsx:L981](file:///t:/Project/mec-cc/frontend/src/app/blog/write/page.tsx#L981) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"router.push("/blog")} variant="ghost" size="lg"..."** | [page.tsx:L990](file:///t:/Project/mec-cc/frontend/src/app/blog/write/page.tsx#L990) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Partners Page](http://localhost:3001/collaborate/partners)
- **Page File:** [src/app/collaborate/partners/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/collaborate/partners/page.tsx)
- **Route:** `/collaborate/partners`
- **Total Default Shadow Buttons:** 1

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Become a Sponsor →"** | [page.tsx:L116](file:///t:/Project/mec-cc/frontend/src/app/collaborate/partners/page.tsx#L116) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Become a Sponsor Page](http://localhost:3001/collaborate/sponsor)
- **Page File:** [src/app/collaborate/sponsor/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/page.tsx)
- **Route:** `/collaborate/sponsor`
- **Total Default Shadow Buttons:** 5

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"(Icon or dynamic content)"** | [SponsorView.tsx:L55](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L55) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [SponsorView.tsx:L61](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L61) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"Choose Gold"** | [SponsorView.tsx:L236](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L236) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [SponsorView.tsx:L355](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L355) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [SponsorView.tsx:L361](file:///t:/Project/mec-cc/frontend/src/app/collaborate/sponsor/components/SponsorView.tsx#L361) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |

---

## 📄 [Contact Page](http://localhost:3001/contact)
- **Page File:** [src/app/contact/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/contact/page.tsx)
- **Route:** `/contact`
- **Total Default Shadow Buttons:** 1

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"(Icon or dynamic content)"** | [ContactForm.tsx:L291](file:///t:/Project/mec-cc/frontend/src/app/contact/components/ContactForm.tsx#L291) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Other Component / Modal](http://localhost:3001Shared UI Component)
- **Page File:** [src/app/cp-hub/components/CPHubView.tsx](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx)
- **Route:** `Shared UI Component`
- **Total Default Shadow Buttons:** 31

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"} > Add Club Doc"** | [CPHubView.tsx:L726](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L726) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} > Add Achievement"** | [CPHubView.tsx:L917](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L917) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setAchievementModal( )} > Cancel"** | [CPHubView.tsx:L1093](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L1093) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **": undefined} >"** | [CPHubView.tsx:L1101](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L1101) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setDocModal( )} > Cancel"** | [CPHubView.tsx:L1499](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L1499) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **": undefined} >"** | [CPHubView.tsx:L1507](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/components/CPHubView.tsx#L1507) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"}> Back to CP Hub Resources"** | [page.tsx:L68](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L68) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} > Download PDF"** | [page.tsx:L159](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L159) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} > Open Full Screen"** | [page.tsx:L170](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L170) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"} > Go to Resource"** | [page.tsx:L184](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L184) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} > Launch Resource Link"** | [page.tsx:L228](file:///t:/Project/mec-cc/frontend/src/app/cp-hub/docs/[id]/page.tsx#L228) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Return to Login"** | [page.tsx:L54](file:///t:/Project/mec-cc/frontend/src/app/forgot-password/page.tsx#L54) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L82](file:///t:/Project/mec-cc/frontend/src/app/forgot-password/page.tsx#L82) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Add Project"** | [ProjectsClient.tsx:L203](file:///t:/Project/mec-cc/frontend/src/app/projects/components/ProjectsClient.tsx#L203) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Submit First Project"** | [ProjectsClient.tsx:L280](file:///t:/Project/mec-cc/frontend/src/app/projects/components/ProjectsClient.tsx#L280) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Go to Login →"** | [ProjectsClient.tsx:L332](file:///t:/Project/mec-cc/frontend/src/app/projects/components/ProjectsClient.tsx#L332) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Live Demo ↗"** | [page.tsx:L81](file:///t:/Project/mec-cc/frontend/src/app/projects/[slug]/page.tsx#L81) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"↗"** | [page.tsx:L87](file:///t:/Project/mec-cc/frontend/src/app/projects/[slug]/page.tsx#L87) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"GitHub ↗"** | [page.tsx:L100](file:///t:/Project/mec-cc/frontend/src/app/projects/[slug]/page.tsx#L100) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L129](file:///t:/Project/mec-cc/frontend/src/app/reset-password/page.tsx#L129) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L203](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx#L203) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"/verify?cert=$ `; copyToClipboard(url, "Public ..."** | [page.tsx:L408](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx#L408) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"} className="print:hidden" > View Member Activi..."** | [page.tsx:L422](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx#L422) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L471](file:///t:/Project/mec-cc/frontend/src/app/verify/page.tsx#L471) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Go to Sign In"** | [page.tsx:L178](file:///t:/Project/mec-cc/frontend/src/app/verify-email/page.tsx#L178) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L231](file:///t:/Project/mec-cc/frontend/src/app/verify-email/page.tsx#L231) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"onEdit(template)} title="Edit Template">"** | [CertificateTemplateCard.tsx:L181](file:///t:/Project/mec-cc/frontend/src/components/certificates/CertificateTemplateCard.tsx#L181) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"}} > Reset to Boilerplate"** | [CertificateTemplateModal.tsx:L659](file:///t:/Project/mec-cc/frontend/src/components/certificates/CertificateTemplateModal.tsx#L659) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"(Icon or dynamic content)"** | [CertificateTemplateModal.tsx:L823](file:///t:/Project/mec-cc/frontend/src/components/certificates/CertificateTemplateModal.tsx#L823) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Close Preview"** | [CertificateTemplatePreviewModal.tsx:L156](file:///t:/Project/mec-cc/frontend/src/components/certificates/CertificateTemplatePreviewModal.tsx#L156) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [ProjectModal.tsx:L585](file:///t:/Project/mec-cc/frontend/src/components/projects/ProjectModal.tsx#L585) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Admin Dashboard](http://localhost:3001/dashboard)
- **Page File:** [src/app/dashboard/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/dashboard/page.tsx)
- **Route:** `/dashboard`
- **Total Default Shadow Buttons:** 52

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Write New Article"** | [page.tsx:L309](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/blogs/page.tsx#L309) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Write First Post"** | [page.tsx:L460](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/blogs/page.tsx#L460) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} className="w-full sm:w-auto" > Create Template"** | [page.tsx:L973](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L973) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} > Create First Template"** | [page.tsx:L1035](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1035) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowSingleModal(false)}> Cancel"** | [page.tsx:L1335](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1335) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L1338](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1338) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowBulkModal(false)}> Cancel"** | [page.tsx:L1550](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1550) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L1553](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1553) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setRevokeCertTarget(null)}> Cancel"** | [page.tsx:L1589](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1589) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"setDeleteTarget(null)}> Cancel"** | [page.tsx:L1616](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1616) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"setEditingCert(null)} > Cancel"** | [page.tsx:L1780](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1780) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L1788](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-certificates/page.tsx#L1788) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Add Non-Member Participant"** | [page.tsx:L938](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/event-detail/[id]/page.tsx#L938) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setPrintTargetCerts(event.certificates)} disabl..."** | [page.tsx:L2080](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/event-detail/[id]/page.tsx#L2080) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowBulkModal(true)} disabled= > Bulk Issue"** | [page.tsx:L2090](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/event-detail/[id]/page.tsx#L2090) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"Issue Certificates"** | [page.tsx:L2412](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/event-detail/[id]/page.tsx#L2412) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Issue to Winners"** | [page.tsx:L2547](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/event-detail/[id]/page.tsx#L2547) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Issue Certificate"** | [page.tsx:L2742](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/event-detail/[id]/page.tsx#L2742) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"window.print()} className="cursor-pointer" > Pr..."** | [page.tsx:L2847](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-events/event-detail/[id]/page.tsx#L2847) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Add Project"** | [page.tsx:L141](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-projects/page.tsx#L141) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Add First Project"** | [page.tsx:L385](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/manage-projects/page.tsx#L385) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} onClick= ); setCourseModalOpen(true); }} > Ad..."** | [page.tsx:L311](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L311) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} onClick= ); setInstructorModalOpen(true); }} ..."** | [page.tsx:L330](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L330) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} onClick= > Refresh"** | [page.tsx:L350](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L350) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"handleToggleCourseStatus(course)} title= classN..."** | [page.tsx:L518](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L518) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} onClick= ); setCourseModalOpen(true); }} clas..."** | [page.tsx:L527](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L527) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"handleToggleInstructorStatus(inst)} title= clas..."** | [page.tsx:L651](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L651) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} onClick= ); setInstructorModalOpen(true); }} ..."** | [page.tsx:L660](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L660) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L773](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L773) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L856](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L856) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} className="!bg-red-500 hover:not-disabled:!bg..."** | [page.tsx:L915](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(admin-dash)/utilities/page.tsx#L915) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Public Verify Portal"** | [page.tsx:L86](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(member-dash)/certificates/page.tsx#L86) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"View Upcoming Events →"** | [page.tsx:L112](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(member-dash)/certificates/page.tsx#L112) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Launch Verification Portal →"** | [page.tsx:L209](file:///t:/Project/mec-cc/frontend/src/app/dashboard/(member-dash)/certificates/page.tsx#L209) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Return to Dashboard"** | [page.tsx:L256](file:///t:/Project/mec-cc/frontend/src/app/dashboard/member-approvals/[id]/page.tsx#L256) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"← Back to Member Approvals"** | [page.tsx:L271](file:///t:/Project/mec-cc/frontend/src/app/dashboard/member-approvals/[id]/page.tsx#L271) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"✓ Approve Application"** | [page.tsx:L635](file:///t:/Project/mec-cc/frontend/src/app/dashboard/member-approvals/[id]/page.tsx#L635) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L846](file:///t:/Project/mec-cc/frontend/src/app/dashboard/member-approvals/[id]/page.tsx#L846) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [AdminAddMemberModal.tsx:L1181](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/AdminAddMemberModal.tsx#L1181) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Reload roles"** | [DesignationManager.tsx:L426](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L426) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"Add Role"** | [DesignationManager.tsx:L431](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L431) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Add Role"** | [DesignationManager.tsx:L460](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L460) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"handleOpenAssignModal(d)} style= } >"** | [DesignationManager.tsx:L597](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L597) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"setIsAddModalOpen(false)} disabled= > Cancel"** | [DesignationManager.tsx:L813](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L813) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"(Icon or dynamic content)"** | [DesignationManager.tsx:L822](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L822) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setSelectedMemberIds([])} > Clear Selection"** | [DesignationManager.tsx:L1124](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L1124) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"setAssignTarget(null)} disabled= > Cancel"** | [DesignationManager.tsx:L1136](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L1136) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **")`}"** | [DesignationManager.tsx:L1145](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/DesignationManager.tsx#L1145) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"handleOpenForm(f)} > Fill Out Form"** | [FormsTab.tsx:L87](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/FormsTab.tsx#L87) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [FormsTab.tsx:L178](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/FormsTab.tsx#L178) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowModal(true)} > Add Project"** | [ProjectsTab.tsx:L30](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/ProjectsTab.tsx#L30) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowModal(true)}> Add a Project"** | [ProjectsTab.tsx:L83](file:///t:/Project/mec-cc/frontend/src/components/dashboard/legacy/ProjectsTab.tsx#L83) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Event Details Page](http://localhost:3001/events/[slug])
- **Page File:** [src/app/events/[slug]/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/page.tsx)
- **Route:** `/events/[slug]`
- **Total Default Shadow Buttons:** 5

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Registration Closed"** | [EventRegisterButton.tsx:L25](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L25) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Register for Event →"** | [EventRegisterButton.tsx:L39](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L39) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Register on External Portal ↗"** | [EventRegisterButton.tsx:L48](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L48) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setIsModalOpen(true)} className="shadow-[4px_4p..."** | [EventRegisterButton.tsx:L59](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegisterButton.tsx#L59) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [EventRegistrationModal.tsx:L395](file:///t:/Project/mec-cc/frontend/src/app/events/[slug]/EventRegistrationModal.tsx#L395) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Gallery Archive Page](http://localhost:3001/gallery)
- **Page File:** [src/app/gallery/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/gallery/page.tsx)
- **Route:** `/gallery`
- **Total Default Shadow Buttons:** 1

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"remaining) ↓` )}"** | [GalleryClient.tsx:L322](file:///t:/Project/mec-cc/frontend/src/app/gallery/GalleryClient.tsx#L322) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |

---

## 📄 [Join Us / Membership Page](http://localhost:3001/join)
- **Page File:** [src/app/join/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/join/page.tsx)
- **Route:** `/join`
- **Total Default Shadow Buttons:** 1

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"(Icon or dynamic content)"** | [page.tsx:L144](file:///t:/Project/mec-cc/frontend/src/app/join/page.tsx#L144) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Authentication (Login / Register)](http://localhost:3001/login)
- **Page File:** [src/app/login/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/login/page.tsx)
- **Route:** `/login`
- **Total Default Shadow Buttons:** 5

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"0)} id="login-submit" > s)` ) : showSecurityCod..."** | [page.tsx:L407](file:///t:/Project/mec-cc/frontend/src/app/login/page.tsx#L407) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Unlock Application Form"** | [page.tsx:L1056](file:///t:/Project/mec-cc/frontend/src/app/register/page.tsx#L1056) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L2213](file:///t:/Project/mec-cc/frontend/src/app/register/page.tsx#L2213) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [page.tsx:L2417](file:///t:/Project/mec-cc/frontend/src/app/register/page.tsx#L2417) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Proceed to Login →"** | [page.tsx:L2424](file:///t:/Project/mec-cc/frontend/src/app/register/page.tsx#L2424) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Home Page](http://localhost:3001/)
- **Page File:** [src/app/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/page.tsx)
- **Route:** `/`
- **Total Default Shadow Buttons:** 13

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"hero-join-cta"** | [page.tsx:L85](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L85) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Become a Sponsor"** | [page.tsx:L88](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L88) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"View all events →"** | [page.tsx:L150](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L150) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"Full leaderboard →"** | [page.tsx:L366](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L366) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"View all projects →"** | [page.tsx:L390](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L390) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"Apply to join"** | [page.tsx:L418](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L418) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Have questions? Contact us →"** | [page.tsx:L421](file:///t:/Project/mec-cc/frontend/src/app/page.tsx#L421) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"About Us →"** | [AboutContactGlimpse.tsx:L134](file:///t:/Project/mec-cc/frontend/src/components/home/AboutContactGlimpse.tsx#L134) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Send Message"** | [AboutContactGlimpse.tsx:L137](file:///t:/Project/mec-cc/frontend/src/components/home/AboutContactGlimpse.tsx#L137) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"View all articles →"** | [HomeBlogs.tsx:L36](file:///t:/Project/mec-cc/frontend/src/components/home/HomeBlogs.tsx#L36) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"View full gallery archive →"** | [HomeGallery.tsx:L121](file:///t:/Project/mec-cc/frontend/src/components/home/HomeGallery.tsx#L121) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"Become a sponsor →"** | [HomeSponsors.tsx:L120](file:///t:/Project/mec-cc/frontend/src/components/home/HomeSponsors.tsx#L120) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"All Partners"** | [HomeSponsors.tsx:L123](file:///t:/Project/mec-cc/frontend/src/components/home/HomeSponsors.tsx#L123) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |

---

## 📄 [User Profile Page](http://localhost:3001/profile)
- **Page File:** [src/app/profile/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/profile/page.tsx)
- **Route:** `/profile`
- **Total Default Shadow Buttons:** 22

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"(Icon or dynamic content)"** | [AvatarPositionModal.tsx:L467](file:///t:/Project/mec-cc/frontend/src/app/profile/components/AvatarPositionModal.tsx#L467) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"View Upcoming Opportunities"** | [CertificatesTab.tsx:L104](file:///t:/Project/mec-cc/frontend/src/app/profile/components/CertificatesTab.tsx#L104) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Open Public Verify Page ↗"** | [CertificatesTab.tsx:L156](file:///t:/Project/mec-cc/frontend/src/app/profile/components/CertificatesTab.tsx#L156) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Digital Asset ↗"** | [CertificatesTab.tsx:L160](file:///t:/Project/mec-cc/frontend/src/app/profile/components/CertificatesTab.tsx#L160) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"Apply"** | [CoverPresetModal.tsx:L165](file:///t:/Project/mec-cc/frontend/src/app/profile/components/CoverPresetModal.tsx#L165) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"} className="h-7 px-2.5 text-xs" >"** | [CoverPresetModal.tsx:L229](file:///t:/Project/mec-cc/frontend/src/app/profile/components/CoverPresetModal.tsx#L229) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowBrowseAll(!showBrowseAll)} >"** | [EventsTab.tsx:L57](file:///t:/Project/mec-cc/frontend/src/app/profile/components/EventsTab.tsx#L57) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowBrowseAll(true)}> Browse Available Events"** | [EventsTab.tsx:L148](file:///t:/Project/mec-cc/frontend/src/app/profile/components/EventsTab.tsx#L148) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"onRegisterEvent(eventId)} className="h-[30px] p..."** | [EventsTab.tsx:L235](file:///t:/Project/mec-cc/frontend/src/app/profile/components/EventsTab.tsx#L235) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"handleOpenForm(f)} > Fill Out Form"** | [FormsTab.tsx:L96](file:///t:/Project/mec-cc/frontend/src/app/profile/components/FormsTab.tsx#L96) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [FormsTab.tsx:L193](file:///t:/Project/mec-cc/frontend/src/app/profile/components/FormsTab.tsx#L193) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"handleAddSkill()} className="shrink-0"> Add Skill"** | [ProfileEditTab.tsx:L865](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProfileEditTab.tsx#L865) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Add Position"** | [ProfileEditTab.tsx:L930](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProfileEditTab.tsx#L930) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"Add Education"** | [ProfileEditTab.tsx:L1025](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProfileEditTab.tsx#L1025) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"profile-save-btn"** | [ProfileEditTab.tsx:L1119](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProfileEditTab.tsx#L1119) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [ProfileEditTab.tsx:L1250](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProfileEditTab.tsx#L1250) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"(Icon or dynamic content)"** | [ProfileEditTab.tsx:L1393](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProfileEditTab.tsx#L1393) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowModal(true)} > Add Project"** | [ProjectsTab.tsx:L30](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProjectsTab.tsx#L30) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"setShowModal(true)}> Add Your First Project"** | [ProjectsTab.tsx:L83](file:///t:/Project/mec-cc/frontend/src/app/profile/components/ProjectsTab.tsx#L83) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"security-save-btn"** | [SecurityTab.tsx:L204](file:///t:/Project/mec-cc/frontend/src/app/profile/components/SecurityTab.tsx#L204) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"}} > Discard &amp; Leave"** | [page.tsx:L503](file:///t:/Project/mec-cc/frontend/src/app/profile/page.tsx#L503) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"catch finally }} >"** | [page.tsx:L518](file:///t:/Project/mec-cc/frontend/src/app/profile/page.tsx#L518) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Lab Report Cover Page Generator](http://localhost:3001/resources/cover-page)
- **Page File:** [src/app/resources/cover-page/page.tsx](file:///t:/Project/mec-cc/frontend/src/app/resources/cover-page/page.tsx)
- **Route:** `/resources/cover-page`
- **Total Default Shadow Buttons:** 4

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"} > Reset"** | [CoverPageGeneratorClient.tsx:L971](file:///t:/Project/mec-cc/frontend/src/app/resources/cover-page/CoverPageGeneratorClient.tsx#L971) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"} title="Open browser print dialog / save as PD..."** | [CoverPageGeneratorClient.tsx:L980](file:///t:/Project/mec-cc/frontend/src/app/resources/cover-page/CoverPageGeneratorClient.tsx#L980) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |
| **"} > Save As Default Student Info"** | [CoverPageGeneratorClient.tsx:L1750](file:///t:/Project/mec-cc/frontend/src/app/resources/cover-page/CoverPageGeneratorClient.tsx#L1750) | `<Button variant="secondary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="secondary">` |
| **"} className="border border-black shadow-[2px_2p..."** | [CoverPageGeneratorClient.tsx:L3310](file:///t:/Project/mec-cc/frontend/src/app/resources/cover-page/CoverPageGeneratorClient.tsx#L3310) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

## 📄 [Global Layout (Navbar / Footer - all pages)](http://localhost:3001)
- **Page File:** [src/components/layout/Navbar.tsx](file:///t:/Project/mec-cc/frontend/src/components/layout/Navbar.tsx)
- **Route:** `/* (All Pages)`
- **Total Default Shadow Buttons:** 1

| Button Label / Text | Origin File & Line | Component / Variant | Default Shadow Applied |
| :--- | :--- | :--- | :--- |
| **"Join Club"** | [Navbar.tsx:L452](file:///t:/Project/mec-cc/frontend/src/components/layout/Navbar.tsx#L452) | `<Button variant="primary">` | `3px brutalist (shadow-[3px_3px_0px_0px_var(--text-primary)]) via <Button variant="primary">` |

---

