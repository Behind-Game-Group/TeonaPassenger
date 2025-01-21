// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { postMethod } from '../../services/axiosInstance';

const App = () => {
    const [city, setCity] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(1);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [error, setError] = useState('');

    interface Hotel {
        name: string;
        brand_name: string;
        link: string;
    }

    interface FormData extends Record<string, unknown> {
        city: string;
        checkIn: string;
        checkOut: string;
        adults: number;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data: FormData = {
            city,
            checkIn,
            checkOut,
            adults,
        };

        try {
            // Envoi de la requête POST à l'API Symfony
            const response = await postMethod('/api/hotels', data);
            console.log(response.data);
            // setHotels(response.data);
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération des hôtels.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-center mb-8">Recherche d'Hôtels</h1>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    <div>
                        <label htmlFor="city" className="block text-lg font-semibold text-gray-700">Ville :</label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="checkIn" className="block text-lg font-semibold text-gray-700">Date d'arrivée :</label>
                        <input
                            type="date"
                            id="checkIn"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="checkOut" className="block text-lg font-semibold text-gray-700">Date de départ :</label>
                        <input
                            type="date"
                            id="checkOut"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Rechercher
                    </button>
                </form>

                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold">Hôtels disponibles :</h2>
                    {hotels.length > 0 ? (
                        <ul className="mt-4 space-y-4">
                            {hotels.map((hotel, index) => (
                                <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">
                                    <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="text-xl text-purple-600 font-semibold hover:underline">
                                        {hotel.name}
                                    </a>
                                    <p className="text-gray-600">{hotel.brand_name}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-gray-600">Aucun hôtel trouvé pour ces critères.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
