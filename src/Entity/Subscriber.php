<?php

namespace App\Entity;

use App\Repository\SubscriberRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SubscriberRepository::class)]
class Subscriber
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column]
    private ?bool $isSubscribed = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function isSubscribed(): ?bool
    {
        return $this->isSubscribed;
    }

    public function setSubscribed(bool $isSubscribed): static
    {
        $this->isSubscribed = $isSubscribed;

        return $this;
    }
}
