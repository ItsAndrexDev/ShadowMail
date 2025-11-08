<script>
</script>

<div class="page">
  <div class="container">
    <div class="hero-section">
      <h1 class="page-title">Security & Privacy</h1>
      <p class="page-subtitle">Your privacy is our priority</p>
    </div>

    <div class="content">
      <div class="intro-section">
        <p>
          ShadowMail is built with security at its core. We provide temporary, disposable email addresses that protect your privacy without compromising functionality. All addresses are completely free to use.
        </p>
      </div>

      <div class="security-section">
        <h2>1. Zero-Knowledge Architecture</h2>
        <p>
          We don't know who you are, and we like it that way. ShadowMail operates on a zero-knowledge principle:
        </p>
        <ul>
          <li>No personal information required to create temporary addresses</li>
          <li>No tracking cookies or analytics</li>
          <li>No IP address logging</li>
          <li>No user profiling or behavioral analysis</li>
        </ul>
      </div>

      <div class="security-section">
        <h2>2. Temporary Address System</h2>
        <p>
          Create up to 12 temporary email addresses at any time. Each address is:
        </p>
        <ul>
          <li>Instantly generated without registration</li>
          <li>Active for your session or until you delete it</li>
          <li>Deletable at any time with one click</li>
          <li>Completely isolated from your other addresses</li>
        </ul>
      </div>

      <div class="security-section">
        <h2>3. Data Protection</h2>
        <h3>3.1 Email Storage</h3>
        <p>
          Your emails are stored temporarily and securely:
        </p>
        <ul>
          <li>Messages are encrypted at rest</li>
          <li>Automatic deletion after 7 days</li>
          <li>Immediate deletion when you remove an address</li>
          <li>No email content analysis or scanning</li>
        </ul>

        <h3>3.2 Infrastructure Security</h3>
        <p>
          Our infrastructure is designed for maximum security:
        </p>
        <ul>
          <li>End-to-end TLS encryption for all connections</li>
          <li>Secure servers in privacy-respecting jurisdictions</li>
          <li>Regular security audits and updates</li>
          <li>DDoS protection and rate limiting</li>
        </ul>
      </div>

      <div class="security-section">
        <h2>4. What We Don't Do</h2>
        <p>
          We believe privacy means restraint. Here's what we never do:
        </p>
        <ul>
          <li>Sell or share your data with third parties</li>
          <li>Use your emails for advertising or profiling</li>
          <li>Require phone numbers or personal identification</li>
          <li>Track your browsing or email reading habits</li>
          <li>Cooperate with mass surveillance programs</li>
        </ul>
      </div>

      <div class="security-section">
        <h2>5. Open Source Commitment</h2>
        <p>
          Transparency builds trust. Our codebase is:
        </p>
        <ul>
          <li>Fully open source under GPL v3 license</li>
          <li>Publicly auditable on GitHub</li>
          <li>Community-reviewed and tested</li>
          <li>Reproducible and self-hostable</li>
        </ul>
      </div>

      <div class="security-section">
        <h2>6. Best Practices</h2>
        <p>
          To maximize your security when using ShadowMail:
        </p>
        <ul>
          <li>Use different addresses for different services</li>
          <li>Delete addresses immediately after use</li>
          <li>Don't use temporary emails for sensitive accounts</li>
          <li>Access ShadowMail over HTTPS only</li>
          <li>Clear your browser cache after important sessions</li>
        </ul>
      </div>

      <div class="security-section">
        <h2>7. Reporting Security Issues</h2>
        <p>
          Found a security vulnerability? We take security seriously and appreciate responsible disclosure.
        </p>
        <p>
          Contact us at: <strong>security@shadowmail.com</strong>
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 900px;
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

  .content {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 3rem;
  }

  .intro-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .intro-section p {
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 1.1rem;
    margin: 0;
  }

  .security-section {
    margin-bottom: 3rem;
  }

  .security-section:last-child {
    margin-bottom: 0;
  }

  .security-section h2 {
    font-size: 1.75rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border);
  }

  .security-section h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .security-section p {
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  .security-section ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 1rem;
  }

  .security-section li {
    color: var(--text-secondary);
    line-height: 1.8;
    padding-left: 2rem;
    position: relative;
    margin-bottom: 0.5rem;
  }

  .security-section li::before {
    content: "✓";
    position: absolute;
    left: 0.5rem;
    color: var(--accent);
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .content {
      padding: 2rem 1.5rem;
    }

    .security-section h2 {
      font-size: 1.5rem;
    }
  }
</style>