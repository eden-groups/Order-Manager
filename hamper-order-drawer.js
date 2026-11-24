class HamperOrderDrawer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.lang = localStorage.getItem('hamper_lang') || 'en';
  }

  connectedCallback() {
    this.render();
  }

  get translations() {
    return (window.HAMPER_TRANSLATIONS && window.HAMPER_TRANSLATIONS[this.lang]) || {};
  }

  get dailyLimit() {
    return (window.HAMPER_CONFIG && window.HAMPER_CONFIG.DAILY_ORDER_LIMIT) || 100;
  }

  setLang(lang) {
    this.lang = lang;
    this.updateTexts();
    this.shadowRoot.querySelectorAll('hamper-cookie-box, hamper-photo-picker').forEach((el) => {
      if (typeof el.setLang === 'function') el.setLang(lang);
    });
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
    const boxComp = this.shadowRoot.querySelector('hamper-cookie-box');
    if (!panel) return;

    if (this.isOpen) {
      panel.classList.add('open');
      if (boxComp && typeof boxComp.playDropAndClose === 'function') {
        setTimeout(() => boxComp.playDropAndClose(), 120);
      }
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 160);
    } else {
      panel.classList.remove('open');
      if (boxComp && typeof boxComp.resetBox === 'function') {
        boxComp.resetBox();
      }
    }
  }

  showLimitError_(msg) {
    const errEl = this.shadowRoot.querySelector('.limit-error');
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }

  clearLimitError_() {
    const errEl = this.shadowRoot.querySelector('.limit-error');
    if (!errEl) return;
    errEl.textContent = '';
    errEl.style.display = 'none';
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = this.shadowRoot.querySelector('.submit-btn');
    const photoPicker = this.shadowRoot.querySelector('hamper-photo-picker');
    const t = this.translations;
    const sheetUrl = window.HAMPER_CONFIG && window.HAMPER_CONFIG.GOOGLE_SHEET_WEB_APP_URL;

    this.clearLimitError_();

    if (photoPicker && typeof photoPicker.validateSize === 'function') {
      const check = photoPicker.validateSize();
      if (!check.valid) {
        this.showLimitError_(check.message);
        return;
      }
    }

    const customerName = form.customerName.value.trim();
    const whatsappNumber = form.whatsappNumber.value.trim();
    const deliveryAddress = form.deliveryAddress.value.trim();
    const landmark = form.landmark.value.trim();
    const deliveryContactPhone = form.deliveryContactPhone.value.trim();
    const customerNote = form.customerNote ? form.customerNote.value.trim() : '';

    submitBtn.disabled = true;
    submitBtn.textContent = t.submitting_btn;

    try {
      if (sheetUrl && sheetUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        const count = window.HamperMediaUtils
          ? await window.HamperMediaUtils.fetchTodayOrderCount(sheetUrl)
          : 0;
        if (count >= this.dailyLimit) {
          this.showLimitError_(t.daily_limit_error);
          return;
        }
      }

      const hamperId = this.getAttribute('hamper-id') || 'hamper';
      const photoData = photoPicker && typeof photoPicker.getCompressedPhoto === 'function'
        ? await photoPicker.getCompressedPhoto(hamperId)
        : { greetingPhotoBase64: '', greetingPhotoName: '', greetingPhotoMimeType: '' };

      const hamperName = this.lang === 'ml'
        ? this.getAttribute('hamper-name-ml')
        : this.getAttribute('hamper-name-en');

      const addonLabel = this.lang === 'ml' ? 'ബട്ടർ കുക്കീസ് (സൗജന്യം)' : 'Butter Cookies (Free)';

      const orderPayload = {
        timestamp: new Date().toISOString(),
        language: this.lang,
        hamperId,
        hamperName: this.getAttribute('hamper-name-en'),
        basePrice: this.getAttribute('base-price'),
        selectedAddon: 'cookies',
        complimentaryItem: 'Butter Cookies',
        cardThemeFallback: photoData.greetingPhotoBase64 ? 'Uploaded Photo' : 'Christmas Theme',
        customerNote,
        customerName,
        whatsappNumber,
        deliveryAddress,
        landmark,
        deliveryContactPhone,
        ...photoData
      };

      if (sheetUrl && sheetUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        console.info('Google Sheet Placeholder Mode - Order Payload:', orderPayload);
      }

      form.reset();
      if (photoPicker && typeof photoPicker.reset === 'function') {
        photoPicker.reset();
      }

      this.updateTexts();
      this.close();

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
      console.error('Order submission error:', err);
      alert(this.lang === 'ml'
        ? 'ക്ഷമിക്കണം, ഓർഡർ സമർപ്പിക്കുന്നതിൽ പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.'
        : 'Sorry, there was an error submitting your order. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = this.translations.submit_btn;
    }
  }

  updateTexts() {
    const t = this.translations;
    const root = this.shadowRoot;
    if (!root || !t.form_heading) return;

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
    root.querySelector('[data-t="note_label"]').textContent = t.note_label;
    root.querySelector('textarea[name="customerNote"]').placeholder = t.note_ph;
    root.querySelector('.submit-btn').textContent = t.submit_btn;
  }

  render() {
    const t = this.translations;
    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
        }

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
          transition: max-height 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease, margin-top 0.35s ease;
          margin-top: 0;
        }

        .collapsible-panel.open {
          max-height: 1750px;
          opacity: 1;
          margin-top: 18px;
        }

        .inner-box {
          width: 100%;
          background: rgba(9, 33, 22, 0.88);
          border: 1px solid rgba(244, 208, 111, 0.35);
          border-radius: 16px;
          padding: 18px 14px;
          color: #fffdf9;
        }

        .form-title {
          font-size: 1rem;
          color: #f4d06f;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(244, 208, 111, 0.2);
          padding-bottom: 6px;
        }

        .field {
          width: 100%;
          margin-bottom: 12px;
        }

        label.field-label {
          display: block;
          font-size: 0.82rem;
          color: #e0ece6;
          margin-bottom: 5px;
          font-weight: 600;
        }

        input, textarea {
          display: block;
          width: 100%;
          max-width: 100%;
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

        .limit-error {
          display: none;
          background: rgba(255, 89, 100, 0.16);
          border: 1px solid #ff5964;
          color: #ffd6da;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 0.86rem;
          font-weight: 600;
          margin-bottom: 10px;
          text-align: center;
          line-height: 1.45;
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
          <hamper-cookie-box></hamper-cookie-box>

          <form class="order-form">
            <div class="form-title" data-t="form_heading">${t.form_heading}</div>

            <div class="field">
              <label class="field-label" data-t="name_label">${t.name_label}</label>
              <input type="text" name="customerName" required placeholder="${t.name_ph}" />
            </div>

            <div class="field">
              <label class="field-label" data-t="wa_label">${t.wa_label}</label>
              <input type="tel" name="whatsappNumber" required placeholder="${t.wa_ph}" />
            </div>

            <div class="field">
              <label class="field-label" data-t="addr_label">${t.addr_label}</label>
              <textarea name="deliveryAddress" required placeholder="${t.addr_ph}"></textarea>
            </div>

            <div class="field">
              <label class="field-label" data-t="landmark_label">${t.landmark_label}</label>
              <input type="text" name="landmark" required placeholder="${t.landmark_ph}" />
            </div>

            <div class="field">
              <label class="field-label" data-t="contact_label">${t.contact_label}</label>
              <input type="tel" name="deliveryContactPhone" required placeholder="${t.contact_ph}" />
            </div>

            <div class="field">
              <hamper-photo-picker></hamper-photo-picker>
            </div>

            <div class="field">
              <label class="field-label" data-t="note_label">${t.note_label}</label>
              <textarea name="customerNote" placeholder="${t.note_ph}"></textarea>
            </div>

            <div class="limit-error" role="alert"></div>
            <button type="submit" class="submit-btn">${t.submit_btn}</button>
          </form>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.order-form').addEventListener('submit', (e) => this.handleSubmit(e));
  }
}

customElements.define('hamper-order-drawer', HamperOrderDrawer);