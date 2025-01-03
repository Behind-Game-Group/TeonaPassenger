import React, { useEffect, useState } from 'react';
import { getMethod, postMethod } from '../../services/axiosInstance';
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

  const [airports, setAirports] = useState<Airport[]>([]);
  const [newAirport, setNewAirport] = useState<Partial<Airport>>({});

  const { csrfToken } = useUserContext();

  useEffect(() => {
    fetchUserProfile();
    fetchTravelers();
    fetchFidelityPrograms();
    fetchAirports();
  }, []);

  const formatDateForInput = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getMethod('/showUserProfile');
      setProfile(response);
      setFormData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profile.');
    }
  };

  const fetchTravelers = async () => {
    try {
      const response = await getMethod('/showTravelers');
      const formattedTravelers = response.map((traveler: Traveler) => ({
        ...traveler,
        birthdate: formatDateForInput(traveler.birthdate),
      }));
      setTravelers(formattedTravelers);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch travelers.');
    }
  };

  const fetchFidelityPrograms = async () => {
    try {
      const response = await getMethod('/showFidelityPrograms');
      setFidelityPrograms(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fidelity programs.');
    }
  };

  const fetchAirports = async () => {
    try {
      const response = await getMethod('/showAirports');
      setAirports(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch airports.');
    }
  };

  const handleDelete = async (endpoint: string, id: number, fetchCallback: () => void) => {
    if (!csrfToken) {
      setError('CSRF token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await postMethod(endpoint, { id, csrfToken });
      setSuccess('Item deleted successfully.');
      fetchCallback();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    endpoint: string,
    data: any,
    fetchCallback: () => void
  ) => {
    e.preventDefault();

    if (!csrfToken) {
      setError('CSRF token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await postMethod(endpoint, { ...data, csrfToken });
      setSuccess('Item added successfully.');
      fetchCallback();
    } catch (err: any) {
      setError(err.message || 'Failed to add item.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-customOrange">
      <h1>User Profile</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      <form onSubmit={(e) => handleSubmit(e, '/updateUserProfile', formData, fetchUserProfile)}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {/* Other forms and displays for Travelers, Fidelity Programs, and Airports */}

    </div>
  );
};

export default UserProfile;
