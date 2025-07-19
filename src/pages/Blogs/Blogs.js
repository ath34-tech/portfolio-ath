import React, { useEffect, useState } from "react";
import "./Blogs.css";
import Button from "../../components/Button";
import blogData from "../../data/blogs.json"; // ✅ import local JSON

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async fetch (optional: replace with a real backend later)
    const timer = setTimeout(() => {
      setBlogs(blogData || []);
      setLoading(false);
    }, 500); // simulate loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="blogs-page">
      <h2>All Blogs</h2>

      {loading ? (
        <p className="blogs-loading">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs to display.</p>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog, i) => (
            <div className="blog-card" key={i}>
              <img className="blog-thumb" src={blog.image} alt={blog.title} />
              <div className="blog-info">
                <h4 className="blog-title">{blog.title}</h4>
                <p className="blog-platform">📌 {blog.platform}</p>
                <Button onClick={() => window.open(blog.url, "_blank")}>
                  Read Blog ↗
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
