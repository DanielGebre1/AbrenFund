<?php

// app/Enums/RoleEnum.php

namespace App\Enums;

class RoleEnum
{
    const USER = 'user';
    const REVIEWER = 'reviewer';
    const ADMIN = 'admin';

    public static function getRoles(): array
    {
        return [
            self::USER => 'User',
            self::REVIEWER => 'Reviewer',
            self::ADMIN => 'Admin',
        ];
    }
}

