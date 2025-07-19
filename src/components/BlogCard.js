import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

const BlogCard = ({ blog }) => (
  <Link to={`/blogs/${blog.id}`} className="blog-card">
    <h3>{blog.title}</h3>
    <p>{blog.excerpt}</p>
    <span className="blog-date">{blog.date}</span>
  </Link>
);

export default BlogCard;
