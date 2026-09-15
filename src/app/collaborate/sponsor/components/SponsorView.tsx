"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { partners } from "@/data/partners";
import { Target, Shield, Zap, Check } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface SponsorViewProps {
  initialContent?: any;
}

export default function SponsorView({ initialContent }: SponsorViewProps) {
  const { settings } = useSiteSettings();

  const contactEmail = settings.contact_email || "meccomputerclub@gmail.com";
  const contactPhone = settings.contact_phone || "+8801780667954";

  // Content from page editor or fallback defaults
  const kicker = initialContent?.hero?.kicker || "Corporate Sponsorship";
  const title = initialContent?.hero?.title || "Acquire Top Tech Talent";
  const description =
    initialContent?.hero?.description ||
    "150+ active members. Trusted by 15+ companies to deliver battle-tested engineering students before they hit the job market.";
  const deckButtonText = initialContent?.hero?.deckButtonText || "Get the Pitch Deck";
  const tiersButtonText = initialContent?.hero?.tiersButtonText || "View Sponsorship Tiers";

  const stat1Value = initialContent?.stats?.stat1Value || "150+";
  const stat1Label = initialContent?.stats?.stat1Label || "Active Members";
  const stat2Value = initialContent?.stats?.stat2Value || "20+";
  const stat2Label = initialContent?.stats?.stat2Label || "Yearly Events";
  const stat3Value = initialContent?.stats?.stat3Value || "500+";
  const stat3Label = initialContent?.stats?.stat3Label || "Participants";
  const stat4Value = initialContent?.stats?.stat4Value || "15+";
  const stat4Label = initialContent?.stats?.stat4Label || "Sponsors";

  const cycleNotice = initialContent?.cta?.cycleNotice || "Sponsorship cycle closes Nov 30";
  const ctaTitle = initialContent?.cta?.title || "Ready to collaborate?";
  const emailButtonText = initialContent?.cta?.emailButtonText || "Email Us";
  const callButtonText = initialContent?.cta?.callButtonText || "Call Us";

  return (
    <main>
      {/* 1. HERO */}
      <section className="pt-10 md:pt-14 pb-8 md:pb-12 text-center">
        <div className="container max-w-[var(--max-width-narrow)] mx-auto px-4 md:px-8">
          <span className="kicker">{kicker}</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-text-secondary mb-6 max-w-[640px] mx-auto leading-relaxed">
            {description}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              href={`mailto:${contactEmail}?subject=Pitch%20Deck%20Request`}
              variant="primary"
            >
              {deckButtonText}
            </Button>
            <Button href="#tiers" variant="secondary">
              {tiersButtonText}
            </Button>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="py-8 md:py-10 bg-surface-secondary">
        <div className="container mx-auto px-4 md:px-8">
          {/* A) Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-8">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-text-primary">{stat1Value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat1Label}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-text-primary">{stat2Value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat2Label}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-text-primary">{stat3Value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat3Label}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-text-primary">{stat4Value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat4Label}</div>
            </div>
          </div>

          {/* B) Sponsor Logo Row */}
          <div className="flex gap-6 justify-center items-center flex-wrap mt-6">
            {partners.slice(0, 5).map((partner, i) => (
              <div
                key={i}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:text-text-primary hover:-translate-y-0.5 transition-all font-bold text-2xl text-text-secondary flex items-center justify-center py-2 px-4 select-none"
                title={partner.name}
              >
                {partner.logoPlaceholder}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a
              href="/collaborate/partners"
              className="text-sm text-text-secondary underline hover:text-text-primary transition-colors"
            >
              See all our partners &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* 3. WHY PARTNER WITH US */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">
              Why Partner With Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl p-6 shadow-[4px_4px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_var(--border-default)]">
              <Target size={24} className="text-accent-primary mb-3" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Direct Recruitment</h3>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                Hire battle-tested engineers directly from our panels for your jobs and internships.
              </p>
            </div>
            <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl p-6 shadow-[4px_4px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_var(--border-default)]">
              <Shield size={24} className="text-accent-primary mb-3" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Brand Authority</h3>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                Get your logo featured prominently on physical banners, merchandise, and our website.
              </p>
            </div>
            <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl p-6 shadow-[4px_4px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_var(--border-default)]">
              <Zap size={24} className="text-accent-primary mb-3" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Product Adoption</h3>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                Introduce your APIs and products directly into our hackathons and member workshops.
              </p>
            </div>
          </div>
          <p className="text-center mt-6 text-xs text-text-tertiary italic">
            Note: Sponsorship also fulfills Corporate Social Responsibility (CSR) goals by funding nationwide tech education.
          </p>
        </div>
      </section>

      {/* 4. SPONSORSHIP TIERS */}
      <section id="tiers" className="py-12 md:py-16 bg-surface-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">
              Sponsorship Tiers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children items-stretch">
            {/* Bronze */}
            <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl p-6 flex flex-col shadow-[4px_4px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_var(--border-default)] hover:-translate-y-0.5 transition-all">
              <div className="text-xl font-bold text-text-primary">Bronze</div>
              <div className="text-2xl font-bold text-accent-primary my-2">৳10k+</div>
              <hr className="border-0 border-t border-border-default my-3" />
              <ul className="p-0 m-0 mb-4 list-none text-sm text-text-secondary flex flex-col gap-2 flex-1">
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Logo on event banners
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Social media mentions
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Digital certificate
                </li>
              </ul>
              <Button
                href={`mailto:${contactEmail}?subject=Bronze%20Sponsorship%20Inquiry`}
                variant="outline"
                className="w-full"
              >
                Choose Bronze
              </Button>
            </div>

            {/* Silver */}
            <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl p-6 flex flex-col shadow-[4px_4px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_var(--border-default)] hover:-translate-y-0.5 transition-all">
              <div className="text-xl font-bold text-text-primary">Silver</div>
              <div className="text-2xl font-bold text-accent-primary my-2">৳25k+</div>
              <hr className="border-0 border-t border-border-default my-3" />
              <ul className="p-0 m-0 mb-4 list-none text-sm text-text-secondary flex flex-col gap-2 flex-1">
                <li className="flex gap-2 items-start font-bold text-text-primary">
                  <Check size={16} className="text-text-primary shrink-0 mt-0.5" /> All Bronze benefits
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Physical booth at events
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> 5-min Keynote speech
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Permanent logo on website
                </li>
              </ul>
              <Button
                href={`mailto:${contactEmail}?subject=Silver%20Sponsorship%20Inquiry`}
                variant="outline"
                className="w-full"
              >
                Choose Silver
              </Button>
            </div>

            {/* Gold */}
            <div className="relative bg-surface-elevated border-2 border-accent-primary rounded-xl p-6 flex flex-col shadow-[0_10px_40px_-10px_rgba(132,204,22,0.3)] lg:scale-105 z-10 hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-3 right-4 bg-accent-primary text-surface-primary font-mono text-xs font-bold uppercase py-1 px-3 rounded-full tracking-wide shadow-md">
                Most Popular
              </div>
              <div className="text-xl font-bold text-text-primary">Gold</div>
              <div className="text-2xl font-bold text-accent-primary my-2">৳50k+</div>
              <div className="text-xs text-accent-warning -mt-2 mb-2">Only 2 Gold slots left this cycle</div>
              <hr className="border-0 border-t border-border-default my-3" />
              <ul className="p-0 m-0 mb-4 list-none text-sm text-text-secondary flex flex-col gap-2 flex-1">
                <li className="flex gap-2 items-start font-bold text-text-primary">
                  <Check size={16} className="text-text-primary shrink-0 mt-0.5" /> All Silver benefits
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Sponsor a tech workshop
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> 15-min exclusive Keynote
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Access to resume database
                </li>
              </ul>
              <Button
                href={`mailto:${contactEmail}?subject=Gold%20Sponsorship%20Inquiry`}
                variant="primary"
                className="w-full"
              >
                Choose Gold
              </Button>
            </div>

            {/* Platinum */}
            <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl p-6 flex flex-col shadow-[4px_4px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_var(--border-default)] hover:-translate-y-0.5 transition-all">
              <div className="text-xl font-bold text-text-primary">Platinum</div>
              <div className="text-2xl font-bold text-accent-primary my-2">৳100k+</div>
              <hr className="border-0 border-t border-border-default my-3" />
              <ul className="p-0 m-0 mb-4 list-none text-sm text-text-secondary flex flex-col gap-2 flex-1">
                <li className="flex gap-2 items-start font-bold text-text-primary">
                  <Check size={16} className="text-text-primary shrink-0 mt-0.5" /> All Gold benefits
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Flagship event naming rights
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Joint workshop series
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={16} className="text-accent-primary shrink-0 mt-0.5" /> Custom software collab
                </li>
              </ul>
              <Button
                href={`mailto:${contactEmail}?subject=Platinum%20Sponsorship%20Inquiry`}
                variant="outline"
                className="w-full"
              >
                Choose Platinum
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            <div>
              <div className="text-4xl font-bold text-accent-primary opacity-30 mb-2 font-mono">01</div>
              <h4 className="font-bold text-lg text-text-primary mb-1">Reach Out</h4>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                Contact our corporate relations team to request a customized pitch deck.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-primary opacity-30 mb-2 font-mono">02</div>
              <h4 className="font-bold text-lg text-text-primary mb-1">Discuss &amp; Plan</h4>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                We align on goals and customize a tier tailored to your ROI targets.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-primary opacity-30 mb-2 font-mono">03</div>
              <h4 className="font-bold text-lg text-text-primary mb-1">Agreement</h4>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                Sign the formal MoU to officially lock in the deliverables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINI FAQ */}
      <section className="py-12 md:py-16 bg-surface-secondary/50">
        <div className="container max-w-[var(--max-width-narrow)] mx-auto px-4 md:px-8">
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-surface-elevated border border-border-default rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-base text-text-primary mb-2">
                Can we choose a custom package outside these tiers?
              </h4>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                Yes. We can tailor a custom package focusing on specific events, workshops, or merchandise depending on your marketing goals.
              </p>
            </div>
            <div className="bg-surface-elevated border border-border-default rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-base text-text-primary mb-2">
                Is the amount negotiable for startups/early-stage companies?
              </h4>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                We often provide in-kind sponsorship options (e.g., providing software credits or API access) for early-stage startups.
              </p>
            </div>
            <div className="bg-surface-elevated border border-border-default rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-base text-text-primary mb-2">
                How is the sponsorship money used?
              </h4>
              <p className="text-sm text-text-secondary m-0 leading-relaxed">
                100% of the funds go directly into hosting events, printing merchandise, providing contest prizes, and maintaining our digital infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT CTA FOOTER */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-surface-secondary to-accent-primary/10 border-t border-border-default text-center">
        <div className="container max-w-[var(--max-width-narrow)] mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-accent-primary font-bold uppercase tracking-wider mb-2">
            {cycleNotice}
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-6">{ctaTitle}</h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              href={`mailto:${contactEmail}?subject=Corporate%20Sponsorship%20Inquiry`}
              variant="primary"
            >
              {emailButtonText}
            </Button>
            <Button href={`tel:${contactPhone}`} variant="secondary">
              {callButtonText}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
