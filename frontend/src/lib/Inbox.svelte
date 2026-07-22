<script>
  import {
    API,
    showPopup,
    currentAddress,
    currentEmail,
    isPreviewActive,
    slots,
  } from "../stores/page";

  $: selectedAddress = $currentAddress;
  $: previewActive = $isPreviewActive;
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
      if (content.status === 429) return showPopup("Invalid Email Format");
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

  async function clearSelectedInbox() {
    if (!selectedAddress.email) return;
    for (let email of selectedAddress.emails) {
      const res = await fetch(API + "/delete-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.id }),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401)
          return showPopup("You're Unauthorized to perform this action.");
        if (res.status === 400)
          return showPopup("You must specify an email to delete!");
      }
    }
    await refreshSelectedInbox();
  }

  async function deleteEmail(emailId) {
    const res = await fetch(API + "/delete-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailId }),
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

  async function switchPreview(email) {
    currentEmail.set(email);
    isPreviewActive.set(!previewActive);
  }
</script>

<main>
  <div class="inbox-header">
    <div>
      <h3 id="selectedEmailAddress">
        {selectedAddress.email ?? "No Email selected📫"}
      </h3>
      <div class="email-time">Each email will self-delete in 10 days.</div>
    </div>
    <div style="display: flex; gap: 1rem; align-items: center;">
      <button class="btn btn-danger btn-sm" on:click={clearSelectedInbox}
        >Clear All</button
      >
    </div>
  </div>

  <div class="email-list">
    {#each selectedAddress.emails as email}
      <div class="email-row">
        <div class="email-item" on:click={() => switchPreview(email)}>
          <div class="email-subject">{email.subject}</div>
          <div class="email-from">{email.sender}</div>
        </div>

        <button
          class="delete-btn"
          on:click|stopPropagation={() => deleteEmail(email.id)}
          title="Delete email"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            enable-background="new 0 0 32 32"
            version="1.1"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M28,5h-5V4c0-1.7-1.3-3-3-3h-4h-4c-1.7,0-3,1.3-3,3v1H4C3.5,5,3,5.5,3,6s0.5,1,1,1h1v19c0,2.8,2.2,5,5,5h6   h6c2.8,0,5-2.2,5-5V7h1c0.5,0,1-0.5,1-1S28.5,5,28,5z"
              fill="#ef4444"
            />
            <path
              d="M12,11.1c-0.5,0-1,0.5-1,1v12c0,0.6,0.5,1,1,1s1-0.4,1-1v-12C13,11.6,12.5,11.1,12,11.1z"
              fill="#1a1a1a"
            />
            <path
              d="M20,11.1c-0.5,0-1,0.5-1,1v12c0,0.6,0.5,1,1,1s1-0.4,1-1v-12C21,11.6,20.5,11.1,20,11.1z"
              fill="#1a1a1a"
            />
            <path
              d="M28,5h-5V4c0-1.7-1.3-3-3-3h-4h-4c-1.7,0-3,1.3-3,3v1H4C3.5,5,3,5.5,3,6s0.5,1,1,1h12h12c0.5,0,1-0.5,1-1    S28.5,5,28,5z"
              fill="#1a1a1a"
            />
          </svg>
        </button>
      </div>
    {/each}

    {#if !selectedAddress.emails.length}
      <div
        style="padding: 3rem; text-align: center; color: var(--text-secondary);"
      >
        📫 Send an email! Don't be scared!
      </div>
    {/if}
  </div>
</main>
<style>
  .inbox-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .email-list {
    max-height: 500px;
    overflow-y: auto;
  }

  .email-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    transition: 0.3s ease;
  }

  .email-row:hover {
    background: var(--bg-tertiary);
  }

  .email-item {
    padding: 1.5rem;
    cursor: pointer;
    flex: 1;
    border-bottom: none;
  }

  .delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 1rem;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    opacity: 0.75;
  }

  .delete-btn:hover {
    opacity: 1;
    transform: scale(1.1);
    background: rgba(239, 68, 64, 0.1);
    box-shadow: 0 0 12px rgba(239, 68, 64, 0.4);
  }

  .email-subject {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .email-from {
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }

  .email-time {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
</style>