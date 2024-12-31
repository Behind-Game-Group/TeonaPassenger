<?php

namespace App\Controller;

use App\Entity\Airport;
use App\Entity\User;
use App\Repository\AirportRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class AirportController extends AbstractController
{
    #[Route('/showAirports', name: 'app_show_airports')]
    public function showAirports(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $airports = $userProfile->getAirports();
            $data = $serializerInterface->serialize($airports, 'json', ['groups' => ['airport:read']]);
            return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addAirport', name: 'app_add_airport')]
    public function addAirport(EntityManagerInterface $em, Request $request, AirportRepository $airportRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérification de la présence du token CSRF dans la requête
        if (empty($data['csrfToken'])) {
            return new JsonResponse(['error' => 'CSRF token is missing'], Response::HTTP_BAD_REQUEST);
        }

        // Validation du token CSRF
        $csrfToken = new CsrfToken('default', $data['csrfToken']);
        if (!$csrfTokenManager->isTokenValid($csrfToken)) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $airport = new Airport();

            $name = $data['name'] ?? null;
            $location = $data['location'] ?? null;
            if (!$name || !$location) {
                return new JsonResponse(['error' => 'Name and location are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Vérification si l'aéroport existe déjà
            $existingAirport = $airportRepository->findOneBy(['name' => $name, 'userProfile_id' => $userProfile->getId()]);
            if ($existingAirport) {
                return new JsonResponse(['error' => 'This airport already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $airport->setName($name);
            $airport->setLocation($location);
            $userProfile->addAirport($airport);
            $em->persist($airport);
            $em->flush();

            return new JsonResponse(['message' => 'Airport added successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteAirport', name: 'app_delete_airport')]
    public function deleteAirport(EntityManagerInterface $em, Request $request, AirportRepository $airportRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérification de la présence du token CSRF dans la requête
        if (empty($data['csrfToken'])) {
            return new JsonResponse(['error' => 'CSRF token is missing'], Response::HTTP_BAD_REQUEST);
        }

        // Validation du token CSRF
        $csrfToken = new CsrfToken('default', $data['csrfToken']);
        if (!$csrfTokenManager->isTokenValid($csrfToken)) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();

            $id = $data['id'] ?? null;
            if (!$id) {
                return new JsonResponse(['error' => 'Id is required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $airport = $airportRepository->find($id);
            if (!$airport) {
                return new JsonResponse(['error' => 'Airport not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $userProfile->removeAirport($airport);
            $em->remove($airport);
            $em->flush();

            return new JsonResponse(['message' => 'Airport deleted successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/modifyAirport', name: 'app_modify_airport')]
    public function modifyAirport(EntityManagerInterface $em, Request $request, AirportRepository $airportRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérification de la présence du token CSRF dans la requête
        if (empty($data['csrfToken'])) {
            return new JsonResponse(['error' => 'CSRF token is missing'], Response::HTTP_BAD_REQUEST);
        }

        // Validation du token CSRF
        $csrfToken = new CsrfToken('default', $data['csrfToken']);
        if (!$csrfTokenManager->isTokenValid($csrfToken)) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();

            $id = $data['id'] ?? null;
            if (!$id) {
                return new JsonResponse(['error' => 'Id is required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $airport = $airportRepository->find($id);
            if (!$airport) {
                return new JsonResponse(['error' => 'Airport not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $name = $data['name'] ?? null;
            $location = $data['location'] ?? null;
            if (!$name || !$location) {
                return new JsonResponse(['error' => 'Name and location are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $airport->setName($name);
            $airport->setLocation($location);

            $em->persist($airport);
            $em->flush();

            return new JsonResponse(['message' => 'Airport updated successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
