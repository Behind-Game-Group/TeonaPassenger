import React, { useState, useEffect } from 'react';
import { getMethod } from '../../services/axiosInstance';

const HotelSearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return; // Ne pas envoyer de requête si la saisie est trop courte
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const response = await getMethod('/api/hotel-suggestions');
                setSuggestions(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des suggestions :', error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions();
        }, 300); // Attendre 300 ms avant d'envoyer une requête

        return () => clearTimeout(delayDebounceFn); // Nettoyer le timeout précédent
    }, [query]);

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une destination"
                style={{ width: '100%', padding: '8px' }}
            />
            {loading && <div>Chargement...</div>}
            {suggestions.length > 0 && (
                <ul style={{ position: 'absolute', top: '40px', left: 0, right: 0, background: '#fff', border: '1px solid #ccc' }}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} style={{ padding: '8px', cursor: 'pointer' }}>
                            <strong>{suggestion.title}</strong>
                            <p style={{ margin: 0 }}>{suggestion.location}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HotelSearchBar;
