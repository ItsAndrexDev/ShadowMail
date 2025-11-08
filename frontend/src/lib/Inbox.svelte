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
    $: selectedEmail = $currentEmail;
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
                    return showPopup(
                        "You're Unauthorized to perform this action.",
                    );
                if (res.status === 400)
                    return showPopup("You must specify an email to delete!");
            }
        }
        await refreshSelectedInbox();
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
            <div class="email-time">
                Each email will self-delete in 10 days.
            </div>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
            <button
                class="btn btn-primary btn-sm"
                on:click={refreshSelectedInbox}>↻ Refresh</button
            >
            <button class="btn btn-danger btn-sm" on:click={clearSelectedInbox}
                >Clear All</button
            >
        </div>
    </div>

    <div class="email-list">
        {#each selectedAddress.emails as email}
            <div class="email-item" on:click={() => switchPreview(email)}>
                <div class="email-subject">{email.subject}</div>
                <div class="email-from">{email.sender}</div>
            </div>
        {/each}

        {#if !selectedAddress.emails.length}
            <div
                style="padding: 3rem; text-align: center; color: var(--text-secondary);"
            >
                📫 Select an email slot to view its inbox
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

    .email-item {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
        transition: 0.3s ease;
    }

    .email-item:hover {
        background: var(--bg-tertiary);
    }

    .email-item.unread {
        border-left: 3px solid var(--accent);
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
