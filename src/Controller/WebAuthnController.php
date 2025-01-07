<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Webauthn\PublicKeyCredentialCreationOptions;
use Webauthn\PublicKeyCredentialRpEntity;
use Webauthn\PublicKeyCredentialUserEntity;
use Webauthn\AuthenticatorSelectionCriteria;
use Webauthn\PublicKeyCredentialParameters;
use Webauthn\PublicKeyCredentialDescriptor;
use Webauthn\PublicKeyCredentialRequestOptions;
use Symfony\Component\Security\Core\User\UserInterface;

class WebAuthnController extends AbstractController
{
    #[Route('/webauthn/register/options', name: 'webauthn_register_options', methods: ['GET'])]
    public function generateRegisterOptions(UserInterface $userInterface): JsonResponse
    {
        // Crée une entité représentant l'application WebAuthn, contenant le nom de l'application.
        $rpEntity = new PublicKeyCredentialRpEntity('Teona Passenger');

        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if ($user instanceof User) {
            // Récupérer l'identifiant de l'utilisateur
            $userIdentifier = $userInterface->getUserIdentifier(); // Par exemple, l'email

            // Convertir l'identifiant de l'utilisateur en ArrayBuffer (en PHP, on convertit en chaîne binaire)
            $userIdArrayBuffer = $this->stringToArrayBuffer($userIdentifier);

            // Créer l'entité utilisateur WebAuthn avec l'ArrayBuffer
            $userEntity = new PublicKeyCredentialUserEntity(
                $userIdArrayBuffer, // L'ID utilisateur sous forme d'ArrayBuffer
                $userInterface->getUserIdentifier(),  // Identifiant utilisateur sous forme de chaîne (affichage)
                $user->getUserIdentifier()  // Identifiant interne pour l'utilisateur
            );
        }

        // Créer les options de création de la clé publique WebAuthn
        $authenticatorSelection = new AuthenticatorSelectionCriteria(
            residentKey: AuthenticatorSelectionCriteria::RESIDENT_KEY_REQUIREMENT_DISCOURAGED, // Ne nécessite pas de clé résidente
            userVerification: AuthenticatorSelectionCriteria::USER_VERIFICATION_REQUIREMENT_REQUIRED // Vérification de l'utilisateur requise
        );

        // Créer les options de création d'identifiants WebAuthn
        $publicKeyCredentialCreationOptions = new PublicKeyCredentialCreationOptions(
            rp: $rpEntity, // Entité représentant l'application WebAuthn
            user: $userEntity, // Entité représentant l'utilisateur
            challenge: random_bytes(32), // Génère un challenge aléatoire pour la sécurité de l'enregistrement
            pubKeyCredParams: [new PublicKeyCredentialParameters(PublicKeyCredentialDescriptor::CREDENTIAL_TYPE_PUBLIC_KEY, -7)], // Paramètres de la clé publique (algorithme utilisé)
            timeout: 60000, // Délai d'attente (60 secondes) pour la réponse de l'authentificateur
            authenticatorSelection: $authenticatorSelection // Sélection de l'authentificateur
        );

        // Retourner les options de création d'identifiants WebAuthn sous forme de réponse JSON
        return $this->json(['publicKey' => $publicKeyCredentialCreationOptions]);
    }

    // Fonction pour convertir une chaîne en ArrayBuffer
    private function stringToArrayBuffer(string $str): string
    {
        // Convertir la chaîne en binaire
        $buffer = '';
        for ($i = 0; $i < strlen($str); $i++) {
            $buffer .= chr(ord($str[$i]));
        }
        return $buffer;
    }

    // Route pour générer les options de connexion WebAuthn (pour l'authentification de l'utilisateur).
    #[Route('/webauthn/login/options', name: 'webauthn_login_options', methods: ['GET'])]
    public function generateLoginOptions(): JsonResponse
    {
        // Crée les options de demande d'authentification WebAuthn, incluant les données nécessaires pour la vérification de l'utilisateur.
        $publicKeyCredentialRequestOptions = new PublicKeyCredentialRequestOptions(
            challenge: random_bytes(32), // Génère un challenge aléatoire pour la sécurité de la connexion
            timeout: 60000, // Délai d'attente (60 secondes) pour la réponse de l'authentificateur
            userVerification: PublicKeyCredentialRequestOptions::USER_VERIFICATION_REQUIREMENT_REQUIRED // Vérification de l'utilisateur requise
        );

        // Retourne les options de demande d'authentification sous forme de réponse JSON.
        return $this->json($publicKeyCredentialRequestOptions);
    }
}
