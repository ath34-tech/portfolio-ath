import React from 'react';
import ArchitectureDiagram from '../components/technical/ArchitectureDiagram';
import EngineeringDecision from '../components/technical/EngineeringDecision';
import TechnicalNote from '../components/technical/TechnicalNote';
import CodeBlock from '../components/technical/CodeBlock';
import { projects } from '../data/projects';

export default function ProjectDetailPage({ projectId, navigateTo }) {
  const project = projects.find(p => p.id === projectId) || projects[0];
  const currentIndex = projects.findIndex(p => p.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="project-detail-page paper-unfold-transition" style={{ paddingTop: 'var(--s6)', paddingBottom: 'var(--s10)' }}>
      <div className="container">
        {/* Top Breadcrumb Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s6)' }}>
          <button
            onClick={() => navigateTo('/work')}
            className="type-meta"
            style={{ color: 'var(--accent)', cursor: 'pointer' }}
          >
            ← BACK TO SELECTED WORK
          </button>
          <span className="type-section-num">
            PROJECT {project.number} / 0{projects.length}
          </span>
        </div>

        {/* Case Study Header */}
        <div style={{ borderBottom: 'var(--border-ink)', paddingBottom: 'var(--s6)', marginBottom: 'var(--s6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s3)' }}>
            <span className={`type-badge ${project.status === 'LIVE' ? 'badge-live' : 'badge-building'}`}>
              {project.status}
            </span>
            <span className="type-meta">{project.category}</span>
            <span className="type-meta">·</span>
            <span className="type-meta">{project.year}</span>
          </div>

          <h1 className="type-heading-1" style={{ fontSize: 'clamp(44px, 8vw, 110px)', marginBottom: 'var(--s4)' }}>
            {project.title}
          </h1>

          <p className="type-body-lg" style={{ maxWidth: '800px', marginBottom: 'var(--s5)' }}>
            {project.summary}
          </p>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap' }}>
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn-primary">
                LIVE PRODUCT DEMO ↗
              </a>
            )}
            {project.links.producthunt && (
              <a href={project.links.producthunt} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                PRODUCT HUNT ↗
              </a>
            )}
            {project.links.dockerhub && (
              <a href={project.links.dockerhub} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                DOCKER HUB ↗
              </a>
            )}
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                GITHUB REPO ↗
              </a>
            )}
          </div>
        </div>

        {/* Case Study Hero Preview Image */}
        {project.image && (
          <div style={{
            width: '100%',
            maxHeight: '520px',
            backgroundColor: 'var(--paper-deep)',
            border: 'var(--border-ink)',
            boxShadow: '4px 4px 0px var(--ink)',
            marginBottom: 'var(--s8)',
            overflow: 'hidden'
          }}>
            <img 
              src={project.image} 
              alt={project.title} 
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '520px',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        {/* Metadata Strip */}
        <div className="grid-3col paper-surface-clean" style={{
          border: 'var(--border-ink)',
          marginBottom: 'var(--s8)',
          gap: 'var(--s4)'
        }}>
          <div>
            <span className="type-meta" style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>ROLE</span>
            <span className="type-body" style={{ fontWeight: '600', fontSize: '15px' }}>SOFTWARE ENGINEER / AUTHOR</span>
          </div>
          <div>
            <span className="type-meta" style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>TECHNOLOGY STACK</span>
            <span className="type-body" style={{ fontWeight: '600', fontSize: '15px' }}>{project.stack.join(' · ')}</span>
          </div>
          <div>
            <span className="type-meta" style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>SYSTEM CATEGORY</span>
            <span className="type-body" style={{ fontWeight: '600', fontSize: '15px' }}>{project.category}</span>
          </div>
        </div>

        {/* Section 01: The Problem */}
        <section style={{ marginBottom: 'var(--s8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
            <span className="type-section-num">01 / THE PROBLEM</span>
          </div>
          <h2 className="type-heading-2" style={{ fontSize: '32px', marginBottom: 'var(--s4)' }}>
            Why this system needed to be built.
          </h2>
          <p className="type-body-lg" style={{ color: 'var(--ink)', maxWidth: '900px', lineHeight: '1.5' }}>
            {project.problem}
          </p>
        </section>

        {/* Section 02: The System & Architecture */}
        <section style={{ marginBottom: 'var(--s8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
            <span className="type-section-num">02 / THE SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="type-heading-2" style={{ fontSize: '32px', marginBottom: 'var(--s4)' }}>
            System topology & data flow.
          </h2>
          <p className="type-body" style={{ fontSize: '17px', color: 'var(--muted)', maxWidth: '900px', marginBottom: 'var(--s5)' }}>
            {project.approach}
          </p>

          <ArchitectureDiagram architecture={project.architecture} />
        </section>

        {/* Section 03: Engineering Decisions */}
        {project.decisions && project.decisions.length > 0 && (
          <section style={{ marginBottom: 'var(--s8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
              <span className="type-section-num">03 / ENGINEERING DECISIONS & TRADEOFFS</span>
            </div>
            <h2 className="type-heading-2" style={{ fontSize: '32px', marginBottom: 'var(--s5)' }}>
              Key technical decisions & why they worked.
            </h2>

            {project.decisions.map((dec, idx) => (
              <EngineeringDecision key={idx} decision={dec} />
            ))}
          </section>
        )}

        {/* Section 04: Technical Notes & Code Snippets */}
        <section style={{ marginBottom: 'var(--s8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
            <span className="type-section-num">04 / IMPLEMENTATION & CODE</span>
          </div>
          <h2 className="type-heading-2" style={{ fontSize: '32px', marginBottom: 'var(--s5)' }}>
            Implementation fragments & technical constraints.
          </h2>

          {project.technicalNotes && project.technicalNotes.map((note, idx) => (
            <TechnicalNote key={idx} title={note.title} content={note.content} />
          ))}

          {project.codeSnippet && (
            <CodeBlock
              label={project.codeSnippet.label}
              language={project.codeSnippet.language}
              code={project.codeSnippet.code}
            />
          )}
        </section>

        {/* Section 05: Results & Learnings */}
        <section style={{
          borderTop: 'var(--border-ink)',
          paddingTop: 'var(--s7)',
          marginBottom: 'var(--s8)'
        }}>
          <div className="grid-2col" style={{ gap: 'var(--s7)' }}>
            <div>
              <span className="type-section-num" style={{ display: 'block', marginBottom: 'var(--s3)' }}>
                05 / VERIFIED RESULTS & OUTCOMES
              </span>
              <ul style={{ paddingLeft: 'var(--s4)', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                {project.results.map((res, rIdx) => (
                  <li key={rIdx} className="type-body" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                    {res}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="type-section-num" style={{ display: 'block', marginBottom: 'var(--s3)' }}>
                06 / WHAT I LEARNED
              </span>
              <p className="type-body-lg" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                "{project.learnings}"
              </p>
            </div>
          </div>
        </section>

        {/* Next Project Footer Link */}
        <div style={{
          backgroundColor: 'var(--paper-deep)',
          border: 'var(--border-ink)',
          padding: 'var(--s6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--s4)'
        }}>
          <div>
            <span className="type-section-num" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
              NEXT CASE STUDY
            </span>
            <h3 className="type-heading-2" style={{ fontSize: '32px' }}>
              {nextProject.title}
            </h3>
            <span className="type-meta">{nextProject.category}</span>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigateTo(`/work/${nextProject.id}`)}
          >
            EXPLORE {nextProject.title.toUpperCase()} →
          </button>
        </div>
      </div>
    </div>
  );
}
