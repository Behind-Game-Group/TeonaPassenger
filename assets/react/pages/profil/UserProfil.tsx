import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfile {
  id: number;
  name: string | null;
  surname: string | null;
  username: string | null;
  avatar: string | null;
  site: string | null;
  local_airport: string | null;
}

interface Traveler {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthdate: string;
  gender: string;
  phone: string;
  DHS?: number;
  KTN?: number;
}

interface FidelityProgram {
  id: number;
  name: string;
  programNumber: number;
}

interface Airport {
  id: number;
  name: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [newTraveler, setNewTraveler] = useState<Partial<Traveler>>({});
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fidelityPrograms, setFidelityPrograms] = useState<FidelityProgram[]>([]); 
  const [newFidelityProgram, setNewFidelityProgram] = useState<Partial<FidelityProgram>>({});
  const [selectedTravelerId, setSelectedTravelerId] = useState<number | null>(null);

  // Nouvel état pour les aéroports
  const [airports, setAirports] = useState<Airport[]>([]);
  const [newAirport, setNewAirport] = useState<Partial<Airport>>({});

  useEffect(() => {
    fetchUserProfile();
    fetchCsrfToken();
    fetchTravelers();
    fetchFidelityPrograms();
    fetchAirports(); // Chargement des aéroports
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/showUserProfile');
      setProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch user profile.');
    }
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/csrf-token-endpoint');
      setCsrfToken(response.data.token);
    } catch (err) {
      setError('Failed to fetch CSRF token.');
    }
  };

  const fetchTravelers = async () => {
    try {
      const response = await axios.get('/showTravelers');
      setTravelers(response.data);
    } catch (err) {
      setError('Failed to fetch travelers.');
    }
  };

  const fetchFidelityPrograms = async () => {
    try {
      const response = await axios.get('/showFidelityPrograms');
      setFidelityPrograms(response.data);
    } catch (err) {
      setError('Failed to fetch fidelity programs.');
    }
  };

  // Nouvelle fonction pour récupérer les aéroports
  const fetchAirports = async () => {
    try {
      const response = await axios.get('/showAirports');
      setAirports(response.data);
    } catch (err) {
      setError('Failed to fetch airports.');
    }
  };

  const handleTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTraveler({ ...newTraveler, [e.target.name]: e.target.value });
  };

  const handleFidelityProgramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFidelityProgram({ ...newFidelityProgram, [e.target.name]: e.target.value });
  };

  // Nouvelle fonction pour ajouter un aéroport
  const handleAirportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAirport({ ...newAirport, [e.target.name]: e.target.value });
  };

  const handleAddTraveler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrfToken) {
      setError('CSRF token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/addTraveler', {
        ...newTraveler,
        csrfToken,
      });
      setSuccess('Traveler added successfully.');
      fetchTravelers(); // Rafraîchir la liste des voyageurs
    } catch (err) {
      setError('Failed to add traveler.');
    } finally {
      setLoading(false);
    }
  };

  // Nouvelle fonction pour ajouter un aéroport
  const handleAddAirport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrfToken) {
      setError('CSRF token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post('/addAirport', {
        ...newAirport,
        csrfToken,
      });
      setSuccess('Airport added successfully.');
      fetchAirports(); // Rafraîchir la liste des aéroports
    } catch (err) {
      setError('Failed to add airport.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      {/* Formulaire pour ajouter un voyageur */}
      <h2>Add Traveler</h2>
      <form onSubmit={handleAddTraveler}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newTraveler.name || ''}
            onChange={handleTravelerChange}
          />
        </label>
        <br />
        <label>
          Surname:
          <input
            type="text"
            name="surname"
            value={newTraveler.surname || ''}
            onChange={handleTravelerChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={newTraveler.email || ''}
            onChange={handleTravelerChange}
          />
        </label>
        <br />
        <label>
          Birthdate:
          <input
            type="date"
            name="birthdate"
            value={newTraveler.birthdate || ''}
            onChange={handleTravelerChange}
          />
        </label>
        <br />
        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={newTraveler.gender || ''}
            onChange={handleTravelerChange}
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={newTraveler.phone || ''}
            onChange={handleTravelerChange}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Traveler'}
        </button>
      </form>

      {/* Affichage des voyageurs */}
      <h2>My Travelers</h2>
      <ul>
        {travelers.map((traveler) => (
          <li key={traveler.id}>
            {traveler.name} {traveler.surname} - {traveler.email}
          </li>
        ))}
      </ul>

      {/* Formulaire pour ajouter un programme de fidélité */}
      <h2>Add Fidelity Program</h2>
      <form onSubmit={handleAddFidelityProgram}>
        <label>
          Program Name:
          <input
            type="text"
            name="name"
            value={newFidelityProgram.name || ''}
            onChange={handleFidelityProgramChange}
          />
        </label>
        <br />
        <label>
          Program Number:
          <input
            type="number"
            name="programNumber"
            value={newFidelityProgram.programNumber || ''}
            onChange={handleFidelityProgramChange}
          />
        </label>
        <br />
        <label>
          Traveler:
          <select
            value={selectedTravelerId || ''}
            onChange={(e) => setSelectedTravelerId(Number(e.target.value))}
          >
            <option value="">Select Traveler</option>
            {travelers.map((traveler) => (
              <option key={traveler.id} value={traveler.id}>
                {traveler.name} {traveler.surname}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Fidelity Program'}
        </button>
      </form>

      {/* Affichage des programmes de fidélité */}
      <h2>My Fidelity Programs</h2>
      <ul>
        {fidelityPrograms.map((program) => (
          <li key={program.id}>
            {program.name} - {program.programNumber}
          </li>
        ))}
      </ul>

      {/* Formulaire pour ajouter un aéroport */}
      <h2>Add Airport</h2>
      <form onSubmit={handleAddAirport}>
        <label>
          Airport Name:
          <input
            type="text"
            name="name"
            value={newAirport.name || ''}
            onChange={handleAirportChange}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Airport'}
        </button>
      </form>

      {/* Affichage des aéroports */}
      <h2>My Airports</h2>
      <ul>
        {airports.map((airport) => (
          <li key={airport.id}>
            {airport.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
