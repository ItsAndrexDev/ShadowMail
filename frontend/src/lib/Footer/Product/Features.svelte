<script>

</script>

<main>
<div class="page">
  <div class="container">
    <div class="hero-section">
      <h1 class="page-title">Powerful Features for Complete Privacy</h1>
      <p class="page-subtitle">
        Everything you need to keep your communications secure and anonymous
      </p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>End-to-End Encryption</h3>
        <p>
          Your emails are encrypted on your device and can only be decrypted by
          the intended recipient. Not even we can read your messages.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">👤</div>
        <h3>Anonymous Accounts</h3>
        <p>
          No personal information required. Create accounts with just an email
          without any identifying data.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🌐</div>
        <h3>Tor Integration</h3>
        <p>
          Built-in Tor support ensures your IP address and location remain
          hidden, providing an additional layer of anonymity.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">⏱️</div>
        <h3>Self-Destructing Messages</h3>
        <p>
          Every email ever recieved self-deletes after 10 days, ensuring your data remains safe.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🛡️</div>
        <h3>Zero-Knowledge Architecture</h3>
        <p>
          We can't access your data even if we wanted to. Your privacy is
          protected by design, not just policy.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>Cross-Platform Access</h3>
        <p>
          Access your secure email from any device - web, mobile, or desktop.
          Your privacy goes wherever you go.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>No Tracking</h3>
        <p>
          We don't track your activity, log your IP address, or collect
          analytics. Your usage patterns stay private.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">💾</div>
        <h3>Secure Storage</h3>
        <p>
          All stored data is encrypted at rest. Your emails remain protected
          even if our servers were compromised.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🔑</div>
        <h3>Military Grade Encryption</h3>
        <p>
          We use AES-256 for symmetric encryption, RSA-4096 for asymmetric encryption, and SHA-512 for hashing. All industry-standard, military-grade encryption.
        </p>
      </div>
    </div>
  </div>
</div>
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 4rem;
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
    font-size: 1.25rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2rem;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }

  .feature-card p {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style>