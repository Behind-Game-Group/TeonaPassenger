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

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchCsrfToken();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/showUserProfile');
      setProfile(response.data);
      setFormData(response.data); // Pré-remplir le formulaire avec les données existantes
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.surname) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!csrfToken) {
      setError('CSRF token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/updateUserProfile', {
        ...formData,
        csrfToken,
      });
      setSuccess('Profile updated successfully.');
      setProfile({ ...profile, ...formData } as UserProfile);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;  // Ajouter un spinner ici pour améliorer l'UX
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default UserProfile;
