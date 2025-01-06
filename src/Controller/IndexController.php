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

    // Ajout de la route
    #[Route('/userprofil', name: 'app_userprofil')]
    public function userprofil(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/favorite', name: 'app_favorite')]
    public function favorite(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
    }

    #[Route('/vols/page', name: 'app_profil')]
    public function vols(): Response
    {
        return $this->render('index/index.html.twig', [
            'sitename' => 'Teona Passenger',
        ]);
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

    #[Route('/getCurrentUser', name: 'app_get_current_user')]
    public function getCurrentUser(CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $user = $this->getUser();
        $csrfToken = $csrfTokenManager->getToken('default')->getValue();
        if ($user instanceof User) {
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

    #[Route('/profil/voyageurs.tsx', name: 'app_voyageurs')]
    public function voyageurs():Response
    {
        return $this->render('profil/voyageurs.html.twig');
    }

    #[Route('/profil/ajoutervoyageur.tsx', name: 'app_ajoutervoyageur')]
    public function ajoutervoyageur():Response
    {
        return $this->render('profil/ajoutervoyageur.html.twig');
    }
}
