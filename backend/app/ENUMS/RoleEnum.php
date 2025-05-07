<?php

// app/Enums/RoleEnum.php

namespace App\Enums;

class RoleEnum
{
    const USER = 'user';
    const Moderator = 'moderator';
    const ADMIN = 'admin';

    public static function getRoles(): array
    {
        return [
            self::USER => 'User',
            self::MODERATOR => 'Moderator',
            self::ADMIN => 'Admin',
        ];
    }
}

