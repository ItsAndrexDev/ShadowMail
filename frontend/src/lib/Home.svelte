<script>
    import { showPage } from "../stores/page";
</script>

<main>
<div id="home" class="page">
    <div class="hero">
        <div class="hero-content">
            <h1>Secure Temporary Email</h1>
            <p>
                Protect your privacy with disposable email addresses. No
                registration required, instant activation, complete anonymity.
            </p>
            <button
                class="btn btn-primary"
                style="font-size: 1.1rem; padding: 1rem 2rem;"
                on:click={() => showPage("register")}
            >
                Create Your ShadowMail Account
            </button>
            <button
                class="btn btn-secondary"
                style="font-size: 1.1rem; padding: 1rem 3rem; margin-top: 3%;"
                on:click={() => showPage("login")}
                >Sign in to account</button
            >

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure</h3>
                    <p>Protect yourself against spammers, hackers</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <h3>Fast, Reactive site</h3>
                    <p>ShadowMail delivers great user experience</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎭</div>
                    <h3>Anonymous</h3>
                    <p>No personal data required</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">♻️</div>
                    <h3>Multi Account</h3>
                    <p>
                        Have access to a maximum of 12 mails at all times with an
                        account
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
</main>


<style>
    .hero {
        min-height: calc(100vh - 70px);
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(99, 102, 241, 0.1) 0%,
            transparent 50%
        );
    }

    .hero-content {
        text-align: center;
        max-width: 600px;
        padding: 2rem;
    }

    .hero h1 {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #fff, #a0a0a0);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero p {
        font-size: 1.25rem;
        color: var(--text-secondary);
        margin-bottom: 2rem;
        line-height: 1.6;
    }

    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-top: 4rem;
    }

    .feature {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border);
        transition:
            transform 0.3s ease,
            border-color 0.3s ease;
    }

    .feature:hover {
        transform: translateY(-5px);
        border-color: var(--accent);
    }

    .feature-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
</style>
