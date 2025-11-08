<script>
  import { API } from "../../../stores/page";
  let formData = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  let submitted = false;
  let errors = {};

  function validateForm() {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    } else if (formData.message.trim().length > 1024) {
      errors.message = "Message cannot be longer than 1024 characters";
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      const {name, email, subject, message} = formData;
      // In a real app, this would send to your backend
      console.log("Form submitted:", formData);
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,email,subject,message}),
        credentials: "include", // ✅ important
      });

      if (!res.ok) {
        return;
      }

      submitted = true;

      // Reset form
      formData = {
        name: "",
        email: "",
        subject: "",
        message: "",
      };

      // Reset success message after 5 seconds
      setTimeout(() => {
        submitted = false;
      }, 5000);
    }
  }
</script>

<div class="page">
  <div class="container">
    <div class="hero-section">
      <h1 class="page-title">Contact Us</h1>
      <p class="page-subtitle">We'd love to hear from you</p>
    </div>

    <div class="content-wrapper">
      <div class="contact-info-section">
        <h2>Get in Touch</h2>
        <p>
          Have questions, suggestions, or security concerns? Reach out to us
          through the form or contact us directly.
        </p>

        <div class="contact-methods">
          <div class="contact-card">
            <h3>General Inquiries</h3>
            <p>For general questions and support</p>
            <a href="mailto:support@shadowmail.com">support@shadowmail.com</a>
          </div>

          <div class="contact-card">
            <h3>Security Issues</h3>
            <p>Report vulnerabilities responsibly</p>
            <a href="mailto:security@shadowmail.com">security@shadowmail.com</a>
          </div>

          <div class="contact-card">
            <h3>Legal Matters</h3>
            <p>Terms, compliance, and legal requests</p>
            <a href="mailto:legal@shadowmail.com">legal@shadowmail.com</a>
          </div>

          <div class="contact-card">
            <h3>Business & Partnerships</h3>
            <p>Collaboration opportunities</p>
            <a href="mailto:business@shadowmail.com">business@shadowmail.com</a>
          </div>
        </div>

        <div class="social-section">
          <h3>Connect With Us</h3>
          <div class="social-links">
            <a
              href="https://github.com/AndrewSimonDew"
              target="_blank"
              rel="noopener noreferrer">GitHub</a
            >
            <a
              href="https://support.shadowmail.win"
              target="_blank"
              rel="noopener noreferrer">Discord</a
            >
          </div>
        </div>
      </div>

      <div class="contact-form-section">
        <h2>Send Us a Message</h2>

        {#if submitted}
          <div class="success-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <p>Thank you! Your message has been sent successfully.</p>
          </div>
        {/if}

        <form on:submit={handleSubmit}>
          <div class="form-group">
            <label for="name">Name *</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              class:error={errors.name}
              placeholder="Your name"
            />
            {#if errors.name}
              <span class="error-message">{errors.name}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              class:error={errors.email}
              placeholder="your@email.com"
            />
            {#if errors.email}
              <span class="error-message">{errors.email}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              bind:value={formData.subject}
              class:error={errors.subject}
              placeholder="What is this regarding?"
            />
            {#if errors.subject}
              <span class="error-message">{errors.subject}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="message">Message *</label>
            <textarea
              id="message"
              bind:value={formData.message}
              class:error={errors.message}
              placeholder="Tell us more..."
              rows="6"
            ></textarea>
            {#if errors.message}
              <span class="error-message">{errors.message}</span>
            {/if}
          </div>

          <button type="submit" class="submit-btn"> Send Message </button>
        </form>

        <p class="form-note">
          * Required fields. We typically respond within 24-48 hours.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .page-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .contact-info-section,
  .contact-form-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2.5rem;
  }

  h2 {
    font-size: 1.75rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  .contact-methods {
    display: grid;
    gap: 1rem;
    margin: 2rem 0;
  }

  .contact-card {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
  }

  .contact-card h3 {
    color: var(--accent);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .contact-card p {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  .contact-card a {
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .contact-card a:hover {
    color: var(--accent);
  }

  .address-section,
  .social-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }

  .social-links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .social-links a {
    color: var(--text-primary);
    text-decoration: none;
    padding: 0.5rem 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 6px;
    transition: all 0.2s;
  }

  .social-links a:hover {
    background: var(--accent);
    border-color: var(--accent);
  }

  .success-message {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 8px;
    margin-bottom: 2rem;
    color: rgb(34, 197, 94);
  }

  .success-message svg {
    flex-shrink: 0;
  }

  .success-message p {
    margin: 0;
    color: rgb(34, 197, 94);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input,
  textarea {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.75rem;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  input.error,
  textarea.error {
    border-color: #ef4444;
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .submit-btn {
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .submit-btn:hover {
    background: var(--accent-hover);
  }

  .form-note {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-top: 1rem;
    margin-bottom: 0;
  }

  @media (max-width: 968px) {
    .content-wrapper {
      grid-template-columns: 1fr;
    }

    .page-title {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 2rem 1rem;
    }

    .contact-info-section,
    .contact-form-section {
      padding: 1.5rem;
    }
  }
</style>
