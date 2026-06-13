<script>
  import Account from "./lib/Account.svelte";
  import About from "./lib/Footer/Company/About.svelte";
  import Contact from "./lib/Footer/Company/Contact.svelte";
  import Gdpr from "./lib/Footer/Legal/Gdpr.svelte";
  import PrivacyPolicy from "./lib/Footer/Legal/PrivacyPolicy.svelte";
  import Tos from "./lib/Footer/Legal/Tos.svelte";
  import Faq from "./lib/Footer/Product/Faq.svelte";
  import Features from "./lib/Footer/Product/Features.svelte";
  import Security from "./lib/Footer/Product/Security.svelte";
  import Home from "./lib/Home.svelte";
  import Login from "./lib/Login.svelte";
  import Register from "./lib/Register.svelte";
  import { page, showPage, API } from "./stores/page";

  (async() => {
    const res = await fetch(API + "/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      credentials: "include", // ✅ important
    });
    if(res.ok) showPage('account')
  })()
</script>

<main>
  <nav>
    <div class="nav-container">
      <div class="brand">
        <img
          class="shadow-logo"
          src="logo.png"
          alt="ShadowMail Logo"
          on:click={() => showPage("home")}
        />
        <div class="logo" on:click={() => showPage("home")}>ShadowMail</div>
      </div>
      <div class="nav-buttons" id="navButtons">
        <button class="btn btn-secondary" on:click={() => showPage("login")}
          >Log In</button
        >
        <button class="btn btn-primary" on:click={() => showPage("register")}
          >Get Started</button
        >
      </div>
    </div>
  </nav>

  {#if $page === "home"}
    <Home />
  {:else if $page === "login"}
    <Login />
  {:else if $page === "register"}
    <Register />
  {:else if $page === "account"}
    <Account />
  {:else if $page === "about"}
    <About />
  {:else if $page === "contact"}
    <Contact />
  {:else if $page === "faq"}
    <Faq />
  {:else if $page === "gdpr"}
    <Gdpr />
  {:else if $page === "privacypolicy"}
    <PrivacyPolicy />
  {:else if $page === "tos"}
    <Tos />
  {:else if $page === "features"}
    <Features />
  {:else if $page === "security"}
    <Security />
  {/if}
</main>

<footer>
  <div class="footer-container">
    <div class="footer-content">
      <!-- Brand Section -->
      <div class="footer-section">
        <div class="footer-brand">
          <img class="footer-logo" src="logo.png" alt="ShadowMail Logo" />
          <div class="footer-brand-name">ShadowMail</div>
        </div>
        <p class="footer-tagline">
          Secure, anonymous email for everyone. Your privacy is our priority.
        </p>
      </div>

      <!-- Product Links -->
      <div class="footer-section">
        <h3 class="footer-heading">Product</h3>
        <ul class="footer-links">
          <li>
            <a href="#" on:click|preventDefault={() => showPage("features")}
              >Features</a
            >
          </li>
          <li>
            <a href="#" on:click|preventDefault={() => showPage("security")}
              >Security</a
            >
          </li>
          <li>
            <a href="#" on:click|preventDefault={() => showPage("faq")}>FAQ</a>
          </li>
        </ul>
      </div>

      <!-- Company Links -->
      <div class="footer-section">
        <h3 class="footer-heading">Company</h3>
        <ul class="footer-links">
          <li>
            <a href="#" on:click|preventDefault={() => showPage("about")}
              >About Us</a
            >
          </li>
          <li>
            <a href="#" on:click|preventDefault={() => showPage("contact")}
              >Contact</a
            >
          </li>
        </ul>
      </div>

      <!-- Legal Links -->
      <div class="footer-section">
        <h3 class="footer-heading">Legal</h3>
        <ul class="footer-links">
          <li>
            <a
              href="#"
              on:click|preventDefault={() => showPage("privacypolicy")}
              >Privacy Policy</a
            >
          </li>
          <li>
            <a href="#" on:click|preventDefault={() => showPage("tos")}
              >Terms of Service</a
            >
          </li>
          <li>
            <a href="#" on:click|preventDefault={() => showPage("gdpr")}>GDPR</a
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-copyright">
        © {new Date().getFullYear()} ShadowMail. All rights reserved.
      </div>
      <div class="footer-social">
        <a
          href="#"
          class="social-link"
          aria-label="GitHub"
          on:click={() =>
            window.open("https://github.com/ItsAndrexDev", "_blank")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
</style>
