<?php

namespace App\Controller;

use App\Entity\FidelityProgram;
use App\Entity\User;
use App\Repository\FidelityProgramRepository;
use App\Repository\TravelerRepository;
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
            $travelers = $userProfile->getTravelers();
            foreach ($travelers as $traveler) {
                $fidelityProgram[] = $traveler->getFidelityPrograms();
            }
            $data = $serializerInterface->serialize($fidelityProgram, 'json', ['groups' => ['fidelityProgram:read']]);
            return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addFidelityProgram', name: 'app_add_fidelity_program')]
    public function addFidelityProgram(EntityManagerInterface $em, Request $request, FidelityProgramRepository $fidelityProgramRepository, CsrfTokenManagerInterface $csrfTokenManager, TravelerRepository $travelerRepository): JsonResponse
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
            $traveler = $travelerRepository->find($id);
            if (!$traveler) {
                return new JsonResponse(['error' => 'Traveler not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $fidelityProgram = new FidelityProgram();

            $name = $data['name'] ?? null;
            $programNumber = $data['programNumber'] ?? null;
            if (!$name || !$programNumber) {
                return new JsonResponse(['error' => 'Name and description are required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Check if the fidelity program already exists
            $existingFidelityProgram = $fidelityProgramRepository->findOneBy(['name' => $name, 'traveler_id' => $traveler->getId()]);
            if ($existingFidelityProgram) {
                return new JsonResponse(['error' => 'This fidelity program already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $fidelityProgram->setName($name);
            $fidelityProgram->setProgramNumber($programNumber);
            $traveler->addFidelityProgram($fidelityProgram);
            $em->persist($fidelityProgram);
            $em->flush();

            return new JsonResponse(['message' => 'Fidelity program added successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteFidelityProgram', name: 'app_delete_fidelity_program')]
    public function deleteFidelityProgram(EntityManagerInterface $em, Request $request, FidelityProgramRepository $fidelityProgramRepository, CsrfTokenManagerInterface $csrfTokenManager, TravelerRepository $travelerRepository): JsonResponse
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
            $program_id = $data['id'] ?? null;
            if (!$program_id) {
                return new JsonResponse(['error' => 'Program id is required'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $program = $fidelityProgramRepository->find($program_id);
            if (!$program) {
                return new JsonResponse(['error' => 'Program not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $traveler = $program->getTravelerId();
            $traveler->removeFidelityProgram($program);
            $em->remove($program);
            $em->flush();

            return new JsonResponse(['message' => 'Fidelity program deleted successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
