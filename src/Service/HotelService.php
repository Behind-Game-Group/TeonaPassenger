<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class HotelService
{
    private HttpClientInterface $client;
    private string $apiKey;

    public function __construct(HttpClientInterface $client, string $apiKey = 'VOTRE_CLE_API')
    {

        $this->client = $client;
        $this->apiKey = $apiKey;
    }


    public function searchHotels(string $city, string $checkIn, string $checkOut, int $adults): array
    {
        $endpoint = 'https://serpapi.com/search';

        $response = $this->client->request('GET', $endpoint, [
            'query' => [
                'engine' => 'google_hotels',
                'q' => $city,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'adults' => $adults,
                'currency' => 'EUR',
                'api_key' => $this->apiKey,
            ],
        ]);

        return $response->toArray();
    }

    public function fetchHotelSuggestions(string $query): array
    {
        if (empty($query)) {
            return [];
        }

        $endpoint = "https://serpapi.com/search";

        try {
            $response = $this->client->request('GET', $endpoint, [
                'query' => [
                    'engine' => 'google_hotels',
                    'q' => $query,
                    'api_key' => $this->apiKey,
                ],
            ]);

            $data = $response->toArray();

            $suggestions = [];
            if (isset($data['hotels_results'])) {
                foreach ($data['hotels_results'] as $hotel) {
                    $suggestions[] = [
                        'title' => $hotel['title'] ?? '',
                        'location' => $hotel['address'] ?? '',
                    ];
                }
            }

            return array_slice($suggestions, 0, 5);
        } catch (\Exception $e) {
            return [];
        }
    }
}
