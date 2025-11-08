<script>
    import { showPage, showPopup, API } from "../stores/page";
    let email = "";
    let password = "";
    let passowrdConfirm = "";
    async function handleRegister() {
        if (password != passowrdConfirm) return showPopup("Passwords do not match!");

        const emailMatch = email.match(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        ); // regex email verification
        if (!emailMatch) return showPopup("You must enter a valid email!");
        const passwordMatch = password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/);
        if (!passwordMatch)
            return showPopup(
                "Your password must be at least 8-16 characters,\n Have lowercase, uppercase letters,\nInclude numbers,special characters!",
                5
            );

        const res = await fetch(API + "/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
        if (!res.ok) {
            const err = await res.json();
            showPopup("Email already in use!");
            return;
        }

        showPopup("Successfull Registration!");
        showPage("login");
    }
</script>

<main>
    <div id="register" class="page">
        <div class="auth-container">
            <div class="auth-box">
                <h2>Create Account</h2>
                <form on:submit|preventDefault>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            id="register-email"
                            bind:value={email}
                            required
                            placeholder="your@email.com"
                        />
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            id="register-password"
                            bind:value={password}
                            required
                            placeholder="Create a strong password"
                        />
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            id="register-password-confirm"
                            bind:value={passowrdConfirm}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        on:click={() => handleRegister()}
                        style="width: 100%;">Create Account</button
                    >
                </form>
                <div class="auth-switch">
                    Already have an account? <a
                        on:click={() => showPage("login")}>Sign in</a
                    >
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
