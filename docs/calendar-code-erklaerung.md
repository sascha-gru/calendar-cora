# Calendar.tsx - Code-Erklärung

Diese Dokumentation erklärt den Code der Calendar-Komponente Zeile für Zeile in einfacher Sprache.

---

## 1. useEffect - Drag & Drop Initialisierung

```typescript
useEffect(() => {
    let dragEl = document.getElementById('draggable-el')
    if (dragEl) {
        new Draggable(dragEl, {
            itemSelector: '.fc-event',
            eventData: function(eventEl: HTMLElement) {
                let id = eventEl.getAttribute("data");
                let title = eventEl.getAttribute("title");
                let description = eventEl.getAttribute("description");
                let start = eventEl.getAttribute("start");
                return {
                    id, title, description, start
                }
            }
        })
    }
}, [])
```

### Zeile für Zeile:

**`useEffect(() => {`**
- `useEffect` ist ein spezieller React-Befehl, der sagt: "Führe diesen Code aus, nachdem die Seite fertig geladen ist." Es ist wie ein Startschuss - sobald alles bereit ist, wird der Code darin ausgeführt.

**`let dragEl = document.getElementById('draggable-el')`**
- `let dragEl` erstellt eine Variable (einen Speicherplatz) namens "dragEl".
- `document` ist die gesamte Webseite.
- `getElementById('draggable-el')` sucht auf der Seite nach einem Element mit der ID "draggable-el" (das ist der Bereich rechts mit "Meine Termine").
- Das gefundene Element wird in der Variable `dragEl` gespeichert.

**`if (dragEl) {`**
- `if` bedeutet "falls" oder "wenn".
- Diese Zeile prüft: "Wurde das Element gefunden?" Falls ja, mache weiter. Falls nicht (z.B. Tippfehler in der ID), überspringe den Code darin.

**`new Draggable(dragEl, {`**
- `new` erstellt etwas Neues.
- `Draggable` ist eine Funktion aus der FullCalendar-Bibliothek, die Elemente "ziehbar" macht.
- `dragEl` sagt: "Mach den Bereich mit den Terminen ziehbar."
- `{` startet die Einstellungen (wie ein Menü mit Optionen).

**`itemSelector: '.fc-event',`**
- `itemSelector` bedeutet: "Welche Elemente innerhalb von dragEl sollen ziehbar sein?"
- `'.fc-event'` ist ein CSS-Selektor. Der Punkt bedeutet "suche nach der CSS-Klasse". Also: "Nur Elemente mit der Klasse `fc-event` sind ziehbar."

**`eventData: function(eventEl: HTMLElement) {`**
- `eventData` definiert: "Was soll passieren, wenn jemand ein Element zieht?"
- `function(eventEl: HTMLElement)` erstellt eine Funktion. `eventEl` ist das gezogene Element (z.B. "Termin Wichtig 1").
- `: HTMLElement` ist TypeScript und sagt dem Computer: "eventEl ist ein HTML-Element."

**`let id = eventEl.getAttribute("data");`**
- Erstellt Variable `id` und holt den Wert des Attributs "data" vom gezogenen Element.
- Beispiel: `<div data="123">` → `id` wäre "123"

**`let title = eventEl.getAttribute("title");`**
- Holt den Titel des Elements (z.B. "Termin Wichtig 1").

**`let description = eventEl.getAttribute("description");`**
- Holt die Beschreibung des Elements.

**`let start = eventEl.getAttribute("start");`**
- Holt das Startdatum des Elements.

**`return { id, title, description, start }`**
- `return` gibt etwas zurück.
- Hier werden alle gesammelten Daten als Paket zurückgegeben, damit der Kalender weiß, welcher Termin erstellt werden soll.

**`}, [])`**
- `}` beendet die useEffect-Funktion.
- `[]` ist ein leeres Array. Es bedeutet: "Führe diesen Code nur EINMAL aus, beim ersten Laden." Ohne `[]` würde der Code ständig wiederholt werden.

---

## 2. FullCalendar Properties

```typescript
<FullCalendar
    events={allEvents}
    nowIndicator={true}
    editable={true}
    droppable={true}
    selectable={true}
    selectMirror={true}
    dateClick={handleDateClick}
    drop={(data) => addEvent(data)}
    eventClick={(data) => handleDeleteModal(data)}
/>
```

### Zeile für Zeile:

**`events={allEvents}`**
- `events` ist wie eine Liste aller Termine, die im Kalender angezeigt werden sollen.
- `allEvents` ist die Variable, in der du deine Termine speicherst.
- Der Kalender schaut in diese Liste und zeigt jeden Termin an der richtigen Stelle an.

**`nowIndicator={true}`**
- `nowIndicator` bedeutet "Jetzt-Anzeiger".
- `true` heißt "an" oder "ja".
- Es wird eine rote Linie angezeigt, die zeigt, welche Uhrzeit gerade ist (nur in der Wochen- oder Tagesansicht sichtbar).

**`editable={true}`**
- `editable` bedeutet "bearbeitbar".
- `true` heißt: Termine können per Drag & Drop verschoben werden. Du kannst einen Termin anklicken und auf einen anderen Tag ziehen.

**`droppable={true}`**
- `droppable` bedeutet "empfänglich für Drops" (Ablegen).
- `true` heißt: Du kannst Termine von außen (z.B. von der Liste rechts) in den Kalender hineinziehen und dort ablegen.

**`selectable={true}`**
- `selectable` bedeutet "auswählbar".
- `true` heißt: Du kannst auf einen Tag oder Zeitraum klicken, um ihn auszuwählen (z.B. um einen neuen Termin zu erstellen).

**`selectMirror={true}`**
- `selectMirror` bedeutet "Auswahl-Spiegel".
- `true` heißt: Wenn du einen Zeitraum auswählst, wird ein Platzhalter angezeigt, der zeigt, wo der neue Termin landen würde.

**`dateClick={handleDateClick}`**
- `dateClick` bedeutet "Datum-Klick".
- `handleDateClick` ist eine Funktion, die oben im Code definiert ist.
- Wenn jemand auf ein Datum klickt, wird diese Funktion ausgeführt. Sie speichert das angeklickte Datum für einen neuen Termin.

**`drop={(data) => addEvent(data)}`**
- `drop` bedeutet "fallen lassen" oder "ablegen".
- `(data) => addEvent(data)` ist eine kleine Funktion (Pfeilfunktion).
- Wenn du einen Termin von rechts in den Kalender ziehst und loslässt, passiert:
  1. `data` enthält alle Infos (welches Datum, welcher Termin)
  2. `addEvent(data)` wird aufgerufen und fügt den Termin zur Liste hinzu

**`eventClick={(data) => handleDeleteModal(data)}`**
- `eventClick` bedeutet "Termin-Klick".
- Wenn du auf einen bestehenden Termin im Kalender klickst:
  1. `data` enthält die Infos über den angeklickten Termin
  2. `handleDeleteModal(data)` öffnet ein Popup-Fenster, das fragt ob du den Termin löschen möchtest

---

## 3. Termin-Liste (Draggable Elements)

```typescript
<div id="draggable-el" className='ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2'>
    <h1 className='font-bold text-lg text-center'>Meine Termine</h1>
    {events.map((event) => (
        <div className='fc-event border-2 p-1 w-full text-center rounded-md ml-auto m-2 bg-white cursor-pointer'
            title={event.title}
            key={event.id}
        >
            {event.title}
        </div>
    ))}
</div>
```

### Zeile für Zeile:

**`<div id="draggable-el" className='ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2'>`**
- `<div>` ist ein Container (wie eine unsichtbare Box).
- `id="draggable-el"` gibt dieser Box einen Namen. Das ist wichtig, weil der `useEffect`-Code oben genau nach dieser ID sucht, um die Box "ziehbar" zu machen.
- `className='...'` sind Styling-Klassen von Tailwind CSS:
  - `ml-8` = margin-left (Abstand links)
  - `w-full` = volle Breite
  - `border-2` = Rand mit 2 Pixel Dicke
  - `p-2` = padding (Innenabstand)
  - `rounded-md` = abgerundete Ecken
  - `mt-16` = margin-top (Abstand oben)
  - `lg:h-1/2` = auf großen Bildschirmen halbe Höhe

**`<h1 className='font-bold text-lg text-center'>Meine Termine</h1>`**
- `<h1>` ist eine Überschrift.
- `font-bold` = fett gedruckt
- `text-lg` = größere Schrift
- `text-center` = zentriert
- "Meine Termine" ist der Text, der angezeigt wird.

**`{events.map((event) => (`**
- `events` ist die Liste mit Terminen (die 5 "Termin Wichtig" Einträge).
- `.map()` ist eine Schleife. Sie geht durch jeden Eintrag in der Liste.
- `(event) =>` bedeutet: Für jeden einzelnen Termin (genannt "event") mache folgendes...
- Die geschweiften Klammern `{}` sagen React: "Hier kommt JavaScript-Code."

**`<div className='fc-event border-2 p-1 w-full text-center rounded-md ml-auto m-2 bg-white cursor-pointer'`**
- Für jeden Termin wird eine Box erstellt.
- `fc-event` = **WICHTIG!** Diese Klasse macht das Element ziehbar (der `useEffect` sucht danach).
- `border-2` = Rand
- `p-1` = kleiner Innenabstand
- `w-full` = volle Breite
- `text-center` = Text zentriert
- `rounded-md` = abgerundete Ecken
- `m-2` = Abstand rundherum
- `bg-white` = weißer Hintergrund
- `cursor-pointer` = Mauszeiger wird zur Hand (zeigt: "klickbar")

**`title={event.title}`**
- Speichert den Titel als HTML-Attribut. Der `useEffect`-Code liest diesen Wert mit `getAttribute("title")`.

**`key={event.id}`**
- `key` ist eine Pflichtangabe für React bei Listen.
- React braucht eine eindeutige ID für jeden Eintrag, um effizient zu arbeiten.

**`{event.title}`**
- Zeigt den Titel des Termins an (z.B. "Termin Wichtig 1").

---

## 4. Woher kommen die Property-Namen?

Die Namen wie `events`, `nowIndicator`, `editable`, etc. kommen aus der **offiziellen FullCalendar-Dokumentation**.

### Quellen:

**1. Offizielle Dokumentation (beste Quelle):**
- https://fullcalendar.io/docs

Kategorien in der Doku:
- "Event Display" → `events`
- "Date & Time Display" → `nowIndicator`
- "Event Dragging & Resizing" → `editable`, `droppable`
- "Date Clicking & Selecting" → `selectable`, `selectMirror`, `dateClick`
- "Event Clicking & Hovering" → `eventClick`

**2. TypeScript-Typen:**
- In `node_modules/@fullcalendar/core/index.d.ts` findest du die TypeScript-Definitionen, aber das ist sehr unübersichtlich.

**3. VS Code Autovervollständigung:**
- Wenn du in VS Code `<FullCalendar` tippst und dann `Strg+Leertaste` drückst, zeigt dir die Autovervollständigung alle verfügbaren Props an.

**Wichtig:** Du "erfindest" diese Namen nicht selbst. Du liest sie in der Doku nach oder nutzt die Autovervollständigung in VS Code.

---

## Zusammenfassung

| Bereich | Zweck |
|---------|-------|
| `useEffect` | Initialisiert Drag & Drop beim Laden der Seite |
| FullCalendar Props | Konfigurieren das Verhalten des Kalenders |
| Termin-Liste | Zeigt ziehbare Termine an der Seite |
| `fc-event` Klasse | Macht Elemente ziehbar |
| `id="draggable-el"` | Markiert den Container für Drag & Drop |
