<script>
    import {
        currentEmail,
        isPreviewActive,
        API,
        showPopup,
        currentAddress,
        slots,
    } from "../stores/page";

    $: selectedEmail = $currentEmail;
    $: previewActive = $isPreviewActive;
    $: selectedAddress = $currentAddress;

    // 🔒 Prevent background scrolling when modal is open
    $: {
        if (previewActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    async function refreshSelectedInbox() {
        if (!selectedAddress.email) return;
        const content = await fetch(API + "/get-emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: selectedAddress.email }),
            credentials: "include",
        });

        if (!content.ok) {
            if (content.status == 401)
                return showPopup("You're Unauthorized to do this!");
            if (content.status === 400)
                return showPopup("Must Specify address to read emails from!");
            if (content.status === 429)
                return showPopup("Invalid Email Format");
            return showPopup("Something went wrong.");
        }

        if (content.status === 204) {
            selectedAddress.emails = [];
            return;
        }

        const emailjson = await content.json();
        currentAddress.set({ ...selectedAddress, emails: emailjson.mails });
        slots.update((old) =>
            old.map((s) =>
                s.email === selectedAddress.email
                    ? { ...s, emails: emailjson.mails }
                    : s,
            ),
        );
        currentAddress.set({ ...selectedAddress, emails: emailjson.mails });
    }

    async function deleteEmail() {
        const res = await fetch(API + "/delete-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: selectedEmail.id }),
            credentials: "include",
        });

        if (!res.ok) {
            if (res.status === 401)
                return showPopup("You're Unauthorized to perform this action.");
            if (res.status === 400)
                return showPopup("You must specify an email to delete!");
        }
        isPreviewActive.set(false);
        currentEmail.set({
            id: 0,
            address_id: 0,
            sender: "",
            subject: "",
            body: "",
            created_at: "",
        });
        refreshSelectedInbox();
    }

    // 📏 Auto-resize iframe height
    let iframe;

    function resizeIframe() {
        if (!iframe) return;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
            iframe.style.height = doc.body.scrollHeight + "px";
        }
    }
</script>

<main>
    {#if previewActive}
        <div class="overlay" on:click={() => isPreviewActive.set(false)}>
            <div class="email-preview-container" on:click|stopPropagation>
                <!-- Top action bar -->
                <div class="top-action-bar">
                    <button
                        class="btn btn-secondary"
                        on:click={() => isPreviewActive.set(false)}
                    >
                        ← Back to Inbox
                    </button>
                    <button class="btn btn-danger" on:click={deleteEmail}>
                        Delete
                    </button>
                </div>

                <div class="email-preview">
                    <div class="email-preview-header">
                        <h1 class="email-preview-subject">
                            {selectedEmail.subject || "No Subject"}
                        </h1>
                        <div class="email-meta">
                            <div>
                                <strong>From:</strong>
                                {selectedEmail.sender}
                            </div>
                            <div>
                                <strong>To:</strong>
                                {String(selectedEmail.address_id) +
                                    "@shadowmail.win"}
                            </div>
                            <div>
                                <strong>Date:</strong>
                                {selectedEmail.created_at}
                            </div>
                        </div>
                    </div>

                    <div class="email-preview-body">
                        <iframe
                            bind:this={iframe}
                            on:load={resizeIframe}
                            srcdoc={`<!DOCTYPE html><html><head>
      <base target="_blank">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden; /* disable internal scroll */
          background: transparent;
          color: white;
          font-family: sans-serif;
        }
      </style>
    </head>
    <body>${selectedEmail.body}</body></html>`}
                            class="email-frame"
                            sandbox="allow-same-origin allow-popups"
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
</main>

<style>
    .top-action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .email-preview-container {
        background: var(--bg-secondary);
        border-radius: 12px;
        max-width: 900px;
        width: 90%;
        padding: 2rem;
        z-index: 10000;
        position: relative;
        overflow-y: auto;
        max-height: 90vh;
    }

    .email-preview {
        background: var(--bg-secondary);
        border-radius: 12px;
        border: 1px solid var(--border);
        overflow: hidden;
        z-index: 9999;
    }

    .email-preview-header {
        padding: 2rem;
        border-bottom: 1px solid var(--border);
    }

    .email-preview-subject {
        font-size: 1.75rem;
        margin-bottom: 1rem;
    }

    .email-meta {
        display: flex;
        gap: 2rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
        flex-wrap: wrap;
    }

    .email-preview-body {
        flex: 1;
        overflow-y: auto; /* ✅ only this scrolls */
        max-height: 70vh; /* adjust to your liking */
        padding: 1rem;
        border-top: 1px solid var(--border);
    }

    .email-frame {
        width: 100%;
        height: 100%;
        border: none;
        pointer-events: auto;
    }
</style>
