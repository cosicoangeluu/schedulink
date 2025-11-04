'use client';

import React from 'react';
import { useEventForm } from './useEventForm';

interface EquipmentItem {
  id: number;
  quantity: number;
}

interface EditEventModalProps {
  event: {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date?: string;
    venues: number[];
    equipment: EquipmentItem[];
    application_date: string;
    rental_date: string;
    behalf_of: string;
    contact_info: string;
    nature_of_event: string;
    requires_equipment?: boolean;
    chairs_qty?: number;
    tables_qty?: number;
    projector?: boolean;
    other_equipment?: string;
    setup_start_time?: string;
    setup_end_time?: string;
    setup_hours?: number;
    event_start_time?: string;
    event_end_time?: string;
    event_hours?: number;
    cleanup_start_time?: string;
    cleanup_end_time?: string;
    cleanup_hours?: number;
    total_hours?: number;
    multi_day_schedule?: string;
  };
  onClose: () => void;
  onSave: (id: number, updatedEvent: { name: string; description: string; start_date: string; end_date?: string; venues: number[]; equipment: EquipmentItem[]; application_date: string; rental_date: string; behalf_of: string; contact_info: string; nature_of_event: string; requires_equipment?: boolean; chairs_qty?: number; tables_qty?: number; projector?: boolean; other_equipment?: string; setup_start_time?: string; setup_end_time?: string; setup_hours?: number; event_start_time?: string; event_end_time?: string; event_hours?: number; cleanup_start_time?: string; cleanup_end_time?: string; cleanup_hours?: number; total_hours?: number; multi_day_schedule?: string }) => void;
}

export default function EditEventModal({ event, onClose, onSave }: EditEventModalProps): React.ReactElement {
  const { formData, availableVenues, availableEquipment, handleInputChange, handleVenueChange, handleEquipmentChange } = useEventForm({
    initialData: event,
    isEdit: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.start_date) {
      let finalOtherEquipment = formData.other_equipment;
      if (formData.gym_sound_system) {
        finalOtherEquipment = finalOtherEquipment ? `${finalOtherEquipment}, Gym & Sound System` : 'Gym & Sound System';
      }
      if (formData.microphone) {
        finalOtherEquipment = finalOtherEquipment ? `${finalOtherEquipment}, Microphone` : 'Microphone';
      }

      const eventData = {
        name: formData.name,
        description: formData.description || '',
        start_date: formData.start_date,
        ...(formData.end_date && { end_date: formData.end_date }),
        venues: formData.venues,
        equipment: formData.equipment,
        application_date: formData.application_date || '',
        rental_date: formData.rental_date || '',
        behalf_of: formData.behalf_of || '',
        contact_info: formData.contact_info || '',
        nature_of_event: formData.nature_of_event || '',
        requires_equipment: formData.requires_equipment,
        chairs_qty: formData.chairs_qty || 0,
        tables_qty: formData.tables_qty || 0,
        projector: formData.projector,
        other_equipment: finalOtherEquipment || '',
        setup_start_time: formData.setup_start_time || '',
        setup_end_time: formData.setup_end_time || '',
        setup_hours: formData.setup_hours || 0,
        event_start_time: formData.event_start_time || '',
        event_end_time: formData.event_end_time || '',
        event_hours: formData.event_hours || 0,
        cleanup_start_time: formData.cleanup_start_time || '',
        cleanup_end_time: formData.cleanup_end_time || '',
        cleanup_hours: formData.cleanup_hours || 0,
        total_hours: formData.total_hours || 0,
        ...(formData.multi_day_schedule && { multi_day_schedule: formData.multi_day_schedule })
      };
      onSave(event.id, eventData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[95vh] flex flex-col border border-gray-100">
        {/* Header - Fixed height to prevent cutting */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-8 py-6 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <i className="ri-calendar-event-line text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Event</h2>
                  <p className="text-red-100 text-sm">Update the details to modify your event</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm hover:scale-105"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-8 py-6 bg-gray-50/50">
          <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Basic Info */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-information-line text-blue-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-600">Tell us about your event</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                      placeholder="e.g., Basketball Tournament, Seminar, Meeting"
                      required
                    />
                    <i className="ri-edit-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                      placeholder="Briefly describe your event..."
                      rows={3}
                    />
                    <i className="ri-file-text-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                </div>
              </div>
            </section>

            {/* Dates */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-calendar-line text-green-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
                  <p className="text-sm text-gray-600">When will your event take place?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      step="60"
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                      required
                    />
                    <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <i className="ri-information-line mr-1"></i>
                    Select date and time (hours and minutes)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      step="60"
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                    />
                    <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <i className="ri-information-line mr-1"></i>
                    Leave empty for single-day events
                  </p>
                </div>

                {formData.end_date && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <i className="ri-file-upload-line text-blue-600 mt-0.5"></i>
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 font-medium">Multi-day event detected</p>
                        <p className="text-xs text-blue-600 mt-1">Attach schedule if available</p>
                        <input
                          type="file"
                          name="multi_day_schedule"
                          onChange={handleInputChange}
                          className="mt-2 w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black bg-white"
                          accept=".pdf,.doc,.docx"
                        />
                        {formData.multi_day_schedule && typeof formData.multi_day_schedule === 'string' && (
                          <p className="text-xs text-blue-600 mt-1">Current file: {formData.multi_day_schedule}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-amber-600 mt-0.5"></i>
                    <div>
                      <p className="text-sm text-amber-800 font-medium">Additional Details</p>
                      <p className="text-xs text-amber-700 mt-1">Please refer to the paper application form for additional date-related details.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Application/Rental & Contact */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-line text-purple-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                  <p className="text-sm text-gray-600">Administrative information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="application_date"
                      value={formData.application_date}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                    />
                    <i className="ri-calendar-check-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="rental_date"
                      value={formData.rental_date}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                    />
                    <i className="ri-calendar-event-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application on behalf of
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="behalf_of"
                      value={formData.behalf_of}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                      placeholder="e.g., Business, Individual, Organization"
                    />
                    <i className="ri-building-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="contact_info"
                      value={formData.contact_info}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                      placeholder="Enter contact number or email"
                    />
                    <i className="ri-phone-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nature of Event
                  </label>
                  <div className="relative">
                    <textarea
                      name="nature_of_event"
                      value={formData.nature_of_event}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                      placeholder="e.g., Youth basketball game, karate tournament, meeting, seminar"
                      rows={2}
                    />
                    <i className="ri-file-list-line absolute right-3 top-3.5 text-gray-400"></i>
                  </div>
                </div>
              </div>
            </section>

            {/* Venues */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <i className="ri-map-pin-line text-indigo-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Venue Selection</h3>
                  <p className="text-sm text-gray-600">Choose your preferred locations</p>
                </div>
              </div>

              <div className="space-y-3">
                {availableVenues.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                    {availableVenues.map(venue => (
                      <label key={venue.id} className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.venues.includes(venue.id)}
                          onChange={(e) => handleVenueChange(venue.id, e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{venue.name}</span>
                            {venue.availability && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i className="ri-check-line mr-1"></i>
                                Available
                              </span>
                            )}
                          </div>
                          {venue.description && (
                            <p className="text-xs text-gray-600 mt-1">{venue.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="ri-building-line text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-500 text-sm mb-2">No venues available</p>
                    <p className="text-xs text-gray-400">Add venues in the Resources section</p>
                  </div>
                )}
              </div>
            </section>

            {/* Setup & Cleanup */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ri-tools-line text-orange-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Setup & Cleanup</h3>
                  <p className="text-sm text-gray-600">Time requirements for preparation</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Setup */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Setup</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="setup_start_time"
                          value={formData.setup_start_time}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="setup_end_time"
                          value={formData.setup_end_time}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="setup_hours"
                          value={formData.setup_hours}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                          min="0"
                          step="0.5"
                          readOnly
                        />
                        <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Event</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="event_start_time"
                          value={formData.event_start_time}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="event_end_time"
                          value={formData.event_end_time}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="event_hours"
                          value={formData.event_hours}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                          min="0"
                          step="0.5"
                          readOnly
                        />
                        <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cleanup */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Cleanup</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="cleanup_start_time"
                          value={formData.cleanup_start_time}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          name="cleanup_end_time"
                          value={formData.cleanup_end_time}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="cleanup_hours"
                          value={formData.cleanup_hours}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                          min="0"
                          step="0.5"
                          readOnly
                        />
                        <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Hours
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="total_hours"
                      value={formData.total_hours}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200"
                      min="0"
                      step="0.5"
                      readOnly
                    />
                    <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-information-line text-amber-600 mt-0.5"></i>
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Important Note</p>
                    <p className="text-xs text-amber-700 mt-1">Please refer to the paper application form for detailed setup/cleanup guidelines and requirements.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Equipment */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <i className="ri-archive-line text-teal-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Equipment & Resources</h3>
                  <p className="text-sm text-gray-600">Select equipment and additional resources needed</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="requires_equipment"
                    checked={formData.requires_equipment}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-900">
                    I need equipment for this event
                  </label>
                </div>

                {formData.requires_equipment && (
                  <div className="space-y-6 pl-4 border-l-2 border-teal-200">
                    {/* Available Equipment */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <i className="ri-tools-line mr-2 text-teal-600"></i>
                        Available Equipment
                      </h4>
                      {availableEquipment.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {availableEquipment.map(equipment => {
                            const selectedItem = formData.equipment.find(item => item.id === equipment.id);
                            const isMultiUnit = equipment.total > 1;
                            return (
                              <div key={equipment.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <div className="flex items-center flex-1">
                                  {isMultiUnit ? (
                                    <>
                                      <input
                                        type="number"
                                        min="0"
                                        max={equipment.available}
                                        value={selectedItem?.quantity || 0}
                                        onChange={(e) => handleEquipmentChange(equipment.id, parseInt(e.target.value) || 0)}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm mr-3"
                                        placeholder="Qty"
                                      />
                                      <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900">{equipment.name}</span>
                                        <p className="text-xs text-gray-600">Available: {equipment.available}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <input
                                        type="checkbox"
                                        checked={selectedItem?.quantity === 1 || false}
                                        onChange={(e) => handleEquipmentChange(equipment.id, e.target.checked ? 1 : 0)}
                                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 mr-3"
                                      />
                                      <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900">{equipment.name}</span>
                                        {equipment.description && (
                                          <p className="text-xs text-gray-600">{equipment.description}</p>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                {equipment.available > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <i className="ri-check-line mr-1"></i>
                                    Available
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <i className="ri-archive-line text-4xl text-gray-300 mb-3"></i>
                          <p className="text-gray-500 text-sm mb-2">No equipment available</p>
                          <p className="text-xs text-gray-400">Add equipment in the Resources section</p>
                        </div>
                      )}
                    </div>

                    {/* Other Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Equipment or Special Requests
                      </label>
                      <div className="relative">
                        <textarea
                          name="other_equipment"
                          value={formData.other_equipment}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                          placeholder="e.g., Hurricane fan, microphone, special lighting, etc."
                          rows={3}
                        />
                        <i className="ri-add-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <i className="ri-information-line mr-1"></i>
                        Specify any additional equipment not listed above
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
              <div className="text-sm text-gray-600">
                <i className="ri-information-line mr-1"></i>
                All fields marked with <span className="text-red-500">*</span> are required
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium cursor-pointer"
                >
                  <i className="ri-close-line mr-2"></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-medium cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <i className="ri-save-line mr-2"></i>
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
