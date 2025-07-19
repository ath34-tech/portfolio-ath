import React, { useEffect, useState } from "react";
import "./Projects.css";
import Button from "../../components/Button";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/users/ath34-tech/repos?per_page=100")
      .then((res) => res.json())
      .then((data) => {
        const repos = data
          .filter(repo => !repo.fork) // optional: ignore forked repos
          .sort((a, b) => {
            const starsA = a.stargazers_count;
            const starsB = b.stargazers_count;
            return starsB - starsA;
          })
          .map((repo) => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            updated_at: repo.updated_at,
          }));

        setProjects(repos);
        setLoading(false);
      })
      .catch(() => {
        setProjects([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="projects-page">
      <h2>My GitHub Repos</h2>

      {loading ? (
        <p className="projects-loading">Loading projects...</p>
      ) : (
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <div className="project-unique-card" key={i}>
              <div className="project-unique-header">
                <h4>{proj.name}</h4>
                {proj.language && (
                  <span className="project-lang">{proj.language}</span>
                )}
              </div>
              <p className="project-desc">
                {proj.description || "No description provided."}
              </p>
              <div className="project-meta">
                <span>⭐ {proj.stars}</span>
                <span>🍴 {proj.forks}</span>
              </div>
              <div className="project-links">
                <Button onClick={() => window.open(proj.html_url, "_blank")}>
                  GitHub Repo
                </Button>
                {proj.homepage && (
                  <Button
                    onClick={() => window.open(proj.homepage, "_blank")}
                    variant="light"
                  >
                    Live Demo
                  </Button>
                )}
              </div>
              <p className="project-updated">
                Last updated: {new Date(proj.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
