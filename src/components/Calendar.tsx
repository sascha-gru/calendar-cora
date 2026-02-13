'use client';

import { useState, Fragment, useRef } from 'react';
import { set, useForm } from 'react-hook-form';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DropArg } from '@fullcalendar/interaction';
import { CheckIcon } from '@heroicons/react/20/solid'
import { X, PencilIcon, CalendarIcon } from 'lucide-react';
import { EventClickArg } from '@fullcalendar/core';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import deLocale from '@fullcalendar/core/locales/de'; 
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Modal } from './Modal/modal';
import { Button } from './Button/button';
import { Input } from './Input/input';
import { Label } from './Label/label';

interface Event {
    id: string;
    title: string;
    description: string;
    start: Date | string;
    end: Date | string;
    allDay: boolean;
}

export default function CalendarView() {
    const calendarRef = useRef<FullCalendar>(null);
    const { register, formState: { errors } } = useForm<Event>();
    const [originalEvent, setOriginalEvent] = useState<Event | null>(null);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [modalType, setModalType] = useState<'create' | 'info' | 'delete' | 'edit' | null>(null);
    const [previousModalType, setPreviousModalType] = useState<'info' | 'edit' | null>(null);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [newEvent, setNewEvent] = useState<Event>({
        id: '0',
        title: '',
        description: '',
        start: '',
        end: '',
        allDay: false,
    })

    // Formatiert Date zu lokalem Datum (YYYY-MM-DD)
    function formatToLocalDate(date: Date | string): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Formatiert Date zu lokaler Uhrzeit (HH:mm)
    function formatToLocalTime(date: Date | string): string {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Kombiniert Datum und Uhrzeit zu einem Date-String
    function combineDateAndTime(currentDate: Date | string | undefined, newDate?: string, newTime?: string): string {
        const current = currentDate ? new Date(currentDate) : new Date();
        const dateStr = newDate || formatToLocalDate(current);
        const timeStr = newTime || formatToLocalTime(current);
        return `${dateStr}T${timeStr}`;
    }

    function handleDateClick(arg: {date: Date, allDay: boolean }) {
        const startDate = arg.date;
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 Minuten später
        // allDay immer auf false setzen, damit der Benutzer es manuell aktivieren kann
        setNewEvent({
            id: new Date().getTime().toString(),
            title: '',
            description: '',
            start: startDate,
            end: endDate,
            allDay: false
        })
        setModalType('create')
    }

    function handleShowInfo(data: EventClickArg) {
        let endDate = data.event.end ?? data.event.start ?? new Date();
        // Bei ganztägigen Events: Enddatum -1 Tag für Anzeige (FullCalendar speichert exklusiv)
        if (data.event.allDay && data.event.end) {
            const adjustedEnd = new Date(data.event.end);
            adjustedEnd.setDate(adjustedEnd.getDate() - 1);
            endDate = adjustedEnd;
        }
        setNewEvent({
            id: data.event.id,
            title: data.event.title,
            description: data.event.extendedProps.description || '',
            start: data.event.start ?? new Date(),
            end: endDate,
            allDay: data.event.allDay
        });
        setIdToDelete(data.event.id);
        setModalType('info');
    }

    function addEvent(data: DropArg ) {
        const startDate = data.date;
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 Minuten später
        const event = {...newEvent, start: startDate, end: endDate, title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime().toString() }
        setAllEvents([...allEvents, event])
    }

    function handleEventDrop(info: { event: { id: string; start: Date | null; end: Date | null; allDay: boolean } }) {
        setAllEvents(allEvents.map(event => {
            if (event.id !== info.event.id) return event;

            const newStart = info.event.start ?? new Date();
            // Berechne die ursprüngliche Dauer und wende sie auf das neue Startdatum an
            const oldStart = new Date(event.start);
            const oldEnd = new Date(event.end);
            const duration = oldEnd.getTime() - oldStart.getTime();
            const newEnd = new Date(newStart.getTime() + duration);

            return { ...event, start: newStart, end: newEnd, allDay: info.event.allDay };
        }))
    }

    function handleDeleteModal(data: {event: {id: string}}, fromModal: 'info' | 'edit') {
        setPreviousModalType(fromModal);
        setModalType('delete');
        setIdToDelete(data.event.id);
    }

    function handleDelete() {
    setAllEvents(allEvents.filter(event => (event.id) !== idToDelete))
    setModalType(null);
    setIdToDelete(null)
    }

    function handleCloseModal() {
        setModalType(null)
        setNewEvent({
            id: '0',
            title: '',
            description: '',
            start: '',
            end: '',
            allDay: false,
        })
        setOriginalEvent(null)
        setIdToDelete(null)
        // Event-Selektion aufheben
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.unselect();
        }
        // Manuell die Selected-Klasse von allen Events entfernen
        document.querySelectorAll('.fc-event-selected').forEach(el => {
            el.classList.remove('fc-event-selected');
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewEvent({
        ...newEvent,
        title: e.target.value

        })
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setNewEvent({
        ...newEvent,
        description: e.target.value
        })
    }

    // Bei ganztägigen Events: Enddatum +1 Tag für FullCalendar (exklusives Enddatum)
    function adjustEndDateForAllDay(event: Event): Event {
        if (event.allDay && event.end) {
            const adjustedEnd = new Date(event.end);
            adjustedEnd.setDate(adjustedEnd.getDate() + 1);
            return { ...event, end: adjustedEnd };
        }
        return event;
    }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const eventToSave = adjustEndDateForAllDay(newEvent);
        setAllEvents([...allEvents, eventToSave])
        setModalType(null)
        setNewEvent({
            id: '0',
            title: '',
            description: '',
            start: '',
            end: '',
            allDay: false,
        })
    }

    function handleUpdate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const eventToSave = adjustEndDateForAllDay(newEvent);
        setAllEvents(allEvents.map(event =>
            event.id === newEvent.id ? eventToSave : event
        ))
        setOriginalEvent(newEvent)
        setModalType('info')
    }

    function handleUpdateEvent(data: EventClickArg) {
        // Formular mit den Daten des angeklickten Termins füllen
        const eventData = {
            id: data.event.id,
            title: data.event.title,
            description: data.event.extendedProps.description || '',
            start: data.event.start ?? new Date(),
            end: data.event.end ?? new Date(),
            allDay: data.event.allDay
        };
        setOriginalEvent(eventData);
        setNewEvent(eventData);
        setIdToDelete(data.event.id);  // ID für eventuelles Löschen speichern
        setModalType('edit')
    }

    function hasChanges(): boolean {
        if (!originalEvent) return false;
        return (
          newEvent.title !== originalEvent.title ||
          newEvent.description !== originalEvent.description ||
          newEvent.start?.toString() !== originalEvent.start?.toString() ||
          newEvent.end?.toString() !== originalEvent.end?.toString() ||
          newEvent.allDay !== originalEvent.allDay
      );  
    }

    return (
        <div className='min-h-screen px-70 py-20'>
            <div className='w-full'>
                <div className='cursor-pointer'>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[
                            dayGridPlugin,
                            interactionPlugin,
                            timeGridPlugin,
                            listPlugin,
                            momentTimezonePlugin,
                            multiMonthPlugin
                        ]}
                        timeZone="Europe/Berlin"
                        locale={deLocale}
                        initialDate={new Date()}
                        initialView="dayGridMonth"
                        navLinks={true}
                        headerToolbar={{
                            left: 'prev next timeGridDay',
                            center: 'title',
                            right: 'timeGridWeek dayGridMonth multiMonthYear listWeek'
                        }}
                        buttonText={{
                            day: 'Heute',
                            month: 'Monat',
                            week: 'Woche',
                            list: 'Terminübersicht'
                        }}
                        events={allEvents}
                        nowIndicator={true}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        selectMirror={true}
                        dateClick={handleDateClick}
                        drop={(data) => addEvent(data)}
                        eventClick={handleShowInfo}
                        eventDrop={handleEventDrop}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                        eventDidMount={(info) => {
                            // Für Listenansicht: "Uhr" zur Zeitanzeige hinzufügen
                            if (info.view.type === 'listWeek' && !info.event.allDay) {
                                const timeCell = info.el.querySelector('.fc-list-event-time');
                                if (timeCell && !timeCell.textContent?.includes('Uhr')) {
                                    timeCell.textContent = timeCell.textContent + ' Uhr';
                                }
                            }
                        }}
                        eventContent={(eventInfo) => {
                            const view = eventInfo.view.type;
                            const event = eventInfo.event;

                            // Eigene Zeitformatierung mit Null (4-stellig)
                            const formatTime = (date: Date | null) => {
                                if (!date) return '';
                                const hours = date.getHours().toString().padStart(2, '0');
                                const minutes = date.getMinutes().toString().padStart(2, '0');
                                return `${hours}:${minutes}`;
                            };

                            const startTime = formatTime(event.start);
                            const endTime = formatTime(event.end);
                            const timeText = `${startTime} - ${endTime}`;

                            // Listenansicht
                            if (view === 'listWeek') {
                                return (
                                    <span>
                                        <span className='font-bold'>{event.title}</span>
                                    </span>
                                );
                            }

                            // Für Wochen- und Tagesansicht
                            if ((view === 'timeGridWeek' || view === 'timeGridDay') && !event.allDay) {
                                return (
                                    <div className="fc-event-main-frame" style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span className="fc-event-title font-bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
                                        <span className="custom-event-time" style={{ whiteSpace: 'nowrap', fontSize: '0.9em' }}>{startTime} - {endTime} Uhr</span>
                                    </div>
                                );
                            }

                            // Monatsansicht
                            if (view === 'dayGridMonth' && !event.allDay) {
                                return (
                                    <div className="fc-event-main-frame" style={{
                                        backgroundColor: '#3788d8',
                                        color: 'white',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: '2px',
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        padding: '2px 4px',
                                        marginTop: '2px',
                                        marginBottom: '2px'
                                    }}>
                                        <span className="font-bold" style={{ wordBreak: 'break-word' }}>{event.title}</span>
                                        <span className="fc-event-time" style={{ whiteSpace: 'nowrap', fontSize: '0.85em' }}>{timeText} Uhr</span>
                                    </div>
                                );
                            }

                            // Ganztägige Events (Monatsansicht)
                            if (view === 'dayGridMonth' && event.allDay) {
                                return (
                                    <div className="fc-event-main-frame" style={{
                                        backgroundColor: '#3788d8',
                                        color: 'white',
                                        borderRadius: '4px',
                                        padding: '2px 4px',
                                    }}>
                                        <span className="font-bold">{event.title}</span>
                                    </div>
                                );
                            }

                            // Ganztägige Events (andere Ansichten)
                            return (
                                <div className="fc-event-main-frame">
                                    <div className="fc-event-title-container">
                                        <div className="fc-event-title fc-sticky">{event.title}</div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>

            {/* Modalkompenente Termin zum Erstellen, Bearbeiten, Info zeigen, löschen */}
            <Modal isOpen={modalType !== null} onClose={handleCloseModal} title={
                    modalType === 'create' ? 'Neuen Termin erstellen' :
                    modalType === 'info' ? 'Details' :
                    modalType === 'edit' ? 'Termin bearbeiten' :
                    modalType === 'delete' ? 'Termin löschen' : ''
                } size={modalType === 'info' || modalType === 'delete' ? 'md' : 'lg'}>
                
                {/* Modal zum Erstellen und Bearbeiten */}
                {(modalType === 'create' || modalType === 'edit') && (
                    <div className="w-full rounded-lg bg-white px-6 py-8 shadow-md ring-1 ring-gray-900/5 sm:px-10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                           {modalType === 'create' ? <CheckIcon className="h-6 w-6 text-gray-600" aria-hidden="true" /> : <PencilIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />}
                        </div>

                        {/* X-Symbol zum Löschen oben rechts im Bearbeiten-Modal */}
                        {modalType === 'edit' && (
                            <button className="absolute top-24 right-12 text-gray-500 hover:text-gray-800" onClick={() => handleDeleteModal({event: {id: idToDelete ?? ''}}, 'edit')}>
                                <X className="h-6 w-6 cursor-pointer" aria-hidden="true"/>
                            </button>
                        )}

                        {/* Titel des Modals Erstellen oder Bearbeiten */}
                        <h2 className="text-xl text-center font-semibold mt-4">{modalType === 'create' ? 'Neuen Termin erstellen' : 'Termin bearbeiten'}</h2>
                        <form className="mt-8 space-y-6" onSubmit={(e) => modalType === 'create' ? handleSubmit(e) : handleUpdate(e)}>
                            <div>
                                <Label htmlFor='title'>Titel</Label>
                                <Input
                                id="title"
                                {...register('title')}
                                value={newEvent.title} onChange={(e) => handleChange(e)}
                                placeholder="Fügen Sie einen Titel hinzu"
                                className="mt-1"
                                />
                                {errors.title && (
                                <p className="text-sm text-error-600 mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Datum und Zeit Eingabe: Startdatum */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <Label htmlFor='starttime'>{newEvent.allDay ? 'Startdatum' : 'Startdatum/-zeit'}</Label>
                                    <div className="flex items-center gap-1">
                                        <Input type="date" id="startdate" className="cursor-pointer"
                                        value={newEvent.start ? formatToLocalDate(newEvent.start) : ''}
                                        onClick={(e) => e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, start: 
                                        combineDateAndTime(newEvent.start, e.target.value, undefined)})} />

                                        <Input type="time" id="starttime"
                                        className={newEvent.allDay ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                                        disabled={newEvent.allDay}
                                        value={newEvent.start ? formatToLocalTime(newEvent.start) : ''}
                                        onClick={(e) => !newEvent.allDay && e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, start:
                                        combineDateAndTime(newEvent.start, undefined, e.target.value)})} />
                                    </div>
                                </div>

                                {/* Enddatum */}
                                <div>
                                    <Label htmlFor='endtime'>{newEvent.allDay ? 'Enddatum' : 'Enddatum/-zeit'}</Label>
                                    <div className="flex items-center gap-1">
                                        <Input type="date" id="enddate" className="cursor-pointer"
                                        value={newEvent.end ? formatToLocalDate(newEvent.end) : ''}
                                        onClick={(e) => e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, end: 
                                        combineDateAndTime(newEvent.end, e.target.value, undefined)})} />

                                        <Input type="time" id="endtime"
                                        className={newEvent.allDay ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                                        disabled={newEvent.allDay}
                                        value={newEvent.end ? formatToLocalTime(newEvent.end) : ''}
                                        onClick={(e) => !newEvent.allDay && e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, end:
                                        combineDateAndTime(newEvent.end, undefined, e.target.value)})} />
                                    </div>
                                </div>
                            </div>

                            {/* Beschreibung des Termins */}
                            <div className="mt-5">
                                <Label htmlFor='description'>Beschreibung (optional)</Label>
                                    <textarea 
                                    id="description" className="block w-full leading-relaxed rounded-lg border border-gray-200 px-3 py-4 mt-1 text-sm" 
                                    {...register('description')}
                                    value={newEvent.description} onChange={handleDescriptionChange} 
                                    placeholder="Fügen Sie eine Beschreibung hinzu" />
                            </div>

                            {/* Ganztägig Checkbox */}
                            <div className="flex justify-start mt-5">
                                <Label className="flex items-center cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 rounded cursor-pointer"
                                    checked={newEvent.allDay}
                                    onChange={(e) => setNewEvent({...newEvent, allDay: e.target.checked})} />
                                    <span className="ml-3">Ganztägig</span>
                                </Label>
                             </div>

                             {/* Buttons zum Erstellen/Aktualisieren oder Abbrechen des neuen Termins */}
                             <div className="mt-4 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <Button    
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-25 cursor-pointer"
                                    disabled={modalType === 'create' ? newEvent.title === "" : !hasChanges()}
                                >
                                    {modalType === 'create' ? 'Erstellen' : 'Aktualisieren'}
                                </Button>
                                <Button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 cursor-pointer"
                                    onClick={() => modalType === 'create' ? handleCloseModal() : setModalType('info')}
                                >
                                    Abbrechen
                                </Button>
                            </div>
                    </form>
                </div>
                )}

                {/* Modal zum Anzeigen von Termindetails */}
                {modalType === 'info' && (
                    <div className="w-full rounded-lg bg-white px-6 py-8 shadow-md ring-1 ring-gray-900/5 sm:px-10">
                            <button className="absolute top-24 right-12 text-gray-500 hover:text-gray-800" onClick={() => handleDeleteModal({event: {id: newEvent.id}}, 'info')}>
                                <X className="h-6 w-6 cursor-pointer" aria-hidden="true"/>
                            </button>

                        <div className="flex items-start justify-center gap-4 mt-8">
                            <CalendarIcon className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" />
                            <h2 className="text-2xl text-gray-900">{newEvent.title}</h2>
                        </div>

                            {newEvent.allDay ? (
                                <div className="text-center mt-6">
                                    <Label className="text-md text-gray-700">Ganztägig</Label>
                                    <p className="mt-1 text-gray-700">
                                        {(() => {
                                            const startStr = new Date(newEvent.start).toLocaleDateString('de-DE', { dateStyle: 'short' });
                                            const endStr = new Date(newEvent.end).toLocaleDateString('de-DE', { dateStyle: 'short' });
                                            return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
                                        })()}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="text-center">
                                        <Label className="text-md text-gray-700">Startdatum/-zeit</Label>
                                        <p className="mt-1 text-gray-700">{newEvent.start ? new Date(newEvent.start).toLocaleString('de-DE',
                                            { dateStyle: 'short', timeStyle: 'short' }).replace(',', ' -') : ''}</p>
                                    </div>
                                    <div className="text-center">
                                        <Label className="text-md text-gray-700">Enddatum/-zeit</Label>
                                        <p className="mt-1 text-gray-700">{newEvent.end ? new Date(newEvent.end).toLocaleString('de-DE',
                                            { dateStyle: 'short', timeStyle: 'short' }).replace(',', ' -') : ''}</p>
                                    </div>
                                </div>
                            )}
                            {newEvent.description && (
                                <>
                                    <p className="text-center text-md text-gray-700 font-semibold mt-8">Beschreibung:</p>
                                    <p className="mt-2 text-center text-sm text-gray-700 whitespace-pre-wrap">{newEvent.description}</p>
                                </>
                            )}

                        <div className="mt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <Button
                                type='button'
                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2 cursor-pointer"
                                onClick={() => {
                                    setOriginalEvent(newEvent);
                                    setModalType('edit');
                                }}
                            >
                                Termin bearbeiten
                            </Button>
                            <Button
                            type='button'
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 cursor-pointer"
                            onClick={handleCloseModal}
                            >
                                Schließen
                            </Button>
                        </div>
                    </div>
                )}

                {/* Löschen Modal */}
                {modalType === 'delete' && (
                    <div className="w-full rounded-lg bg-white px-6 py-8 shadow-md ring-1 ring-gray-900/5 sm:px-10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <X className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <h2 className="text-xl text-center font-semibold mt-4">Termin löschen</h2>
                        <p className="mt-4 text-center text-sm text-gray-500">
                            Möchten Sie diesen Termin wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>
                        <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <Button
                                type='button'
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:col-start-2 cursor-pointer"
                                onClick={handleDelete}
                            >
                                Löschen
                            </Button>
                            <Button
                                type='button'
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 cursor-pointer"
                                onClick={() => setModalType(previousModalType)}
                            >
                                Abbrechen
                            </Button>
                        </div>
                    </div>
                )}            
            </Modal>
        </div>
    )
}