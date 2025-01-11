<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class GoogleAuthenticator extends AbstractAuthenticator
{

    public function __construct(
        private string $clientId,
        private string $clientSecret,
        private string $redirectUri,
        private ParameterBagInterface $params
    ) {
        $this->params = $params;
    }

    public function authenticate(Request $request): Passport
{
    $code = $request->get('code');
    
    try {
        $client = new \GuzzleHttp\Client();
        $response = $client->post('https://oauth2.googleapis.com/token', [
            'form_params' => [
                'code' => $code,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'redirect_uri' => $this->redirectUri,
                'grant_type' => 'authorization_code',
            ],
            'http_errors' => false
        ]);

        $data = json_decode($response->getBody()->getContents(), true);
        
        // Ajout de plus de détails dans l'erreur
        if ($response->getStatusCode() !== 200) {
            throw new AuthenticationException(
                sprintf(
                    'Google error: %s. Details: %s. Code: %s, Redirect URI: %s', 
                    $data['error'] ?? 'unknown error',
                    $data['error_description'] ?? 'no details',
                    $code,
                    $this->redirectUri
                )
            );
        }

            // Récupérer les informations de l'utilisateur avec le token
            $userInfoResponse = $client->get('https://www.googleapis.com/oauth2/v2/userinfo', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $data['access_token']
                ]
            ]);
            
            $userInfo = json_decode($userInfoResponse->getBody()->getContents(), true);

            return new SelfValidatingPassport(
                new UserBadge($userInfo['email']), 
                [new RememberMeBadge()]
            );
            
        } catch (\Exception $e) {
            throw new AuthenticationException($e->getMessage());
        }
    }

    public function supports(Request $request): ?bool
    {
        // Désactiver complètement l'authenticator pour le callback Google
        return false;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null; // Continuez normalement sans redirection supplémentaire.
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(['status' => 'failure', 'message' => $exception->getMessage()], 401);
    }
}
