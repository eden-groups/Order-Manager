class HamperPhotoPicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.lang = localStorage.getItem('hamper_lang') || 'en';
    this._previewUrl = null;
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

  getFile() {
    const input = this.shadowRoot.querySelector('input[type="file"]');
    return (input && input.files && input.files[0]) || null;
  }

  validateSize(maxBytes = 8 * 1024 * 1024) {
    const file = this.getFile();
    if (!file) return { valid: true };
    if (file.size > maxBytes) {
      return { valid: false, message: this.translations.photo_too_large };
    }
    return { valid: true };
  }

  async getCompressedPhoto(hamperId = 'hamper') {
    const file = this.getFile();
    if (!file) {
      return {
        greetingPhotoBase64: '',
        greetingPhotoName: '',
        greetingPhotoMimeType: ''
      };
    }

    const utils = window.HamperMediaUtils;
    const { base64, mimeType } = utils
      ? await utils.compressImageToBase64(file)
      : { base64: '', mimeType: 'image/jpeg' };

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return {
      greetingPhotoBase64: base64,
      greetingPhotoName: `${hamperId}-${Date.now()}-${baseName}.jpg`,
      greetingPhotoMimeType: mimeType
    };
  }

  reset() {
    const input = this.shadowRoot.querySelector('input[type="file"]');
    const preview = this.shadowRoot.querySelector('.photo-preview');
    const fileNameEl = this.shadowRoot.querySelector('.photo-file-name');
    if (input) input.value = '';
    if (preview) {
      preview.style.display = 'none';
      preview.removeAttribute('src');
    }
    if (this._previewUrl) {
      URL.revokeObjectURL(this._previewUrl);
      this._previewUrl = null;
    }
    if (fileNameEl) {
      fileNameEl.textContent = this.translations.photo_no_file || '';
    }
  }

  handleChange_() {
    const input = this.shadowRoot.querySelector('input[type="file"]');
    const preview = this.shadowRoot.querySelector('.photo-preview');
    const fileNameEl = this.shadowRoot.querySelector('.photo-file-name');
    const t = this.translations;

    if (this._previewUrl) {
      URL.revokeObjectURL(this._previewUrl);
      this._previewUrl = null;
    }

    const file = input && input.files && input.files[0];
    if (!file) {
      if (preview) {
        preview.style.display = 'none';
        preview.removeAttribute('src');
      }
      if (fileNameEl) fileNameEl.textContent = t.photo_no_file || '';
      return;
    }

    if (fileNameEl) fileNameEl.textContent = file.name;
    if (preview) {
      this._previewUrl = URL.createObjectURL(file);
      preview.src = this._previewUrl;
      preview.style.display = 'block';
    }
  }

  updateTexts() {
    const t = this.translations;
    const root = this.shadowRoot;
    if (!root || !t.photo_label) return;

    const labelEl = root.querySelector('[data-t="photo_label"]');
    const captionEl = root.querySelector('[data-t="photo_caption"]');
    const btnTextEl = root.querySelector('[data-t="photo_choose_btn"]');
    const fileNameEl = root.querySelector('.photo-file-name');

    if (labelEl) labelEl.textContent = t.photo_label;
    if (captionEl) captionEl.textContent = t.photo_caption;
    if (btnTextEl) btnTextEl.textContent = t.photo_choose_btn;
    if (fileNameEl) {
      const file = this.getFile();
      fileNameEl.textContent = file ? file.name : t.photo_no_file;
    }
  }

  render() {
    const t = this.translations;
    const uid = `photo-input-${Math.random().toString(36).slice(2, 8)}`;

    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
        }

        :host {
          display: block;
          width: 100%;
          font-family: 'Segoe UI', 'Noto Sans Malayalam', sans-serif;
        }

        label.field-label {
          display: block;
          font-size: 0.82rem;
          color: #e0ece6;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .photo-caption {
          display: block;
          font-size: 0.78rem;
          color: #f4d06f;
          margin-bottom: 8px;
          line-height: 1.45;
          font-weight: 500;
        }

        .photo-picker-box {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px dashed rgba(244, 208, 111, 0.5);
          border-radius: 12px;
          padding: 10px;
        }

        .photo-input-hidden {
          display: none;
        }

        .photo-choose-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(244, 208, 111, 0.18);
          color: #f4d06f;
          border: 1px solid rgba(244, 208, 111, 0.55);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 0.8rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .photo-choose-btn:hover {
          background: #f4d06f;
          color: #0b2e1e;
        }

        .photo-file-name {
          font-size: 0.78rem;
          color: #d6e4dd;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .photo-preview {
          display: none;
          width: 100%;
          max-height: 150px;
          object-fit: cover;
          border-radius: 10px;
          margin-top: 8px;
          border: 1px solid rgba(244, 208, 111, 0.35);
        }
      </style>

      <label class="field-label" data-t="photo_label">${t.photo_label}</label>
      <span class="photo-caption" data-t="photo_caption">${t.photo_caption}</span>
      <div class="photo-picker-box">
        <input type="file" accept="image/*" class="photo-input-hidden" id="${uid}" />
        <label for="${uid}" class="photo-choose-btn">
          <span>📷</span>
          <span data-t="photo_choose_btn">${t.photo_choose_btn}</span>
        </label>
        <span class="photo-file-name">${t.photo_no_file}</span>
      </div>
      <img class="photo-preview" alt="" />
    `;

    const input = this.shadowRoot.querySelector('input[type="file"]');
    if (input) {
      input.addEventListener('change', () => this.handleChange_());
    }
  }
}

customElements.define('hamper-photo-picker', HamperPhotoPicker);