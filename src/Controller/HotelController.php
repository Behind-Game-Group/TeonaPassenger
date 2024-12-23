<?php

namespace App\Controller;

use App\Entity\DislikedHotel;
use App\Entity\FavoriteHotel;
use App\Entity\User;
use App\Repository\DislikedHotelRepository;
use App\Repository\FavoriteHotelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class HotelController extends AbstractController
{
    #[Route('/showFavoriteHotels', name: 'app_show_favoite_hotels')]
    public function showFavoiteHotels(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $favoriteHotels = $userProfile->getFavoriteHotels();
            $favHotelData = $serializerInterface->serialize($favoriteHotels, 'json', ['groups' => ['favoriteHotel:read']]);
            return new JsonResponse($favHotelData, JsonResponse::HTTP_OK, [], true);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addFavoriteHotel', name: 'app_add_favoite_hotel')]
    public function addFavoiteHotel(EntityManagerInterface $em, Request $request, FavoriteHotelRepository $favoriteHotelRepository, DislikedHotelRepository $dislikedHotelRepository): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $favoriteHotel = new FavoriteHotel();

            $data = json_decode($request->getContent(), true);
            $name = $data['name'] ?? null;
            if (!$name) {
                return new JsonResponse(['error' => 'Name is required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $existingHotel = $favoriteHotelRepository->findOneBy(['name' => $name, 'userProfile_id' => $userProfile->getId()]);
            if ($existingHotel) {
                return new JsonResponse(['error' => 'This favorite hotel already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $dislikedHotel = $dislikedHotelRepository->findOneBy(['name' => $name, 'userProfile_id' => $userProfile->getId()]);
            if ($dislikedHotel) {
                $userProfile->removeDislikedHotel($dislikedHotel);
                $em->remove($dislikedHotel);
                $em->flush();
            }

            $favoriteHotel->setName($name);
            $userProfile->addFavoriteHotel($favoriteHotel);
            $em->persist($favoriteHotel);
            $em->flush();
            return new JsonResponse(['message' => 'Favorite hotel added successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteFavoriteHotel', name: 'app_delete_favoite_hotel')]
    public function deleteFavoiteHotel(EntityManagerInterface $em, Request $request, FavoriteHotelRepository $favoriteHotelRepository): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            
            $data = json_decode($request->getContent(), true);
            $id = $data['id'] ?? null;
            if (!$id) {
                return new JsonResponse(['error' => 'Id is required'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $hotel = $favoriteHotelRepository->find($id);
            if (!$hotel) {
                return new JsonResponse(['error' => 'Hotel not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $userProfile->removeFavoriteHotel($hotel);
            $em->remove($hotel);
            $em->flush();
            return new JsonResponse(['message' => 'Favorite hotel deleted successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/showDislikedHotels', name: 'app_show_disliked_hotels')]
    public function showDislikedHotels(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $disliskedHotels = $userProfile->getDislikedHotels();
            $dislikeHotelData = $serializerInterface->serialize($disliskedHotels, 'json', ['groups' => ['dislikedHotel:read']]);
            return new JsonResponse($dislikeHotelData, JsonResponse::HTTP_OK, [], true);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addDislikedHotel', name: 'app_add_disliked_hotel')]
    public function addDislikedHotel(EntityManagerInterface $em, Request $request, DislikedHotelRepository $dislikedHotelRepository, FavoriteHotelRepository $favoriteHotelRepository): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $dislikedHotel = new DislikedHotel();

            $data = json_decode($request->getContent(), true);
            $name = $data['name'] ?? null;
            if (!$name) {
                return new JsonResponse(['error' => 'Name is required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $existingHotel = $dislikedHotelRepository->findOneBy(['name' => $name, 'userProfile_id' => $userProfile->getId()]);
            if ($existingHotel) {
                return new JsonResponse(['error' => 'This disliked hotel already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $favoriteHotel = $favoriteHotelRepository->findOneBy(['name' => $name, 'userProfile_id' => $userProfile->getId()]);
            if ($favoriteHotel) {
                $userProfile->removeFavoriteHotel($favoriteHotel);
                $em->remove($favoriteHotel);
                $em->flush();
            }

            $dislikedHotel->setName($name);
            $userProfile->addDislikedHotel($dislikedHotel);
            $em->persist($dislikedHotel);
            $em->flush();
            return new JsonResponse(['message' => 'Disliked hotel added successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteDislikedHotel', name: 'app_delete_disliked_hotel')]
    public function deleteDislikedHotel(EntityManagerInterface $em, Request $request, DislikedHotelRepository $dislikedHotelRepository): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            
            $data = json_decode($request->getContent(), true);
            $id = $data['id'] ?? null;
            if (!$id) {
                return new JsonResponse(['error' => 'Id is required'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $hotel = $dislikedHotelRepository->find($id);
            if (!$hotel) {
                return new JsonResponse(['error' => 'Hotel not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $userProfile->removeDislikedHotel($hotel);
            $em->remove($hotel);
            $em->flush();
            return new JsonResponse(['message' => 'Disliked hotel deleted successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

}