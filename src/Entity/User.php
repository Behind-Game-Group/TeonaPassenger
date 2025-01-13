<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['user:read'])]
    #[ORM\Column(length: 180)]
    private ?string $email = null;

    #[Groups(['user:read'])]
    #[ORM\Column(length: 180, nullable: true)]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[Groups(['user:read'])]
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[Groups(['user:unread'])]
    #[ORM\Column(nullable: true)]
    private ?string $password = null;

    #[Groups(['user:read'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['user:read'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToOne(mappedBy: 'user_id', cascade: ['persist', 'remove'])]
    private ?UserProfile $userProfile = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?GoogleConnection $googleConnection = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Auth0Connection $auth0Connection = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUserProfile(): ?UserProfile
    {
        return $this->userProfile;
    }

    public function setUserProfile(UserProfile $userProfile): static
    {
        // set the owning side of the relation if necessary
        if ($userProfile->getUserId() !== $this) {
            $userProfile->setUserId($this);
        }

        $this->userProfile = $userProfile;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }
    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getGoogleConnection(): ?GoogleConnection
    {
        return $this->googleConnection;
    }

    public function setGoogleConnection(?GoogleConnection $googleConnection): static
    {
        // unset the owning side of the relation if necessary
        if ($googleConnection === null && $this->googleConnection !== null) {
            $this->googleConnection->setUser(null);
        }

        // set the owning side of the relation if necessary
        if ($googleConnection !== null && $googleConnection->getUser() !== $this) {
            $googleConnection->setUser($this);
        }

        $this->googleConnection = $googleConnection;

        return $this;
    }

    public function getAuth0Connection(): ?Auth0Connection
    {
        return $this->auth0Connection;
    }

    public function setAuth0Connection(?Auth0Connection $auth0Connection): static
    {
        // unset the owning side of the relation if necessary
        if ($auth0Connection === null && $this->auth0Connection !== null) {
            $this->auth0Connection->setUser(null);
        }

        // set the owning side of the relation if necessary
        if ($auth0Connection !== null && $auth0Connection->getUser() !== $this) {
            $auth0Connection->setUser($this);
        }

        $this->auth0Connection = $auth0Connection;

        return $this;
    }
}
