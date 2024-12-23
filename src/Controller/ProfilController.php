<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserProfileRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProfilController extends AbstractController
{
    //READ PROFIL
    #[Route('/profil/display', name: 'app_display_profil', methods: ['GET'])]
    public function displayProfil(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'You are not logged in!'], 404);
        }

        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            if ($userProfile == null) {
                return new JsonResponse(['error' => 'User not found'], 404);
            }

            return new JsonResponse([
                [
                    'createTime' => $userProfile->getCreateTime(),
                    'updateTime' => $userProfile->getUpdateTime(),
                    'name' => $userProfile->getName(),
                    'surname' => $userProfile->getSurname(),
                    'username' => $userProfile->getUsername(),
                    'avatar' => $userProfile->getAvatar(),
                    'site' => $userProfile->getSite(),
                    'localAirport' => $userProfile->getLocalAirport(),
                ],
            ]);
        }
    }

    //Add user to expeditors
    #[Route('/expeditors', name: 'app_add_expeditor', methods: ['POST'])]
    public function addExpeditor(Request $request, UserProfileRepository $userProfileRepository): JsonResponse
    {
        $data = json_decode($request->getContent());
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'You are not logged in!'], 404);
        }

        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            if ($userProfile == null) {
                return new JsonResponse(['error' => 'User not found'], 404);
            }

            $userProfile->addAuthorizedExpeditor($data['email']);

            $userProfileRepository->save($userProfile, true);

        }
    }
}
