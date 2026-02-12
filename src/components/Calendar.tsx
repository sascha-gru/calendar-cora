'use client';

import { useState, Fragment, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Transition, Dialog, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DropArg } from '@fullcalendar/interaction';
import { CheckIcon } from '@heroicons/react/20/solid'
import { X, Briefcase, PencilIcon } from 'lucide-react';
import { EventClickArg } from '@fullcalendar/core';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import deLocale from '@fullcalendar/core/locales/de'; 
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Modal } from './Modal/modal';
import { Button } from './Button/button';
import { register } from 'module';
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
        setNewEvent({ ...newEvent, start: startDate, end: endDate, allDay: false, id: new Date().getTime().toString() })
        setModalType('create')
    }

    function handleShowInfo(data: EventClickArg) {
        setNewEvent({
            id: data.event.id,
            title: data.event.title,
            description: data.event.extendedProps.description || '',
            start: data.event.start ?? new Date(),
            end: data.event.end ?? new Date(),
            allDay: data.event.allDay
        });
        setModalType('info');
    }

    function addEvent(data: DropArg ) {
        const startDate = data.date;
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 Minuten später
        const event = {...newEvent, start: startDate, end: endDate, title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime().toString() }
        setAllEvents([...allEvents, event])
    }
    
    function handleDeleteModal(data: {event: {id: string}}) {
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

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setAllEvents([...allEvents, newEvent])
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
        setAllEvents(allEvents.map(event => 
            event.id === newEvent.id ? newEvent : event
        ))
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
                        eventClick={handleUpdateEvent}
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

                            // Ganztägige Events
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

            {/* Modalkompenente Termin dynamisch: Erstellen, bearbeiten, Info zeigen, löschen */}
            <Modal isOpen={modalType !== null} onClose={handleCloseModal} title={
                    modalType === 'create' ? 'Neuen Termin erstellen' :
                    modalType === 'info' ? 'Details' :
                    modalType === 'edit' ? 'Termin bearbeiten' :
                    modalType === 'delete' ? 'Termin löschen' : ''
                } size='lg'>
                
                {/* Erstellen/Bearbeiten Modal */}
                {(modalType === 'create' || modalType === 'edit') && (
                    <div className="w-full rounded-lg bg-white px-6 py-8 shadow-md ring-1 ring-gray-900/5 sm:px-10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                           {modalType === 'create' ? <CheckIcon className="h-6 w-6 text-gray-600" aria-hidden="true" /> : <PencilIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />}
                        </div>

                        {/* X-Symbol zum Löschen oben rechts im Bearbeiten-Modal */}
                        {modalType === 'edit' && (
                            <button className="absolute top-20 right-10 text-gray-500 hover:text-gray-800" onClick={() => handleDeleteModal({event: {id: idToDelete ?? ''}})}>
                                <X className="h-6 w-5 cursor-pointer" aria-hidden="true"/>
                            </button>
                        )}

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
                                    <Label htmlFor='starttime'>Startdatum/-zeit</Label>
                                    <div className="flex items-center gap-1">
                                        <Input type="date" id="startdate" className="cursor-pointer"
                                        value={newEvent.start ? formatToLocalDate(newEvent.start) : ''}
                                        onClick={(e) => e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, start: 
                                        combineDateAndTime(newEvent.start, e.target.value, undefined)})} />

                                        <Input type="time" id="starttime" className="cursor-pointer"
                                        value={newEvent.start ? formatToLocalTime(newEvent.start) : ''}
                                        onClick={(e) => e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, start: 
                                        combineDateAndTime(newEvent.start, undefined, e.target.value)})} />
                                    </div>
                                </div>

                                {/* Enddatum */}
                                <div>
                                    <Label htmlFor='endtime'>Enddatum/-zeit</Label>
                                    <div className="flex items-center gap-1">
                                        <Input type="date" id="enddate" className="cursor-pointer"
                                        value={newEvent.end ? formatToLocalDate(newEvent.end) : ''}
                                        onClick={(e) => e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, end: 
                                        combineDateAndTime(newEvent.end, e.target.value, undefined)})} />

                                        <Input type="time" id="endtime" className="cursor-pointer"
                                        value={newEvent.end ? formatToLocalTime(newEvent.end) : ''}
                                        onClick={(e) => e.currentTarget.showPicker()}
                                        onChange={(e) => setNewEvent({...newEvent, end: 
                                        combineDateAndTime(newEvent.end, undefined, e.target.value)})} />
                                    </div>
                                </div>
                            </div>

                            {/* Beschreibung des Termins */}
                            <div className="mt-5">
                                <Label htmlFor='description'>Beschreibung (optional)</Label>
                                    <textarea 
                                    id="description" className="block w-full sm:leading-3 rounded-lg border border-gray-200 p-3 mt-1" 
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
                                    onClick={handleCloseModal}
                                >
                                    Abbrechen
                                </Button>
                            </div>
                    </form>
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
                                onClick={handleCloseModal}
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