<?php

namespace App\Controller;

use App\Entity\FavoriteDestination;
use App\Entity\User;
use App\Repository\CompanyRepository;
use App\Repository\FavoriteDestinationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class DestinationController extends AbstractController
{
    #[Route('/showDestinations', name: 'app_show_destinations')]
    public function showDestinations(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $destination = $userProfile->getFavoriteDestinations();
            $data = $serializerInterface->serialize($destination, 'json', ['groups' => ['favoriteDestination:read']]);
            return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addDestination', name: 'app_add_destination')]
    public function addDestination(EntityManagerInterface $em, Request $request, FavoriteDestinationRepository $favoriteDestinationRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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
            $destination = new FavoriteDestination();

            $name = $data['name'] ?? null;
            $address = $data['adress'] ?? null;
            if (!$name || !$address) {
                return new JsonResponse(['error' => 'Name and adress are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $existingadress = $favoriteDestinationRepository->findOneBy(['address' => $address, 'userProfile_id' => $userProfile->getId()]);
            if ($existingadress) {
                $existingadress->setName($name);
                $em->persist($existingadress);
                $em->flush();
                return new JsonResponse(['message' => 'Destination name updated successfully'], Response::HTTP_OK);
            }

            $existingDestination = $favoriteDestinationRepository->findOneBy(['name' => $name, 'address' => $address, 'userProfile_id' => $userProfile->getId()]);
            if ($existingDestination) {
                return new JsonResponse(['error' => 'This destination already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $destination->setName($name);
            $destination->setAddress($address);
            $userProfile->addFavoriteDestination($destination);
            $em->persist($destination);
            $em->flush();
            return new JsonResponse(['message' => 'Company added successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteDestination', name: 'app_delete_destination')]
    public function deleteDestination(EntityManagerInterface $em, Request $request, FavoriteDestinationRepository $favoriteDestinationRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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
            $destination = $favoriteDestinationRepository->find($id);
            if (!$destination) {
                return new JsonResponse(['error' => 'Company not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $userProfile->removeFavoriteDestination($destination);
            $em->remove($destination);
            $em->flush();
            return new JsonResponse(['message' => 'Company deleted successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/modifyDestination', name: 'app_modify_destination')]
    public function modifyDestination(EntityManagerInterface $em, Request $request, FavoriteDestinationRepository $favoriteDestinationRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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
            $destination = $favoriteDestinationRepository->find($id);
            if (!$destination) {
                return new JsonResponse(['error' => 'Company not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $name = $data['name'] ?? null;
            $address = $data['adress'] ?? null;
            if (!$name || !$address) {
                return new JsonResponse(['error' => 'Name and adress are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $existingadress = $favoriteDestinationRepository->findOneBy(['address' => $address, 'userProfile_id' => $userProfile->getId()]);
            if ($existingadress) {
                $existingadress->setName($name);
                $em->persist($existingadress);
                $em->flush();
                return new JsonResponse(['message' => 'Destination name updated successfully'], Response::HTTP_OK);
            }

            $existingDestination = $favoriteDestinationRepository->findOneBy(['name' => $name, 'address' => $address, 'userProfile_id' => $userProfile->getId()]);
            if ($existingDestination) {
                return new JsonResponse(['error' => 'This destination already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $destination->setName($name);
            $destination->setAddress($address);
            $em->persist($destination);
            $em->flush();
            return new JsonResponse(['message' => 'Company added successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}