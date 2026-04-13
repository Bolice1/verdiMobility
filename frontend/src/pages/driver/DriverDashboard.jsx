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

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', top: 0, left: 0, position: 'fixed', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
      
      {/* -------------------- SIDEBAR -------------------- */}
      <div style={{ width: '420px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(0,0,0,0.1)', zIndex: 10, position: 'relative', boxShadow: '5px 0 25px rgba(0,0,0,0.05)' }}>
        
        {/* Sidebar Header */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: appState !== 'offline' ? '#10B981' : '#94A3B8', boxShadow: appState !== 'offline' ? '0 0 12px #10B981' : 'none', transition: 'all 0.3s' }}></div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-secondary)' }}>VerdiMo Driver</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             {appState !== 'offline' && (
               <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                 <Bell size={22} color="var(--color-primary)" />
                 <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></span>
               </button>
             )}
             <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => window.location.href='/driver/settings'}>
               <User size={22} color="var(--color-secondary)" />
             </button>
          </div>
        </div>

        {/* Earnings Summary */}
        <div style={{ padding: '1rem 1.5rem', flexShrink: 0 }}>
          <div style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>Earnings Today</span>
               <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center' }}><DollarSign size={20} color="var(--color-primary)" /> 142.50</span>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-border)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
               <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>Completed</span>
               <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary)' }}>4</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem 1.5rem 1.5rem' }} className="hide-scrollbar">
          
          {/* OFFLINE */}
          {appState === 'offline' && (
            <div className="card" style={{ padding: '2rem 1.5rem', boxShadow: 'none', border: '1px solid var(--color-border)', backgroundColor: 'white', textAlign: 'center', marginTop: '1rem' }}>
              <Package size={48} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>Currently Offline</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '2rem' }}>Setup cargo details to begin receiving transport requests.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
                <div style={{ position: 'relative' }}>
                  <Package size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Cargo Space Available (e.g. 50%)" 
                    value={cargoSpace}
                    onChange={(e) => setCargoSpace(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', fontSize: '0.875rem', fontWeight: 600, outline: 'none' }} 
                  />
                </div>
              </div>
              <button onClick={handleToggleOnline} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', fontWeight: 800, borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 10px 15px rgba(16, 185, 129, 0.2)' }}>
                <Power size={20} /> GO ONLINE
              </button>
            </div>
          )}

          {/* SCANNING */}
          {appState === 'scanning' && (
             <div className="card" style={{ padding: '3rem 1.5rem', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)', border: '2px solid var(--color-primary)', backgroundColor: 'white', textAlign: 'center', marginTop: '1rem' }}>
               <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem auto' }}>
                 <div className="radar-pulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.4)', zIndex: 1 }}></div>
                 <div className="pulse-dot-primary" style={{ position: 'relative', zIndex: 2, margin: '35px auto', width: '16px', height: '16px' }}></div>
               </div>
               <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>Scanning network...</h2>
               <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600, margin: 0 }}>Finding nearby cargo requests</p>
               
               <button onClick={handleToggleOnline} style={{ width: '100%', marginTop: '3rem', padding: '1rem', fontWeight: 700, backgroundColor: '#FEF2F2', color: '#EF4444', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer' }}>Cancel</button>
             </div>
          )}

          {/* VIEWING REQUESTS (Vertical List) */}
          {appState === 'viewing_requests' && !selectedRequest && (
            <div style={{ marginTop: '1rem' }}>
               <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>Nearby Requests</span>
                 <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800 }}>{requests.length} Found</span>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {requests.map(req => (
                   <div key={req.id} onClick={() => setSelectedRequest(req)} className="zoom-on-hover" style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={req.avatar} alt={req.customer} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
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
                 {requests.length === 0 && (
                   <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem', fontWeight: 500 }}>No active requests nearby. Waiting for matches...</p>
                 )}
               </div>
            </div>
          )}

          {/* SELECTED REQUEST DETAILS */}
          {appState === 'viewing_requests' && selectedRequest && (
            <div className="slide-up" style={{ marginTop: '1rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid var(--color-border)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
               <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--color-secondary)' }}>Request Details</h3>
                  <button onClick={() => setSelectedRequest(null)} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer' }}>
                    <X size={16} color="var(--color-text-muted)" />
                  </button>
               </div>
               
               <div style={{ padding: '1.5rem' }}>
                 {/* Customer Profile */}
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <img src={selectedRequest.avatar} alt="Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--color-primary)' }} />
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{selectedRequest.customer}</div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#EAB308' }}><Star size={14} fill="#EAB308"/> {selectedRequest.rating}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}><Clock size={14} /> {selectedRequest.timeEst}</span>
                      </div>
                    </div>
                 </div>

                 {/* Route Details */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem', marginBottom: '1.5rem', position: 'relative' }}>
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

                 {/* Financials & Cargo */}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Cargo Size</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{selectedRequest.cargoType}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)' }}>Payout</span>
                      <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary)' }}>{selectedRequest.payout}</span>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <button onClick={handleRejectRequest} className="btn" style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', backgroundColor: '#FEF2F2', color: '#EF4444', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                     Reject
                   </button>
                   <button onClick={handleAcceptRequest} className="btn btn-primary" style={{ flex: 2, padding: '1rem', borderRadius: '0.75rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
                     <Check size={18} strokeWidth={3} /> ACCEPT JOB
                   </button>
                 </div>
               </div>
            </div>
          )}

          {/* ACTIVE JOB MULTI-STAGE TRACKER */}
          {['en_route', 'arrived', 'in_transit', 'completed'].includes(appState) && activeJob && (
             <div className="slide-up" style={{ marginTop: '1rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid var(--color-border)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', padding: '1.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div className="pulse-dot-primary" style={{ backgroundColor: appState === 'completed' ? '#10B981' : '#EAB308', boxShadow: `0 0 10px ${appState === 'completed' ? '#10B981' : '#EAB308'}`, width: '12px', height: '12px' }}></div>
                   <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-secondary)' }}>
                     {appState === 'en_route' && 'En Route to Pickup'}
                     {appState === 'arrived' && 'Arrived at Pickup'}
                     {appState === 'in_transit' && 'In Transit to Dropoff'}
                     {appState === 'completed' && 'Transport Complete!'}
                   </span>
                 </div>
               </div>

               <div style={{ padding: '1.5rem' }}>
                 {/* Job Profile */}
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={activeJob.avatar} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--color-border)' }} alt="customer" />
                      <div>
                         <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Customer</div>
                         <div style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>{activeJob.customer}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>{activeJob.payout}</span>
                 </div>

                 {/* Job Controls */}
                 <button onClick={advanceDeliveryState} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', borderRadius: '0.75rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: appState === 'completed' ? '#10B981' : 'var(--color-secondary)', border: 'none', cursor: 'pointer', color: 'white' }}>
                    {appState === 'en_route' && <><MapPin size={20} /> I HAVE ARRIVED</>}
                    {appState === 'arrived' && <><Package size={20} /> CARGO LOADED</>}
                    {appState === 'in_transit' && <><CheckCircle2 size={20} /> MARK DELIVERED</>}
                    {appState === 'completed' && <><Check size={20} /> FINISH & FIND MORE</>}
                 </button>
               </div>
             </div>
          )}

        </div>

        {/* Bottom Navigation Buttons (now in Sidebar) */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
          <button style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-primary)', cursor: 'pointer' }}>
            <Truck size={22} />
            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 800 }}>Drive</span>
          </button>
          <button onClick={() => window.location.href='/driver/settings'} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <SettingsIcon size={22} />
            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 600 }}>Settings</span>
          </button>
          <button onClick={() => { localStorage.removeItem('verdimo_user'); window.location.href='/login'; }} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <LogOut size={22} />
            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 600 }}>Logout</span>
          </button>
        </div>

      </div>

      {/* -------------------- MAP AREA -------------------- */}
      <div style={{ flex: 1, position: 'relative', height: '100%' }}>
        <LiveTrackingMap drivers={driverMapData} />
        
        {/* Full-screen subtle overlay for offline mode to draw focus to sidebar */}
        {appState === 'offline' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'grayscale(1)', pointerEvents: 'none', zIndex: 1 }}></div>}
        
        {/* Radar Effect moved to Map bounds */}
        {appState === 'scanning' && (
           <div className="radar-pulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.4)', zIndex: 5, pointerEvents: 'none' }}></div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .radar-pulse { animation: radar 3s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        @keyframes radar {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .pulse-dot-primary {
          border-radius: 50%; background-color: var(--color-primary); 
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
      `}} />
    </div>
  );
};

export default DriverDashboard;
