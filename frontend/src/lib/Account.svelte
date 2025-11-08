<script>
    // @ts-nocheck
    import { showPopup, API, currentAddress, slots } from "../stores/page";
    import EmailPreview from "./EmailPreview.svelte";
    import Inbox from "./Inbox.svelte";

    // reactive store subscriptions
    $: selectedAddress = $currentAddress;

    function createSlot(id, address, mails = []) {
        if ($slots.length >= 12) {
            showPopup("Maximum of 12 email slots reached!");
            return;
        }

        const newSlot = {
            id,
            email: address,
            emails: mails,
        };

        slots.set([...$slots, newSlot]);
        currentAddress.set(newSlot);
    }

    async function getExistingSlots() {
        const res = await fetch(API + "/get-addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            credentials: "include",
        });

        if (!res.ok) {
            if (res.status === 401)
                return showPopup("You're Unauthorized to do this.");
            return showPopup("Something went wrong.");
        }

        const json = await res.json();

        // Copy current slots into a map for easy updating
        const currentSlotsMap = new Map($slots.map((s) => [s.id, s]));
        slots.set([]);
        for (let address of json.addresses) {
            const content = await fetch(API + "/get-emails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: address.address }),
                credentials: "include",
            });

            let emails = [];
            if (content.ok && content.status !== 204) {
                const emailjson = await content.json();
                emails = emailjson.mails;
            }

            // Update existing slot or create new one
            if (currentSlotsMap.has(address.id)) {
                currentSlotsMap.get(address.id).emails = emails;
            } else {
                currentSlotsMap.set(address.id, {
                    id: address.id,
                    email: address.address,
                    emails,
                });
            }
        }

        // Convert map back to array and update store
        const newSlots = Array.from(currentSlotsMap.values());
        slots.set(newSlots);

        // Preserve selected address if it still exists
        const selected = newSlots.find(
            (s) => s.email === $currentAddress.email,
        );
        if (selected) {
            currentAddress.set(selected);
        } else if (newSlots.length > 0) {
            currentAddress.set(newSlots[0]);
        } else {
            currentAddress.set({ emails: [] });
        }
    }

    getExistingSlots();

    async function generateNewSlot() {
        const res = await fetch(API + "/new-address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            credentials: "include",
        });

        if (!res.ok) {
            if (res.status == 401)
                return showPopup("You're Unauthorized to do this");
            if (res.status == 429)
                return showPopup("Maximum amount of emails reached.");
            return showPopup("Something went wrong.");
        }

        const json = await res.json();
        createSlot(json.id, json.address);
    }

    async function deleteEmailSlot(address) {
        const res = await fetch(API + "/delete-address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
            credentials: "include",
        });

        if (res.ok) {
            // Remove deleted slot from slots array
            const newSlots = $slots.filter((s) => s.email !== address);
            slots.set(newSlots);

            // Update selected address if it was deleted
            if ($currentAddress.email === address) {
                currentAddress.set(newSlots[0] ?? { emails: [] });
            }
        } else if (res.status == 401) {
            showPopup("You're not authorized to perform this action.");
        } else if (res.status === 429) {
            showPopup("Invalid Address");
        } else {
            showPopup("Something went wrong.");
        }
    }

    async function copyAddress(address) {
        navigator.clipboard
            .writeText(address)
            .then(() => showPopup("Copied to clipboard!"))
            .catch((err) => {
                showPopup("Failed to copy!");
                console.error(err);
            });
    }
</script>

<main>
    <EmailPreview />
    <div id="account" class="page">
        <div class="account-container">
            <div class="account-header">
                <div
                    style="display: flex; justify-content: space-between; align-items: center;"
                >
                    <h2>Your ShadowMail Account</h2>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <button
                            class="btn btn-primary"
                            on:click={generateNewSlot}
                            >➕ Create New Email</button
                        >
                        <button
                            class="btn btn-secondary"
                            on:click={getExistingSlots}>Refresh All</button
                        >
                        <span
                            style="color: var(--text-secondary);"
                            id="slotCounter"
                        >
                            {$slots.length}/12 slots used
                        </span>
                    </div>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    Manage up to 12 temporary email addresses. No address will
                    self-delete.
                </p>

                <!-- Email Slots Grid -->
                <div class="email-slots-grid" id="emailSlotsGrid">
                    {#each $slots as slot (slot.id)}
                        <div
                            class="email-slot {slot.email ===
                            selectedAddress.email
                                ? 'active'
                                : ''}"
                            on:click={() => currentAddress.set(slot)}
                        >
                            <div class="email-slot-header">
                                <div class="email-slot-address">
                                    {slot.email}
                                </div>
                                <div class="email-slot-actions">
                                    <button
                                        on:click|stopPropagation={() =>
                                            copyAddress(slot.email)}
                                        class="slot-action-btn"
                                        title="Copy email">📋</button
                                    >
                                    <button
                                        on:click|stopPropagation={() =>
                                            deleteEmailSlot(slot.email)}
                                        class="slot-action-btn"
                                        title="Delete">🗑️</button
                                    >
                                </div>
                            </div>
                            <div class="email-slot-info">
                                <span class="email-count"
                                    >{slot.emails.length} emails</span
                                >
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="inbox-container">
                <Inbox />
            </div>
        </div>
    </div>
</main>

<style>
    .email-preview {
        background: var(--bg-secondary);
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        border: 1px solid var(--border);
    }
    .account-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 2rem;
    }

    .account-header {
        background: var(--bg-secondary);
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        border: 1px solid var(--border);
    }

    .email-display {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .email-address {
        font-size: 1.5rem;
        font-family: monospace;
        background: var(--bg-tertiary);
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border);
        flex: 1;
    }

    .copy-btn {
        padding: 0.75rem;
        background: var(--accent);
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .copy-btn:hover {
        background: var(--accent-hover);
    }

    .inbox-container {
        background: var(--bg-secondary);
        border-radius: 12px;
        border: 1px solid var(--border);
        overflow: hidden;
    }

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
        transition: background 0.3s ease;
    }

    .email-item:hover {
        background: var(--bg-tertiary);
    }

    .email-item.unread {
        border-left: 3px solid var(--accent);
    }

    .email-from {
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    .email-subject {
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
    }

    .email-time {
        color: var(--text-secondary);
        font-size: 0.85rem;
    }

    /* Email Preview */
    .email-preview-container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 0 2rem;
    }

    .email-preview {
        background: var(--bg-secondary);
        border-radius: 12px;
        border: 1px solid var(--border);
        overflow: hidden;
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
    }

    .email-preview-body {
        padding: 2rem;
        line-height: 1.8;
        color: var(--text-primary);
    }

    .email-actions {
        padding: 1.5rem 2rem;
        border-top: 1px solid var(--border);
        display: flex;
        gap: 1rem;
    }

    /* Loading animation */
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid var(--border);
        border-radius: 50%;
        border-top-color: var(--accent);
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Responsive */
    @media (max-width: 768px) {
        .hero h1 {
            font-size: 2.5rem;
        }

        .email-address {
            font-size: 1rem;
        }

        nav {
            padding: 1rem;
        }
    }

    /* Email Slots Grid */
    .email-slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.3rem;
        margin-bottom: 2rem;
    }

    .email-slot {
        background: var(--bg-secondary);
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }

    .email-slot:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
    }

    .email-slot.active {
        border-color: var(--accent);
        background: rgba(99, 102, 241, 0.1);
    }

    .email-slot.empty {
        border: 2px dashed var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 120px;
        cursor: pointer;
    }

    .email-slot.empty:hover {
        border-color: var(--accent);
        background: rgba(99, 102, 241, 0.05);
    }

    .email-slot-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .email-slot-address {
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--text-primary);
        word-break: break-all;
    }

    .email-slot-actions {
        display: flex;
        gap: 0.5rem;
    }

    .slot-action-btn {
        background: var(--bg-tertiary);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        border-radius: 6px;
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .slot-action-btn:hover {
        color: var(--text-primary);
        border-color: var(--text-secondary);
    }

    .email-slot-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-secondary);
        font-size: 0.85rem;
    }

    .email-count {
        background: var(--accent);
        color: white;
        border-radius: 12px;
        padding: 0.2rem 0.6rem;
        font-size: 0.8rem;
    }

    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
</style>
