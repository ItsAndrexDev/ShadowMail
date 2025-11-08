<script>
  let openIndex = null;

  function toggleFAQ(index) {
    openIndex = openIndex === index ? null : index;
  }

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click the 'Get Started' button and follow the simple registration process. No personal information is required - just choose a username and password.",
        },
        {
          q: "Is ShadowMail really free?",
          a: "Yes! ShadowMail is completely free! Unlimited Addresses, Unlimited Emails.",
        },
        {
          q: "What devices can I use ShadowMail on?",
          a: "ShadowMail works on any device with a web browser.",
        },
      ],
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "How does end-to-end encryption work?",
          a: "Your emails are encrypted on your device before being sent. Only the intended recipient can decrypt them. Even we cannot read your encrypted messages.",
        },
        {
          q: "Do you log my IP address?",
          a: "No. We do not log IP addresses or track your activity. Your privacy is protected by design.",
        },
        {
          q: "What data do you collect?",
          a: "We collect minimal data necessary for the service to function: your username, encrypted mailbox data, and payment information if you subscribe to a paid plan. We never sell or share your data.",
        },
        {
          q: "Can government agencies access my emails?",
          a: "Due to our zero-knowledge architecture and Swiss jurisdiction, we cannot provide access to your encrypted emails even if legally compelled. We have nothing to hand over.",
        },
      ],
    },
    {
      category: "Features",
      questions: [
        {
          q: "What is a self-destructing message?",
          a: "You can set an expiration time for your emails. After the specified period, the message is automatically and permanently deleted from both sender and recipient inboxes.",
        },
        {
          q: "Do you support email aliases?",
          a: "Soon! Create multiple email addresses that all forward to your main inbox. Perfect for compartmentalizing your online identity.",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          q: "What encryption standards do you use?",
          a: "We use AES-256 for symmetric encryption, RSA-4096 for asymmetric encryption, and SHA-512 for hashing. All industry-standard, military-grade encryption.",
        },
        {
          q: "What happens if I lose my password?",
          a: "Due to zero-knowledge encryption, we cannot reset your password. If you lose it, your encrypted data cannot be recovered. We recommend using a password manager.",
        },
      ],
    },
  ];
</script>

<main>
  <div class="page">
    <div class="container">
      <div class="hero-section">
        <h1 class="page-title">Frequently Asked Questions</h1>
        <p class="page-subtitle">
          Find answers to common questions about ShadowMail
        </p>
      </div>

      <div class="faq-container">
        {#each faqs as category, categoryIndex}
          <div class="faq-category">
            <h2 class="category-title">{category.category}</h2>
            <div class="faq-list">
              {#each category.questions as faq, questionIndex}
                {@const index = `${categoryIndex}-${questionIndex}`}
                <div class="faq-item" class:open={openIndex === index}>
                  <button
                    class="faq-question"
                    on:click={() => toggleFAQ(index)}
                  >
                    <span>{faq.q}</span>
                    <span class="faq-icon"
                      >{openIndex === index ? "−" : "+"}</span
                    >
                  </button>
                  {#if openIndex === index}
                    <div class="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="contact-section">
        <h2>Still have questions?</h2>
        <p>
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <button class="btn btn-primary" on:click={() => window.open("https://support.shadowmail.win")}>Contact Support</button>
      </div>
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 900px;
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
  }

  .faq-container {
    margin-bottom: 4rem;
  }

  .faq-category {
    margin-bottom: 3rem;
  }

  .category-title {
    font-size: 1.75rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--border);
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .faq-item {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .faq-item.open {
    border-color: var(--accent);
  }

  .faq-question {
    width: 100%;
    padding: 1.5rem;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 1.1rem;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
  }

  .faq-question:hover {
    color: var(--accent);
  }

  .faq-icon {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent);
    min-width: 30px;
    text-align: center;
  }

  .faq-answer {
    padding: 0 1.5rem 1.5rem;
    animation: slideDown 0.3s ease;
  }

  .faq-answer p {
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 1rem;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .contact-section {
    text-align: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 3rem;
  }

  .contact-section h2 {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .contact-section p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .category-title {
      font-size: 1.5rem;
    }

    .faq-question {
      font-size: 1rem;
      padding: 1.25rem;
    }
  }
</style>
