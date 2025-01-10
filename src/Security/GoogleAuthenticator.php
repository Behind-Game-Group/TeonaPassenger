<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Security\Authenticator\OAuth2Authenticator;
use Symfony\Component\HttpFoundation\Request;
use League\OAuth2\Client\Provider\GoogleUser;
use Symfony\Component\HttpFoundation\Response;
use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Util\TargetPathTrait;

class GoogleAuthenticator extends OAuth2Authenticator
{
    use TargetPathTrait;

    public function __construct(
        private readonly RouterInterface $router,
        private readonly ClientRegistry $clientRegistry,
        private readonly UserRepository $repository,
        private readonly OAuthRegistrationService $registrationService,
        private readonly LoggerInterface $logger,
        private readonly ParameterBagInterface $params
    ) {}

    protected function getUserFromResourceOwner(ResourceOwnerInterface $resourceOwner, UserRepository $repository): ?User
    {
        if (!($resourceOwner instanceof GoogleUser)) {
            throw new \RuntimeException("expecting google user");
        }

        if (true !== ($resourceOwner->toArray()['email_verified'] ?? null)) {
            throw new AuthenticationException("email not verified");
        }

        return $repository->findOneBy([
            'google_id' => $resourceOwner->getId(),
            'email' => $resourceOwner->getEmail()
        ]);
    }

    public function supports(Request $request): ?bool
    {
        return $request->getPathInfo() === '/google/callback';
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse(['status' => 'failure', 'message' => $exception->getMessage()], 401);
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        // Utilisez la méthode get pour récupérer les variables d'environnement
        $clientId = $this->params->get('google_oauth_id');
        $clientSecret = $this->params->get('google_oauth_secret');

        dump($clientId, $clientSecret);

        // Récupérer le code d'autorisation de Google
        $code = $request->get('code');

        if (!$code) {
            throw new \InvalidArgumentException('Aucun code d\'autorisation fourni pour l\'authentification.');
        }

        // Échanger le code contre un jeton d'accès (access_token)
        $client = new \GuzzleHttp\Client();
        $response = $client->post('https://oauth2.googleapis.com/token', [
            'form_params' => [
                'code' => $code,
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri' => 'https://127.0.0.1:8000/google/callback',
                'grant_type' => 'authorization_code',
            ],
        ]);

        $data = json_decode($response->getBody()->getContents(), true);
        $accessToken = $data['access_token'] ?? null;

        if (!$accessToken) {
            throw new \InvalidArgumentException('Erreur de récupération du jeton d\'accès de Google.');
        }

        // Utiliser le jeton pour récupérer les infos de l'utilisateur
        $response = $client->get('https://www.googleapis.com/oauth2/v3/userinfo', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ],
        ]);

        $userData = json_decode($response->getBody()->getContents(), true);
        $userEmail = $userData['email'] ?? null;

        if (!$userEmail) {
            throw new \InvalidArgumentException('Aucun email récupéré à partir de Google.');
        }

        // Créez et retournez un Passport avec l'email utilisateur
        return new SelfValidatingPassport(
            new UserBadge($userEmail),
            [new RememberMeBadge()]
        );
    }
}
