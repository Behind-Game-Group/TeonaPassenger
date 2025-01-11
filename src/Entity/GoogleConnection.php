<?php

namespace App\Entity;

use App\Repository\GoogleConnectionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GoogleConnectionRepository::class)]
class GoogleConnection
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $google_id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $google_name = null;

    #[ORM\OneToOne(inversedBy: 'googleConnection', cascade: ['persist', 'remove'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGoogleId(): ?string
    {
        return $this->google_id;
    }

    public function setGoogleId(string $google_id): static
    {
        $this->google_id = $google_id;
        return $this;
    }

    public function getGoogleName(): ?string
    {
        return $this->google_name;
    }

    public function setGoogleName(?string $google_name): static
    {
        $this->google_name = $google_name;
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
