import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"
import Home from "./pages/Home/Home";
import { BackendProvider } from './context/BackendContext';

import FloatingSignsBackground from "./components/FloatingSignsBackground";

// import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
// import ProjectDetail from "./pages/Projects/ProjectDetail";
import Blogs from "./pages/Blogs/Blogs";
// import BlogDetail from "./pages/Blogs/BlogDetail";
import CP from "./pages/CP/CP";
import Contact from "./pages/Contact/Contact";
// import NotFound from "./pages/NotFound"; // fallback 404

function App() {
  return (
    <BackendProvider>
    <Router>

      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
<Route path="/blogs" element={<Blogs />} />
          <Route path="/cp" element={<CP />} />
          <Route path="/contact" element={<Contact />} />

          {/* <Route path="/about" element={<About />} />
          // <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/cp" element={<CP />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
      <Footer />

    </Router>
                <FloatingSignsBackground />

    </BackendProvider>
  );
}

export default App;
