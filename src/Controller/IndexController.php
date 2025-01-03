<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class IndexController extends AbstractController
{
    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/getCurrentUser', name: 'app_get_current_user')]
    public function getCurrentUser(): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            return new JsonResponse([
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles(),
                ],
            ]);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/assets/react/pages/Résultat/Resultat.tsx', name:'resultats')]
    public function resultat():Response
    {
        return $this->render('resultat/resultat.html.twig', [
            'test' => 'test'
        ]);
    }

    #[Route('/vols', name: 'app_vols')]
    public function vols(): Response
    {
        return $this->render('vols/vols.html.twig', [
            'test' => 'test'
        ]);
    }

    #[Route('/hebergement', name: 'app_hebergement')]
    public function hebergement(): Response
    {
        return $this->render('hebergement/hebergement.html.twig');
    }

    #[Route('/profil', name: 'app_profil')]
    public function profil(): Response
    {
        return $this->render('profil/profil.html.twig');
    }

    #[Route('/profil/parametres.tsx', name: 'app_parametres')]
    public function parametres():Response
    {
        return $this->render('profil/parametres.html.twig');
    }

    #[Route('/profil/preferences.tsx', name: 'app_preferences')]
    public function preferences():Response
    {
        return $this->render('profil/preferences.html.twig');
    }
}
