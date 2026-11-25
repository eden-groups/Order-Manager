// Web Component: <hamper-complimentary-box>
// Renders tier-based complimentary perk badge (cherries / cookies / hidden for signature box),
// animates items jumping into the gift box from both left and right sides, and closes the lid.
class HamperComplimentaryBox extends HTMLElement {
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

  get complimentaryType() {
    return this.getAttribute('complimentary-type') || 'cookies';
  }

  getPerkConfig_() {
    const type = this.complimentaryType;
    const t = this.translations;

    if (type === 'none') {
      return {
        showBadge: false,
        showStage: false,
        badgeText: '',
        statusText: ''
      };
    }

    if (type === 'cherries') {
      return {
        showBadge: true,
        showStage: true,
        badgeText: t.complimentary_cherry_badge || t.complimentary_badge || '',
        statusText: t.box_status_cherry || t.box_status_complimentary || ''
      };
    }

    return {
      showBadge: true,
      showStage: true,
      badgeText: t.complimentary_cookie_badge || t.complimentary_badge || '',
      statusText: t.box_status_cookie || t.box_status_complimentary || ''
    };
  }

  setLang(lang) {
    this.lang = lang;
    this.updateTexts();
  }

  getCherrySvg() {
    return `<svg viewBox="0 0 64 64" width="36" height="36" aria-hidden="true">
      <path d="M32 34 C30 20, 22 14, 15 12" fill="none" stroke="#68b04d" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 34 C35 21, 43 15, 50 13" fill="none" stroke="#68b04d" stroke-width="3" stroke-linecap="round"/>
      <circle cx="22" cy="40" r="10" fill="#d62839" stroke="#f4d06f" stroke-width="1.8"/>
      <circle cx="42" cy="42" r="10" fill="#b81d2d" stroke="#f4d06f" stroke-width="1.8"/>
      <circle cx="19" cy="37" r="2.6" fill="#ff9aa2" opacity="0.8"/>
      <circle cx="39" cy="39" r="2.6" fill="#ff9aa2" opacity="0.8"/>
    </svg>`;
  }

  getCookieSvg() {
    return `<svg viewBox="0 0 64 64" width="36" height="36" aria-hidden="true">
      <circle cx="32" cy="34" r="20" fill="#d99b52" stroke="#f4d06f" stroke-width="2"/>
      <circle cx="25" cy="28" r="2.5" fill="#4a2c11"/>
      <circle cx="38" cy="26" r="2.5" fill="#4a2c11"/>
      <circle cx="32" cy="37" r="3" fill="#4a2c11"/>
      <circle cx="24" cy="42" r="2.2" fill="#4a2c11"/>
      <circle cx="41" cy="40" r="2.5" fill="#4a2c11"/>
    </svg>`;
  }

  getItemSvg() {
    return this.complimentaryType === 'cherries'
      ? this.getCherrySvg()
      : this.getCookieSvg();
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
    if (this.complimentaryType === 'none') return;

    this.clearTimers_();

    const stage = this.shadowRoot.querySelector('.box-stage');
    const boxEl = this.shadowRoot.querySelector('.gift-box');
    const insideEl = this.shadowRoot.querySelector('.box-inside-item');
    if (!stage || !boxEl) return;

    boxEl.classList.remove('closed', 'bounce');
    if (insideEl) insideEl.classList.remove('settled');

    stage.querySelectorAll('.flying-item').forEach((el) => el.remove());

    const leftFlyer = document.createElement('div');
    leftFlyer.className = 'flying-item from-left';
    leftFlyer.innerHTML = this.getItemSvg();

    const rightFlyer = document.createElement('div');
    rightFlyer.className = 'flying-item from-right';
    rightFlyer.innerHTML = this.getItemSvg();

    stage.appendChild(leftFlyer);
    stage.appendChild(rightFlyer);

    this._animTimer = setTimeout(() => {
      boxEl.classList.add('bounce');
      if (insideEl) insideEl.classList.add('settled');

      this._closeTimer = setTimeout(() => {
        boxEl.classList.add('closed');
      }, 360);

      this._cleanupTimer = setTimeout(() => {
        leftFlyer.remove();
        rightFlyer.remove();
      }, 950);
    }, 1150);
  }

  resetBox() {
    this.clearTimers_();
    const stage = this.shadowRoot.querySelector('.box-stage');
    const boxEl = this.shadowRoot.querySelector('.gift-box');
    const insideEl = this.shadowRoot.querySelector('.box-inside-item');
    if (stage) stage.querySelectorAll('.flying-item').forEach((el) => el.remove());
    if (boxEl) boxEl.classList.remove('closed', 'bounce');
    if (insideEl) insideEl.classList.remove('settled');
  }

  updateTexts() {
    const root = this.shadowRoot;
    if (!root) return;

    const perk = this.getPerkConfig_();
    const stage = root.querySelector('.box-stage');
    const badge = root.querySelector('[data-t="complimentary_badge"]');
    const status = root.querySelector('[data-t="box_status_complimentary"]');
    const insideEl = root.querySelector('.box-inside-item');

    if (stage) stage.style.display = perk.showStage ? 'block' : 'none';
    if (badge) {
      badge.style.display = perk.showBadge ? 'inline-flex' : 'none';
      badge.textContent = perk.badgeText;
    }
    if (status) {
      status.style.display = perk.statusText ? 'block' : 'none';
      status.textContent = perk.statusText;
    }
    if (insideEl) {
      insideEl.innerHTML = this.getItemSvg();
    }
  }

  render() {
    const perk = this.getPerkConfig_();
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Segoe UI', 'Noto Sans Malayalam', sans-serif;
        }

        .box-stage {
          display: ${perk.showStage ? 'block' : 'none'};
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
          display: ${perk.showBadge ? 'inline-flex' : 'none'};
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

        .box-inside-item {
          position: absolute;
          top: 8px;
          z-index: 1;
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .box-inside-item.settled {
          opacity: 0.92;
          transform: scale(0.82);
        }

        .gift-box.closed .box-inside-item {
          opacity: 0;
        }

        .flying-item {
          position: absolute;
          top: 46px;
          left: calc(50% - 18px);
          z-index: 20;
          pointer-events: none;
        }

        .flying-item.from-left {
          animation: jumpFromLeft 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .flying-item.from-right {
          animation: jumpFromRight 1.15s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
          opacity: 0;
        }

        @keyframes jumpFromLeft {
          0% {
            transform: translate(-72px, 8px) scale(0.95) rotate(-18deg);
            opacity: 1;
          }
          45% {
            transform: translate(-32px, -42px) scale(1.2) rotate(12deg);
            opacity: 1;
          }
          85% {
            transform: translate(-4px, -6px) scale(0.76) rotate(0deg);
            opacity: 0.7;
          }
          100% {
            transform: translate(-4px, -4px) scale(0.7) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes jumpFromRight {
          0% {
            transform: translate(72px, 8px) scale(0.95) rotate(18deg);
            opacity: 1;
          }
          45% {
            transform: translate(32px, -42px) scale(1.2) rotate(-12deg);
            opacity: 1;
          }
          85% {
            transform: translate(4px, -6px) scale(0.76) rotate(0deg);
            opacity: 0.7;
          }
          100% {
            transform: translate(4px, -4px) scale(0.7) rotate(0deg);
            opacity: 0;
          }
        }

        .box-status-text {
          display: ${perk.statusText ? 'block' : 'none'};
          font-size: 0.8rem;
          color: #f4d06f;
          margin-top: 6px;
          font-weight: 600;
        }
      </style>

      <div class="box-stage">
        <div class="complimentary-badge" data-t="complimentary_badge">${perk.badgeText}</div>
        <div class="gift-box-wrap">
          <div class="gift-box">
            <div class="box-inside-item">${this.getItemSvg()}</div>
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
          <div class="box-status-text" data-t="box_status_complimentary">${perk.statusText}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('hamper-complimentary-box', HamperComplimentaryBox);