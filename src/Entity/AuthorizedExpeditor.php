<?php

namespace App\Entity;

use App\Repository\AuthorizedExpeditorRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AuthorizedExpeditorRepository::class)]
class AuthorizedExpeditor
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\ManyToOne(inversedBy: 'authorizedExpeditors')]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserProfile $userProfile_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getUserProfileId(): ?UserProfile
    {
        return $this->userProfile_id;
    }

    public function setUserProfileId(?UserProfile $userProfile_id): static
    {
        $this->userProfile_id = $userProfile_id;

        return $this;
    }
}
