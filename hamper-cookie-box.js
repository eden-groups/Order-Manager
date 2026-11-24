class HamperCookieBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.lang = localStorage.getItem('hamper_lang') || 'en';
    this._animTimer = null;
    this._closeTimer = null;
    this._cleanupTimer = null;
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

  getCookiesSvg() {
    return `<svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
      <circle cx="32" cy="34" r="20" fill="#d99b52" stroke="#f4d06f" stroke-width="2"/>
      <circle cx="25" cy="28" r="2.5" fill="#4a2c11"/>
      <circle cx="38" cy="26" r="2.5" fill="#4a2c11"/>
      <circle cx="32" cy="37" r="3" fill="#4a2c11"/>
      <circle cx="24" cy="42" r="2.2" fill="#4a2c11"/>
      <circle cx="41" cy="40" r="2.5" fill="#4a2c11"/>
    </svg>`;
  }

  clearTimers_() {
    if (this._animTimer) {
      clearTimeout(this._animTimer);
      this._animTimer = null;
    }
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    if (this._cleanupTimer) {
      clearTimeout(this._cleanupTimer);
      this._cleanupTimer = null;
    }
  }

  playDropAndClose() {
    this.clearTimers_();

    const stage = this.shadowRoot.querySelector('.box-stage');
    const boxEl = this.shadowRoot.querySelector('.gift-box');
    const insideEl = this.shadowRoot.querySelector('.box-inside-cookie');
    if (!stage || !boxEl) return;

    boxEl.classList.remove('closed', 'bounce');
    if (insideEl) insideEl.classList.remove('settled');

    const oldFlyer = stage.querySelector('.flying-cookie');
    if (oldFlyer) oldFlyer.remove();

    const flyer = document.createElement('div');
    flyer.className = 'flying-cookie';
    flyer.innerHTML = this.getCookiesSvg();
    stage.appendChild(flyer);

    // Cookie jump takes ~1.15s; settle & bounce right as it lands inside
    this._animTimer = setTimeout(() => {
      boxEl.classList.add('bounce');
      if (insideEl) insideEl.classList.add('settled');

      // Pause briefly with cookies inside before closing lid smoothly
      this._closeTimer = setTimeout(() => {
        boxEl.classList.add('closed');
      }, 360);

      this._cleanupTimer = setTimeout(() => {
        if (flyer.parentNode) flyer.remove();
      }, 950);
    }, 1120);
  }

  resetBox() {
    this.clearTimers_();
    const boxEl = this.shadowRoot.querySelector('.gift-box');
    const insideEl = this.shadowRoot.querySelector('.box-inside-cookie');
    if (boxEl) boxEl.classList.remove('closed', 'bounce');
    if (insideEl) insideEl.classList.remove('settled');
  }

  updateTexts() {
    const t = this.translations;
    const root = this.shadowRoot;
    if (!root || !t.complimentary_badge) return;
    const badge = root.querySelector('[data-t="complimentary_badge"]');
    const status = root.querySelector('[data-t="box_status_complimentary"]');
    if (badge) badge.textContent = t.complimentary_badge;
    if (status) status.textContent = t.box_status_complimentary;
  }

  render() {
    const t = this.translations;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Segoe UI', 'Noto Sans Malayalam', sans-serif;
        }

        .box-stage {
          position: relative;
          background: rgba(255, 255, 255, 0.04);
          border: 1px dashed rgba(244, 208, 111, 0.35);
          border-radius: 14px;
          padding: 14px 10px;
          margin-bottom: 18px;
          text-align: center;
          overflow: hidden;
        }

        .complimentary-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #0b2e1e;
          background: linear-gradient(
            115deg,
            #e6b84c 0%,
            #fff3b8 45%,
            #f4d06f 55%,
            #d49b27 100%
          );
          background-size: 200% auto;
          box-shadow: 0 0 14px rgba(244, 208, 111, 0.45);
          animation: shimmerSweep 2.6s linear infinite;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        @keyframes shimmerSweep {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .gift-box-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .gift-box {
          position: relative;
          width: 84px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .box-lid {
          transform-origin: 10px 25px;
          transform: translateY(-7px) rotate(-14deg);
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .gift-box.closed .box-lid {
          transform: translateY(0px) rotate(0deg);
        }

        .gift-box.bounce {
          animation: boxBounce 0.55s ease;
        }

        @keyframes boxBounce {
          0%, 100% { transform: scale(1, 1); }
          45% { transform: scale(1.1, 0.92); }
        }

        .box-inside-cookie {
          position: absolute;
          top: 8px;
          z-index: 1;
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .box-inside-cookie.settled {
          opacity: 0.9;
          transform: scale(0.82);
        }

        .gift-box.closed .box-inside-cookie {
          opacity: 0;
        }

        .flying-cookie {
          position: absolute;
          top: 42px;
          left: calc(50% - 19px);
          z-index: 20;
          pointer-events: none;
          animation: cookieJumpArc 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cookieJumpArc {
          0% {
            transform: translate(-58px, 8px) scale(0.95) rotate(-18deg);
            opacity: 1;
          }
          45% {
            transform: translate(-26px, -40px) scale(1.22) rotate(12deg);
            opacity: 1;
          }
          85% {
            transform: translate(0px, -6px) scale(0.78) rotate(0deg);
            opacity: 0.65;
          }
          100% {
            transform: translate(0px, -4px) scale(0.72) rotate(0deg);
            opacity: 0;
          }
        }

        .box-status-text {
          font-size: 0.8rem;
          color: #f4d06f;
          margin-top: 6px;
          font-weight: 600;
        }
      </style>

      <div class="box-stage">
        <div class="complimentary-badge" data-t="complimentary_badge">${t.complimentary_badge}</div>
        <div class="gift-box-wrap">
          <div class="gift-box">
            <div class="box-inside-cookie">${this.getCookiesSvg()}</div>
            <svg viewBox="0 0 80 72" width="76" height="68" style="position:relative; z-index:2;" aria-hidden="true">
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
          <div class="box-status-text" data-t="box_status_complimentary">${t.box_status_complimentary}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('hamper-cookie-box', HamperCookieBox);