import { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Phone, Clock, Search, Globe, ChevronRight, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Clinic {
  id: string;
  name: string;
  location: string;
  services: string[];
  contact: string;
  lat: number;
  lng: number;
  openHours: string;
}

const CLINICS_DATA: Clinic[] = [
  {
    id: '1',
    name: 'Marie Stopes Kenya - Eastleigh',
    location: 'Eastleigh, Nairobi',
    services: ['Family Planning', 'STI Testing', 'Maternal Health'],
    contact: '0800 720 005',
    lat: -1.2727,
    lng: 36.8485,
    openHours: '08:00 - 18:00'
  },
  {
    id: '2',
    name: 'Family Health Options Kenya (FHOK)',
    location: 'Mai Mahiu Rd, Nairobi West',
    services: ['Counseling', 'Contraceptives', 'Youth Services'],
    contact: '+254 20 6003926',
    lat: -1.3094,
    lng: 36.8126,
    openHours: '09:00 - 17:00'
  },
  {
    id: '3',
    name: 'PS Kenya - Tunza Clinic',
    location: 'Kwangware, Nairobi',
    services: ['Child Health', 'Reproductive Care', 'Lab services'],
    contact: '0702 123 456',
    lat: -1.2858,
    lng: 36.7564,
    openHours: '08:00 - 20:00'
  },
  {
    id: '4',
    name: 'Aga Khan University Hospital - SRH Unit',
    location: '3rd Parklands Ave, Nairobi',
    services: ['Specialist Care', 'Fertility', 'Oncology'],
    contact: '+254 20 3662000',
    lat: -1.2612,
    lng: 36.8219,
    openHours: '24 Hours'
  }
];

export default function ClinicFinder() {
  const [clinics, setClinics] = useState<Clinic[]>(CLINICS_DATA);
  const [search, setSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Extract unique services
  const allServices = useMemo(() => {
    const services = new Set<string>();
    CLINICS_DATA.forEach(c => c.services.forEach(s => services.add(s)));
    return Array.from(services).sort();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.log("Geolocation error:", err)
      );
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
      ? prev.filter(s => s !== service) 
      : [...prev, service]
    );
  };

  const filteredClinics = clinics.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.location.toLowerCase().includes(search.toLowerCase());
    const matchesServices = selectedServices.length === 0 || 
                            selectedServices.every(s => c.services.includes(s));
    
    return matchesSearch && matchesServices;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Find a Clinic</h2>
        <p className="text-slate-500">Access professional care at safe, recognized centers across Kenya.</p>
        
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sage-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-sage-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-sage-600/20 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Filter size={14} /> Filter by Services
            </div>
            <div className="flex flex-wrap gap-2">
              {allServices.map(service => {
                const isSelected = selectedServices.includes(service);
                return (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      isSelected 
                      ? 'bg-sage-600 text-white border-sage-600 shadow-sm' 
                      : 'bg-white text-slate-600 border-sage-200 hover:border-sage-400'
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
              {selectedServices.length > 0 && (
                <button 
                  onClick={() => setSelectedServices([])}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 flex items-center gap-1 hover:bg-amber-100 transition-colors"
                >
                  <X size={12} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredClinics.map((clinic, idx) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800">{clinic.name}</h3>
                    {userLocation && (
                      <span className="bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {calculateDistance(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng)} KM AWAY
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin size={16} className="text-sage-600" />
                    {clinic.location}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {clinic.services.map(s => (
                      <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[140px]">
                  <a 
                    href={`tel:${clinic.contact}`}
                    className="flex items-center justify-center gap-2 bg-sage-600 text-white font-bold text-sm py-3 rounded-xl hover:bg-sage-700 transition-all"
                  >
                    <Phone size={16} /> Call Clinic
                  </a>
                  <button className="flex items-center justify-center gap-2 bg-white border border-sage-200 text-slate-600 font-bold text-sm py-3 rounded-xl hover:bg-sage-50 transition-all">
                    <Navigation size={16} /> Navigate
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={14} /> Open: {clinic.openHours}
                </div>
                <button className="text-sage-600 font-bold text-xs flex items-center gap-1 hover:underline">
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredClinics.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto">
              <Search size={30} />
            </div>
            <p className="text-slate-400 font-medium">No clinics found matching your criteria.</p>
            <button 
              onClick={() => { setSearch(""); setSelectedServices([]); }} 
              className="text-sage-600 font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
        <Globe className="text-blue-600 shrink-0" size={24} />
        <div className="space-y-1">
          <h4 className="font-bold text-blue-900 text-sm">Online Directory</h4>
          <p className="text-blue-700 text-xs leading-relaxed">
            For more locations, you can visit the official Ministry of Health (MOH) healthcare facility directory or contact Marie Stopes Kenya's toll-free line: <strong>0800 720 005</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

