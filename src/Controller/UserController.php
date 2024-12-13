<?php 

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\BrowserKit\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/add', name: 'user', methods: ['POST'])]
    public function addUser(UserRepository $userRepository):Response
    {
        $user = new User();
        $user->setEmail('admin@admin.com');
        $user->setPassword('admin');
        $user->setRoles(['ROLE_ADMIN']);
        
        $userRepository->save($user);
        return new Response ('User added successfully');
    }
}