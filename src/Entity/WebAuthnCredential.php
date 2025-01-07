<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Webauthn\PublicKeyCredentialSource;
use Webauthn\TrustPath\EmptyTrustPath;

#[ORM\Entity]
#[ORM\Table(name: 'webauthn_credentials')]
class WebAuthnCredential
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid')]
    private Uuid $id;

    #[ORM\Column(type: 'string', unique: true)]
    private string $publicKeyCredentialId;

    #[ORM\Column(type: 'json')]
    private array $credentialData;

    public function __construct(PublicKeyCredentialSource $credential)
    {
        $this->id = Uuid::v4();
        $this->publicKeyCredentialId = $credential->publicKeyCredentialId;
        $this->credentialData = [
            'publicKeyCredentialId' => $credential->publicKeyCredentialId,
            'type' => $credential->type,
            'transports' => $credential->transports,
            'attestationType' => $credential->attestationType,
            'trustPath' => new EmptyTrustPath(),
            'aaguid' => (string) $credential->aaguid,
            'credentialPublicKey' => $credential->credentialPublicKey,
            'userHandle' => $credential->userHandle,
            'counter' => $credential->counter,
        ];
    }

    public function getCredential(): PublicKeyCredentialSource
    {
        return new PublicKeyCredentialSource(
            $this->credentialData['publicKeyCredentialId'],
            $this->credentialData['type'],
            $this->credentialData['transports'],
            $this->credentialData['attestationType'],
            new EmptyTrustPath(),
            Uuid::fromString($this->credentialData['aaguid']),
            $this->credentialData['credentialPublicKey'],
            $this->credentialData['userHandle'],
            $this->credentialData['counter']
        );
    }
}
