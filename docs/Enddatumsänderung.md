# Enddatumsänderung bei ganztägigen Events

## Problem

FullCalendar speichert das Enddatum bei ganztägigen Events **exklusiv**. Das bedeutet:
- Ein ganztägiges Event am 10.02. wird intern als `start: 10.02.` und `end: 11.02.` gespeichert
- Dies führte zu falschen Anzeigen im Modal (Enddatum war immer 1 Tag zu spät)

## Lösung

### 1. Neue Hilfsfunktion `adjustEndDateForAllDay`

```typescript
function adjustEndDateForAllDay(event: Event): Event {
    if (event.allDay && event.end) {
        const adjustedEnd = new Date(event.end);
        adjustedEnd.setDate(adjustedEnd.getDate() + 1);
        return { ...event, end: adjustedEnd };
    }
    return event;
}
```

Diese Funktion fügt 1 Tag zum Enddatum hinzu, bevor das Event an FullCalendar übergeben wird.

### 2. Anpassung in `handleShowInfo`

Beim Öffnen des Info-Modals wird das Enddatum um 1 Tag reduziert:

```typescript
if (data.event.allDay && data.event.end) {
    const adjustedEnd = new Date(data.event.end);
    adjustedEnd.setDate(adjustedEnd.getDate() - 1);
    endDate = adjustedEnd;
}
```

### 3. Anpassung in `handleSubmit` und `handleUpdate`

Beide Funktionen verwenden jetzt `adjustEndDateForAllDay` vor dem Speichern:

```typescript
const eventToSave = adjustEndDateForAllDay(newEvent);
setAllEvents([...allEvents, eventToSave]);
```

### 4. Verbesserte Anzeige im Info-Modal

Bei ganztägigen Events wird jetzt unterschieden:
- **Eintägig**: Nur ein Datum wird angezeigt (z.B. "10.02.26")
- **Mehrtägig**: Datumsbereich wird angezeigt (z.B. "10.02.26 - 12.02.26")

```typescript
{newEvent.allDay ? (
    <div className="text-center mt-6">
        <Label>Ganztägig</Label>
        <p>
            {startStr === endStr ? startStr : `${startStr} - ${endStr}`}
        </p>
    </div>
) : (
    // Normale Anzeige mit Start- und Endzeit
)}
```

### 5. Dynamische Labels im Formular

- Bei ganztägigen Events: "Startdatum" / "Enddatum"
- Bei normalen Events: "Startdatum/-zeit" / "Enddatum/-zeit"

### 6. Deaktivierte Zeitfelder bei ganztägigen Events

Die Zeitfelder werden bei aktivierter "Ganztägig"-Checkbox ausgegraut und deaktiviert:

```typescript
className={newEvent.allDay ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
disabled={newEvent.allDay}
```

## Zusammenfassung der Änderungen

| Bereich | Änderung |
|---------|----------|
| Speichern | +1 Tag zum Enddatum vor dem Speichern |
| Anzeigen | -1 Tag vom Enddatum beim Laden |
| Info-Modal | Intelligente Anzeige (eintägig vs. mehrtägig) |
| Formular | Dynamische Labels und deaktivierte Zeitfelder |
