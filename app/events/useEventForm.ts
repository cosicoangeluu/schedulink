import { useEffect, useState } from 'react';

interface EquipmentItem {
  id: number;
  quantity: number;
}

interface EventFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venues: number[];
  equipment: EquipmentItem[];
  application_date: string;
  rental_date: string;
  behalf_of: string;
  contact_info: string;
  nature_of_event: string;
  requires_equipment: boolean;
  chairs_qty: number;
  tables_qty: number;
  projector: boolean;
  gym_sound_system: boolean;
  microphone: boolean;
  other_equipment: string;
  setup_start_time: string;
  setup_end_time: string;
  setup_hours: number;
  event_start_time: string;
  event_end_time: string;
  event_hours: number;
  cleanup_start_time: string;
  cleanup_end_time: string;
  cleanup_hours: number;
  total_hours: number;
  multi_day_schedule?: string | File;
}

interface UseEventFormProps {
  initialData?: Partial<EventFormData>;
  isEdit?: boolean;
}

export function useEventForm({ initialData = {}, isEdit = false }: UseEventFormProps) {
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  };

  const [formData, setFormData] = useState<EventFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    start_date: isEdit ? formatDateForInput(initialData.start_date || '') : '',
    end_date: isEdit ? formatDateForInput(initialData.end_date || '') : '',
    venues: initialData.venues || [],
    equipment: initialData.equipment || [],
    application_date: initialData.application_date || '',
    rental_date: initialData.rental_date || '',
    behalf_of: initialData.behalf_of || '',
    contact_info: initialData.contact_info || '',
    nature_of_event: initialData.nature_of_event || '',
    requires_equipment: initialData.requires_equipment || false,
    chairs_qty: initialData.chairs_qty || 0,
    tables_qty: initialData.tables_qty || 0,
    projector: initialData.projector || false,
    gym_sound_system: initialData.other_equipment?.includes('Gym & Sound System') || false,
    microphone: initialData.other_equipment?.includes('Microphone') || false,
    other_equipment: initialData.other_equipment || '',
    setup_start_time: initialData.setup_start_time || '',
    setup_end_time: initialData.setup_end_time || '',
    setup_hours: initialData.setup_hours || 0,
    event_start_time: initialData.event_start_time || '',
    event_end_time: initialData.event_end_time || '',
    event_hours: initialData.event_hours || 0,
    cleanup_start_time: initialData.cleanup_start_time || '',
    cleanup_end_time: initialData.cleanup_end_time || '',
    cleanup_hours: initialData.cleanup_hours || 0,
    total_hours: initialData.total_hours || 0,
    ...(isEdit && { multi_day_schedule: initialData.multi_day_schedule || '' })
  });

  const [availableVenues, setAvailableVenues] = useState<any[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    let parsedValue: any = value;
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      parsedValue = parseInt(value) || 0;
    } else if (type === 'file' && files) {
      parsedValue = files[0] || null;
    }
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleVenueChange = (venueId: number, checked: boolean) => {
    setFormData({
      ...formData,
      venues: checked
        ? [...formData.venues, venueId]
        : formData.venues.filter(id => id !== venueId)
    });
  };

  const handleEquipmentChange = (equipmentId: number, quantity: number) => {
    setFormData({
      ...formData,
      equipment: quantity > 0
        ? [...formData.equipment.filter(item => item.id !== equipmentId), { id: equipmentId, quantity }]
        : formData.equipment.filter(item => item.id !== equipmentId)
    });
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('https://schedulink-backend.onrender.com/api/venues');
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
        const response = await fetch('https://schedulink-backend.onrender.com/api/resources');
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

  // Auto-compute hours based on start and end times
  useEffect(() => {
    const computeHours = (startTime: string, endTime: string) => {
      if (startTime && endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours > 0 ? diffHours : 0;
      }
      return 0;
    };

    const setupHours = computeHours(formData.setup_start_time, formData.setup_end_time);
    const eventHours = computeHours(formData.event_start_time, formData.event_end_time);
    const cleanupHours = computeHours(formData.cleanup_start_time, formData.cleanup_end_time);
    const totalHours = setupHours + eventHours + cleanupHours;

    // Only update if values have actually changed to prevent infinite loop
    if (
      formData.setup_hours !== setupHours ||
      formData.event_hours !== eventHours ||
      formData.cleanup_hours !== cleanupHours ||
      formData.total_hours !== totalHours
    ) {
      setFormData(prev => ({
        ...prev,
        setup_hours: setupHours,
        event_hours: eventHours,
        cleanup_hours: cleanupHours,
        total_hours: totalHours
      }));
    }
  }, [formData.setup_start_time, formData.setup_end_time, formData.event_start_time, formData.event_end_time, formData.cleanup_start_time, formData.cleanup_end_time, formData.setup_hours, formData.event_hours, formData.cleanup_hours, formData.total_hours]);

  return {
    formData,
    setFormData,
    availableVenues,
    availableEquipment,
    handleInputChange,
    handleVenueChange,
    handleEquipmentChange,
    formatDateForInput
  };
}
