'use client';

import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api-config';

interface EquipmentItem {
  id: number;
  quantity: number;
}

interface ViewEventModalProps {
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
    status: string;
    created_at: string;
  };
  onClose: () => void;
}

export default function ViewEventModal({ event, onClose }: ViewEventModalProps): React.ReactElement {
  const [availableVenues, setAvailableVenues] = useState<any[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<any[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.venues);
        if (response.ok) {
          const data = await response.json();
          setAvailableVenues(data);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    const fetchEquipment = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.resources);
        if (response.ok) {
          const data = await response.json();
          setAvailableEquipment(data);
        }
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchVenues();
    fetchEquipment();
  }, []);

  // Helper functions to check if sections should be displayed
  const hasApplicationDetails = () => {
    return event.application_date ||
           event.rental_date ||
           (event.behalf_of && event.behalf_of.trim() !== '') ||
           (event.contact_info && event.contact_info.trim() !== '') ||
           (event.nature_of_event && event.nature_of_event.trim() !== '');
  };

  const hasVenues = () => {
    return event.venues && event.venues.length > 0;
  };

  const hasSetupCleanup = () => {
    return event.setup_start_time ||
           event.setup_end_time ||
           (event.setup_hours && event.setup_hours > 0) ||
           event.event_start_time ||
           event.event_end_time ||
           (event.event_hours && event.event_hours > 0) ||
           event.cleanup_start_time ||
           event.cleanup_end_time ||
           (event.cleanup_hours && event.cleanup_hours > 0) ||
           (event.total_hours && event.total_hours > 0);
  };

  const hasEquipment = () => {
    return (event.equipment && event.equipment.length > 0) ||
           (event.chairs_qty && event.chairs_qty > 0) ||
           (event.tables_qty && event.tables_qty > 0) ||
           event.projector ||
           (event.other_equipment && event.other_equipment.trim() !== '');
  };

  const getSelectedVenues = () => {
    return availableVenues.filter(venue => event.venues.includes(venue.id));
  };

  const getSelectedEquipment = () => {
    if (!event.equipment || event.equipment.length === 0) {
      return [];
    }
    return event.equipment.map(item => {
      const equipment = availableEquipment.find(eq => eq.id === item.id);
      return equipment ? { ...equipment, quantity: item.quantity } : { id: item.id, name: `Equipment ${item.id}`, quantity: item.quantity };
    }).filter(Boolean);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[95vh] flex flex-col border border-gray-100">
        {/* Header - Fixed height to prevent cutting */}
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-8 py-6 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <i className="ri-eye-line text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">View Event Details</h2>
                  <p className="text-red-100 text-sm">Review event information</p>
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
          <div className="px-8 py-6 bg-gray-50/50">
            <div className="space-y-8">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
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
                    <p className="text-sm text-gray-600">Event details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={event.name}
                        disabled
                        className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
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
                        value={event.description || ''}
                        disabled
                        className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm resize-none"
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
                    <p className="text-sm text-gray-600">When the event takes place</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={formatDateTime(event.start_date)}
                        disabled
                        className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                      />
                      <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                    </div>
                  </div>

                  {event.end_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date & Time
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={formatDateTime(event.end_date)}
                          disabled
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                        />
                        <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Application/Rental & Contact - Only show if has data */}
              {hasApplicationDetails() && (
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
                    {event.application_date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formatDate(event.application_date)}
                            disabled
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                          />
                          <i className="ri-calendar-check-line absolute right-3 top-3.5 text-gray-400"></i>
                        </div>
                      </div>
                    )}

                    {event.rental_date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rental Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formatDate(event.rental_date)}
                            disabled
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                          />
                          <i className="ri-calendar-event-line absolute right-3 top-3.5 text-gray-400"></i>
                        </div>
                      </div>
                    )}

                    {event.behalf_of && event.behalf_of.trim() !== '' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application on behalf of
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={event.behalf_of}
                            disabled
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                          />
                          <i className="ri-building-line absolute right-3 top-3.5 text-gray-400"></i>
                        </div>
                      </div>
                    )}

                    {event.contact_info && event.contact_info.trim() !== '' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Information
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={event.contact_info}
                            disabled
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                          />
                          <i className="ri-phone-line absolute right-3 top-3.5 text-gray-400"></i>
                        </div>
                      </div>
                    )}

                    {event.nature_of_event && event.nature_of_event.trim() !== '' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nature of Event
                        </label>
                        <div className="relative">
                          <textarea
                            value={event.nature_of_event}
                            disabled
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm resize-none"
                            rows={2}
                          />
                          <i className="ri-file-list-line absolute right-3 top-3.5 text-gray-400"></i>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Venues - Only show if has venues */}
              {hasVenues() && (
                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="ri-map-pin-line text-indigo-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Venues Used</h3>
                      <p className="text-sm text-gray-600">Selected locations</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {getSelectedVenues().map(venue => (
                        <div key={venue.id} className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="ri-map-pin-line text-indigo-600"></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">{venue.name}</span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i className="ri-check-line mr-1"></i>
                                Selected
                              </span>
                            </div>
                            {venue.description && (
                              <p className="text-xs text-gray-600 mt-1">{venue.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Setup & Cleanup - Only show if has data */}
              {hasSetupCleanup() && (
                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="ri-tools-line text-orange-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Setup & Cleanup</h3>
                      <p className="text-sm text-gray-600">Time requirements</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Setup */}
                    {(event.setup_start_time || event.setup_end_time || (event.setup_hours && event.setup_hours > 0)) && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Setup</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {event.setup_start_time && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time
                              </label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={event.setup_start_time}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                />
                                <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                              </div>
                            </div>
                          )}
                          {event.setup_end_time && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time
                              </label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={event.setup_end_time}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                />
                                <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                              </div>
                            </div>
                          )}
                          {event.setup_hours && event.setup_hours > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hours
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={event.setup_hours}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                  min="0"
                                  step="0.5"
                                />
                                <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Event */}
                    {(event.event_start_time || event.event_end_time || (event.event_hours && event.event_hours > 0)) && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Event</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {event.event_start_time && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time
                              </label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={event.event_start_time}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                />
                                <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                              </div>
                            </div>
                          )}
                          {event.event_end_time && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time
                              </label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={event.event_end_time}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                />
                                <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                              </div>
                            </div>
                          )}
                          {event.event_hours && event.event_hours > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hours
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={event.event_hours}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                  min="0"
                                  step="0.5"
                                />
                                <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cleanup */}
                    {(event.cleanup_start_time || event.cleanup_end_time || (event.cleanup_hours && event.cleanup_hours > 0)) && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Cleanup</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {event.cleanup_start_time && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time
                              </label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={event.cleanup_start_time}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                />
                                <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                              </div>
                            </div>
                          )}
                          {event.cleanup_end_time && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time
                              </label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={event.cleanup_end_time}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                />
                                <i className="ri-time-line absolute right-3 top-3.5 text-gray-400"></i>
                              </div>
                            </div>
                          )}
                          {event.cleanup_hours && event.cleanup_hours > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hours
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={event.cleanup_hours}
                                  disabled
                                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                  min="0"
                                  step="0.5"
                                />
                                <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Total Hours */}
                    {event.total_hours && event.total_hours > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Hours
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={event.total_hours}
                            disabled
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                            min="0"
                            step="0.5"
                          />
                          <span className="absolute right-3 top-3.5 text-gray-400">Hrs</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Equipment */}
              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <i className="ri-archive-line text-teal-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Equipment & Resources</h3>
                      <p className="text-sm text-gray-600">Selected equipment and resources</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {hasEquipment() ? (
                      <>
                        {/* Chairs and Tables */}
                        {(event.chairs_qty && event.chairs_qty > 0) ||
                         (event.tables_qty && event.tables_qty > 0) ||
                         event.projector ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {event.chairs_qty && event.chairs_qty > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chairs Quantity
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={event.chairs_qty}
                                disabled
                                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                min="0"
                              />
                              <i className="ri-chair-line absolute right-3 top-3.5 text-gray-400"></i>
                            </div>
                          </div>
                        )}
                        {event.tables_qty && event.tables_qty > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tables Quantity
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={event.tables_qty}
                                disabled
                                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
                                min="0"
                              />
                              <i className="ri-table-line absolute right-3 top-3.5 text-gray-400"></i>
                            </div>
                          </div>
                        )}
                        {event.projector && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={event.projector}
                              disabled
                              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed mr-3"
                            />
                            <label className="text-sm font-medium text-gray-700">
                              Projector
                            </label>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Selected Equipment */}
                    {getSelectedEquipment().length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <i className="ri-tools-line mr-2 text-teal-600"></i>
                          Equipment Used
                        </h4>
                        <div className="space-y-3">
                          {getSelectedEquipment().map(equipment => (
                            <div key={equipment.id} className="flex items-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                                <i className="ri-tools-line text-teal-600"></i>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">{equipment.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Qty: {equipment.quantity}</span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <i className="ri-check-line mr-1"></i>
                                      Selected
                                    </span>
                                  </div>
                                </div>
                                {equipment.description && (
                                  <p className="text-xs text-gray-600 mt-1">{equipment.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other Equipment */}
                    {event.other_equipment && event.other_equipment.trim() !== '' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Equipment or Special Requests
                        </label>
                        <div className="relative">
                          <textarea
                            value={event.other_equipment}
                            disabled
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm resize-none"
                            rows={3}
                          />
                          <i className="ri-add-line absolute right-3 top-3.5 text-gray-400"></i>
                        </div>
                      </div>
                    )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <i className="ri-archive-line text-4xl text-gray-400 mb-3"></i>
                        <p className="text-gray-500 text-sm">No equipment required for this event</p>
                      </div>
                    )}
                  </div>
                </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
              <div className="text-sm text-gray-600">
                <i className="ri-eye-line mr-1"></i>
                Viewing event details
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium cursor-pointer shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                >
                  <i className="ri-close-line mr-2"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
