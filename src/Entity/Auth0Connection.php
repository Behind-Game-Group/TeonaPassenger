<?php

namespace App\Entity;

use App\Repository\Auth0ConnectionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: Auth0ConnectionRepository::class)]
class Auth0Connection
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $auth0_id = null;  // le 'sub'

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $picture = null;

    #[ORM\Column(nullable: true)]
    private ?bool $email_verified = null;

    #[ORM\OneToOne(inversedBy: 'auth0Connection', cascade: ['persist', 'remove'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuth0Id(): ?string
    {
        return $this->auth0_id;
    }

    public function setAuth0Id(string $auth0_id): static
    {
        $this->auth0_id = $auth0_id;
        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): static
    {
        $this->picture = $picture;
        return $this;
    }

    public function getEmailVerified(): ?bool
    {
        return $this->email_verified;
    }

    public function setEmailVerified(?bool $email_verified): static
    {
        $this->email_verified = $email_verified;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
