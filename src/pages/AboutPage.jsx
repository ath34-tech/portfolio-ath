import React from 'react';
import SectionHeader from '../components/editorial/SectionHeader';
import Timeline from '../components/content/Timeline';
import SkillMatrix from '../components/content/SkillMatrix';
import AchievementMetric from '../components/content/AchievementMetric';
import ContactBlock from '../components/content/ContactBlock';

import { experience } from '../data/experience';
import { skillCategories } from '../data/skills';
import { achievements, secondaryAchievements } from '../data/achievements';

export default function AboutPage({ navigateTo }) {
  return (
    <div className="about-page paper-unfold-transition" style={{ paddingTop: 'var(--s8)', paddingBottom: 'var(--s10)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--s8)' }}>
          <span className="type-section-num" style={{ display: 'block', marginBottom: 'var(--s2)' }}>
            ABOUT & PHILOSOPHY
          </span>
          <h1 className="type-heading-1" style={{ fontSize: 'clamp(48px, 9vw, 110px)', marginBottom: 'var(--s4)' }}>
            ENGINEER / BUILDER
          </h1>
        </div>

        {/* Narrative Statement Grid */}
        <div className="grid-2col" style={{ alignItems: 'flex-start', marginBottom: 'var(--s9)' }}>
          <div className="paper-surface" style={{ padding: 'var(--s6)' }}>
            <span className="type-section-num" style={{ display: 'block', marginBottom: 'var(--s3)' }}>
              CORE POSITIONING
            </span>
            <h2 className="type-heading-2" style={{ fontSize: '32px', lineHeight: '1.2', marginBottom: 'var(--s4)' }}>
              "I like building systems where the interesting part isn't the UI."
            </h2>
            <p className="type-body-lg" style={{ fontSize: '17px', lineHeight: '1.5' }}>
              From custom Python AI agent runtime loops and non-blocking desktop IPC wrappers to Redis-backed LLM gateways, OCR pipelines, and Kafka event streaming — I focus on the underlying architecture, data contracts, and execution reliability.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>
            {/* Clean Profile Photo */}
            <div style={{
              width: '100%',
              maxHeight: '420px',
              display: 'flex',
              justify: 'center'
            }}>
              <img 
                src="/assets/me.png" 
                alt="Ath Tripathi" 
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  maxHeight: '420px',
                  objectFit: 'contain',
                  objectPosition: 'top center',
                  display: 'block'
                }}
              />
            </div>

            <div style={{ borderBottom: 'var(--border-muted)', paddingBottom: 'var(--s3)' }}>
              <span className="type-meta" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>NAME</span>
              <span className="type-body" style={{ fontWeight: '600', fontSize: '18px' }}>ATH TRIPATHI</span>
            </div>
            <div style={{ borderBottom: 'var(--border-muted)', paddingBottom: 'var(--s3)' }}>
              <span className="type-meta" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>LOCATION</span>
              <span className="type-body" style={{ fontWeight: '600', fontSize: '18px' }}>LUCKNOW, INDIA</span>
            </div>
            <div style={{ borderBottom: 'var(--border-muted)', paddingBottom: 'var(--s3)' }}>
              <span className="type-meta" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>EDUCATION</span>
              <span className="type-body" style={{ fontWeight: '600', fontSize: '18px' }}>B.TECH CSE (AI SPECIALIZATION) — IET LUCKNOW (CGPA: 8.07)</span>
            </div>
            <div>
              <span className="type-meta" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>ROLES</span>
              <span className="type-body" style={{ fontWeight: '600', fontSize: '18px' }}>SOFTWARE ENGINEER / AI INFRASTRUCTURE / REVIEWER</span>
            </div>
          </div>
        </div>

        {/* Career Timeline Section */}
        <section style={{ marginBottom: 'var(--s9)' }}>
          <SectionHeader
            number="01"
            title="PROFESSIONAL EXPERIENCE & EDUCATION"
            subtitle="Verified work history as Technical Assessment Reviewer at Vcriate, Full Stack Developer at Manifold Ventures, and Computer Science degree."
          />
          <Timeline experience={experience} />
        </section>

        {/* Verified Achievements */}
        <section style={{ marginBottom: 'var(--s9)' }}>
          <SectionHeader
            number="02"
            title="COMPETITIVE PROGRAMMING & METRICS"
            subtitle="Problem-solving milestones across Codeforces, CodeChef, LeetCode, and open-source GitHub repositories."
          />
          <AchievementMetric
            achievements={achievements}
            secondaryAchievements={secondaryAchievements}
          />
        </section>

        {/* Skill Matrix */}
        <section style={{ marginBottom: 'var(--s9)' }}>
          <SectionHeader
            number="03"
            title="CATEGORIZED TECHNICAL SKILLS"
            subtitle="Languages, frameworks, databases, infrastructure tools, AI frameworks, and core CS fundamentals."
          />
          <SkillMatrix skillCategories={skillCategories} />
        </section>

        {/* Contact Block */}
        <ContactBlock />
      </div>
    </div>
  );
}
