class ChorePointsCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  set hass(hass) {
    this.hass = hass;
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    } else {
      this.updatePoints();
    }
  }

  render() {
    const config = this.config;
    const entities = config.entities || [];
    const title = config.title || "Chore Points";
    const pinCode = "6822";

    this.innerHTML = `
      <style>
        ha-card {
          height: 100%;
        }

        .card-content {
          padding: 0;
        }

        .chore-container {
          padding: 16px;
          background: var(--ha-card-background, #1a1a1a);
          color: var(--ha-text-color, #fff);
          font-family: var(--ha-font-family);
          border-radius: 12px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--ha-border-color, rgba(255,255,255,0.1));
          padding-bottom: 12px;
        }

        .title {
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.1px;
        }

        .points-total {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 18px;
          font-weight: 600;
          color: var(--success-color, #4caf50);
          background: rgba(76, 175, 80, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
        }

        .points-icon {
          font-size: 20px;
        }

        .checkboxes {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .checkbox-item {
          aspect-ratio: 1;
          border: 2px solid var(--ha-border-color, rgba(255,255,255,0.2));
          border-radius: 8px;
          background: var(--ha-card-background, #1a1a1a);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--success-color, #4caf50);
          position: relative;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .checkbox-item:hover:not(.checked) {
          border-color: var(--ha-text-color, #fff);
          background: rgba(255,255,255,0.05);
        }

        .checkbox-item.checked {
          border-color: var(--error-color, #f44336);
          background: rgba(244, 67, 54, 0.1);
          cursor: not-allowed;
        }

        .checkbox-item.checked::after {
          content: '❌';
          position: absolute;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkbox-item.checked .euro {
          display: none;
        }

        .euro {
          font-size: 14px;
          font-weight: 700;
          color: var(--success-color, #4caf50);
        }

        .reset-btn {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--ha-border-color, rgba(255,255,255,0.2));
          border-radius: 8px;
          background: var(--error-color, #f44336);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-btn:hover {
          border-color: var(--error-color, #f44336);
          background: var(--error-color, #f44336);
          opacity: 0.9;
        }

        .reset-btn:active {
          transform: scale(0.98);
        }

        .pin-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }

        .pin-modal.active {
          display: flex;
        }

        .pin-dialog {
          background: var(--ha-card-background, #1a1a1a);
          color: var(--ha-text-color, #fff);
          padding: 24px;
          border-radius: 12px;
          min-width: 300px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .pin-dialog h2 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .pin-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border: 2px solid var(--ha-border-color, rgba(255,255,255,0.2));
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          color: var(--ha-text-color, #fff);
          font-size: 24px;
          letter-spacing: 4px;
          text-align: center;
          font-family: monospace;
        }

        .pin-input::placeholder {
          color: var(--ha-text-color, rgba(255,255,255,0.3));
        }

        .pin-buttons {
          display: flex;
          gap: 12px;
        }

        .pin-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid var(--ha-border-color, rgba(255,255,255,0.2));
          border-radius: 8px;
          background: var(--ha-card-background, #1a1a1a);
          color: var(--ha-text-color, #fff);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pin-btn:hover {
          border-color: var(--ha-text-color, #fff);
          background: rgba(255,255,255,0.05);
        }

        .pin-btn.confirm {
          background: var(--success-color, #4caf50);
          border-color: var(--success-color, #4caf50);
          color: #fff;
        }

        .pin-btn.confirm:hover {
          background: var(--success-color, #4caf50);
          opacity: 0.9;
        }

        .pin-error {
          color: var(--error-color, #f44336);
          font-size: 13px;
          margin-bottom: 12px;
          text-align: center;
        }
      </style>

      <ha-card>
        <div class="card-content">
          <div class="chore-container">
            <div class="header">
              <div class="title">${title}</div>
              <div class="points-total">
                <span class="points-icon">€</span>
                <span id="total-points">10</span>
              </div>
            </div>

            <div class="checkboxes" id="checkboxes-container">
              ${entities.map((entity, idx) => `
                <div class="checkbox-item" data-entity="${entity}" data-index="${idx}">
                  <span class="euro">1€</span>
                </div>
              `).join('')}
            </div>

            <button class="reset-btn" id="reset-btn">Opnieuw beginnen</button>
          </div>
        </div>
      </ha-card>

      <div class="pin-modal" id="pin-modal">
        <div class="pin-dialog">
          <h2>Beveiligingscode</h2>
          <div class="pin-error" id="pin-error"></div>
          <input 
            type="password" 
            class="pin-input" 
            id="pin-input" 
            placeholder="0000"
            inputmode="numeric"
            maxlength="4"
          />
          <div class="pin-buttons">
            <button class="pin-btn" id="pin-cancel">Annuleren</button>
            <button class="pin-btn confirm" id="pin-confirm">Bevestigen</button>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.updatePoints();
  }

  setupEventListeners() {
    const entities = this.config.entities || [];
    const pinCode = "6822";

    // Checkbox clicks
    this.querySelectorAll('.checkbox-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!item.classList.contains('checked')) {
          const entity = item.dataset.entity;
          this.hass.callService('input_number', 'set_value', {
            entity_id: entity,
            value: 1
          });
        }
      });
    });

    // Reset button
    this.querySelector('#reset-btn').addEventListener('click', () => {
      this.querySelector('#pin-modal').classList.add('active');
      this.querySelector('#pin-input').value = '';
      this.querySelector('#pin-error').textContent = '';
      this.querySelector('#pin-input').focus();
    });

    // PIN modal buttons
    this.querySelector('#pin-cancel').addEventListener('click', () => {
      this.querySelector('#pin-modal').classList.remove('active');
    });

    this.querySelector('#pin-confirm').addEventListener('click', () => {
      const inputPin = this.querySelector('#pin-input').value;
      if (inputPin === pinCode) {
        this.resetAllPoints();
        this.querySelector('#pin-modal').classList.remove('active');
      } else {
        this.querySelector('#pin-error').textContent = 'Foutieve code, probeer opnieuw';
        this.querySelector('#pin-input').value = '';
        this.querySelector('#pin-input').focus();
      }
    });

    // PIN input enter key
    this.querySelector('#pin-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.querySelector('#pin-confirm').click();
      }
    });
  }

  resetAllPoints() {
    const entities = this.config.entities || [];
    entities.forEach(entity => {
      this.hass.callService('input_number', 'set_value', {
        entity_id: entity,
        value: 0
      });
    });
  }

  updatePoints() {
    const entities = this.config.entities || [];
    let checkedCount = 0;

    entities.forEach((entity, idx) => {
      const state = this.hass.states[entity];
      const value = state ? parseFloat(state.state) : 0;
      const item = this.querySelector(`[data-index="${idx}"]`);

      if (value === 1) {
        item.classList.add('checked');
        checkedCount++;
      } else {
        item.classList.remove('checked');
      }
    });

    const totalPoints = 10 - checkedCount;
    this.querySelector('#total-points').textContent = totalPoints;
  }

  getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement('chore-points-card-editor');
  }

  static getStubConfig() {
    return {
      title: 'Chore Points',
      entities: []
    };
  }
}

customElements.define('chore-points-card', ChorePointsCard);

// Simple config editor
class ChorePointsCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  render() {
    this.innerHTML = `
      <div style="padding: 16px;">
        <ha-form-group>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Title</label>
            <input 
              type="text" 
              id="title" 
              value="${this.config.title || ''}"
              style="width: 100%; padding: 8px; border: 1px solid var(--ha-border-color); border-radius: 4px; box-sizing: border-box;"
            />
          </div>
        </ha-form-group>
        <div style="color: var(--ha-text-color, #fff); font-size: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 4px;">
          <strong>Setup hint:</strong> Voeg input_number entities toe in de YAML config. Gebruik entities: met input_number.kind1_chore_1 tot input_number.kind1_chore_10
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define('chore-points-card-editor', ChorePointsCardEditor);
