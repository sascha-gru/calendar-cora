# Änderungen am Kalender - 10.02.2026

## 1. Datum- und Zeitfelder neu strukturiert

### Separate Eingabefelder
Die kombinierten `datetime-local` Inputs wurden durch separate Felder ersetzt:
- **Datum-Input** (`type="date"`)
- **Uhrzeit-Input** (`type="time"`)
- **"Uhr"** als Text direkt nach der Uhrzeit

### Neue Helper-Funktionen
```typescript
formatToLocalDate(date)      // Gibt YYYY-MM-DD zurück
formatToLocalTime(date)      // Gibt HH:mm zurück
combineDateAndTime(...)      // Kombiniert Datum und Zeit zu einem String
```

### Picker öffnet bei Klick auf Werte
`onClick={(e) => e.currentTarget.showPicker()}` wurde hinzugefügt, sodass das Dropdown-Menü sich öffnet, wenn man auf die Datums-/Zeitwerte klickt (nicht nur auf das Icon).

---

## 2. Termin-Anzeige in allen Ansichten angepasst

### Allgemein
- **Titel steht immer zuerst** (fett)
- **Zeit danach** im Format `10:00 - 10:30 Uhr` (Start- und Endzeit)

### Monatsansicht
- Titel oben, Zeit darunter (vertikales Layout mit `flexDirection: 'column'`)
- Zeit etwas kleiner (`fontSize: '0.85em'`)

### Wochen-/Tagesansicht
- Titel und Zeit nebeneinander (horizontales Layout mit `flexDirection: 'row'`)
- Beide linksbündig (`justifyContent: 'flex-start'`)

### Listenansicht
- Titel (fett) gefolgt von Zeit

---

## 3. Hover-Effekt in Monatsansicht korrigiert

CSS wurde angepasst, damit der Hover-Schatten nur so groß ist wie die Termin-Box selbst:

```css
.fc-dayGridMonth-view .fc-daygrid-event,
.fc-dayGridMonth-view .fc-daygrid-event-harness {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.fc-dayGridMonth-view .fc-daygrid-event:hover .fc-event-main-frame {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

---

## 4. Termin-Erstellung in Monatsansicht korrigiert

### Problem
Beim Klicken in der Monatsansicht wurde `allDay` automatisch auf `true` gesetzt, wodurch Termine nicht korrekt angezeigt wurden.

### Lösung
- `handleDateClick` setzt jetzt `allDay: false` standardmäßig
- Benutzer kann "Ganztägig" manuell aktivieren
- Checkbox hat jetzt `checked={newEvent.allDay}` für korrekte Statusanzeige

---

## 5. FullCalendar Standard-Zeit versteckt

In der Wochen-/Tagesansicht wurde die Standard-Zeitanzeige von FullCalendar versteckt, um Duplikate zu vermeiden:

```css
.fc-timegrid-event .fc-event-main > .fc-event-time {
  display: none !important;
}
```

---

## Betroffene Dateien

- `src/components/Calendar.tsx` - Hauptkomponente mit allen Logik-Änderungen
- `src/app/globals.css` - CSS für Hover-Effekte und FullCalendar-Anpassungen
