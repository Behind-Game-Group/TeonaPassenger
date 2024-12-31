<?php

namespace App\Controller;

use DateTime;
use App\Entity\Trip;
use App\Entity\User;
use App\Repository\TripRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TripsController extends AbstractController
{
    #[Route('/trip/add', name: 'app_add_trip', methods: ['POST'])]
    public function addTrip(Request $request, TripRepository $tripRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérification de la présence du token CSRF dans la requête
        if (empty($data['csrfToken'])) {
            return new JsonResponse(['error' => 'You are not logged in!'], Response::HTTP_BAD_REQUEST);
        }

        // Validation du token CSRF
        $csrfToken = new CsrfToken('default', $data['csrfToken']);
        if (!$csrfTokenManager->isTokenValid($csrfToken)) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }

        // Check if user is logged in
        $user = $this->getUser();
        if (!$user instanceof \App\Entity\User) {
            return new JsonResponse(['error' => 'You are not logged in!'], 401);
        }

        $userProfile = $user->getUserProfile();
        if ($userProfile === null) {
            return new JsonResponse(['error' => 'User profile not found'], 404);
        }

        // Validate input fields
        if (empty($data['name'])) {
            return new JsonResponse(['error' => 'Name is required.'], 400);
        }

        if (empty($data['destination'])) {
            return new JsonResponse(['error' => 'Destination is required.'], 400);
        }

        if (empty($data['departureDate'])) {
            return new JsonResponse(['error' => 'Departure date is required.'], 400);
        }

        if (empty($data['arrivalDate'])) {
            return new JsonResponse(['error' => 'Arrival date is required.'], 400);
        }

        if (!isset($data['isConsultable'])) {
            return new JsonResponse(['error' => 'You need to check one of the consultation options.'], 400);
        }

        if ($tripRepository->findOneBy(['name' => $data['name'], 'destination' => $data['destination'], 'userProfile_id' => $userProfile->getId()])) {
            return new JsonResponse(['error' => "Cant't add the same trip twice."], 400);
        }

        // Parse dates
        $departureDate = DateTime::createFromFormat('Y-m-d', $data['departureDate']);
        $arrivalDate = DateTime::createFromFormat('Y-m-d', $data['arrivalDate']);

        if ($departureDate === false || $arrivalDate === false) {
            return new JsonResponse(['error' => 'Invalid date format. Dates must be in Y-m-d format.'], 400);
        }

        if ($departureDate >= $arrivalDate) {
            return new JsonResponse(['error' => 'Arrival date must be after departure date.'], 400);
        }

        // Create and save the trip
        $trip = new Trip();
        $trip->setName($data['name']);
        $trip->setDestination($data['destination']);
        $trip->setDepartureDate($departureDate);
        $trip->setArrivalDate($arrivalDate);

        if ($data['isConsultable'] === 'isConsultableOption1') {
            $trip->setConsultation(true); // Public
        } else {
            $trip->setConsultation(false); // Privé
        }


        $userProfile->addTrip($trip);

        $tripRepository->save($trip, true);

        return new JsonResponse(['message' => 'Trip created successfully.'], 201);
    }

    #[Route('/trips/display', name: 'app_get_trips', methods: ['GET'])]
    public function getTrips(SerializerInterface $serializer): JsonResponse
    {

        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'You are not logged in!'], 401);
        }

        $userProfile = $user->getUserProfile();
        if ($userProfile === null) {
            return new JsonResponse(['error' => 'User profile not found'], 404);
        }

        $trips = $userProfile->getTrips();
        if (empty($trips)) {
            return new JsonResponse(['error' => 'No trips found'], 404);
        }

        $data = $serializer->serialize($trips, 'json', ['groups' => ['trip:read']]);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/trip', name: 'app_delete_trip', methods: ['DELETE'])]
    public function deleteTrip(Request $request, TripRepository $tripRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Vérification de la présence du token CSRF dans la requête
            if (empty($data['csrfToken'])) {
                return new JsonResponse(['error' => 'You are not logged in!'], Response::HTTP_BAD_REQUEST);
            }

            // Validation du token CSRF
            $csrfToken = new CsrfToken('default', $data['csrfToken']);
            if (!$csrfTokenManager->isTokenValid($csrfToken)) {
                return new JsonResponse(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
            }

            $user = $this->getUser();

            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'You are not logged in!'], 401);
            }

            if (empty($data['id'])) {
                return new JsonResponse(['error' => 'ID is required'], 400);
            }

            $userProfile = $user->getUserProfile();
            if ($userProfile === null) {
                return new JsonResponse(['error' => 'User profile not found'], 404);
            }

            $trip = $tripRepository->findOneBy(['id' => $data['id'], 'userProfile_id' => $userProfile->getId()]);
            if ($trip === null) {
                return new JsonResponse(['error' => 'Trip not found'], 404);
            }

            $userProfile->removeTrip($trip);
            $tripRepository->remove($trip);

            return new JsonResponse(['message' => 'Trip removed successfully'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/trip/{id}', name: 'app_edit_trip', methods: ['PUT'])]
    public function editTrip(Request $request, TripRepository $tripRepository, $id, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        try {
            // Récupérer les données envoyées par l'utilisateur
            $data = json_decode($request->getContent(), true);

            // Vérification de la présence du token CSRF dans la requête
            if (empty($data['csrfToken'])) {
                return new JsonResponse(['error' => 'You are not logged in!'], Response::HTTP_BAD_REQUEST);
            }
    
            // Validation du token CSRF
            $csrfToken = new CsrfToken('default', $data['csrfToken']);
            if (!$csrfTokenManager->isTokenValid($csrfToken)) {
                return new JsonResponse(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
            }

            // Vérification si l'utilisateur est connecté
            $user = $this->getUser();
            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'You are not logged in!'], 401);
            }

            // Vérification du profil de l'utilisateur
            $userProfile = $user->getUserProfile();
            if ($userProfile === null) {
                return new JsonResponse(['error' => 'User profile not found'], 404);
            }

            // Recherche du voyage à mettre à jour
            $trip = $tripRepository->findOneBy(['id' => $id, 'userProfile_id' => $userProfile->getId()]);
            if (!$trip) {
                return new JsonResponse(['error' => 'Trip not found'], 404);
            }

            // Validation des données de voyage
            if (empty($data['name']) || empty($data['destination']) || empty($data['departureDate']) || empty($data['arrivalDate']) || !isset($data['isConsultable'])) {
                return new JsonResponse(['error' => 'Missing required fields'], 400);
            }

            // Vérifier le format des dates
            $departureDate = DateTime::createFromFormat('Y-m-d', $data['departureDate']);
            $arrivalDate = DateTime::createFromFormat('Y-m-d', $data['arrivalDate']);

            if ($departureDate === false || $arrivalDate === false) {
                return new JsonResponse(['error' => 'Invalid date format. Dates must be in Y-m-d format.'], 400);
            }

            if ($departureDate >= $arrivalDate) {
                return new JsonResponse(['error' => 'Arrival date must be after departure date.'], 400);
            }

            // Mise à jour des propriétés du voyage

            $trip->setName($data['name']);
            $trip->setDestination($data['destination']);
            $trip->setDepartureDate($departureDate);
            $trip->setArrivalDate($arrivalDate);

            if ($data['isConsultable'] === 'isConsultableOption1') {
                $trip->setConsultation(true); // Public
            } else {
                $trip->setConsultation(false); // Privé
            }


            // Sauvegarde du voyage mis à jour
            $tripRepository->save($trip, true);

            // Retourner une réponse de succès
            return new JsonResponse(['message' => 'Trip updated successfully.'], 200);
        } catch (\Exception $e) {
            // Gestion des erreurs
            return new JsonResponse(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }
}
