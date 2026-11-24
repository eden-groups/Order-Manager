// Web Component 2: <order-success-modal>
// Bilingual confirmation popup notifying the customer that an executive will contact them on WhatsApp
class OrderSuccessModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.lang = localStorage.getItem('hamper_lang') || 'en';
    this.orderData = null;
  }

  connectedCallback() {
    this.render();
  }

  get translations() {
    return (window.HAMPER_TRANSLATIONS && window.HAMPER_TRANSLATIONS[this.lang]) || {};
  }

  setLang(lang) {
    this.lang = lang;
    this.render();
  }

  show(orderData) {
    this.orderData = orderData;
    this.render();
    const overlay = this.shadowRoot.querySelector('.modal-overlay');
    if (overlay) overlay.classList.add('open');
  }

  hide() {
    const overlay = this.shadowRoot.querySelector('.modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  render() {
    const t = this.translations;
    const data = this.orderData || { hamperName: '', addonLabel: '', whatsappNumber: '' };

    this.shadowRoot.innerHTML = `
      <style>
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 18, 12, 0.82);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          font-family: 'Segoe UI', 'Noto Sans Malayalam', sans-serif;
        }

        .modal-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .modal-card {
          background: linear-gradient(145deg, #14452f 0%, #0b2e1e 100%);
          border: 2px solid #f4d06f;
          border-radius: 24px;
          max-width: 420px;
          width: 100%;
          padding: 32px 24px;
          text-align: center;
          color: #fffdf9;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          transform: scale(0.9);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .modal-overlay.open .modal-card {
          transform: scale(1);
        }

        .check-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: rgba(244, 208, 111, 0.18);
          border: 2px solid #f4d06f;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }

        h2 {
          color: #f4d06f;
          font-size: 1.45rem;
          margin-bottom: 12px;
          line-height: 1.35;
        }

        p.msg {
          color: #e0ece6;
          font-size: 0.98rem;
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .summary-box {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 14px;
          text-align: left;
          font-size: 0.88rem;
          color: #d6e4dd;
          margin-bottom: 22px;
          line-height: 1.7;
        }

        .summary-box strong {
          color: #f4d06f;
        }

        .ok-btn {
          background: #f4d06f;
          color: #0b2e1e;
          border: none;
          border-radius: 999px;
          padding: 12px 36px;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          width: 100%;
          transition: background 0.2s ease;
        }

        .ok-btn:hover {
          background: #ffe08a;
        }
      </style>

      <div class="modal-overlay ${this.orderData ? 'open' : ''}">
        <div class="modal-card">
          <div class="check-circle">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f4d06f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2>${t.success_title || ''}</h2>
          <p class="msg">${t.success_msg || ''}</p>

          <div class="summary-box">
            <div><strong>${t.success_summary_hamper || ''}</strong> ${data.hamperName}</div>
            <div><strong>${t.success_summary_addon || ''}</strong> ${data.addonLabel}</div>
            <div><strong>${t.success_summary_wa || ''}</strong> ${data.whatsappNumber}</div>
          </div>

          <button type="button" class="ok-btn">${t.success_ok_btn || 'Done'}</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.ok-btn').addEventListener('click', () => {
      this.orderData = null;
      this.hide();
    });
  }
}

customElements.define('order-success-modal', OrderSuccessModal);