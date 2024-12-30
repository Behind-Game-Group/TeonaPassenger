<?php

namespace App\Controller;

use App\Entity\SharedTrip;
use App\Entity\User;
use App\Repository\SharedTripRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class SharedTripsController extends AbstractController
{
    private function createErrorResponse(string $message, int $statusCode): JsonResponse
    {
        return new JsonResponse(['error' => $message], $statusCode);
    }

    #[Route('/sharedtrips/display', name: 'app_display_shared_trips', methods: ['GET'])]
    public function displaySharedTrips(SerializerInterface $serializer): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->createErrorResponse('You are not logged in!', 401);
        }

        $userProfile = $user->getUserProfile();
        if ($userProfile === null) {
            return $this->createErrorResponse('User profile not found', 404);
        }

        $sharedTrips = $userProfile->getSharedTrips();
        $data = $serializer->serialize($sharedTrips, 'json', ['groups' => ['sharedTrip:read']]);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/sharedtrips/add', name: 'app_shared_trips_add', methods: ['POST'])]
    public function addSharedTrips(Request $request, SharedTripRepository $sharedTripRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        try {
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
            if (!$user instanceof User) {
                return $this->createErrorResponse('You are not logged in!', 401);
            }

            $userProfile = $user->getUserProfile();
            if ($userProfile === null) {
                return $this->createErrorResponse('User profile not found', 404);
            }

            if (empty($data['email'])) {
                return $this->createErrorResponse('Email is required', 400);
            }

            if (!isset($data['isEditable'])) {
                return $this->createErrorResponse('You need to check one of the cases below', 400);
            }

            $alreadyExistingTrip = $sharedTripRepository->findOneBy(['email' => $data['email'], 'userProfile_id' => $userProfile->getId()]);
            if ($alreadyExistingTrip) {
                return $this->createErrorResponse('Expeditor already exists for this user', 409);
                // Si le trip existe mais n'est pas encore autorisé pour ce profil utilisateur
            }

            $sharedTrip = new SharedTrip();
            $sharedTrip->setEmail($data['email']);

            if ($data['isEditable'] === 'isEditableOption1') {
                $sharedTrip->setIsEditable(true);
            } else {
                $sharedTrip->setIsEditable(false);
            }
            ! $userProfile->addSharedTrip($sharedTrip);
            $sharedTripRepository->save($sharedTrip, true);

            return new JsonResponse(['message' => 'User added to shared trips'], 201);
        } catch (\Exception $e) {
            // Log de l'erreur
            error_log('Error in SharedTripsController: ' . $e->getMessage());
            return $this->createErrorResponse('An unexpected error occurred', 500);
        }
    }

    #[Route('/sharedtrips/delete', name: 'app_delete_shared_trip', methods: ['DELETE'])]
    public function deleteSharedTrip(Request $request, SharedTripRepository $sharedTripRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        try {
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

            if (!$user instanceof User) {
                return $this->createErrorResponse('You are not logged in!', 401);
            }

            if (empty($data['email'])) {
                return $this->createErrorResponse('Email is required', 400);
            }

            $userProfile = $user->getUserProfile();
            if ($userProfile === null) {
                return $this->createErrorResponse('User profile not found', 404);
            }

            $sharedTrip = $sharedTripRepository->findOneBy(['email' => $data['email']]);
            if ($sharedTrip === null) {
                return $this->createErrorResponse('Shared trip not found', 404);
            }

            $userProfile->removeSharedTrip($sharedTrip);
            $sharedTripRepository->remove($sharedTrip);

            return new JsonResponse(['message' => 'Shared trip removed successfully'], 200);
        } catch (\Exception $e) {
            return $this->createErrorResponse('Internal server error: ' . $e->getMessage(), 500);
        }
    }
}
