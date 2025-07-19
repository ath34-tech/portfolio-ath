import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project.id}`} className="project-card">
    <div className="project-title">{project.name}</div>
    <div className="project-stack">
      {project.stack.map((tech, i) => (
        <span className="project-tech" key={i}>{tech}</span>
      ))}
    </div>
    <div className="project-desc">{project.description}</div>
  </Link>
);

export default ProjectCard;
