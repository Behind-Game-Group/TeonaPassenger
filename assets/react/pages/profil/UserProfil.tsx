import React, { useEffect, useState } from 'react';
import { getMethod, postMethod } from '../../services/axiosInstance';  // Import des méthodes personnalisées
import { useUserContext } from '../../context/UserContext';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fidelityPrograms, setFidelityPrograms] = useState<FidelityProgram[]>([]); 
  const [newFidelityProgram, setNewFidelityProgram] = useState<Partial<FidelityProgram>>({});
  const [selectedTravelerId, setSelectedTravelerId] = useState<number | null>(null);

  // Nouvel état pour les aéroportss
  const [airports, setAirports] = useState<Airport[]>([]);
  const [newAirport, setNewAirport] = useState<Partial<Airport>>({});

  const { csrfToken } = useUserContext();

  useEffect(() => {
    fetchUserProfile();
    fetchTravelers();
    fetchFidelityPrograms();
    fetchAirports(); // Chargement des aéroports
  }, []);

  // Fonction pour formater une date au format 'YYYY-MM-DD'
  const formatDateForInput = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Retourne au format 'YYYY-MM-DD'
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getMethod('/showUserProfile');
      setProfile(response);
      setFormData(response);
    } catch (err) {
      setError('Failed to fetch user profile.');
    }
  };

  const fetchTravelers = async () => {
    try {
      const response = await getMethod('/showTravelers');
      if (response) {
        // Formater les dates avant de les assigner à l'état
        const formattedTravelers = response.map((traveler: Traveler) => ({
            ...traveler,
            birthdate: formatDateForInput(traveler.birthdate),

        }));
        setTravelers(formattedTravelers);
    }
    } catch (err) {
      setError('Failed to fetch travelers.');
    }
  };

  const fetchFidelityPrograms = async () => {
    try {
      const response = await getMethod('/showFidelityPrograms');
      setFidelityPrograms(response);
      console.log(response);
    } catch (err) {
      setError('Failed to fetch fidelity programs.');
    }
  };

  // Nouvelle fonction pour récupérer les aéroports
  const fetchAirports = async () => {
    try {
      const response = await getMethod('/showAirports');
      setAirports(response);
      console.log(response);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const response = await postMethod('/addTraveler', {
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

  const handleDeleteTraveler = async (id: number) => {
    if (!csrfToken) {
      setError('CSRF token is missing.');
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      // Remplacez l'URL par le bon endpoint côté backend pour supprimer un voyageur
      await postMethod('/deleteTraveler', { id, csrfToken });
      setSuccess('Traveler deleted successfully.');
      fetchTravelers(); // Rafraîchir la liste des voyageurs après suppression
    } catch (err) {
      setError('Failed to delete traveler.');
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
      await postMethod('/addAirport', {
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

  const handleAddFidelityProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrfToken) {
      setError('CSRF token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await postMethod('/addFidelityProgram', {
        ...newFidelityProgram,
        id: selectedTravelerId,
        csrfToken
      });
      setSuccess('Fidelity Program added successfully.');
      fetchFidelityPrograms(); // Rafraîchir la liste des programmes de fidélité
    } catch (err) {
      setError('Failed to add fidelity program.');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.surname) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await postMethod('/updateUserProfile', {
        ...formData,
        csrfToken,
      });
      if (response) {
        fetchUserProfile();
      }
      setSuccess('Profile updated successfully.');
      setProfile({ ...profile, ...formData } as UserProfile);
    } catch (err) {
      setError('Failed to add traveler.');
    } finally {
      setLoading(false);
    }
  };

  

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center bg-customOrange'>
      <h1>User Profile</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {/* Formulaire pour mettre à jour le profil utilisateur */}
      <form onSubmit={handleUpdateProfile} className='border-2 border-black rounded-sm items-center mb-5 w-[800px]'>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            aria-label="User's Name"
          />
        </label>
        <br />
        <label>
          Surname:
          <input
            type="text"
            name="surname"
            value={formData.surname || ''}
            onChange={handleChange}
            aria-label="User's Surname"
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            aria-label="User's Username"
          />
        </label>
        <br />
        <label>
          Site:
          <input
            type="text"
            name="site"
            value={formData.site || ''}
            onChange={handleChange}
            aria-label="User's Site"
          />
        </label>
        <br />
        <label>
          Local Airport:
          <input
            type="text"
            name="local_airport"
            value={formData.local_airport || ''}
            onChange={handleChange}
            aria-label="User's Local Airport"
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      {/* Formulaire pour ajouter un voyageur */}
      <h2>Add Traveler</h2>
      <form onSubmit={handleAddTraveler} className='border-2 border-black rounded-sm items-center mb-5 w-[800px]'>
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
            {traveler.name} {traveler.surname} - {traveler.email} - {traveler.birthdate}
            <button 
        onClick={() => handleDeleteTraveler(traveler.id)} 
        style={{ marginLeft: '10px', color: 'red' }}
      >
        Supprimer
      </button>
          </li>
        ))}
      </ul>
      <br />
      <br />

      {/* Formulaire pour ajouter un programme de fidélité */}
      <h2>Add Fidelity Program</h2>
      <form onSubmit={handleAddFidelityProgram} className='border-2 border-black rounded-sm items-center mb-5 w-[800px]'>
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
        {fidelityPrograms.map((programIndex, groupIndex) => (
          Array.isArray(programIndex) && programIndex.length > 0 ? (
            <ul key={groupIndex}>
              {programIndex.map((program) => (
                <li key={program.id}>
                  {program.name} - {program.programNumber}
                </li>
              ))}
            </ul>
          ) : null
        ))}
      </ul>
      <br />
      <br />

      {/* Formulaire pour ajouter un aéroport */}
      <h2>Add Airport</h2>
      <form onSubmit={handleAddAirport} className='border-2 border-black rounded-sm items-center mb-5 w-[800px]'>
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