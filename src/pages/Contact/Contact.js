import React, { useState } from "react";
import "./Contact.css";
import Button from "../../components/Button";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState(null); // success / error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill in all fields.");
      return;
    }

    try {
      // Replace with your backend/email endpoint
      console.log("Submitting:", form); // For testing

      // FOR FUTURE: make API call (e.g., EmailJS, Nodemailer, etc.)
      // await fetch("/api/contact", { ... });

      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="contact-page">
      <h2>Contact Me</h2>
      <p className="contact-subtext">Got a project, writing idea, collab, or just want to say hi?</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Your Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </label>

        <label>
          Your Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Your Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write something awesome..."
            rows={5}
          />
        </label>

        <Button type="submit">Send Message</Button>
        {status && <p className="contact-status">{status}</p>}
      </form>
    </section>
  );
}
