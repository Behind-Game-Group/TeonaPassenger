<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class HotelService
{
    private HttpClientInterface $client;
    private string $apiKey;

    public function __construct(HttpClientInterface $client)
    {

        $this->client = $client;
    }


    public function searchHotels(string $city, string $checkIn, string $checkOut): array
    {
        $endpoint = 'https://serpapi.com/search';
        $apiKey = $_ENV['SERPAPI_API_KEY'];

        $response = $this->client->request('GET', $endpoint, [
            'query' => [
                'engine' => 'google_hotels',
                'q' => $city,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'api_key' => $apiKey,
            ],

            
            /*
            Afficher :
            * le nom de l'hôtel / name
            * La description / description
            * Prix par nuit / rate_per_night
            * Le prix total du séjour / total_rate
            
            ? Les images / images[]
            ? Les avis / overall_rating . reviews
            
            */
        ]);

        return $response->toArray();

        $hotels = [];
        if (isset($data['properties'])) {
            foreach ($data['properties'] as $property) {
                $hotel = [
                    'name' => $property['name'] ?? 'N/A',
                    'description' => $property['description'] ?? 'No description available',
                    'rate_per_night' => $property['rate_per_night']['lowest'] ?? 'N/A',
                    'total_rate' => $property['total_rate']['lowest'] ?? 'N/A',
                    'images' => [],  // Tableau pour les images
                    'reviews' => $property['overall_rating'] ?? 'N/A',
                    'reviews_count' => $property['reviews'] ?? 'N/A',
                ];

                // Ajouter les images si elles existent
                if (isset($property['images'])) {
                    foreach ($property['images'] as $image) {
                        $hotel['images'][] = $image['original_image'] ?? 'No image';
                    }
                }

                // Ajouter les détails de l'hôtel à la liste
                $hotels[] = $hotel;
            }
            return $hotels;
        }
    }
}
