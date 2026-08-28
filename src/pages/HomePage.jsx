import React from 'react';
import DisplayBanner from '../components/editorial/DisplayBanner';
import SectionHeader from '../components/editorial/SectionHeader';
import ProjectCard from '../components/projects/ProjectCard';
import Timeline from '../components/content/Timeline';
import SkillMatrix from '../components/content/SkillMatrix';
import AchievementMetric from '../components/content/AchievementMetric';
import ContactBlock from '../components/content/ContactBlock';
import { WovenCanvas } from '../components/ui/woven-light-hero';
import { useScrollReveal } from '../hooks/useScrollReveal';

import { projects } from '../data/projects';
import { experience } from '../data/experience';
import { skillCategories } from '../data/skills';
import { achievements, secondaryAchievements } from '../data/achievements';

export default function HomePage({ navigateTo }) {
  useScrollReveal();
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="home-page paper-unfold-transition">
      {/* 🗞️ 01. TOP NEWSPAPER TEASER STRIP */}
      <section style={{ borderBottom: 'var(--border-ink)', backgroundColor: 'var(--paper)' }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="top-teaser-grid">
            {/* Teaser 1 */}
            <div className="broadsheet-column-rule" style={{ padding: 'var(--s3) var(--s4)', display: 'flex', gap: 'var(--s3)', alignItems: 'center' }}>
              <img src="/assets/pixie_preview.jpg" alt="Pixie" style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid var(--ink)' }} />
              <div>
                <span className="type-badge badge-live" style={{ fontSize: '9px', padding: '1px 5px' }}>ALL WORK!</span>
                <p className="type-meta" style={{ fontSize: '11px', lineHeight: '1.2', color: 'var(--ink)', marginTop: '2px' }}>
                  A Focus of selection of the best work of the last 2 years.
                </p>
                <span className="type-meta" style={{ fontSize: '10px', color: 'var(--accent)' }}>06 SYSTEMS →</span>
              </div>
            </div>

            {/* Teaser 2 */}
            <div className="broadsheet-column-rule" style={{ padding: 'var(--s3) var(--s4)', display: 'flex', gap: 'var(--s3)', alignItems: 'center' }}>
              <img src="/assets/bodhai_preview.jpg" alt="Bodh AI" style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid var(--ink)' }} />
              <div>
                <span className="type-badge badge-building" style={{ fontSize: '9px', padding: '1px 5px' }}>NOW ACCEPTING</span>
                <p className="type-meta" style={{ fontSize: '11px', lineHeight: '1.2', color: 'var(--ink)', marginTop: '2px' }}>
                  Available for contract backend & AI infrastructure engineering.
                </p>
                <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)' }}>LUCKNOW, IN</span>
              </div>
            </div>

            {/* Teaser 3 */}
            <div className="broadsheet-column-rule" style={{ padding: 'var(--s3) var(--s4)', display: 'flex', gap: 'var(--s3)', alignItems: 'center' }}>
              <img src="/assets/routellmesh_preview.jpg" alt="RouteLLMESH" style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid var(--ink)' }} />
              <div>
                <span className="type-badge badge-live" style={{ fontSize: '9px', padding: '1px 5px' }}>THE FUTURE</span>
                <p className="type-meta" style={{ fontSize: '11px', lineHeight: '1.2', color: 'var(--ink)', marginTop: '2px' }}>
                  Python agent loops, LLM gateways & Kafka streaming.
                </p>
                <span className="type-meta" style={{ fontSize: '10px', color: 'var(--accent)' }}>DOCKER HUB ↗</span>
              </div>
            </div>

            {/* Teaser 4: Issue Header Info */}
            <div style={{ padding: 'var(--s3) var(--s4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <span className="type-meta" style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--ink)' }}>NO. 2026 // VOL. I</span>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)' }}>LUCKNOW, INDIA</span>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--accent)' }}>B.TECH CSE (AI)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🗞️ 02. GIANT NEWSPAPER MASTHEAD */}
      <section style={{ padding: 'var(--s4) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Interactive 3D Woven Canvas Background (Hero Scoped Only) */}
        <WovenCanvas />

        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          {/* Double Newspaper Rule Header Divider */}
          <div className="double-newspaper-rule"></div>

          <h1 
            className="animate-print-reveal"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 11vw, 165px)',
              fontWeight: '900',
              lineHeight: '0.86',
              letterSpacing: '-0.025em',
              textAlign: 'center',
              margin: 'var(--s2) 0',
              color: 'var(--ink)',
              textTransform: 'uppercase',
              wordBreak: 'break-word'
            }}
          >
            ATH TRIPATHI
          </h1>

          <div className="double-newspaper-rule"></div>

          {/* 🗞️ 03. FRONT-PAGE ASYMMETRIC COLUMN GRID */}
          <div className="grid-2col" style={{ alignItems: 'flex-end', marginTop: 'var(--s6)', gap: 'var(--s7)' }}>
            
            {/* LEFT COLUMN: All Headline Text, Bio & CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)', paddingBottom: 'var(--s4)' }} className="animate-print-reveal">
              <div>
                <span className="type-meta" style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                  PRIMARY FOCUS // 2026
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 62px)', fontWeight: '900', lineHeight: '0.92', textTransform: 'uppercase' }}>
                  INTERACTIVE ENGINEER!
                </h2>
              </div>

              {/* Stacked Massive Headline Block */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 3.6vw, 48px)',
                fontWeight: '900',
                lineHeight: '0.96',
                letterSpacing: '-0.015em',
                color: 'var(--ink)',
                textTransform: 'uppercase',
                borderTop: 'var(--border-ink)',
                borderBottom: 'var(--border-ink)',
                paddingTop: 'var(--s4)',
                paddingBottom: 'var(--s4)'
              }}>
                <div>AI SYSTEMS SOFTWARE ENGINEER</div>
                <div>LLM INFRASTRUCTURE ARCHITECT</div>
                <div style={{ color: 'var(--accent)' }}>BASED IN LUCKNOW, IN.</div>
              </div>

              {/* Drop-Cap Lead Paragraph */}
              <p className="type-body-lg drop-cap" style={{ fontSize: '17px', lineHeight: '1.5', color: 'var(--ink)', maxWidth: '640px' }}>
                I build software where the interesting part isn't the UI. From custom Python AI agent runtime loops and non-blocking desktop IPC wrappers to Redis-backed LLM gateways, OCR document pipelines, and Kafka event streaming — I focus on architecture, data contracts, and execution reliability.
              </p>

              <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--s2)' }}>
                <button
                  className="editorial-oval-btn"
                  onClick={() => navigateTo('/work')}
                >
                  EXPLORE ALL WORK →
                </button>
                <a
                  href="https://github.com/ath34-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  GITHUB ↗
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Photo sitting naturally on the right WITHOUT any box or container */}
            <div style={{
              display: 'flex',
              justify: 'flex-end',
              alignItems: 'flex-end',
              width: '100%',
              position: 'relative'
            }} className="animate-print-reveal delay-1">
              <img 
                src="/assets/me.png" 
                alt="Ath Tripathi" 
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  height: 'auto',
                  maxHeight: '620px',
                  objectFit: 'contain',
                  objectPosition: 'bottom right',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Inverted Newspaper Black Box Banner */}
          <div className="newspaper-black-banner" style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--s3)',
            marginTop: 'var(--s6)'
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.8vw, 48px)', fontWeight: '900', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
              SYSTEMS NOT SLIDES
            </span>
            <span className="editorial-stamp" style={{ backgroundColor: 'var(--paper)', color: 'var(--accent)', border: '2px solid var(--paper)' }}>
              [ VERIFIED EDITION ]
            </span>
          </div>

          {/* Sub-Column Feature Articles Grid */}
          <div className="grid-2col" style={{ gap: 'var(--s5)', paddingTop: 'var(--s6)' }}>
            {/* Article 1: Upcoming Next */}
            <div className="broadsheet-column-rule" style={{ paddingRight: 'var(--s4)' }}>
              <span className="type-section-num" style={{ fontSize: '11px', display: 'block', marginBottom: 'var(--s2)' }}>
                UPCOMING NEXT
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', lineHeight: '1.1', marginBottom: 'var(--s2)' }}>
                Pixie Desktop Agent — A desktop AI agent that executes multi-step tools.
              </h3>
              <img src="/assets/pixie_preview.jpg" alt="Pixie preview" style={{ width: '100%', height: '110px', objectFit: 'cover', border: '1px solid var(--ink)', marginBottom: 'var(--s2)' }} />
              <p className="type-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.4' }}>
                Tauri/Rust container backed by asynchronous Python tool execution daemon with context compression.
              </p>
            </div>

            {/* Article 2: Think, Create, Deliver */}
            <div>
              <span className="type-section-num" style={{ fontSize: '11px', display: 'block', marginBottom: 'var(--s2)' }}>
                THINK, CREATE, DELIVER
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', lineHeight: '1.1', marginBottom: 'var(--s2)' }}>
                Architectural rigor beyond the initial prototype.
              </h3>
              <p className="type-body drop-cap" style={{ fontSize: '14px', lineHeight: '1.45', color: 'var(--ink)' }}>
                Every system is built for real operational environments: deterministic computer vision OCR preprocessing, Redis latency circuit-breakers, and declarative FastAPI permission middleware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🗞️ 04. NEWSPAPER METRIC STATISTICS BAR */}
      <section style={{
        borderTop: 'var(--border-ink)',
        borderBottom: 'var(--border-ink)',
        backgroundColor: 'var(--paper-deep)',
        padding: 'var(--s4) 0'
      }} className="reveal-on-scroll">
        <div className="container">
          <div className="broadsheet-stats-grid">
            <div className="broadsheet-column-rule" style={{ padding: '0 var(--s2)' }}>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>CP PROBLEMS</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: '900', color: 'var(--ink)' }}>700+</span>
            </div>
            <div className="broadsheet-column-rule" style={{ padding: '0 var(--s2)' }}>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>CODEFORCES</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: '900', color: 'var(--accent)' }}>1356 PUPIL</span>
            </div>
            <div className="broadsheet-column-rule" style={{ padding: '0 var(--s2)' }}>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>CODECHEF</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: '900', color: 'var(--ink)' }}>1633 3★</span>
            </div>
            <div className="broadsheet-column-rule" style={{ padding: '0 var(--s2)' }}>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>LEETCODE</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: '900', color: 'var(--ink)' }}>1500+</span>
            </div>
            <div style={{ padding: '0 var(--s2)' }}>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>GITHUB REPOS</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: '900', color: 'var(--accent)' }}>50+</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🗞️ 05. SELECTED WORK SECTION */}
      <section className="reveal-on-scroll" style={{ paddingTop: 'var(--s9)', paddingBottom: 'var(--s9)' }}>
        <div className="container">
          <SectionHeader
            number="01"
            title="SELECTED WORK"
            subtitle="Systems engineered across AI agent orchestration, LLM infrastructure, computer vision OCR pipelines, backend CRMs, and event streaming."
          />

          <div className="grid-3col">
            {featuredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                navigateTo={navigateTo}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--s7)' }}>
            <button
              className="editorial-oval-btn"
              onClick={() => navigateTo('/work')}
              style={{ padding: '16px 42px' }}
            >
              VIEW FULL PROJECT ARCHIVE →
            </button>
          </div>
        </div>
      </section>

      {/* 🗞️ 06. GIANT STAGGERED TYPOGRAPHY FEATURE SECTION ("THE SYSTEMS PERFECT ARTISAN") */}
      <section style={{
        backgroundColor: 'var(--paper-deep)',
        borderTop: 'var(--border-ink)',
        borderBottom: 'var(--border-ink)',
        paddingTop: 'var(--s8)',
        paddingBottom: 'var(--s8)',
        overflow: 'hidden'
      }} className="reveal-on-scroll">
        <div className="container">
          <div className="staggered-display-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)', flexWrap: 'wrap' }}>
              <span>THE</span>
              <img src="/assets/pixie_preview.jpg" alt="Pixie" style={{ height: '0.7em', width: '1.4em', objectFit: 'cover', border: '2px solid var(--ink)' }} />
              <span>SYSTEMS</span>
            </div>
            <div style={{ color: 'var(--accent)', textIndent: '0.2em' }}>
              PERFECT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <img src="/assets/trade_copilot_preview.jpg" alt="Trade Copilot" style={{ height: '0.7em', width: '1.4em', objectFit: 'cover', border: '2px solid var(--ink)' }} />
              <span>ENGINEER</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🗞️ 07. EXPERIENCE & VERIFIED CREDENTIALS */}
      <section className="reveal-on-scroll" style={{ paddingTop: 'var(--s9)', paddingBottom: 'var(--s8)' }}>
        <div className="container">
          <SectionHeader
            number="02"
            title="VERIFIED WORK EXPERIENCE"
            subtitle="Verified software engineering positions, technical code reviewing, and computer science degree."
          />
          <Timeline experience={experience} />
        </div>
      </section>

      {/* 🗞️ 08. 4-COLUMN NEWSPAPER TESTIMONIAL / REVIEWS ROW */}
      <section style={{
        backgroundColor: 'var(--paper-deep)',
        borderTop: 'var(--border-ink)',
        borderBottom: 'var(--border-ink)',
        padding: 'var(--s7) 0'
      }} className="reveal-on-scroll">
        <div className="container">
          <div className="reviews-grid-4col">
            {/* Review 1 */}
            <div className="broadsheet-column-rule" style={{ paddingRight: 'var(--s4)' }}>
              <p className="type-body" style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: '1.45', marginBottom: 'var(--s3)' }}>
                "Rigorously evaluated multi-language backend codebases, architectural efficiency, and test cases."
              </p>
              <span className="type-meta" style={{ fontSize: '10px', fontWeight: 'bold', display: 'block' }}>VCRIATE</span>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)' }}>TECHNICAL REVIEWER</span>
            </div>

            {/* Review 2 */}
            <div className="broadsheet-column-rule" style={{ paddingRight: 'var(--s4)' }}>
              <p className="type-body" style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: '1.45', marginBottom: 'var(--s3)' }}>
                "Engineered high-throughput full stack features and robust API contracts for production environments."
              </p>
              <span className="type-meta" style={{ fontSize: '10px', fontWeight: 'bold', display: 'block' }}>MANIFOLD VENTURES</span>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)' }}>FULL STACK DEVELOPER</span>
            </div>

            {/* Review 3 */}
            <div className="broadsheet-column-rule" style={{ paddingRight: 'var(--s4)' }}>
              <p className="type-body" style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: '1.45', marginBottom: 'var(--s3)' }}>
                "Strong foundation in Artificial Intelligence, algorithms, database systems, and OS CS core."
              </p>
              <span className="type-meta" style={{ fontSize: '10px', fontWeight: 'bold', display: 'block' }}>IET LUCKNOW</span>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)' }}>B.TECH CSE (AI) · CGPA 8.07</span>
            </div>

            {/* Review 4 */}
            <div>
              <p className="type-body" style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: '1.45', marginBottom: 'var(--s3)' }}>
                "700+ competitive programming benchmarks across Codeforces, CodeChef, and LeetCode."
              </p>
              <span className="type-meta" style={{ fontSize: '10px', fontWeight: 'bold', display: 'block' }}>COMPETITIVE PROGRAMMING</span>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--accent)' }}>PUPIL 1356 · 3★ 1633</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🗞️ 09. SKILLS MATRIX SECTION */}
      <section className="reveal-on-scroll" style={{ paddingTop: 'var(--s8)', paddingBottom: 'var(--s9)' }}>
        <div className="container">
          <SectionHeader
            number="03"
            title="TECHNICAL SKILLS MATRIX"
            subtitle="Grouped competencies across languages, backend, data streaming, infrastructure, AI/ML, and CS core."
          />
          <SkillMatrix skillCategories={skillCategories} />
        </div>
      </section>

      {/* 🗞️ 10. CONTACT BLOCK */}
      <div className="container reveal-on-scroll">
        <ContactBlock />
      </div>
    </div>
  );
}
