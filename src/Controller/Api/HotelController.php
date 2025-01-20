<?php

namespace App\Controller\Api;

use App\Service\HotelService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request as HttpFoundationRequest;
use Symfony\Component\Routing\Annotation\Route;

class HotelController extends AbstractController
{
    private HotelService $hotelService;

    public function __construct(HotelService $hotelService)
    {
        $this->hotelService = $hotelService;
    }

    #[Route('/api/hotels', name: 'api_get_hotels')]
    public function getHotels(HttpFoundationRequest $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        // Example request do not input
        $hotels = $this->hotelService->searchHotels(
            $data['city'],
            $data['checkIn'],
            $data['checkOut'],
            $data['adults']
        );

        return new JsonResponse($hotels);
    }

    #[Route('/api/hotel-suggestions', name: 'api_hotel_suggestions')]
    public function getHotelSuggestions(HttpFoundationRequest $request): JsonResponse
    {
        $query = $request->query->get('query', '');
        $suggestions = $this->hotelService->fetchHotelSuggestions($query);
    
        return new JsonResponse($suggestions, 200);
    }
    
}
