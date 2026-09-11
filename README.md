# Chore Points Card - Home Assistant

Een interactieve Home Assistant custom card voor het beheren van punten/taken voor kinderen. Perfect voor iPad dashboards!

## Features

✅ **Visuele punten-tracker** - 10 vakjes per kind, elk waard €1
✅ **Persistent opslag** - Data slaat op in HA en synct over devices  
✅ **PIN-beveiligd reset** - 4-cijferige code om alles opnieuw in te stellen
✅ **Visuele feedback** - Rood kruis (❌) wanneer vakje is aangetikt
✅ **HA-integratie** - Werkt met input_number helpers
✅ **Dark mode** - Volgt HA's thema

## Installation

### 1. Download/Clone naar HACS

**Via HACS (aanbevolen):**
- Open HACS in Home Assistant
- Klik op `Custom repositories`
- Voeg toe: `https://github.com/your-username/lovelace-chore-points-card`
- Selecteer `Lovelace`
- Klik Install

**Handmatig:**
1. Maak map aan: `config/www/chore-points-card/`
2. Kopieer `chore-points-card.js` naar deze map
3. Voeg toe in HA: `configuration.yaml`:
```yaml
lovelace:
  resources:
    - url: /local/chore-points-card/chore-points-card.js
      type: module
```

### 2. Maak Input Number helpers aan

Voeg in `configuration.yaml` toe (of via UI: Settings → Devices & Services → Helpers):

```yaml
input_number:
  kind1_chore_1:
    name: "Kind 1 - Punt 1"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_2:
    name: "Kind 1 - Punt 2"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_3:
    name: "Kind 1 - Punt 3"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_4:
    name: "Kind 1 - Punt 4"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_5:
    name: "Kind 1 - Punt 5"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_6:
    name: "Kind 1 - Punt 6"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_7:
    name: "Kind 1 - Punt 7"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_8:
    name: "Kind 1 - Punt 8"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_9:
    name: "Kind 1 - Punt 9"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle

  kind1_chore_10:
    name: "Kind 1 - Punt 10"
    min: 0
    max: 1
    step: 1
    unit_of_measurement: ""
    icon: mdi:checkbox-marked-circle
```

⚠️ **Voor Kind 2, 3, 4:** Vervang `kind1` door `kind2`, `kind3`, `kind4`

### 3. Voeg Card toe aan Dashboard

In je Lovelace dashboard YAML:

```yaml
views:
  - title: Punten
    cards:
      - type: custom:chore-points-card
        title: "Kind 1"
        entities:
          - input_number.kind1_chore_1
          - input_number.kind1_chore_2
          - input_number.kind1_chore_3
          - input_number.kind1_chore_4
          - input_number.kind1_chore_5
          - input_number.kind1_chore_6
          - input_number.kind1_chore_7
          - input_number.kind1_chore_8
          - input_number.kind1_chore_9
          - input_number.kind1_chore_10

      - type: custom:chore-points-card
        title: "Kind 2"
        entities:
          - input_number.kind2_chore_1
          - input_number.kind2_chore_2
          - input_number.kind2_chore_3
          - input_number.kind2_chore_4
          - input_number.kind2_chore_5
          - input_number.kind2_chore_6
          - input_number.kind2_chore_7
          - input_number.kind2_chore_8
          - input_number.kind2_chore_9
          - input_number.kind2_chore_10
      
      # Repeat for Kind 3 and Kind 4
```

## Configuratie

### Card Options

| Optie | Type | Vereist | Beschrijving |
|-------|------|---------|-------------|
| `type` | string | Ja | `custom:chore-points-card` |
| `title` | string | Ja | Naam van het kind |
| `entities` | list | Ja | 10x input_number entities |

### PIN-Code

Standaard PIN: `6822`

Wil je deze veranderen? Pas in `chore-points-card.js` aan:
```javascript
const pinCode = "6822";  // Hier aanpassen
```

## Gebruik

1. **Vakje aanklikken** → Vakje wordt afgekruist (❌), teller daalt
2. **Afgekruist vakje kan niet opnieuw worden aangeklikt**
3. **"Opnieuw beginnen"** → Vraagt PIN, reset alles op 10 punten
4. **Synct live** over alle devices

## Troubleshooting

### Card laadt niet
- ✅ Reload browser cache (Ctrl+Shift+Delete)
- ✅ Zet JavaScript console open (F12) - check voor errors
- ✅ Zorg dat het pad `/local/chore-points-card/chore-points-card.js` klopt

### Data synct niet
- ✅ Zorg dat input_number helpers echt bestaan
- ✅ Check entity IDs: `Configuration → Developer Tools → States`
- ✅ Herstart HA: `Developer Tools → YAML → Automations → (restart_home_assistant service)`

### PIN werkt niet
- ✅ Default PIN is `6822`
- ✅ Zorg dat je geen typos hebt (numpad vs keyboard?)

## Developers

Wil je deze aanpassen?

- `chore-points-card.js` - Main logic
- Draai `yarn build` na edits
- Test lokaal via `python3 -m http.server` + http://localhost:8000

## Licentie

MIT License - voel je vrij om aan te passen!

---

Made with ❤️ for Home Assistant kids chores 🎯
