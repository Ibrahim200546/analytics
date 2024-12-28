<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Service;

use Dexodus\FileBundle\Entity\File;
use Dexodus\FileBundle\Entity\FileMember;
use Dexodus\FileBundle\Repository\FileMemberRepository;
use Symfony\Component\Security\Core\User\UserInterface;

class FileSecurity
{
    public function __construct(
        private FileMemberRepository $fileMemberRepository,
    ) {
    }

    public function canInvite(File $file, UserInterface $user): bool
    {
        return in_array(FileMember::ROLE_INVITE, $this->getRoles($file, $user));
    }

    public function canRead(File $file, UserInterface $user): bool
    {
        return in_array(FileMember::ROLE_READ, $this->getRoles($file, $user));
    }

    public function canSign(File $file, UserInterface $user): bool
    {
        return in_array(FileMember::ROLE_SIGN, $this->getRoles($file, $user));
    }

    private function getRoles(File $file, UserInterface $user): array
    {
        $fileMember = $this->fileMemberRepository->findOneBy(['user' => $user, 'file' => $file]);

        if (!$fileMember instanceof FileMember) {
            return [];
        }

        return $fileMember->getRoles();
    }
}
