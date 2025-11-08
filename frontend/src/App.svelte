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
          >Sign In</button
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
            window.open("https://github.com/AndrewSimonDew", "_blank")}
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

        <a
          href="#"
          class="social-link"
          aria-label="Discord"
          on:click={() =>
            window.open("https://support.shadowmail.win", "_blank")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.8943 4.34399C17.5183 3.71467 16.057 3.256 14.5317 3C14.3396 3.33067 14.1263 3.77866 13.977 4.13067C12.3546 3.89599 10.7439 3.89599 9.14391 4.13067C8.99457 3.77866 8.77056 3.33067 8.58922 3C7.05325 3.256 5.59191 3.71467 4.22552 4.34399C1.46286 8.41865 0.716188 12.3973 1.08952 16.3226C2.92418 17.6559 4.69486 18.4666 6.4346 19C6.86126 18.424 7.24527 17.8053 7.57594 17.1546C6.9466 16.92 6.34927 16.632 5.77327 16.2906C5.9226 16.184 6.07194 16.0667 6.21061 15.9493C9.68793 17.5387 13.4543 17.5387 16.889 15.9493C17.0383 16.0667 17.177 16.184 17.3263 16.2906C16.7503 16.632 16.153 16.92 15.5236 17.1546C15.8543 17.8053 16.2383 18.424 16.665 19C18.4036 18.4666 20.185 17.6559 22.01 16.3226C22.4687 11.7787 21.2836 7.83202 18.8943 4.34399ZM8.05593 13.9013C7.01058 13.9013 6.15725 12.952 6.15725 11.7893C6.15725 10.6267 6.98925 9.67731 8.05593 9.67731C9.11191 9.67731 9.97588 10.6267 9.95454 11.7893C9.95454 12.952 9.11191 13.9013 8.05593 13.9013ZM15.065 13.9013C14.0196 13.9013 13.1652 12.952 13.1652 11.7893C13.1652 10.6267 13.9983 9.67731 15.065 9.67731C16.121 9.67731 16.985 10.6267 16.9636 11.7893C16.9636 12.952 16.1317 13.9013 15.065 13.9013Z" stroke="#000000" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
</style>
