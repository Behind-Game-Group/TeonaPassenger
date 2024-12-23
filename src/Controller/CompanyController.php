<?php

namespace App\Controller;

use App\Entity\Company;
use App\Entity\User;
use App\Repository\CompanyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class CompanyController extends AbstractController
{
    #[Route('/showCompanies', name: 'app_show_companies')]
    public function showCompanies(SerializerInterface $serializerInterface): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $company = $userProfile->getCompanies();
            $data = $serializerInterface->serialize($company, 'json', ['groups' => ['company:read']]);
            return new JsonResponse($data, JsonResponse::HTTP_OK, [], true);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/addCompany', name: 'app_add_company')]
    public function addCompany(EntityManagerInterface $em, Request $request, CompanyRepository $companyRepository): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            $company = new Company();

            $data = json_decode($request->getContent(), true);
            $name = $data['name'] ?? null;
            if (!$name) {
                return new JsonResponse(['error' => 'Name is required'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $existingCompany = $companyRepository->findOneBy(['name' => $name, 'userProfile_id' => $userProfile->getId()]);
            if ($existingCompany) {
                return new JsonResponse(['error' => 'This company already exists'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $company->setName($name);
            $userProfile->addCompany($company);
            $em->persist($company);
            $em->flush();
            return new JsonResponse(['message' => 'Company added successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route('/deleteCompany', name: 'app_delete_company')]
    public function deleteCompany(EntityManagerInterface $em, Request $request, CompanyRepository $companyRepository): JsonResponse
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $userProfile = $user->getUserProfile();
            
            $data = json_decode($request->getContent(), true);
            $id = $data['id'] ?? null;
            if (!$id) {
                return new JsonResponse(['error' => 'Id is required'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $company = $companyRepository->find($id);
            if (!$company) {
                return new JsonResponse(['error' => 'Company not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $userProfile->removeCompany($company);
            $em->remove($company);
            $em->flush();
            return new JsonResponse(['message' => 'Company deleted successfully'], Response::HTTP_OK);
        }
        return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}