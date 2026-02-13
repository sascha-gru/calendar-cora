
                                            {Modal zum Löschen}
                                            <X className="h-6 w-6 text-red-600" aria-hidden="true" />
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
                                        <Button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                                        font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={() => {handleDelete(); handleCloseModal();}}>
                                            Ja, löschen
                                        </Button>
                                        <Button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                                        shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setModalType(null)}
                                        >
                                            Abbrechen
                                        </Button>
                                        </div




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



    