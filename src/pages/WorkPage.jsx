import React, { useState } from 'react';
import SectionHeader from '../components/editorial/SectionHeader';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectArchive from '../components/projects/ProjectArchive';
import DisplayBanner from '../components/editorial/DisplayBanner';

import { projects } from '../data/projects';

export default function WorkPage({ navigateTo }) {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const categories = ['ALL', 'AI / AGENTS', 'AI INFRASTRUCTURE', 'FULL STACK / BACKEND', 'DISTRIBUTED SYSTEMS'];

  const filteredProjects = projects.filter(proj => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'AI / AGENTS') return proj.category.includes('AI') || proj.category.includes('AGENTS') || proj.category.includes('VOICE');
    if (filterCategory === 'AI INFRASTRUCTURE') return proj.category.includes('INFRASTRUCTURE') || proj.category.includes('OCR');
    if (filterCategory === 'FULL STACK / BACKEND') return proj.category.includes('FULL STACK') || proj.category.includes('CRM');
    if (filterCategory === 'DISTRIBUTED SYSTEMS') return proj.category.includes('DISTRIBUTED') || proj.category.includes('STREAMING');
    return true;
  });

  return (
    <div className="work-page paper-unfold-transition" style={{ paddingTop: 'var(--s8)', paddingBottom: 'var(--s10)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--s7)' }}>
          <span className="type-section-num" style={{ display: 'block', marginBottom: 'var(--s2)' }}>
            PORTFOLIO ARCHIVE // 2024 – 2026
          </span>
          <h1 className="type-heading-1" style={{ fontSize: 'clamp(48px, 9vw, 120px)', marginBottom: 'var(--s4)' }}>
            SELECTED WORK
          </h1>
          <p className="type-body-lg" style={{ maxWidth: '780px', color: 'var(--muted)' }}>
            A complete broadsheet publication index of systems, agent frameworks, infrastructure gateways, OCR pipelines, and distributed applications built by Ath Tripathi.
          </p>
        </div>

        {/* Filter Category Switches */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--s2)',
          borderTop: 'var(--border-ink)',
          borderBottom: 'var(--border-ink)',
          padding: 'var(--s4) 0',
          marginBottom: 'var(--s7)'
        }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilterCategory(cat)}
              className="type-meta"
              style={{
                padding: '8px 16px',
                backgroundColor: filterCategory === cat ? 'var(--ink)' : 'transparent',
                color: filterCategory === cat ? 'var(--paper)' : 'var(--ink)',
                border: '1px solid var(--ink)',
                transition: 'var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <SectionHeader
          number="01"
          title="FEATURED SYSTEM CASE STUDIES"
          subtitle="Detailed technical breakdowns including problem scope, architecture schematics, engineering decisions, and code."
        />

        <div className="grid-3col" style={{ marginBottom: 'var(--s9)' }}>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              navigateTo={navigateTo}
            />
          ))}
        </div>
      </div>

      {/* Editorial Banner Divider */}
      <DisplayBanner
        textLine1="ARCHITECTURAL"
        textLine2="DEPTH &"
        textLine3="TRADEOFFS"
        subtitle="02 / PROJECT INDEX"
      />

      <div className="container" style={{ paddingTop: 'var(--s9)' }}>
        {/* Full Archive Index Table */}
        <SectionHeader
          number="02"
          title="COMPLETE PROJECT INDEX"
          subtitle="Scannable broadsheet table overview of all repository projects."
        />

        <ProjectArchive projects={filteredProjects} navigateTo={navigateTo} />
      </div>
    </div>
  );
}
