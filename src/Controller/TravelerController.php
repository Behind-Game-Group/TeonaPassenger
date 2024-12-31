<?php

namespace App\Controller;

use App\Entity\Traveler;
use App\Entity\User;
use App\Repository\TravelerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class TravelerController extends AbstractController
{
    #[Route('/showTravelers', name: 'app_show_travelers')]
    public function showTravelers(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $travelers = $userProfile->getTravelers();
            $data = $serializerInterface->serialize($travelers, 'json', ['groups' => ['traveler:read']]);
            return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addTraveler', name: 'app_add_traveler')]
    public function addTraveler(EntityManagerInterface $em, Request $request, TravelerRepository $travelerRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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
            $traveler = new Traveler();

            $name = $data['name'] ?? null;
            $email = $data['email'] ?? null;
            if (!$name || !$email) {
                return new JsonResponse(['error' => 'Name and email are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Vérifie si le voyageur existe déjà
            $existingTraveler = $travelerRepository->findOneBy(['email' => $email, 'userProfile' => $userProfile]);
            if ($existingTraveler) {
                return new JsonResponse(['error' => 'This traveler already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $traveler->setName($name);
            // $traveler->setEmail($email);
            $userProfile->addTraveler($traveler); // Associe ce voyageur au profil utilisateur
            $em->persist($traveler);
            $em->flush();

            return new JsonResponse(['message' => 'Traveler added successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteTraveler', name: 'app_delete_traveler')]
    public function deleteTraveler(EntityManagerInterface $em, Request $request, TravelerRepository $travelerRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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
            $traveler = $travelerRepository->find($id);
            if (!$traveler) {
                return new JsonResponse(['error' => 'Traveler not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $userProfile->removeTraveler($traveler); // Enlève le voyageur du profil utilisateur
            $em->remove($traveler);
            $em->flush();

            return new JsonResponse(['message' => 'Traveler deleted successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/modifyTraveler', name: 'app_modify_traveler')]
    public function modifyTraveler(EntityManagerInterface $em, Request $request, TravelerRepository $travelerRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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
            $traveler = $travelerRepository->find($id);
            if (!$traveler) {
                return new JsonResponse(['error' => 'Traveler not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $name = $data['name'] ?? null;
            $email = $data['email'] ?? null;
            if (!$name || !$email) {
                return new JsonResponse(['error' => 'Name and email are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $traveler->setName($name);
            $traveler->setEmail($email);
            $em->persist($traveler);
            $em->flush();

            return new JsonResponse(['message' => 'Traveler updated successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
