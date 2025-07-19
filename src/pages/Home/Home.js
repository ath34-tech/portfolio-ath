import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import "./Home.css";
import profileImg from "../../assets/images/ath-profile.jpg";
import blogsData from "../../data/blogs.json"; // ✅ LOCAL BLOG DATA
import { FaLaptopCode, FaPenNib, FaFeather } from "react-icons/fa";

const experiences = [
  {
    role: "Full Stack Developer",
    company: "Manifold Ventures",
    duration: "Dec 2021 – Jun 2022",
    icon: <FaLaptopCode color="#2ecc40" size={28} />
  },
  {
    role: "Freelance Writer",
    company: "Twilio",
    duration: "Aug 2022 – Oct 2022",
    icon: <FaPenNib color="#2ecc40" size={28} />
  },
  {
    role: "Freelance Writer",
    company: "Strapi",
    duration: "Jul 2022 – Sep 2022",
    icon: <FaPenNib color="#2ecc40" size={28} />
  },
  {
    role: "Freelance Writer",
    company: "Webiny",
    duration: "Jun 2022 – Jul 2022",
    icon: <FaFeather color="#2ecc40" size={28} />
  },
  {
    role: "Freelance Writer",
    company: "Tutorialspoint",
    duration: "Jul 2021 – Sep 2021",
    icon: <FaFeather color="#2ecc40" size={28} />
  }
];

export default function Home() {
  const [ratings, setRatings] = useState({
    codeforces: { current: null, max: null },
    codechef: 1602,
    atcoder: { current: null, max: null },
    loading: true,
    error: null
  });

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // Fetch CP Ratings
  useEffect(() => {
    async function fetchRatings() {
      try {
        const cfRes = await fetch("https://codeforces.com/api/user.info?handles=athtripathi");
        const cfData = await cfRes.json();
        let cfRating = { current: null, max: null };

        if (cfData.status === "OK" && cfData.result.length > 0) {
          cfRating.current = cfData.result[0].rating;
          cfRating.max = cfData.result[0].maxRating;
        }

        let acRating = { current: null, max: null };
        try {
          const acRes = await fetch("https://atcoder-api.herokuapp.com/user/athtripathi");
          const acData = await acRes.json();
          acRating.current = acData.rating || "Unrated";
          acRating.max = acData.highest_rating || "Unrated";
        } catch {
          acRating = { current: "Unavailable", max: "Unavailable" };
        }

        setRatings({
          codeforces: cfRating,
          codechef: 1602, // hardcoded
          atcoder: acRating,
          loading: false,
          error: null
        });
      } catch {
        setRatings(r => ({
          ...r,
          loading: false,
          error: "Failed to load ratings."
        }));
      }
    }

    fetchRatings();
  }, []);

  // Fetch GitHub Projects Directly
  useEffect(() => {
    fetch("https://api.github.com/users/ath34-tech/repos?per_page=100")
      .then((res) => res.json())
      .then((data) => {
        const repos = data
          .filter(repo => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .map(repo => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            updated_at: repo.updated_at
          }));
        setProjects(repos.slice(0, 5)); // Show top 5
        setProjectsLoading(false);
      })
      .catch(() => {
        setProjects([]);
        setProjectsLoading(false);
      });
  }, []);

  // Load blogs from local JSON
  useEffect(() => {
    setBlogs(blogsData.slice(0, 4));
    setBlogsLoading(false);
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-profile reverse">
          <div className="hero-text">
            <h1>
              Ath Tripathi <span className="hero-dot" />
            </h1>
            <h2>Gen AI Enthusiast • ML Developer • Technical Writer</h2>
            <p>
              B.Tech (AI) at IET Lucknow — building intelligent apps, scaling open source, and crafting developer content for a global audience.
            </p>
            <div className="hero-actions">
              <Button onClick={() => window.location = "/projects"}>See My Projects</Button>
              <Button onClick={() => window.location = "/contact"}>Contact Me</Button>
            </div>
          </div>
          <img src={profileImg} alt="Ath Tripathi" className="hero-img large" />
        </div>
      </section>

      {/* CP Ratings */}
      <section className="cp-section">
        <h3>Competitive Programming Ratings</h3>
        <div className="cp-ratings">
          <a href="https://codeforces.com/profile/athtripathi" target="_blank" rel="noopener noreferrer" className="cp-rating-item textfmt">
            <span className="cp-platform">Codeforces</span>
            <span className="cp-rating">{ratings.loading ? "Loading..." : `${ratings.codeforces.current} (max ${ratings.codeforces.max})`}</span>
          </a>
          <a href="https://www.codechef.com/users/secretmagician" target="_blank" rel="noopener noreferrer" className="cp-rating-item textfmt">
            <span className="cp-platform">CodeChef</span>
            <span className="cp-rating">{ratings.loading ? "Loading..." : ratings.codechef}</span>
          </a>
          <a href="https://atcoder.jp/users/athtripathi" target="_blank" rel="noopener noreferrer" className="cp-rating-item textfmt">
            <span className="cp-platform">AtCoder</span>
            <span className="cp-rating">{ratings.loading ? "Loading..." : `${ratings.atcoder.current} (max ${ratings.atcoder.max})`}</span>
          </a>
        </div>
        {ratings.error && <div className="cp-error">{ratings.error}</div>}
      </section>

      {/* Projects */}
      <section className="home-section">
        <h3>Featured Projects</h3>
        {projectsLoading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="projects-list">
            {projects.map((proj, i) => (
              <div className="project-card" key={i}>
                <div className="project-title">{proj.name}</div>
                <div className="project-stack">
                  {proj.language && <span className="project-tech">{proj.language}</span>}
                  <span className="project-tech">⭐ {proj.stars}</span>
                  <span className="project-tech">🍴 {proj.forks}</span>
                </div>
                <div className="project-desc">{proj.description || "No description provided."}</div>
                <Button onClick={() => window.open(proj.html_url, "_blank")}>
                  View on GitHub
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="home-section-action">
          <Button onClick={() => window.location = "/projects"}>All Projects</Button>
        </div>
      </section>

      {/* Blogs */}
      <section className="home-section">
        <h3>Latest Blogs</h3>
        {blogsLoading ? (
          <p>Loading blogs...</p>
        ) : (
          <div className="blogs-list">
            {blogs.map((blog, i) => (
              <div className="blog-card" key={i}>
                <img className="blog-thumb" src={blog.image} alt={blog.title} />
                <div className="blog-info">
                  <h4 className="blog-title">{blog.title}</h4>
                  <p className="blog-platform">📌 {blog.platform}</p>
                  <Button onClick={() => window.open(blog.url, "_blank")}>Read Full Blog ↗</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="home-section-action">
          <Button onClick={() => window.location = "/blogs"}>All Blogs</Button>
        </div>
      </section>
      {/* Experience */}
      <section className="experience-section">
        <h3>Experience</h3>
        <div className="timeline-responsive">
          {experiences.map((exp, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-icon">{exp.icon}</div>
              <div className="timeline-content">
                <span className="exp-role">{exp.role}</span>
                <span className="exp-company">@ {exp.company}</span>
                <span className="exp-duration">{exp.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* About Summary */}
<section className="about-section">
  <div className="about-flex">
    {/* Bio Card */}
    <div className="about-bio-card">
      <h2 className="about-heading">
        Hey, I'm Ath! <span className="about-wave" role="img" aria-label="wave">👋</span>
      </h2>
      <p className="about-intro">
        <span className="about-highlight">AI whisperer</span>, code-juggler, and caffeinated creator.
        I currently wield my magical powers as a B.Tech (AI) student at IET Lucknow,
        where I build brainy applications smarter than my sleep schedule!
      </p>
      <ul className="about-bullets">
        <li>💡 <b>Machine learning enthusiast</b> (trained algorithms and myself to survive deadlines!)</li>
        <li>🧑‍💻 <b>Full Stack Dev</b>, master of <span className="about-skill">ReactJS</span>, <span className="about-skill">Flask</span>, <span className="about-skill">Django</span></li>
        <li>📜 <b>Technical storyteller</b> & freelance writer for <span className="about-skill">Twilio</span>, <span className="about-skill">Strapi</span>, <span className="about-skill">Tutorialspoint</span>, and more</li>
        <li>⭐ <b>Competitive programmer</b>: Codeforces: <span className="about-cp">1356</span>, CodeChef: <span className="about-cp">1602</span> (destroyer of bugs, collector of virtual badges!)</li>
        <li>🧬 Open Source zealot, always ready to hack on new ideas (or break prod… for research!)</li>
      </ul>
      <div className="about-fun-note">
        <span role="img" aria-label="sparkles">✨</span>
        If you don’t find me coding, I’m probably writing tech blogs, fighting for rating, or daydreaming about the next AI meme generator.
      </div>
      <div className="about-socials">
        <a href="https://www.linkedin.com/in/ath-tripathi-320115230/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span>·</span>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span>·</span>
        <a href="https://codeforces.com/profile/" target="_blank" rel="noopener noreferrer">Codeforces</a>
      </div>
    </div>
    
    {/* Skills & Certifications Card */}
    <div className="about-skills-card">
      <h3>Skills & Tech</h3>
      <div className="about-skills-list">
        <span className="about-badge">Python</span>
        <span className="about-badge">C++</span>
        <span className="about-badge">C#</span>
        <span className="about-badge">JavaScript</span>
        <span className="about-badge">ReactJS</span>
        <span className="about-badge">Flask</span>
        <span className="about-badge">Django</span>
        <span className="about-badge">LangChain</span>
        <span className="about-badge">Machine Learning</span>
        <span className="about-badge">LLMs</span>
        <span className="about-badge">Prompt Engineering</span>
        <span className="about-badge">ARIMA</span>
        <span className="about-badge">Data Viz</span>
      </div>
      <h4>Certifications</h4>
      <ul className="about-certs">
        <li>Mini Holiday Hackathon Hacker — Codédex, Dec 2024</li>
        <li>Time Series Analysis — Intellipaat, Jul 2024</li>
        <li>Data Visualization — IBM, Cognitive Class, Jul 2024</li>
      </ul>
    </div>
  </div>
</section>

    </div>
  );
}
