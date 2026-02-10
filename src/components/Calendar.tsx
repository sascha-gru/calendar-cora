'use client';

import { useState, Fragment, useRef } from 'react';
import { Transition, Dialog, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { X, Briefcase } from 'lucide-react';
import { EventClickArg } from '@fullcalendar/core';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import deLocale from '@fullcalendar/core/locales/de'; 
import multiMonthPlugin from '@fullcalendar/multimonth'

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
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [updateModal, setUpdateModal] = useState (false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [newEvent, setNewEvent] = useState<Event>({
        id: '0',
        title: '',
        description: '',
        start: '',
        end: '',
        allDay: false,
    })

    // Formatiert Date zu lokalem datetime-local Format (YYYY-MM-DDTHH:mm)
    function formatToLocalDatetime(date: Date | string): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

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
        setShowModal(true)
    }

    function addEvent(data: DropArg ) {
        const startDate = data.date;
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 Minuten später
        const event = {...newEvent, start: startDate, end: endDate, title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime().toString() }
        setAllEvents([...allEvents, event])
    }
    
    function handleDeleteModal(data: {event: {id: string}}) {
        setDeleteModal(true);
        setIdToDelete(data.event.id);
    }

    function handleDelete() {
    setAllEvents(allEvents.filter(event => (event.id) !== idToDelete))
    setDeleteModal(false)
    setIdToDelete(null)
    }

    function handleCloseModal() {
        setShowModal(false)
        setUpdateModal(false)
        setNewEvent({
        id: '0',
        title: '',
        description: '',
        start: '',
        end: '',
        allDay: false,
        })
        setDeleteModal(false)
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
        setShowModal(false)
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
        setUpdateModal(false)
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
      setNewEvent({
          id: data.event.id,
          title: data.event.title,
          description: data.event.extendedProps.description || '',
          start: data.event.start ?? new Date(),
          end: data.event.end ?? new Date(),
          allDay: data.event.allDay
      });
      setIdToDelete(data.event.id);  // ID für eventuelles Löschen speichern
      setUpdateModal(true)
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

            {/* Modal für das Löschen eines Termins */}
            <Transition show={deleteModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setDeleteModal}>
                    <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </TransitionChild>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <DialogPanel className="relative transform overflow-hidden rounded-lg
                                    bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                                >
                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                                        justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Termin löschen
                                            </DialogTitle>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                Willst du den Termin wirklich löschen?
                                                </p>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                                        font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={() => {handleDelete(); handleCloseModal();}}>
                                            Ja, löschen
                                        </button>
                                        <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                                        shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setDeleteModal(false)}
                                        >
                                            Abbrechen
                                        </button>
                                        </div>
                                    </DialogPanel>
                                    </TransitionChild>
                                </div>
                                </div>
                            </Dialog>
                            </Transition>

                            {/* Modal für das Hinzufügen eines neuen Termins */} 
                            <Transition show={showModal} as={Fragment}>
                                <Dialog as="div" className="relative z-10" onClose={setShowModal}>
                                    <TransitionChild
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    >
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                    </TransitionChild>

                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <TransitionChild
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                
                                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                            <div>
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                </div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Neuen Termin hinzufügen
                                                        </DialogTitle>
                                                        <form action="submit" onSubmit={handleSubmit}>

                                                        {/* Titel des Termins */}
                                                        <div className="mt-2">
                                                            <label htmlFor="title" className="block text-start text-sm font-medium text-gray-700 mb-1">Titel</label>
                                                            <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                                            focus:ring-2 
                                                            focus:ring-inset focus:ring-blue-600 
                                                            sm:text-sm sm:leading-6 p-2"
                                                            value={newEvent.title} onChange={(e) => handleChange(e)} placeholder="Fügen Sie einen Titel hinzu" />
                                                        </div>

                                                        {/* Startzeit und Endzeit */}
                                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                                            <div>
                                                                <label htmlFor="startdate" className="block text-start text-sm font-medium text-gray-700 mb-1">Startdatum/-zeit</label>
                                                                <div className="flex items-center gap-1">
                                                                    <input type="date" id="startdate" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                                    value={newEvent.start ? formatToLocalDate(newEvent.start) : ''}
                                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                                    onChange={(e) => setNewEvent({...newEvent, start: combineDateAndTime(newEvent.start, e.target.value, undefined)})} />
                                                                    <input type="time" id="starttime" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                                    value={newEvent.start ? formatToLocalTime(newEvent.start) : ''}
                                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                                    onChange={(e) => setNewEvent({...newEvent, start: combineDateAndTime(newEvent.start, undefined, e.target.value)})} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label htmlFor="enddate" className="block text-start text-sm font-medium text-gray-700 mb-1">Enddatum/-zeit</label>
                                                                <div className="flex items-center gap-1">
                                                                    <input type="date" id="enddate" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                                    value={newEvent.end ? formatToLocalDate(newEvent.end) : ''}
                                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                                    onChange={(e) => setNewEvent({...newEvent, end: combineDateAndTime(newEvent.end, e.target.value, undefined)})} />
                                                                    <input type="time" id="endtime" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                                    value={newEvent.end ? formatToLocalTime(newEvent.end) : ''}
                                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                                    onChange={(e) => setNewEvent({...newEvent, end: combineDateAndTime(newEvent.end, undefined, e.target.value)})} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Beschreibung des Termins */}
                                                        <div className="mt-5">
                                                            <textarea name="description" className="block w-full rounded-md border-0 py-1.5 text-gray-900
                                                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                                            focus:ring-2 
                                                            focus:ring-inset focus:ring-blue-600 
                                                            sm:text-sm sm:leading-4 p-2" 
                                                            value={newEvent.description} onChange={handleDescriptionChange} placeholder="Fügen Sie eine Beschreibung hinzu (optional)" />
                                                        </div>

                                                        {/* Checkbox für ganztägige Termine */}
                                                        <div className="flex justify-start mt-5">
                                                            <label className="flex items-center cursor-pointer">
                                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-800 shadow-sm focus:ring-blue-600 cursor-pointer"
                                                                checked={newEvent.allDay}
                                                                onChange={(e) => setNewEvent({...newEvent, allDay: e.target.checked})} />
                                                                <span className="ml-3 text-sm text-gray-900">Ganztägig</span>
                                                            </label>
                                                        </div>

                                                        {/* Buttons zum Erstellen oder Abbrechen des neuen Termins */}
                                                        <div className="mt-4 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                            <button
                                                            type="submit"
                                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-25 cursor-pointer"
                                                            disabled={newEvent.title === ''}
                                                            >
                                                            Erstellen
                                                            </button>
                                                            <button
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 cursor-pointer"
                                                            onClick={handleCloseModal}
                                                            >
                                                            Abbrechen
                                                            </button>
                                                        </div>
                                                        </form>
                                                    </div>
                                            </div>
                                        </DialogPanel>
                                    </TransitionChild>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>  

                    {/* Modal für das Bearbeiten eines Termins */}
                    <Transition show={updateModal} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={setUpdateModal}>
                                <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                </TransitionChild>

                                <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <TransitionChild
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                
                                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <Briefcase className="h-6 w-6 text-green-600" aria-hidden="true"/>
                                    </div>
                                    <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={() => handleDeleteModal({event: {id: idToDelete ?? ''}})}>
                                        <X className="h-6 w-5 cursor-pointer" aria-hidden="true"/>
                                    </button>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        Termin bearbeiten
                                        </DialogTitle>
                                        <form action="submit" onSubmit={handleUpdate}>

                                            {/* Titel des Termins */}
                                            <div className="mt-2">
                                                <label htmlFor="title" className="block text-start text-sm font-medium text-gray-700 mb-1">Titel</label>
                                                <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                                focus:ring-2 
                                                focus:ring-inset focus:ring-blue-600 
                                                sm:text-sm sm:leading-6 p-2"
                                                value={newEvent.title} onChange={(e) => handleChange(e)} placeholder="Fügen Sie einen Titel hinzu" />
                                            </div>

                                            {/* Startzeit und Endzeit */}
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label htmlFor="startdate2" className="block text-start text-sm font-medium text-gray-700 mb-1">Startdatum/-zeit</label>
                                                    <div className="flex items-center gap-1">
                                                        <input type="date" id="startdate2" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                        value={newEvent.start ? formatToLocalDate(newEvent.start) : ''}
                                                        onClick={(e) => e.currentTarget.showPicker()}
                                                        onChange={(e) => setNewEvent({...newEvent, start: combineDateAndTime(newEvent.start, e.target.value, undefined)})} />
                                                        <input type="time" id="starttime2" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                        value={newEvent.start ? formatToLocalTime(newEvent.start) : ''}
                                                        onClick={(e) => e.currentTarget.showPicker()}
                                                        onChange={(e) => setNewEvent({...newEvent, start: combineDateAndTime(newEvent.start, undefined, e.target.value)})} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="enddate2" className="block text-start text-sm font-medium text-gray-700 mb-1">Enddatum/-zeit</label>
                                                    <div className="flex items-center gap-1">
                                                        <input type="date" id="enddate2" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                        value={newEvent.end ? formatToLocalDate(newEvent.end) : ''}
                                                        onClick={(e) => e.currentTarget.showPicker()}
                                                        onChange={(e) => setNewEvent({...newEvent, end: combineDateAndTime(newEvent.end, e.target.value, undefined)})} />
                                                        <input type="time" id="endtime2" className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-4 p-2 cursor-pointer"
                                                        value={newEvent.end ? formatToLocalTime(newEvent.end) : ''}
                                                        onClick={(e) => e.currentTarget.showPicker()}
                                                        onChange={(e) => setNewEvent({...newEvent, end: combineDateAndTime(newEvent.end, undefined, e.target.value)})} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Beschreibung des Termins */}
                                            <div className="mt-5">
                                                <textarea name="description" className="block w-full rounded-md border-0 py-1.5 text-gray-900
                                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                                focus:ring-2 
                                                focus:ring-inset focus:ring-blue-600 
                                                sm:text-sm sm:leading-4 p-2" 
                                                value={newEvent.description} onChange={handleDescriptionChange} placeholder="Fügen Sie eine Beschreibung hinzu (optional)" />
                                            </div>

                                            {/* Checkbox für ganztägige Termine */}
                                            <div className="flex justify-start mt-5">
                                                <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-800 shadow-sm focus:ring-blue-600 cursor-pointer"
                                                checked={newEvent.allDay}
                                                onChange={(e) => setNewEvent({...newEvent, allDay: e.target.checked})} />
                                                <span className="ml-3 text-sm text-gray-900">Ganztägig</span>
                                                </label>
                                            </div>

                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-25 cursor-pointer"
                                            disabled={newEvent.title === ''}

                                            >
                                            Aktualisieren
                                            </button>
                                            <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 cursor-pointer"
                                            onClick={handleCloseModal}
                                            >
                                            Abbrechen
                                            </button>
                                        </div>
                                        </form>
                                    </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>  
        </div>
    )
}