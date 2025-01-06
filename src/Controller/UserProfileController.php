<?php

namespace App\Controller;

use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class UserProfileController extends AbstractController
{
    #[Route('/showUserProfile', name: 'app_show_user_profile')]
    public function showUserProfile(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $data = $serializerInterface->serialize($userProfile, 'json', ['groups' => ['userProfile:read']]);
            return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/updateUserProfile', name: 'app_update_user_profile')]
    public function updateUserProfile(
        EntityManagerInterface $em, 
        Request $request, 
        CsrfTokenManagerInterface $csrfTokenManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // CSRF token verification
        if (empty($data['csrfToken'])) {
            return new JsonResponse(['error' => 'CSRF token is missing'], Response::HTTP_BAD_REQUEST);
        }
        $csrfToken = new CsrfToken('default', $data['csrfToken']);
        if (!$csrfTokenManager->isTokenValid($csrfToken)) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();

            $name = $data['name'] ?? null;
            $surname = $data['surname'] ?? null;
            $username = $data['username'] ?? null;
            $site = $data['site'] ?? null;

            if (!$name || !$surname || !$username || !$site) {
                return new JsonResponse(['error' => 'Name, surname, username and site are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $userProfile->setName($name);
            $userProfile->setSurname($surname);
            $userProfile->setUsername($username);
            $userProfile->setSite($site);
            $userProfile->setLocalAirport($data['local_airport'] ?? $userProfile->getLocalAirport());
            $userProfile->setUpdateTime(new DateTimeImmutable());
            $em->persist($userProfile);
            $em->flush();
            return new JsonResponse(['message' => 'Profile updated successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
