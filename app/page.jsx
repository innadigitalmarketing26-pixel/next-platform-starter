'use client';

import { useEffect, useMemo, useState } from 'react';

const INTERESTS = ['Culture', 'Food', 'Nature', 'Photography', 'Shopping', 'Nightlife', 'History', 'Relaxation'];

const CITY_DATA = {
    rome: {
        palette: 'terracotta',
        items: {
            breakfast: ['Sant’Eustachio Il Caffè', 'Roscioli Caffè', 'Panella'],
            place: ['Trevi Fountain', 'Piazza Navona', 'Trastevere', 'Villa Borghese Gardens', 'Spanish Steps'],
            attraction: ['Colosseum', 'Roman Forum', 'Pantheon', 'Vatican Museums', 'Castel Sant’Angelo'],
            lunch: ['Armando al Pantheon', 'Da Enzo al 29', 'Pizzarium Bonci'],
            cafe: ['Tazza d’Oro', 'Chiostro del Bramante Café', 'Barnum Roma'],
            food: ['Cacio e pepe', 'Carbonara', 'Supplì', 'Carciofi alla romana'],
            photo: ['Giardino degli Aranci', 'Ponte Umberto I', 'Terrazza del Pincio', 'Via Piccolomini']
        }
    },
    paris: {
        palette: 'rose',
        items: {
            breakfast: ['Du Pain et des Idées', 'Café de Flore', 'Hardware Société Paris'],
            place: ['Montmartre', 'Le Marais', 'Île de la Cité', 'Luxembourg Gardens', 'Canal Saint-Martin'],
            attraction: ['Louvre Museum', 'Eiffel Tower', 'Sainte-Chapelle', 'Musée d’Orsay', 'Arc de Triomphe'],
            lunch: ['Bouillon Pigalle', 'L’As du Fallafel', 'Breizh Café'],
            cafe: ['Café Kitsuné Palais Royal', 'Fragments', 'Carette'],
            food: ['Croissant au beurre', 'Crêpes', 'French onion soup', 'Macarons'],
            photo: ['Trocadéro', 'Rue de l’Université', 'Pont Alexandre III', 'Galeries Lafayette rooftop']
        }
    },
    barcelona: {
        palette: 'sunset',
        items: {
            breakfast: ['Granja M. Viader', 'Brunch & Cake', 'Federal Café'],
            place: ['Gothic Quarter', 'El Born', 'Barceloneta', 'Montjuïc', 'Passeig de Gràcia'],
            attraction: ['Sagrada Família', 'Park Güell', 'Casa Batlló', 'Palau de la Música Catalana', 'Picasso Museum'],
            lunch: ['El Xampanyet', 'La Cova Fumada', 'Bar Cañete'],
            cafe: ['Satan’s Coffee Corner', 'Nomad Coffee', 'Faborit Casa Amatller'],
            food: ['Pa amb tomàquet', 'Patatas bravas', 'Crema catalana', 'Bombas de la Barceloneta'],
            photo: ['Bunkers del Carmel', 'Pont del Bisbe', 'Park Güell terrace', 'Montjuïc viewpoint']
        }
    },
    tokyo: {
        palette: 'neon',
        items: {
            breakfast: ['Tsukiji Outer Market', 'Path', 'Onigiri Asakusa Yadoroku'],
            place: ['Shibuya', 'Asakusa', 'Harajuku', 'Yanaka', 'Daikanyama'],
            attraction: ['Meiji Shrine', 'teamLab Planets', 'Tokyo Skytree', 'Senso-ji', 'Shinjuku Gyoen'],
            lunch: ['Uobei Shibuya Dogenzaka', 'Afuri Ramen', 'Tonkatsu Maisen Aoyama'],
            cafe: ['Koffee Mameya', 'Fuglen Tokyo', 'Blue Bottle Kiyosumi'],
            food: ['Sushi', 'Ramen', 'Taiyaki', 'Okonomiyaki'],
            photo: ['Shibuya Sky', 'Tokyo International Forum', 'Omoide Yokocho', 'Asakusa Culture Center rooftop']
        }
    },
    tirana: {
        palette: 'emerald',
        items: {
            breakfast: ['Mulliri Vjetër', 'Noor Coffee & Fine Food', 'Komiteti Kafe Muzeum'],
            place: ['Skanderbeg Square', 'Blloku', 'Pazari i Ri', 'Grand Park of Tirana', 'Pedonalja Murat Toptani'],
            attraction: ['Bunk’Art 2', 'House of Leaves', 'National Gallery of Arts', 'Dajti Ekspres', 'Et’hem Bey Mosque'],
            lunch: ['Oda', 'Era Blloku', 'Mullixhiu'],
            cafe: ['Sophie Caffe', 'Radio Bar', 'Nouvelle Vague'],
            food: ['Byrek', 'Tavë kosi', 'Fërgesë', 'Trileçe'],
            photo: ['Dajti Mountain viewpoint', 'Skanderbeg Square', 'Tirana Castle', 'Grand Park lake']
        }
    },
    default: {
        palette: 'ocean',
        items: {
            breakfast: ['A highly rated local bakery', 'A traditional breakfast café', 'A specialty coffee shop'],
            place: ['Historic city center', 'Main public square', 'Local market district', 'Riverside or waterfront area', 'Creative neighborhood'],
            attraction: ['Top city museum', 'Signature landmark', 'Local cultural center', 'Popular viewpoint', 'Historic monument'],
            lunch: ['A trusted local lunch spot', 'A popular neighborhood restaurant', 'A well-reviewed market food hall'],
            cafe: ['A specialty coffee café', 'A scenic terrace café', 'A local dessert shop'],
            food: ['Signature regional dish', 'Traditional street food', 'Popular local dessert', 'Seasonal specialty'],
            photo: ['Main panoramic viewpoint', 'Historic street at golden hour', 'Waterfront at sunset', 'Landmark during blue hour']
        }
    }
};

const CATEGORY_META = {
    breakfast: { label: 'Breakfast suggestion', icon: '☕', time: '08:30' },
    place: { label: 'Place to visit', icon: '📍', time: '10:00' },
    attraction: { label: 'Attraction & activity', icon: '🎟️', time: '11:30' },
    lunch: { label: 'Lunch suggestion', icon: '🥗', time: '13:30' },
    cafe: { label: 'Restaurant or café', icon: '🍽️', time: '16:00' },
    food: { label: 'Local food recommendation', icon: '🥘', time: '18:00' },
    photo: { label: 'Photography location', icon: '📸', time: 'Golden hour' }
};

function normalizeCity(value = '') {
    const city = value.trim().toLowerCase();
    return Object.keys(CITY_DATA).find((key) => key !== 'default' && city.includes(key)) || 'default';
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

function dateRange(start, end) {
    const result = [];
    const cursor = new Date(`${start}T12:00:00`);
    const last = new Date(`${end}T12:00:00`);
    while (cursor <= last && result.length < 21) {
        result.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }
    return result;
}

function uniquePick(list, index) {
    return list[index % list.length];
}

function buildDescription(category, name, destination) {
    const descriptions = {
        breakfast: `Start the day at ${name}, selected as a practical breakfast stop before exploring ${destination}.`,
        place: `${name} is a strong introduction to the character, architecture, and everyday atmosphere of ${destination}.`,
        attraction: `Plan focused time for ${name}. It is included for its cultural value and fit with the day’s route.`,
        lunch: `${name} is placed mid-route to reduce unnecessary travel and give you time to recharge.`,
        cafe: `${name} is a useful afternoon or evening stop for local atmosphere, drinks, or a relaxed meal.`,
        food: `Try ${name} to experience a recognizable local flavor associated with ${destination}.`,
        photo: `${name} works best around golden hour or blue hour, when light and city views are usually more flattering.`
    };
    return descriptions[category];
}

function generateTrip(form, existingId) {
    const cityKey = normalizeCity(form.destination);
    const city = CITY_DATA[cityKey];
    const days = dateRange(form.startDate, form.endDate).map((date, dayIndex) => {
        const categories = Object.keys(CATEGORY_META);
        return {
            id: `${existingId || Date.now()}-day-${dayIndex}`,
            date: date.toISOString().slice(0, 10),
            title: dayIndex === 0 ? 'Arrival & first impressions' : dayIndex === 1 ? 'Landmarks & local flavor' : `Explore ${form.destination} differently`,
            items: categories.map((category, categoryIndex) => {
                const name = uniquePick(city.items[category], dayIndex + categoryIndex);
                return {
                    id: `${Date.now()}-${dayIndex}-${categoryIndex}`,
                    category,
                    name,
                    time: CATEGORY_META[category].time,
                    location: form.destination,
                    cost: form.budget === 'Luxury' ? '€€€' : form.budget === 'Budget' ? '€' : '€€',
                    description: buildDescription(category, name, form.destination),
                    source: 'AI-generated'
                };
            })
        };
    });

    return {
        id: existingId || `trip-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget,
        travelers: form.travelers,
        pace: form.pace,
        transport: form.transport,
        interests: form.interests,
        notes: form.notes,
        palette: city.palette,
        days
    };
}

const emptyForm = {
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'Mid-range',
    travelers: 2,
    pace: 'Balanced',
    transport: 'Walking + public transport',
    interests: ['Culture', 'Food', 'Photography'],
    notes: ''
};

export default function Page() {
    const [screen, setScreen] = useState('home');
    const [form, setForm] = useState(emptyForm);
    const [trips, setTrips] = useState([]);
    const [activeTripId, setActiveTripId] = useState(null);
    const [editingTripId, setEditingTripId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(null);

    useEffect(() => {
        const saved = window.localStorage.getItem('tripmuse-itineraries');
        if (saved) {
            try {
                setTrips(JSON.parse(saved));
            } catch {
                window.localStorage.removeItem('tripmuse-itineraries');
            }
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem('tripmuse-itineraries', JSON.stringify(trips));
    }, [trips]);

    const activeTrip = useMemo(() => trips.find((trip) => trip.id === activeTripId), [trips, activeTripId]);

    function updateForm(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function toggleInterest(interest) {
        setForm((current) => ({
            ...current,
            interests: current.interests.includes(interest)
                ? current.interests.filter((item) => item !== interest)
                : [...current.interests, interest]
        }));
    }

    function openPlanner() {
        setEditingTripId(null);
        setForm(emptyForm);
        setError('');
        setScreen('planner');
    }

    function handleGenerate(event) {
        event.preventDefault();
        setError('');
        if (!form.destination || !form.startDate || !form.endDate) {
            setError('Destination, Start Date, and End Date are required.');
            return;
        }
        if (new Date(form.endDate) < new Date(form.startDate)) {
            setError('End Date cannot be earlier than Start Date.');
            return;
        }
        setLoading(true);
        window.setTimeout(() => {
            const trip = generateTrip(form, editingTripId);
            setTrips((current) => editingTripId
                ? current.map((item) => item.id === editingTripId ? trip : item)
                : [trip, ...current]
            );
            setActiveTripId(trip.id);
            setEditingTripId(null);
            setLoading(false);
            setScreen('itinerary');
        }, 900);
    }

    function editTrip(trip) {
        setForm({
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
            travelers: trip.travelers,
            pace: trip.pace,
            transport: trip.transport,
            interests: trip.interests,
            notes: trip.notes || ''
        });
        setEditingTripId(trip.id);
        setScreen('planner');
    }

    function deleteTrip(id) {
        if (!window.confirm('Delete this itinerary permanently?')) return;
        setTrips((current) => current.filter((trip) => trip.id !== id));
        if (activeTripId === id) {
            setActiveTripId(null);
            setScreen('dashboard');
        }
    }

    function deleteItem(dayId, itemId) {
        if (!window.confirm('Remove this item from your itinerary?')) return;
        setTrips((current) => current.map((trip) => trip.id !== activeTripId ? trip : {
            ...trip,
            updatedAt: new Date().toISOString(),
            days: trip.days.map((day) => day.id !== dayId ? day : {
                ...day,
                items: day.items.filter((item) => item.id !== itemId)
            })
        }));
    }

    function saveModalItem(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const nextItem = {
            id: modal.item?.id || `manual-${Date.now()}`,
            category: data.get('category'),
            name: data.get('name'),
            time: data.get('time'),
            location: data.get('location'),
            cost: data.get('cost'),
            description: data.get('description'),
            source: modal.item?.source || 'Added manually'
        };
        setTrips((current) => current.map((trip) => trip.id !== activeTripId ? trip : {
            ...trip,
            updatedAt: new Date().toISOString(),
            days: trip.days.map((day) => day.id !== modal.dayId ? day : {
                ...day,
                items: modal.item
                    ? day.items.map((item) => item.id === modal.item.id ? nextItem : item)
                    : [...day.items, nextItem]
            })
        }));
        setModal(null);
    }

    async function shareTrip(trip) {
        const text = `${trip.destination} itinerary: ${trip.startDate} to ${trip.endDate}`;
        if (navigator.share) {
            await navigator.share({ title: `${trip.destination} itinerary`, text, url: window.location.href });
        } else {
            await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
            window.alert('Share link copied.');
        }
    }

    return (
        <div className="site-shell">
            <header className="topbar">
                <button className="brand" onClick={() => setScreen('home')} aria-label="TripMuse home">
                    <span className="brand-mark">✦</span>
                    <span>TripMuse <strong>AI</strong></span>
                </button>
                <nav>
                    <button onClick={() => setScreen('home')}>Home</button>
                    <button onClick={() => setScreen('dashboard')}>My Trips</button>
                    <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Pricing</button>
                </nav>
                <button className="ghost-button">Sign in</button>
            </header>

            {screen === 'home' && (
                <main>
                    <section className="hero">
                        <div className="hero-copy">
                            <span className="eyebrow">AI-POWERED TRAVEL PLANNING</span>
                            <h1>Your next trip,<br /><em>beautifully planned.</em></h1>
                            <p>Build a personalized day-by-day itinerary around your destination, dates, budget, interests, and travel pace.</p>
                            <div className="hero-actions">
                                <button className="primary-button" onClick={openPlanner}>Build my itinerary <span>→</span></button>
                                <button className="text-button" onClick={() => setScreen('dashboard')}>View my trips</button>
                            </div>
                            <div className="trust-row">
                                <span>✓ No subscription</span>
                                <span>✓ Editable anytime</span>
                                <span>✓ PDF-ready</span>
                            </div>
                        </div>
                        <div className="hero-visual" aria-label="Sample itinerary preview">
                            <div className="floating-pill pill-one">📸 Golden hour spot</div>
                            <div className="floating-pill pill-two">🍝 Local food pick</div>
                            <div className="preview-card">
                                <div className="preview-cover">
                                    <span>ROME · 4 DAYS</span>
                                    <h3>La Dolce Vita</h3>
                                    <p>A balanced city escape</p>
                                </div>
                                <div className="preview-day">
                                    <div className="day-number">01</div>
                                    <div>
                                        <strong>Arrival & first impressions</strong>
                                        <small>Trevi Fountain · Pantheon · Trastevere</small>
                                    </div>
                                </div>
                                <div className="preview-day muted">
                                    <div className="day-number">02</div>
                                    <div>
                                        <strong>Ancient Rome</strong>
                                        <small>Colosseum · Roman Forum · Monti</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="how-it-works">
                        <div className="section-heading">
                            <span className="eyebrow">SIMPLE BY DESIGN</span>
                            <h2>From idea to itinerary in three steps</h2>
                        </div>
                        <div className="step-grid">
                            <article><span>01</span><h3>Tell us your trip</h3><p>Add destination, dates, budget, pace, travelers, and interests.</p></article>
                            <article><span>02</span><h3>AI builds each day</h3><p>Get varied places, food, attractions, photo spots, and practical timing.</p></article>
                            <article><span>03</span><h3>Make it yours</h3><p>Edit, add manually, delete, share, and print your itinerary.</p></article>
                        </div>
                    </section>

                    <section id="pricing" className="pricing-section">
                        <div>
                            <span className="eyebrow">ONE-TIME PAYMENT</span>
                            <h2>Pay for the trip, not another subscription.</h2>
                            <p>Unlock a complete itinerary with editing, sharing, and PDF export.</p>
                        </div>
                        <article className="price-card">
                            <span>Complete itinerary</span>
                            <strong>€9.90</strong>
                            <small>one-time payment per trip</small>
                            <button className="primary-button" onClick={openPlanner}>Start planning</button>
                        </article>
                    </section>
                </main>
            )}

            {screen === 'planner' && (
                <main className="planner-wrap">
                    <div className="planner-intro">
                        <button className="back-button" onClick={() => setScreen(editingTripId ? 'dashboard' : 'home')}>← Back</button>
                        <span className="eyebrow">{editingTripId ? 'UPDATE YOUR TRIP' : 'BUILD YOUR TRIP'}</span>
                        <h1>{editingTripId ? 'Edit itinerary' : 'Where are you going?'}</h1>
                        <p>Share the essentials. The itinerary will be organized day by day.</p>
                    </div>
                    <form className="planner-form" onSubmit={handleGenerate}>
                        <label className="field full-field">
                            <span>Destination</span>
                            <input value={form.destination} onChange={(event) => updateForm('destination', event.target.value)} placeholder="e.g. Rome, Italy" />
                        </label>
                        <label className="field">
                            <span>Start Date</span>
                            <input type="date" value={form.startDate} onChange={(event) => updateForm('startDate', event.target.value)} />
                        </label>
                        <label className="field">
                            <span>End Date</span>
                            <input type="date" min={form.startDate} value={form.endDate} onChange={(event) => updateForm('endDate', event.target.value)} />
                        </label>
                        <label className="field">
                            <span>Travelers</span>
                            <input type="number" min="1" max="20" value={form.travelers} onChange={(event) => updateForm('travelers', Number(event.target.value))} />
                        </label>
                        <label className="field">
                            <span>Budget style</span>
                            <select value={form.budget} onChange={(event) => updateForm('budget', event.target.value)}>
                                <option>Budget</option><option>Mid-range</option><option>Luxury</option>
                            </select>
                        </label>
                        <label className="field">
                            <span>Travel pace</span>
                            <select value={form.pace} onChange={(event) => updateForm('pace', event.target.value)}>
                                <option>Relaxed</option><option>Balanced</option><option>Fast-paced</option>
                            </select>
                        </label>
                        <label className="field">
                            <span>Transportation</span>
                            <select value={form.transport} onChange={(event) => updateForm('transport', event.target.value)}>
                                <option>Walking + public transport</option><option>Rental car</option><option>Taxi / rideshare</option><option>Mostly walking</option>
                            </select>
                        </label>
                        <fieldset className="interest-field full-field">
                            <legend>Interests</legend>
                            <div className="interest-grid">
                                {INTERESTS.map((interest) => (
                                    <button type="button" key={interest} className={form.interests.includes(interest) ? 'selected' : ''} onClick={() => toggleInterest(interest)}>{interest}</button>
                                ))}
                            </div>
                        </fieldset>
                        <label className="field full-field">
                            <span>Additional notes</span>
                            <textarea value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Places you must see, dietary needs, accessibility, activities to avoid..." />
                        </label>
                        {error && <p className="form-error">{error}</p>}
                        <button className="primary-button generate-button" disabled={loading}>
                            {loading ? 'Creating your itinerary…' : editingTripId ? 'Update itinerary' : 'Generate itinerary'}
                        </button>
                    </form>
                </main>
            )}

            {screen === 'dashboard' && (
                <main className="dashboard-wrap">
                    <div className="dashboard-heading">
                        <div><span className="eyebrow">YOUR TRAVEL SPACE</span><h1>My itineraries</h1></div>
                        <button className="primary-button" onClick={openPlanner}>＋ New itinerary</button>
                    </div>
                    {trips.length === 0 ? (
                        <section className="empty-state">
                            <div className="empty-icon">✈</div>
                            <h2>You haven’t created any itineraries yet.</h2>
                            <p>Start planning your first personalized trip with AI.</p>
                            <button className="primary-button" onClick={openPlanner}>Create Your First Itinerary</button>
                        </section>
                    ) : (
                        <section className="trip-grid">
                            {trips.map((trip) => (
                                <article key={trip.id} className={`trip-card theme-${trip.palette}`}>
                                    <div className="trip-card-cover">
                                        <span>{trip.days.length} DAYS</span>
                                        <h2>{trip.destination}</h2>
                                        <p>{trip.startDate} → {trip.endDate}</p>
                                    </div>
                                    <div className="trip-card-body">
                                        <div className="trip-meta"><span>👥 {trip.travelers}</span><span>◷ {trip.pace}</span><span>{trip.budget}</span></div>
                                        <div className="trip-actions">
                                            <button onClick={() => { setActiveTripId(trip.id); setScreen('itinerary'); }}>View</button>
                                            <button onClick={() => editTrip(trip)}>Edit</button>
                                            <button onClick={() => shareTrip(trip)}>Share</button>
                                            <button onClick={() => { setActiveTripId(trip.id); window.setTimeout(() => window.print(), 100); }}>PDF</button>
                                            <button className="danger" onClick={() => deleteTrip(trip.id)}>Delete</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>
                    )}
                </main>
            )}

            {screen === 'itinerary' && activeTrip && (
                <main className={`itinerary-wrap theme-${activeTrip.palette}`}>
                    <section className="itinerary-hero">
                        <button className="back-button light" onClick={() => setScreen('dashboard')}>← My Trips</button>
                        <div className="itinerary-hero-content">
                            <span>{activeTrip.days.length}-DAY PERSONALIZED ITINERARY</span>
                            <h1>{activeTrip.destination}</h1>
                            <p>{activeTrip.startDate} — {activeTrip.endDate} · {activeTrip.travelers} travelers · {activeTrip.pace}</p>
                            <div className="itinerary-toolbar">
                                <button onClick={() => editTrip(activeTrip)}>✎ Edit trip</button>
                                <button onClick={() => shareTrip(activeTrip)}>↗ Share</button>
                                <button onClick={() => window.print()}>⇩ Download PDF</button>
                            </div>
                        </div>
                    </section>

                    <section className="itinerary-content">
                        <div className="trip-summary">
                            <div><span>Budget</span><strong>{activeTrip.budget}</strong></div>
                            <div><span>Transport</span><strong>{activeTrip.transport}</strong></div>
                            <div><span>Interests</span><strong>{activeTrip.interests.slice(0, 3).join(', ')}</strong></div>
                        </div>
                        <div className="accuracy-note">ⓘ Demo recommendations are organized for the selected city. Connect a live travel-data provider before production use to verify current opening hours, closures, addresses, and booking availability.</div>

                        <div className="day-list">
                            {activeTrip.days.map((day, index) => (
                                <article className="day-card" key={day.id}>
                                    <div className="day-header">
                                        <div><span>DAY {String(index + 1).padStart(2, '0')} · {formatDate(new Date(`${day.date}T12:00:00`))}</span><h2>{day.title}</h2></div>
                                        <button className="add-button" onClick={() => setModal({ dayId: day.id, item: null })}>＋ Add manually</button>
                                    </div>
                                    <div className="recommendation-list">
                                        {day.items.map((item) => (
                                            <div className="recommendation-item" key={item.id}>
                                                <div className="category-icon">{CATEGORY_META[item.category]?.icon || '✦'}</div>
                                                <div className="recommendation-main">
                                                    <div className="recommendation-topline">
                                                        <span>{CATEGORY_META[item.category]?.label || item.category}</span>
                                                        <small>{item.source}</small>
                                                    </div>
                                                    <h3>{item.name}</h3>
                                                    <p>{item.description}</p>
                                                    <div className="item-meta"><span>◷ {item.time}</span><span>⌖ {item.location}</span><span>{item.cost}</span></div>
                                                </div>
                                                <div className="item-actions">
                                                    <button onClick={() => setModal({ dayId: day.id, item })}>Edit</button>
                                                    <button className="danger" onClick={() => deleteItem(day.id, item.id)}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </main>
            )}

            {modal && (
                <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}>
                    <form className="modal-card" onSubmit={saveModalItem} onMouseDown={(event) => event.stopPropagation()}>
                        <div className="modal-heading"><div><span className="eyebrow">ITINERARY ITEM</span><h2>{modal.item ? 'Edit recommendation' : 'Add manually'}</h2></div><button type="button" onClick={() => setModal(null)}>×</button></div>
                        <label className="field"><span>Type</span><select name="category" defaultValue={modal.item?.category || 'place'}>{Object.entries(CATEGORY_META).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
                        <label className="field"><span>Name</span><input name="name" required defaultValue={modal.item?.name || ''} /></label>
                        <div className="modal-row">
                            <label className="field"><span>Time</span><input name="time" defaultValue={modal.item?.time || ''} /></label>
                            <label className="field"><span>Cost</span><input name="cost" defaultValue={modal.item?.cost || ''} /></label>
                        </div>
                        <label className="field"><span>Location</span><input name="location" defaultValue={modal.item?.location || activeTrip?.destination || ''} /></label>
                        <label className="field"><span>Description / notes</span><textarea name="description" defaultValue={modal.item?.description || ''} /></label>
                        <button className="primary-button">Save item</button>
                    </form>
                </div>
            )}

            <footer className="site-footer"><span>© 2026 TripMuse AI</span><span>Plan less. Experience more.</span></footer>
        </div>
    );
}
