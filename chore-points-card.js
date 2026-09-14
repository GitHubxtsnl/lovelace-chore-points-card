const CARD_VERSION = '1.1.0';
const PIN_CODE = '6822';

class ChorePointsCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._rendered = false;
  }

  // --- HA lifecycle -------------------------------------------------------

  setConfig(config) {
    if (!config || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('chore-points-card: "entities" is verplicht en moet een lijst zijn');
    }
    this._config = config;
    this._rendered = false;
    this.innerHTML = '';
  }

  // BELANGRIJK: backing field _hass. "this.hass = hass" hier zou de setter
  // zichzelf laten aanroepen -> RangeError: Maximum call stack size exceeded.
  set hass(hass) {
    if (!hass) return;
    this._hass = hass;

    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this._update();
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 4;
  }

  static getStubConfig() {
    return { title: 'Kind', entities: [] };
  }

  // --- Rendering ----------------------------------------------------------

  _render() {
    const title = this._config.title || 'Punten';
    const entities = this._config.entities;
    const total = entities.length;

    this.innerHTML = `
      <ha-card>
        <style>
          .cpc-wrap { padding: 16px; }
          .cpc-head {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 16px; padding-bottom: 12px;
            border-bottom: 1px solid var(--divider-color);
          }
          .cpc-title {
            font-size: var(--ha-card-header-font-size, 20px);
            font-weight: 400;
            color: var(--primary-text-color);
          }
          .cpc-total {
            font-size: 20px; font-weight: 500;
            color: var(--success-color, #4caf50);
            background: rgba(76,175,80,.12);
            padding: 6px 14px; border-radius: 16px;
          }
          .cpc-grid {
            display: grid; grid-template-columns: repeat(5, 1fr);
            gap: 10px; margin-bottom: 16px;
          }
          .cpc-box {
            position: relative; aspect-ratio: 1;
            display: flex; align-items: center; justify-content: center;
            border: 2px solid var(--divider-color);
            border-radius: 8px;
            background: var(--card-background-color);
            cursor: pointer;
            transition: border-color .15s, background .15s;
            -webkit-tap-highlight-color: transparent;
          }
          .cpc-box:not(.used):active { transform: scale(.96); }
          .cpc-euro {
            font-size: 13px; font-weight: 700;
            color: var(--success-color, #4caf50);
          }
          .cpc-box.used {
            cursor: default;
            border-color: var(--error-color, #f44336);
            background: rgba(244,67,54,.08);
          }
          .cpc-box.used .cpc-euro { visibility: hidden; }
          .cpc-cross { display: none; position: absolute; inset: 0; }
          .cpc-box.used .cpc-cross { display: block; }
          .cpc-cross line {
            stroke: var(--error-color, #f44336);
            stroke-width: 8; stroke-linecap: round;
          }
          .cpc-reset {
            width: 100%; padding: 12px;
            border: none; border-radius: 8px;
            background: var(--error-color, #f44336); color: #fff;
            font-size: 14px; font-weight: 500; cursor: pointer;
            font-family: inherit;
          }
          .cpc-reset:active { opacity: .85; }

          .cpc-modal {
            display: none; position: fixed; inset: 0; z-index: 9999;
            background: rgba(0,0,0,.6);
            align-items: center; justify-content: center;
          }
          .cpc-modal.open { display: flex; }
          .cpc-dialog {
            background: var(--card-background-color);
            color: var(--primary-text-color);
            padding: 24px; border-radius: 12px; min-width: 280px;
            box-shadow: 0 8px 24px rgba(0,0,0,.4);
          }
          .cpc-dialog h3 { margin: 0 0 16px; font-weight: 400; }
          .cpc-pin {
            width: 100%; box-sizing: border-box; padding: 12px;
            font-size: 28px; letter-spacing: 10px; text-align: center;
            font-family: monospace;
            border: 2px solid var(--divider-color); border-radius: 8px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
          }
          .cpc-err {
            min-height: 18px; margin: 8px 0 12px; text-align: center;
            font-size: 13px; color: var(--error-color, #f44336);
          }
          .cpc-btns { display: flex; gap: 10px; }
          .cpc-btns button {
            flex: 1; padding: 12px; border-radius: 8px; border: none;
            font-size: 14px; font-weight: 500; cursor: pointer;
            font-family: inherit;
          }
          .cpc-cancel {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
          }
          .cpc-ok { background: var(--success-color, #4caf50); color: #fff; }
        </style>

        <div class="cpc-wrap">
          <div class="cpc-head">
            <div class="cpc-title">${title}</div>
            <div class="cpc-total">&euro;<span class="cpc-count">${total}</span></div>
          </div>

          <div class="cpc-grid">
            ${entities.map((e, i) => `
              <div class="cpc-box" data-idx="${i}">
                <span class="cpc-euro">1&euro;</span>
                <svg class="cpc-cross" viewBox="0 0 100 100">
                  <line x1="20" y1="20" x2="80" y2="80"></line>
                  <line x1="80" y1="20" x2="20" y2="80"></line>
                </svg>
              </div>
            `).join('')}
          </div>

          <button class="cpc-reset">Opnieuw beginnen</button>
        </div>
      </ha-card>

      <div class="cpc-modal">
        <div class="cpc-dialog">
          <h3>Beveiligingscode</h3>
          <input class="cpc-pin" type="password" inputmode="numeric"
                 maxlength="4" placeholder="----">
          <div class="cpc-err"></div>
          <div class="cpc-btns">
            <button class="cpc-cancel">Annuleren</button>
            <button class="cpc-ok">Bevestigen</button>
          </div>
        </div>
      </div>
    `;

    this._bind();
  }

  _bind() {
    const modal = this.querySelector('.cpc-modal');
    const pin = this.querySelector('.cpc-pin');
    const err = this.querySelector('.cpc-err');

    this.querySelectorAll('.cpc-box').forEach((box) => {
      box.addEventListener('click', () => {
        if (box.classList.contains('used')) return;      // eenmalig afkruisen
        const entity = this._config.entities[Number(box.dataset.idx)];
        this._hass.callService('input_number', 'set_value', {
          entity_id: entity,
          value: 1,
        });
      });
    });

    const close = () => { modal.classList.remove('open'); };

    this.querySelector('.cpc-reset').addEventListener('click', () => {
      pin.value = '';
      err.textContent = '';
      modal.classList.add('open');
      pin.focus();
    });

    this.querySelector('.cpc-cancel').addEventListener('click', close);

    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) close();
    });

    const confirm = () => {
      if (pin.value === PIN_CODE) {
        this._config.entities.forEach((entity) => {
          this._hass.callService('input_number', 'set_value', {
            entity_id: entity,
            value: 0,
          });
        });
        close();
      } else {
        err.textContent = 'Foutieve code';
        pin.value = '';
        pin.focus();
      }
    };

    this.querySelector('.cpc-ok').addEventListener('click', confirm);
    pin.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') confirm();
    });
  }

  _update() {
    if (!this._hass || !this._config) return;

    let used = 0;
    this._config.entities.forEach((entity, i) => {
      const state = this._hass.states[entity];
      const box = this.querySelector(`.cpc-box[data-idx="${i}"]`);
      if (!box) return;

      if (state && Number(state.state) >= 1) {
        box.classList.add('used');
        used += 1;
      } else {
        box.classList.remove('used');
      }
    });

    const count = this.querySelector('.cpc-count');
    if (count) count.textContent = this._config.entities.length - used;
  }
}

// Guard tegen dubbele registratie (voorkomt "name has already been used").
if (!customElements.get('chore-points-card')) {
  customElements.define('chore-points-card', ChorePointsCard);
}

// Zonder dit verschijnt de card NIET in de "Add card" picker.
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'chore-points-card')) {
  window.customCards.push({
    type: 'chore-points-card',
    name: 'Chore Points Card',
    description: 'Afkruiskaart met 10 punten van 1 euro en PIN-beveiligde reset',
    preview: false,
  });
}

console.info(
  '%c CHORE-POINTS-CARD %c v' + CARD_VERSION + ' ',
  'color:#fff;background:#4caf50;font-weight:700',
  'color:#4caf50;background:#333'
);
