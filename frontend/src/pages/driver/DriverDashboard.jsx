import { useState, useEffect } from 'react';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { 
  MapPin, Navigation, Package, DollarSign, Bell, Truck, 
  Settings as SettingsIcon, Power, LogOut, ChevronRight, 
  User, CircleDot, X, Check, Star, Navigation2, Clock, CheckCircle2
} from 'lucide-react';

const MOCK_REQUESTS = [
  {
    id: 'REQ-101',
    customer: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 4.8,
    pickup: 'Warehouse A (Northside)',
    dropoff: '124 Green St. Downtown',
    distance: '3.2 mi',
    timeEst: '14 mins',
    payout: '$45.00',
    cargoType: 'Pallets (Medium)',
    coordinates: [51.51, -0.1]
  },
  {
    id: 'REQ-102',
    customer: 'David Chen',
    avatar: 'https://i.pravatar.cc/150?u=david',
    rating: 4.9,
    pickup: 'Port Terminal 3',
    dropoff: 'Tech Hub Building',
    distance: '8.5 mi',
    timeEst: '28 mins',
    payout: '$112.50',
    cargoType: 'Electronics',
    coordinates: [51.49, -0.08]
  },
  {
    id: 'REQ-103',
    customer: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    rating: 4.7,
    pickup: 'IKEA Furniture Store',
    dropoff: '772 Residential Ave',
    distance: '5.1 mi',
    timeEst: '18 mins',
    payout: '$65.00',
    cargoType: 'Furniture',
    coordinates: [51.52, -0.07]
  }
];

const DriverDashboard = () => {
  // states: 'offline', 'scanning', 'viewing_requests', 'en_route', 'arrived', 'in_transit', 'completed'
  const [appState, setAppState] = useState('offline');
  const [cargoSpace, setCargoSpace] = useState('');
  const [destination, setDestination] = useState('');
  
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    if (appState === 'scanning') {
      const timer = setTimeout(() => {
        setRequests(MOCK_REQUESTS);
        setAppState('viewing_requests');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleToggleOnline = (e) => {
    e.preventDefault();
    if (appState === 'offline') {
      if (!cargoSpace) {
        alert("Please enter your available capacity to go online.");
        return;
      }
      setAppState('scanning');
    } else {
      setAppState('offline');
      setRequests([]);
      setSelectedRequest(null);
      setActiveJob(null);
    }
  };

  const handleAcceptRequest = () => {
    setActiveJob(selectedRequest);
    setSelectedRequest(null);
    setAppState('en_route');
  };

  const handleRejectRequest = () => {
    setRequests(requests.filter(r => r.id !== selectedRequest.id));
    setSelectedRequest(null);
  };

  const advanceDeliveryState = () => {
    if (appState === 'en_route') setAppState('arrived');
    else if (appState === 'arrived') setAppState('in_transit');
    else if (appState === 'in_transit') setAppState('completed');
    else if (appState === 'completed') {
       setActiveJob(null);
       setAppState('viewing_requests'); // back to viewing requests
    }
  };

  // Build map data based on state
  let driverMapData = [
    { id: 'SELF', name: 'Your Vehicle', cargoSpace: cargoSpace || 'Offline', coordinates: [51.505, -0.09], heading: destination }
  ];

  if (appState === 'viewing_requests') {
     requests.forEach(req => {
       driverMapData.push({
         id: req.id, name: req.customer, coordinates: req.coordinates, cargoSpace: 'Needs Transport'
       });
     });
  } else if (activeJob) {
     driverMapData.push({
       id: activeJob.id, name: activeJob.customer, coordinates: activeJob.coordinates, cargoSpace: 'Destination'
     });
  }

  // Helper renderers
  const renderTopHUD = () => (
    <div style={{ position: 'absolute', top: 'env(safe-area-inset-top, 1rem)', left: '1rem', right: '1rem', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', pointerEvents: 'auto', boxShadow: 'var(--shadow-md)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: appState !== 'offline' ? '#10B981' : '#94A3B8', boxShadow: appState !== 'offline' ? '0 0 10px #10B981' : 'none', transition: 'all 0.3s' }}></div>
            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-secondary)' }}>VerdiMo Driver</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', pointerEvents: 'auto' }}>
             <button className="icon-btn glass" style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-md)' }} onClick={() => window.location.href='/driver/settings'}>
               <User size={18} color="var(--color-secondary)" />
             </button>
             {appState !== 'offline' && (
               <div className="glass" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', boxShadow: 'var(--shadow-md)' }}>
                 <Bell size={18} color="var(--color-primary)" />
               </div>
             )}
          </div>
        </div>

        {/* Earnings Widget */}
        <div className="glass" style={{ width: 'fit-content', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto', boxShadow: 'var(--shadow-md)' }}>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>Earnings Today</span>
             <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center' }}>
               <DollarSign size={16} color="var(--color-primary)" /> 142.50
             </span>
           </div>
           <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>Completed</span>
             <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-secondary)', textAlign: 'center' }}>4</span>
           </div>
        </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', top: 0, left: 0, position: 'fixed', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
      
      {/* Absolute Map Layer */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1, filter: appState !== 'offline' ? 'none' : 'grayscale(1) opacity(0.8)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <LiveTrackingMap drivers={driverMapData} />
        {appState === 'scanning' && (
           <div className="radar-pulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.4)', zIndex: 1000, pointerEvents: 'none' }}></div>
        )}
      </div>

      {renderTopHUD()}

      {/* Floating Gradient Shadow */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50vh', background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }}></div>

      {/* Main Interaction Area */}
      <div style={{ position: 'absolute', bottom: 'calc(4rem + env(safe-area-inset-bottom))', left: 0, right: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {appState === 'offline' && (
          <div className="card glass-card" style={{ width: 'calc(100% - 2rem)', padding: '1.5rem', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                 <span style={{ fontWeight: 800 }}>Currently Offline</span>
                 <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Setup cargo details to begin</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Package size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Cargo Space Available (e.g. 50%)" 
                  value={cargoSpace}
                  onChange={(e) => setCargoSpace(e.target.value)}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 2.8rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#F1F5F9', fontSize: '0.875rem', fontWeight: 600 }} 
                />
              </div>
            </div>
            <button onClick={handleToggleOnline} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', fontWeight: 800, borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Power size={20} /> GO ONLINE
            </button>
          </div>
        )}

        {appState === 'scanning' && (
           <div className="card glass-card" style={{ width: 'calc(100% - 2rem)', padding: '1.5rem', boxShadow: 'var(--shadow-xl)', border: '2px solid var(--color-primary)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
             <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--color-primary)', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
               <div className="pulse-dot-primary"></div>
               <span style={{ fontWeight: 800 }}>Scanning network...</span>
               <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'none' }}>Finding nearby cargo requests</span>
             </h2>
             <button onClick={handleToggleOnline} className="btn" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontWeight: 700, backgroundColor: '#EF4444', color: 'white', borderRadius: 'var(--radius-full)' }}>Cancel</button>
           </div>
        )}

        {appState === 'viewing_requests' && !selectedRequest && (
          <div style={{ width: '100%', paddingBottom: '0.5rem' }}>
             <div style={{ padding: '0 1rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontWeight: 800, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Nearby Cargo Requests</span>
               <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800 }}>{requests.length} Found</span>
             </div>
             {/* Horizontal Scroll Carousel */}
             <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem', padding: '0 1rem', paddingBottom: '1rem', scrollSnapType: 'x mandatory' }} className="hide-scrollbar">
               {requests.map(req => (
                 <div key={req.id} onClick={() => setSelectedRequest(req)} className="glass-card zoom-on-hover" style={{ minWidth: '280px', flexShrink: 0, scrollSnapAlign: 'start', backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={req.avatar} alt={req.customer} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{req.customer}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#EAB308', fontWeight: 700 }}>
                            <Star size={12} fill="#EAB308" /> {req.rating}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>{req.payout}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                         <Package size={16} color="var(--color-secondary)" />
                         <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{req.cargoType}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                         <Navigation2 size={16} color="var(--color-text-muted)" />
                         <span style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>{req.distance} away ({req.timeEst})</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Selected Request Modal / Detail View */}
        {appState === 'viewing_requests' && selectedRequest && (
          <div className="bottom-sheet slide-up" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--color-secondary)' }}>Cargo Request</h3>
                <button onClick={() => setSelectedRequest(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}>
                  <X size={20} color="var(--color-text-muted)" />
                </button>
             </div>
             
             {/* Customer Mini Profile */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <img src={selectedRequest.avatar} alt="Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--color-primary)' }} />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{selectedRequest.customer}</div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#EAB308' }}><Star size={14} fill="#EAB308"/> {selectedRequest.rating}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}><Clock size={14} /> {selectedRequest.timeEst}</span>
                  </div>
                </div>
             </div>

             {/* Route Trajectory */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '17px', top: '16px', bottom: '16px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2 }}>
                   <CircleDot size={18} color="var(--color-text-muted)" style={{ backgroundColor: 'white' }} />
                   <div>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Pickup</div>
                     <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{selectedRequest.pickup}</div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2, marginTop: '1rem' }}>
                   <MapPin size={18} color="var(--color-primary)" style={{ backgroundColor: 'white' }} />
                   <div>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Dropoff</div>
                     <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{selectedRequest.dropoff}</div>
                   </div>
                </div>
             </div>

             {/* Payout & Cargo */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Cargo Size</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{selectedRequest.cargoType}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Payout</span>
                  <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary)' }}>{selectedRequest.payout}</span>
                </div>
             </div>

             {/* Actions */}
             <div style={{ display: 'flex', gap: '1rem' }}>
               <button onClick={handleRejectRequest} className="btn" style={{ flex: 1, padding: '1.25rem', borderRadius: '1rem', backgroundColor: '#FEE2E2', color: '#EF4444', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                 <X size={20} /> Reject
               </button>
               <button onClick={handleAcceptRequest} className="btn btn-primary" style={{ flex: 2, padding: '1.25rem', borderRadius: '1rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                 <Check size={20} strokeWidth={3} /> ACCEPT JOB
               </button>
             </div>
          </div>
        )}

        {/* Active Job Multi-Stage Tracker */}
        {['en_route', 'arrived', 'in_transit', 'completed'].includes(appState) && activeJob && (
           <div className="card glass-card slide-up" style={{ width: 'calc(100% - 2rem)', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(15px)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <div className="pulse-dot-primary" style={{ backgroundColor: appState === 'completed' ? '#10B981' : '#EAB308', boxShadow: `0 0 10px ${appState === 'completed' ? '#10B981' : '#EAB308'}` }}></div>
                 <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-secondary)' }}>
                   {appState === 'en_route' && 'En Route to Pickup'}
                   {appState === 'arrived' && 'Arrived at Pickup'}
                   {appState === 'in_transit' && 'In Transit to Dropoff'}
                   {appState === 'completed' && 'Transport Complete'}
                 </span>
               </div>
               <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{activeJob.payout}</span>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
               <img src={activeJob.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="customer" />
               <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Customer</div>
                  <div style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{activeJob.customer}</div>
               </div>
             </div>

             <button onClick={advanceDeliveryState} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', borderRadius: '1rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: appState === 'completed' ? '#10B981' : 'var(--color-secondary)', border: 'none', cursor: 'pointer', color: 'white' }}>
                {appState === 'en_route' && <><MapPin size={20} /> I HAVE ARRIVED</>}
                {appState === 'arrived' && <><Package size={20} /> CARGO LOADED</>}
                {appState === 'in_transit' && <><CheckCircle2 size={20} /> MARK DELIVERED</>}
                {appState === 'completed' && <><Check size={20} /> FINISH & FIND MORE</>}
             </button>
           </div>
        )}

      </div>
      
      {/* Root Standard Navigation Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-around', padding: '0.75rem', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0.5rem))', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-primary)', cursor: 'pointer' }}>
          <Truck size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 700 }}>Drive</span>
        </button>
        <button onClick={() => window.location.href='/driver/settings'} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <SettingsIcon size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Settings</span>
        </button>
        <button onClick={() => { localStorage.removeItem('verdimo_user'); window.location.href='/login'; }} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <LogOut size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 500 }}>Logout</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .radar-pulse { animation: radar 3s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        @keyframes radar {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .pulse-dot-primary {
          width: 10px; height: 10px; border-radius: 50%; background-color: var(--color-primary); 
          box-shadow: 0 0 10px var(--color-primary);
          animation: simplePulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes simplePulse {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0.6; transform: scale(1.4); }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .zoom-on-hover { transition: transform 0.2s; }
        .zoom-on-hover:active { transform: scale(0.98); }
        .glass-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
};

export default DriverDashboard;
