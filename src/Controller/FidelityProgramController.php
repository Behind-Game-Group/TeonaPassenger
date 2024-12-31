<?php

namespace App\Controller;

use App\Entity\FidelityProgram;
use App\Entity\User;
use App\Repository\FidelityProgramRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class FidelityProgramController extends AbstractController
{
    #[Route('/showFidelityPrograms', name: 'app_show_fidelity_programs')]
    public function showFidelityPrograms(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $fidelityPrograms = $userProfile->getFidelityPrograms();
            $data = $serializerInterface->serialize($fidelityPrograms, 'json', ['groups' => ['fidelityProgram:read']]);
            return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addFidelityProgram', name: 'app_add_fidelity_program')]
    public function addFidelityProgram(EntityManagerInterface $em, Request $request, FidelityProgramRepository $fidelityProgramRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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
            $fidelityProgram = new FidelityProgram();

            $name = $data['name'] ?? null;
            $description = $data['description'] ?? null;
            if (!$name || !$description) {
                return new JsonResponse(['error' => 'Name and description are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Check if the fidelity program already exists
            $existingFidelityProgram = $fidelityProgramRepository->findOneBy(['name' => $name, 'userProfile_id' => $userProfile->getId()]);
            if ($existingFidelityProgram) {
                return new JsonResponse(['error' => 'This fidelity program already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $fidelityProgram->setName($name);
            $fidelityProgram->setDescription($description);
            $userProfile->addFidelityProgram($fidelityProgram);
            $em->persist($fidelityProgram);
            $em->flush();

            return new JsonResponse(['message' => 'Fidelity program added successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteFidelityProgram', name: 'app_delete_fidelity_program')]
    public function deleteFidelityProgram(EntityManagerInterface $em, Request $request, FidelityProgramRepository $fidelityProgramRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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

            $fidelityProgram = $fidelityProgramRepository->find($id);
            if (!$fidelityProgram) {
                return new JsonResponse(['error' => 'Fidelity program not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $userProfile->removeFidelityProgram($fidelityProgram);
            $em->remove($fidelityProgram);
            $em->flush();

            return new JsonResponse(['message' => 'Fidelity program deleted successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/modifyFidelityProgram', name: 'app_modify_fidelity_program')]
    public function modifyFidelityProgram(EntityManagerInterface $em, Request $request, FidelityProgramRepository $fidelityProgramRepository, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
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

            $fidelityProgram = $fidelityProgramRepository->find($id);
            if (!$fidelityProgram) {
                return new JsonResponse(['error' => 'Fidelity program not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $name = $data['name'] ?? null;
            $description = $data['description'] ?? null;
            if (!$name || !$description) {
                return new JsonResponse(['error' => 'Name and description are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $fidelityProgram->setName($name);
            $fidelityProgram->setDescription($description);

            $em->persist($fidelityProgram);
            $em->flush();

            return new JsonResponse(['message' => 'Fidelity program updated successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
