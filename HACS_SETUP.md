# HACS Setup Guide

Wil je deze card installeren via HACS (recommended)? Volg deze stappen:

## Stap 1: GitHub Repository maken

1. Ga naar [github.com](https://github.com)
2. Log in of maak een account aan
3. Klik op `+` rechtsboven → `New repository`
4. Naam: `lovelace-chore-points-card`
5. Description: "Home Assistant Lovelace card for tracking children's chores"
6. Selecteer: `Public`
7. Zet vinkje bij `Add a README file`
8. Klik `Create repository`

## Stap 2: Bestanden toevoegen

1. In je GitHub repo, klik op `Add file` → `Create new file`
2. Naam: `chore-points-card.js`
3. Plak de volledige inhoud van `chore-points-card.js`
4. Klik `Commit changes`

5. Herhaal voor:
   - `manifest.json` (zie template)
   - `package.json`
   - `.gitignore` (optioneel, zie hieronder)

## Stap 3: .gitignore toevoegen (optioneel maar aanbevolen)

1. Klik `Add file` → `Create new file`
2. Naam: `.gitignore`
3. Inhoud:
```
node_modules/
*.log
.DS_Store
.env
```
4. Commit

## Stap 4: manifest.json aanpassen

In je repo, edit `manifest.json`:

```json
{
  "domain": "chore-points-card",
  "name": "Chore Points Card",
  "codeowners": ["@your-github-username"],
  "config_flow": false,
  "documentation": "https://github.com/YOUR-USERNAME/lovelace-chore-points-card",
  "iot_class": "local_polling",
  "requirements": [],
  "version": "1.0.0",
  "homeassistant": "2024.1.0"
}
```

⚠️ **Vervang `YOUR-USERNAME` door je werkelijke GitHub username!**

## Stap 5: Release maken (optioneel maar best practice)

1. Ga naar `Releases` in je repo
2. Klik `Create a new release`
3. Tag: `v1.0.0`
4. Title: `Initial Release - Chore Points Card v1.0.0`
5. Description:
```
Initial release with full feature set:
- 10 point tracker per child
- PIN-protected reset (6822)
- Persistent data storage via input_number
- Dark mode support
- iPad optimized
```
6. Publish

## Stap 6: HACS integratie

### In Home Assistant:

1. Open Home Assistant
2. Ga naar HACS (via zijbalk)
3. Klik op `Frontend` (linksboven)
4. Klik op `+` button
5. Zoek naar `chore-points-card`
6. Klik op je repo
7. Klik `Download`

**OF handmatig toevoegen:**

1. Klik HACS → `⋮` (menu) → `Custom repositories`
2. URL: `https://github.com/YOUR-USERNAME/lovelace-chore-points-card`
3. Category: `Lovelace`
4. Klik `Create`
5. Nu verschijnt het in de list - klik erop en download

## Stap 7: Verificatie in HA

1. Settings → `Devices & Services` → `Developer Tools`
2. Klik `Check Configuration`
3. Zorg dat geen errors zijn
4. Herstart HA (optioneel maar best practice)

## Stap 8: Test de card

1. Open je Lovelace dashboard
2. Klik edit (potlood icoon)
3. Klik `+ Add card`
4. Zoek op `Chore Points`
5. Selecteer card
6. Vul config in (zie dashboard_config.yaml)
7. Klik `Save`

## Troubleshooting

### Card verschijnt niet in HACS

- ✅ Check dat `manifest.json` correct is
- ✅ Check GitHub repo is `Public`
- ✅ Wacht 5 minuten, refresh HACS

### HACS kan repo niet vinden

- ✅ URL moet exact zijn: `https://github.com/YOUR-USERNAME/lovelace-chore-points-card`
- ✅ GitHub repo mag geen underscores hebben tussen woorden (hyphens OK)
- ✅ Check manifest.json format

### Card laadt niet na download

- ✅ Hard refresh browser: `Ctrl+Shift+Delete`
- ✅ Check JavaScript console op errors
- ✅ Herstart HA: Developer Tools → System → Restart

## Updates pushen

Zodra je fixes doet:

1. Edit bestand in GitHub (of lokaal + git push)
2. Version bumpen in `package.json` en `manifest.json`
3. Maak nieuwe Release in GitHub (tag = version)
4. In HA, HACS checkt automatisch voor updates

---

**That's it!** Je custom card is nu beschikbaar via HACS voor jezelf en (optioneel) voor de hele HA-community. 🎉
