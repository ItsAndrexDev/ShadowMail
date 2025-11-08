<script>
  import { showPage, API, showPopup } from "../stores/page";
  import { slots } from "../stores/page";
  let email = "";
  let password = "";
  async function handleLogin() {
    slots.set([]);
    const emailMatch = email.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    );
    if (!emailMatch) return showPopup("You must enter a valid email!");

    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ✅ important
    });

    if (!res.ok) {
      showPopup("Incorrect Credentials!");
      return;
    }

    showPopup("Successful Login!");

    // ✅ give browser a moment to apply Set-Cookie before new requests
    await new Promise((r) => setTimeout(r, 300));
    showPage("account");
  }
</script>

<main>
  <div id="login" class="page">
    <div class="auth-container">
      <div class="auth-box">
        <h2>Welcome Back</h2>
        <form on:submit|preventDefault>
          <div class="form-group">
            <label>Email Address</label>
            <input
              type="email"
              id="login-email"
              bind:value={email}
              required
              placeholder="your@email.com"
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              id="login-password"
              bind:value={password}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%;"
            on:click={() => handleLogin()}
          >
            Sign In
          </button>
        </form>
        <div class="auth-switch">
          Don't have an account?
          <a on:click={() => showPage("register")}>Create one</a>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .auth-container {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .auth-box {
    background: var(--bg-secondary);
    padding: 2.5rem;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    border: 1px solid var(--border);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }

  .auth-box h2 {
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .auth-switch {
    text-align: center;
    margin-top: 1.5rem;
    color: var(--text-secondary);
  }

  .auth-switch a {
    color: var(--accent);
    text-decoration: none;
    cursor: pointer;
  }

  .auth-switch a:hover {
    text-decoration: underline;
  }
</style>
