// Web Component: <hamper-whatsapp-card>
// Displays WhatsApp contact number, quick chat button, and scannable QR code
class HamperWhatsappCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.lang = localStorage.getItem("hamper_lang") || "en";
  }

  connectedCallback() {
    this.render();
  }

  get translations() {
    return (
      (window.HAMPER_TRANSLATIONS && window.HAMPER_TRANSLATIONS[this.lang]) ||
      {}
    );
  }

  get phoneDisplay() {
    return this.getAttribute("phone") || "+91 95675 04296";
  }

  get waNumberClean() {
    return this.phoneDisplay.replace(/[^0-9]/g, "");
  }

  setLang(lang) {
    this.lang = lang;
    this.updateTexts();
  }

  updateTexts() {
    const t = this.translations;
    const root = this.shadowRoot;
    if (!root || !t.wa_card_title) return;

    root.querySelector('[data-t="wa_card_title"]').textContent =
      t.wa_card_title;
    root.querySelector('[data-t="wa_card_desc"]').textContent = t.wa_card_desc;
    root.querySelector('[data-t="wa_card_btn"]').textContent = t.wa_card_btn;
    root.querySelector('[data-t="wa_qr_caption"]').textContent =
      t.wa_qr_caption;
  }

  render() {
    const t = this.translations;
    const waLink = `https://wa.me/${this.waNumberClean}?text=${encodeURIComponent(
      "Hi! I would like to enquire / order a Christmas Hamper.",
    )}`;
    const qrSrc = this.getAttribute("qr-src") || "whatsapp-qr.jpeg";
    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
        }

        :host {
        display: block;
        width: 100%;
        max-width: 780px;
        margin: 56px auto 0;
        font-family: 'Segoe UI', 'Noto Sans Malayalam', sans-serif;
        }

        .wa-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(244, 208, 111, 0.08));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(244, 208, 111, 0.42);
          border-radius: 20px;
          padding: 22px 24px;
          text-align: left;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.25);
        }

        .wa-info {
          flex: 1;
        }

        .wa-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f4d06f;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .wa-desc {
          font-size: 0.94rem;
          color: #e0ece6;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .wa-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .wa-number-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(9, 33, 22, 0.75);
          border: 1px solid rgba(244, 208, 111, 0.35);
          color: #fffdf9;
          padding: 9px 15px;
          border-radius: 999px;
          font-size: 0.94rem;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .wa-chat-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #25d366;
          color: #072414;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 10px 18px;
          border-radius: 999px;
          transition: transform 0.2s ease, filter 0.2s ease;
        }

        .wa-chat-btn:hover {
          transform: scale(1.03);
          filter: brightness(1.06);
        }

        .qr-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #fffdf9;
          padding: 10px;
          border-radius: 14px;
          border: 2px solid #f4d06f;
          flex-shrink: 0;
        }

        .qr-panel img {
          width: 112px;
          height: 112px;
          display: block;
          border-radius: 6px;
        }

        .qr-caption {
          font-size: 0.72rem;
          font-weight: 700;
          color: #0b2e1e;
          margin-top: 6px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .wa-box {
            flex-direction: column;
            text-align: center;
          }
          .wa-actions {
            justify-content: center;
          }
        }
      </style>

      <div class="wa-box">
        <div class="wa-info">
          <div class="wa-title" data-t="wa_card_title">${t.wa_card_title || ""}</div>
          <p class="wa-desc" data-t="wa_card_desc">${t.wa_card_desc || ""}</p>
          <div class="wa-actions">
            <span class="wa-number-pill">📱 ${this.phoneDisplay}</span>
            <a class="wa-chat-btn" href="${waLink}" target="_blank" rel="noopener noreferrer" data-t="wa_card_btn">
              ${t.wa_card_btn || "Order on WhatsApp"}
            </a>
          </div>
        </div>
        <div class="qr-panel">
          <img src="${qrSrc}" alt="Scan WhatsApp QR Code" />
          <span class="qr-caption" data-t="wa_qr_caption">${t.wa_qr_caption || "Scan to Chat"}</span>
        </div>
      </div>
    `;
  }
}

customElements.define("hamper-whatsapp-card", HamperWhatsappCard);
