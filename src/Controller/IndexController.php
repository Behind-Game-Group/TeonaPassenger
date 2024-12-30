<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class IndexController extends AbstractController
{
    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/profil', name: 'app_profil')]
    public function profil(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/getCurrentUser', name: 'app_get_current_user')]
    public function getCurrentUser(CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {

            $csrfToken = $csrfTokenManager->getToken('default')->getValue();
            return new JsonResponse([
                'user' => [
                    'csrfToken' => $csrfToken, 
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles(),
                ],
            ]);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/sharedtrips', name: 'app_shared_trips', methods: ['GET'])]
    public function sharedTrips(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/trips', name: 'app_trips', methods: ['GET'])]
    public function Trips(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }
}
