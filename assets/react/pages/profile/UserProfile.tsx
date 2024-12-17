import React, { useEffect, useState } from 'react';

function UserProfile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données du profil utilisateur depuis l'API Symfony
    fetch('/profile')
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error('Error fetching profile:', error));
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <section className="p-5 shadow-lg border border-gray-300 rounded-md bg-white">
        <img
          src={profile.avatar}
          alt={`${profile.name} ${profile.surname}`}
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h1 className="text-center text-2xl font-bold">
          {profile.name} {profile.surname}
        </h1>
        <p className="text-center text-gray-500">@{profile.username}</p>
        <p className="text-center">
          Local Airport: <strong>{profile.local_airport}</strong>
        </p>
        <a
          href={profile.site}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-blue-500 mt-3"
        >
          Visit Website
        </a>
      </section>
    </main>
  );
}

export default UserProfile;
