<?php

namespace App\Controller;

use App\Entity\User;
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

        if(!$user instanceof User) {
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

    //EDIT PROFIL
    #[Route('/profil/edit', name: 'app_edit_profil')]
    public function editProfil(Request $request): JsonResponse
    {
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        if(!$user instanceof User) {
            return new JsonResponse(['error' => 'You are not logged in!'], 404);
        }

        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();

            if ($userProfile == null) {
                return new JsonResponse(['error' => 'User not found'], 404);
            }

            return new JsonResponse('');
            
        }
    }
}
