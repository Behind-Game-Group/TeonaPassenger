<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserProfile;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/registerCredentials', name: 'app_register_credentials', methods: ['POST'])]
    public function registerCredentials(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        MailerInterface $mailer // Injection du service MailerInterface
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email and password are required'], 400);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'This email is already registered.'], 400);
        }

        // Utilisation d'une transaction pour garantir la cohérence
        $em->getConnection()->beginTransaction();

        try {
            // Création de l'utilisateur
            $user = new User();
            $user->setEmail($email);
            $user->setRoles(['ROLE_USER']);
            $user->setPassword($passwordHasher->hashPassword($user, $password));

            // Création du profil utilisateur
            $userprofile = new UserProfile();
            $userprofile->setCreateTime(new DateTimeImmutable());
            $user->setUserProfile($userprofile);

            // Sauvegarde dans la base de données
            $em->persist($user);
            $em->flush();

            // Envoi de l'e-mail de confirmation
            $emailMessage = (new Email())
                ->from('no-reply@yourdomain.com') // Adresse de l'expéditeur (à configurer)
                ->to($email) // Adresse de l'utilisateur inscrit
                ->subject('Bienvenue sur notre site !')
                ->html($this->renderView('emails/registration_confirmation.html.twig', [
                    'user' => $user,
                ]));

            $mailer->send($emailMessage);

            // Confirmer la transaction
            $em->getConnection()->commit();

            return new JsonResponse(['message' => 'User registered successfully and confirmation email sent.'], 201);
        } catch (\Exception $e) {
            // Annuler la transaction en cas d'erreur
            $em->getConnection()->rollBack();

            return new JsonResponse(['error' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/loginCreddentials', name: 'app_login_credentials', methods: ['POST'])]
    public function loginCreddentials(): JsonResponse
    {
        // Symfony déclenchera automatiquement le SecurityControllerAuthenticator sur cette route.
        return new JsonResponse(['message' => 'You should never see this!'], 500);
    }
}
