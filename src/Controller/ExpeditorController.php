<?php

namespace App\Controller;

use App\Entity\AuthorizedExpeditor;
use App\Entity\User;
use App\Repository\AuthorizedExpeditorRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class ExpeditorController extends AbstractController
{
    private function createErrorResponse(string $message, int $statusCode): JsonResponse
    {
        return new JsonResponse(['error' => $message], $statusCode);
    }

    #[Route('/expeditors', name: 'app_display_expeditors', methods: ['GET'])]
    public function displayExpeditors(SerializerInterface $serializer): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->createErrorResponse('You are not logged in!', 401);
        }

        $userProfile = $user->getUserProfile();
        if ($userProfile === null) {
            return $this->createErrorResponse('User profile not found', 404);
        }

        $expeditors = $userProfile->getAuthorizedExpeditors();
        $data = $serializer->serialize($expeditors, 'json', ['groups' => ['expeditor:read']]);
        return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
    }

    #[Route('/expeditors', name: 'app_add_expeditor', methods: ['POST'])]
    public function addExpeditor(Request $request, AuthorizedExpeditorRepository $expeditorRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        try {
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

            if (empty($data['email'])) {
                return new JsonResponse(['error' => 'Email is required'], 400);  // Utilisation de 'error' pour la gestion d'erreurs
            }

            $user = $this->getUser();
            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'You are not logged in!'], 401);
            }

            $userProfile = $user->getUserProfile();
            if ($userProfile === null) {
                return new JsonResponse(['error' => 'User profile not found'], 404);
            }

            $existingExpeditor = $expeditorRepository->findOneBy(['email' => $data['email'], 'userProfile_id' => $userProfile->getId()]);
            if ($existingExpeditor) {
                return new JsonResponse(['error' => 'Expeditor already exists for this user'], 409);
            }

            $expeditor = new AuthorizedExpeditor();
            $expeditor->setEmail($data['email']);
            $userProfile->addAuthorizedExpeditor($expeditor);
            $expeditorRepository->save($expeditor, true);

            return new JsonResponse(['message' => 'User added to expeditors'], 201);  // Utilisation de 'message' pour une réponse réussie
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Internal server error: ' . $e->getMessage()], 500);  // Retour d'une erreur générique
        }
    }


    #[Route('/expeditor', name: 'app_remove_expeditor', methods: ['DELETE'])]
    public function removeExpeditor(Request $request, AuthorizedExpeditorRepository $expeditorRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        try {
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

            if (!$user instanceof User) {
                return $this->createErrorResponse('You are not logged in!', 401);
            }

            if (empty($data['email'])) {
                return $this->createErrorResponse('Email is required', 400);
            }

            $userProfile = $user->getUserProfile();
            if ($userProfile === null) {
                return $this->createErrorResponse('User profile not found', 404);
            }

            $expeditor = $expeditorRepository->findOneBy(['email' => $data['email']]);
            if ($expeditor === null) {
                return $this->createErrorResponse('Expeditor not found', 404);
            }

            $userProfile->removeAuthorizedExpeditor($expeditor);
            $expeditorRepository->remove($expeditor);

            return new JsonResponse(['message' => 'Expeditor removed successfully'], 200);
        } catch (\Exception $e) {
            return $this->createErrorResponse('Internal server error: ' . $e->getMessage(), 500);
        }
    }
}
