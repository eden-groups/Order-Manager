// Web Component 1: <hamper-order-drawer>
// Collapsible mobile-friendly order form with animated gift-box add-on picker & Google Sheets submission
class HamperOrderDrawer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.selectedAddon = null; // 'wine' | 'cookies' | 'lights'
    this.lang = localStorage.getItem('hamper_lang') || 'en';
  }

  connectedCallback() {
    this.render();
  }

  get translations() {
    return (window.HAMPER_TRANSLATIONS && window.HAMPER_TRANSLATIONS[this.lang]) || {};
  }

  setLang(lang) {
    this.lang = lang;
    this.updateTexts();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.updateCollapseState();
  }

  close() {
    this.isOpen = false;
    this.updateCollapseState();
  }

  updateCollapseState() {
    const panel = this.shadowRoot.querySelector('.collapsible-panel');
    if (!panel) return;
    if (this.isOpen) {
      panel.classList.add('open');
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    } else {
      panel.classList.remove('open');
    }
  }

  getAddonSvg(type) {
    if (type === 'wine') {
      return `<svg viewBox="0 0 64 64" width="38" height="38">
        <rect x="26" y="6" width="12" height="10" rx="2" fill="#f4d06f"/>
        <path d="M26 16h12l4 12v28a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V28l4-12z" fill="#8b1e24" stroke="#f4d06f" stroke-width="2"/>
        <rect x="24" y="34" width="16" height="14" rx="2" fill="#fffdf9"/>
        <circle cx="32" cy="41" r="3" fill="#8b1e24"/>
      </svg>`;
    }
    if (type === 'cookies') {
      return `<svg viewBox="0 0 64 64" width="38" height="38">
        <circle cx="32" cy="34" r="20" fill="#d99b52" stroke="#f4d06f" stroke-width="2"/>
        <circle cx="25" cy="28" r="2.5" fill="#4a2c11"/>
        <circle cx="38" cy="26" r="2.5" fill="#4a2c11"/>
        <circle cx="32" cy="37" r="3" fill="#4a2c11"/>
        <circle cx="24" cy="42" r="2.2" fill="#4a2c11"/>
        <circle cx="41" cy="40" r="2.5" fill="#4a2c11"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 64 64" width="38" height="38">
      <path d="M10 22 Q32 34 54 20" fill="none" stroke="#8ad8a8" stroke-width="2.5"/>
      <ellipse cx="18" cy="27" rx="4" ry="6" fill="#ff5964"/>
      <ellipse cx="32" cy="31" rx="4" ry="6" fill="#f4d06f"/>
      <ellipse cx="46" cy="26" rx="4" ry="6" fill="#5ce1e6"/>
      <circle cx="18" cy="27" r="7" fill="#ff5964" opacity="0.25"/>
      <circle cx="32" cy="31" r="7" fill="#f4d06f" opacity="0.25"/>
      <circle cx="46" cy="26" r="7" fill="#5ce1e6" opacity="0.25"/>
    </svg>`;
  }

  selectAddon(type, btnEl) {
    this.selectedAddon = type;

    this.shadowRoot.querySelectorAll('.addon-card').forEach(c => c.classList.remove('selected'));
    btnEl.classList.add('selected');

    const stage = this.shadowRoot.querySelector('.picker-stage');
    const boxEl = this.shadowRoot.querySelector('.gift-box-target');
    const stageRect = stage.getBoundingClientRect();
    const btnRect = btnEl.getBoundingClientRect();
    const boxRect = boxEl.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'flying-item';
    flyer.innerHTML = this.getAddonSvg(type);

    const startX = btnRect.left - stageRect.left + btnRect.width / 2 - 19;
    const startY = btnRect.top - stageRect.top + 8;
    const endX = boxRect.left - stageRect.left + boxRect.width / 2 - 19;
    const endY = boxRect.top - stageRect.top + 14;

    flyer.style.setProperty('--start-x', `${startX}px`);
    flyer.style.setProperty('--start-y', `${startY}px`);
    flyer.style.setProperty('--end-x', `${endX}px`);
    flyer.style.setProperty('--end-y', `${endY}px`);

    stage.appendChild(flyer);

    setTimeout(() => {
      boxEl.classList.remove('bounce');
      void boxEl.offsetWidth;
      boxEl.classList.add('bounce');

      const insideSlot = this.shadowRoot.querySelector('.box-inside-item');
      insideSlot.innerHTML = this.getAddonSvg(type);
      insideSlot.classList.add('visible');
      this.updateTexts();
    }, 480);

    setTimeout(() => {
      flyer.remove();
    }, 620);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = this.shadowRoot.querySelector('.submit-btn');
    const t = this.translations;
    const sheetUrl = window.HAMPER_CONFIG && window.HAMPER_CONFIG.GOOGLE_SHEET_WEB_APP_URL;

    const customerName = form.customerName.value.trim();
    const whatsappNumber = form.whatsappNumber.value.trim();
    const deliveryAddress = form.deliveryAddress.value.trim();
    const landmark = form.landmark.value.trim();
    const deliveryContactPhone = form.deliveryContactPhone.value.trim();

    const hamperName = this.lang === 'ml'
      ? this.getAttribute('hamper-name-ml')
      : this.getAttribute('hamper-name-en');

    const addonLabel = this.selectedAddon
      ? t[`addon_${this.selectedAddon}`]
      : (this.lang === 'ml' ? 'ഒന്നും തിരഞ്ഞെടുത്തിട്ടില്ല' : 'None');

    const orderPayload = {
      timestamp: new Date().toISOString(),
      language: this.lang,
      hamperId: this.getAttribute('hamper-id'),
      hamperName: this.getAttribute('hamper-name-en'),
      basePrice: this.getAttribute('base-price'),
      selectedAddon: this.selectedAddon || 'None',
      customerName,
      whatsappNumber,
      deliveryAddress,
      landmark,
      deliveryContactPhone
    };

    submitBtn.disabled = true;
    submitBtn.textContent = t.submitting_btn;

    try {
      if (sheetUrl && sheetUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 600));
        console.info("Google Sheet Placeholder Mode - Order Payload:", orderPayload);
      }

      // Reset form & gift box state
      form.reset();
      this.selectedAddon = null;
      this.shadowRoot.querySelectorAll('.addon-card').forEach(c => c.classList.remove('selected'));
      const insideSlot = this.shadowRoot.querySelector('.box-inside-item');
      insideSlot.innerHTML = '';
      insideSlot.classList.remove('visible');
      this.updateTexts();
      this.close();

      // Dispatch custom event & open <order-success-modal>
      this.dispatchEvent(new CustomEvent('order-placed', {
        bubbles: true,
        composed: true,
        detail: { hamperName, addonLabel, whatsappNumber, orderPayload }
      }));

      const modal = document.querySelector('order-success-modal');
      if (modal && typeof modal.show === 'function') {
        modal.show({ hamperName, addonLabel, whatsappNumber });
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert(this.lang === 'ml'
        ? "ക്ഷമിക്കണം, ഓർഡർ സമർപ്പിക്കുന്നതിൽ പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക."
        : "Sorry, there was an error submitting your order. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = this.translations.submit_btn;
    }
  }

  updateTexts() {
    const t = this.translations;
    const root = this.shadowRoot;
    if (!root || !t.pick_addon_label) return;

    root.querySelector('[data-t="pick_addon_label"]').textContent = t.pick_addon_label;
    root.querySelector('[data-t="addon_wine"]').textContent = t.addon_wine;
    root.querySelector('[data-t="addon_cookies"]').textContent = t.addon_cookies;
    root.querySelector('[data-t="addon_lights"]').textContent = t.addon_lights;

    const boxStatus = root.querySelector('.box-status-text');
    if (this.selectedAddon) {
      boxStatus.textContent = `${t.box_status_filled} ${t['addon_' + this.selectedAddon]}`;
    } else {
      boxStatus.textContent = t.box_status_empty;
    }

    root.querySelector('[data-t="form_heading"]').textContent = t.form_heading;
    root.querySelector('[data-t="name_label"]').textContent = t.name_label;
    root.querySelector('input[name="customerName"]').placeholder = t.name_ph;
    root.querySelector('[data-t="wa_label"]').textContent = t.wa_label;
    root.querySelector('input[name="whatsappNumber"]').placeholder = t.wa_ph;
    root.querySelector('[data-t="addr_label"]').textContent = t.addr_label;
    root.querySelector('textarea[name="deliveryAddress"]').placeholder = t.addr_ph;
    root.querySelector('[data-t="landmark_label"]').textContent = t.landmark_label;
    root.querySelector('input[name="landmark"]').placeholder = t.landmark_ph;
    root.querySelector('[data-t="contact_label"]').textContent = t.contact_label;
    root.querySelector('input[name="deliveryContactPhone"]').placeholder = t.contact_ph;
    root.querySelector('.submit-btn').textContent = t.submit_btn;
  }

  render() {
    const t = this.translations;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          text-align: left;
          font-family: 'Segoe UI', 'Noto Sans Malayalam', sans-serif;
        }

        .collapsible-panel {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease, margin-top 0.35s ease;
          margin-top: 0;
        }

        .collapsible-panel.open {
          max-height: 1250px;
          opacity: 1;
          margin-top: 18px;
        }

        .inner-box {
          background: rgba(9, 33, 22, 0.85);
          border: 1px solid rgba(244, 208, 111, 0.35);
          border-radius: 16px;
          padding: 18px 14px;
          color: #fffdf9;
        }

        .picker-stage {
          position: relative;
          background: rgba(255, 255, 255, 0.04);
          border: 1px dashed rgba(244, 208, 111, 0.35);
          border-radius: 14px;
          padding: 14px 10px;
          margin-bottom: 18px;
          text-align: center;
        }

        .picker-label {
          font-size: 0.85rem;
          color: #f4d06f;
          font-weight: 600;
          margin-bottom: 12px;
          display: block;
          line-height: 1.4;
        }

        .addon-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .addon-card {
          background: rgba(255, 255, 255, 0.07);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 10px 4px;
          color: #fffdf9;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 600;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .addon-card:active {
          transform: scale(0.95);
        }

        .addon-card.selected {
          border-color: #f4d06f;
          background: rgba(244, 208, 111, 0.18);
          box-shadow: 0 0 12px rgba(244, 208, 111, 0.25);
        }

        .gift-box-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 4px;
        }

        .gift-box-target {
          position: relative;
          width: 84px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gift-box-target.bounce {
          animation: boxSquash 0.45s ease;
        }

        .gift-box-target.bounce .box-lid {
          animation: lidPop 0.45s ease;
        }

        .box-inside-item {
          position: absolute;
          top: 6px;
          z-index: 1;
          opacity: 0;
          transform: scale(0.5);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .box-inside-item.visible {
          opacity: 1;
          transform: scale(0.85);
        }

        .box-status-text {
          font-size: 0.8rem;
          color: #d6e4dd;
          margin-top: 6px;
          font-weight: 600;
        }

        .flying-item {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 20;
          pointer-events: none;
          animation: jumpIntoBox 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes jumpIntoBox {
          0% {
            transform: translate(var(--start-x), var(--start-y)) scale(1) rotate(0deg);
            opacity: 1;
          }
          45% {
            transform: translate(calc((var(--start-x) + var(--end-x)) / 2), calc(var(--start-y) - 42px)) scale(1.25) rotate(12deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.65) rotate(0deg);
            opacity: 0.2;
          }
        }

        @keyframes lidPop {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          40% { transform: translateY(-12px) rotate(-8deg); }
        }

        @keyframes boxSquash {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.12, 0.9); }
        }

        .form-title {
          font-size: 1rem;
          color: #f4d06f;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(244, 208, 111, 0.2);
          padding-bottom: 6px;
        }

        .field {
          margin-bottom: 12px;
        }

        label {
          display: block;
          font-size: 0.82rem;
          color: #e0ece6;
          margin-bottom: 4px;
          font-weight: 600;
        }

        input, textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(244, 208, 111, 0.28);
          border-radius: 10px;
          padding: 10px 12px;
          color: #fffdf9;
          font-family: inherit;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        input::placeholder, textarea::placeholder {
          color: rgba(214, 228, 221, 0.5);
        }

        input:focus, textarea:focus {
          border-color: #f4d06f;
          background: rgba(255, 255, 255, 0.12);
        }

        textarea {
          resize: vertical;
          min-height: 64px;
        }

        .submit-btn {
          width: 100%;
          background: #f4d06f;
          color: #0b2e1e;
          font-weight: 700;
          font-family: inherit;
          font-size: 0.98rem;
          padding: 13px;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          margin-top: 6px;
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #ffe08a;
        }

        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
      </style>

      <div class="collapsible-panel">
        <div class="inner-box">
          <div class="picker-stage">
            <span class="picker-label" data-t="pick_addon_label">${t.pick_addon_label}</span>

            <div class="addon-options">
              <button type="button" class="addon-card" data-addon="wine">
                ${this.getAddonSvg('wine')}
                <span data-t="addon_wine">${t.addon_wine}</span>
              </button>
              <button type="button" class="addon-card" data-addon="cookies">
                ${this.getAddonSvg('cookies')}
                <span data-t="addon_cookies">${t.addon_cookies}</span>
              </button>
              <button type="button" class="addon-card" data-addon="lights">
                ${this.getAddonSvg('lights')}
                <span data-t="addon_lights">${t.addon_lights}</span>
              </button>
            </div>

            <div class="gift-box-wrapper">
              <div class="gift-box-target">
                <div class="box-inside-item"></div>
                <svg viewBox="0 0 80 72" width="76" height="68" style="position:relative; z-index:2;">
                  <rect x="14" y="28" width="52" height="38" rx="4" fill="#8b1e24" stroke="#f4d06f" stroke-width="2"/>
                  <rect x="36" y="28" width="8" height="38" fill="#f4d06f"/>
                  <g class="box-lid">
                    <rect x="10" y="20" width="60" height="10" rx="3" fill="#a8242b" stroke="#f4d06f" stroke-width="2"/>
                    <rect x="36" y="20" width="8" height="10" fill="#f4d06f"/>
                    <path d="M40 20 C30 8, 22 14, 34 20 Z" fill="#f4d06f"/>
                    <path d="M40 20 C50 8, 58 14, 46 20 Z" fill="#f4d06f"/>
                  </g>
                </svg>
              </div>
              <div class="box-status-text">${t.box_status_empty}</div>
            </div>
          </div>

          <form class="order-form">
            <div class="form-title" data-t="form_heading">${t.form_heading}</div>

            <div class="field">
              <label data-t="name_label">${t.name_label}</label>
              <input type="text" name="customerName" required placeholder="${t.name_ph}" />
            </div>

            <div class="field">
              <label data-t="wa_label">${t.wa_label}</label>
              <input type="tel" name="whatsappNumber" required placeholder="${t.wa_ph}" />
            </div>

            <div class="field">
              <label data-t="addr_label">${t.addr_label}</label>
              <textarea name="deliveryAddress" required placeholder="${t.addr_ph}"></textarea>
            </div>

            <div class="field">
              <label data-t="landmark_label">${t.landmark_label}</label>
              <input type="text" name="landmark" required placeholder="${t.landmark_ph}" />
            </div>

            <div class="field">
              <label data-t="contact_label">${t.contact_label}</label>
              <input type="tel" name="deliveryContactPhone" required placeholder="${t.contact_ph}" />
            </div>

            <button type="submit" class="submit-btn">${t.submit_btn}</button>
          </form>
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('.addon-card').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectAddon(btn.getAttribute('data-addon'), btn);
      });
    });

    this.shadowRoot.querySelector('.order-form').addEventListener('submit', (e) => this.handleSubmit(e));
  }
}

customElements.define('hamper-order-drawer', HamperOrderDrawer);