<?php
// userprofile
namespace App\Controller;

use App\Entity\User;
use App\Entity\UserProfile;
use App\Repository\UserProfileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class UserProfileController extends AbstractController
{
    #[Route('/user_profile', name: 'create_user_profile', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Création d'un nouveau profil
        $userProfile = new UserProfile();
        $userProfile->setName($data['name'])
            ->setSurname($data['surname'])
            ->setUsername($data['username'])
            ->setAvatar($data['avatar'])
            ->setSite($data['site'])
            ->setLocalAirport($data['local_airport'])
            ->setCreateTime(new \DateTimeImmutable())
            ->setUpdateTime(new \DateTime());

        // Recherche de l'utilisateur lié au profil
        $user = $em->getRepository(User::class)->find($data['user_id']);
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }
        $userProfile->setUserId($user);

        $em->persist($userProfile);
        $em->flush();

        return new JsonResponse(['message' => 'Profil utilisateur créé avec succès'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/user_profile/{id}', name: 'get_user_profile', methods: ['GET'])]
    public function getUserProfile(int $id, UserProfileRepository $repository): JsonResponse
    {
        $userProfile = $repository->find($id);
        if (!$userProfile) {
            return new JsonResponse(['error' => 'Profil utilisateur introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse($userProfile);
    }

    #[Route('/user_profile/{id}', name: 'update_user_profile', methods: ['PUT'])]
    public function updateUserProfile(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $userProfile = $em->getRepository(UserProfile::class)->find($id);
        if (!$userProfile) {
            return new JsonResponse(['error' => 'Profil utilisateur introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        
        // Mise à jour des informations du profil
        $userProfile->setName($data['name'] ?? $userProfile->getName())
            ->setSurname($data['surname'] ?? $userProfile->getSurname())
            ->setUsername($data['username'] ?? $userProfile->getUsername())
            ->setAvatar($data['avatar'] ?? $userProfile->getAvatar())
            ->setSite($data['site'] ?? $userProfile->getSite())
            ->setLocalAirport($data['local_airport'] ?? $userProfile->getLocalAirport())
            ->setUpdateTime(new \DateTime());

        $em->flush();

        return new JsonResponse(['message' => 'Profil utilisateur mis à jour avec succès']);
    }

    #[Route('/user_profile/{id}', name: 'delete_user_profile', methods: ['DELETE'])]
    public function deleteUserProfile(int $id, EntityManagerInterface $em): JsonResponse
    {
        $userProfile = $em->getRepository(UserProfile::class)->find($id);
        if (!$userProfile) {
            return new JsonResponse(['error' => 'Profil utilisateur introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }

        $em->remove($userProfile);
        $em->flush();

        return new JsonResponse(['message' => 'Profil utilisateur supprimé avec succès']);
    }
}
