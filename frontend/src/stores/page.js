import { writable } from "svelte/store";

export const page = writable("home");
export const API = "/api";
export let currentAddress = writable({ emails: [], email: "", });
export let slots = writable([]);
export let currentEmail = writable({id: 0, address_id: 0, sender: "", subject: "",body: "", created_at: ""});
export let isPreviewActive = writable(false);
export function showPage(toShow) {
  page.set(toShow);
}

export function showPopup(message,duration=2.5) {
    // Create popup div
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '15%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#7c7fff';
    popup.style.color = '#fff';
    popup.style.padding = '1rem 2rem';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    popup.style.zIndex = "9999";

    // Add popup to body
    document.body.appendChild(popup);

    // Remove after 2.5 seconds
    setTimeout(() => {
        popup.remove();
    }, duration*1000);
}