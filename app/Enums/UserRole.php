<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case ADMIN = 'admin';
    case SUPER_ADMIN = 'super_admin';

    public function label(): string
    {
        return match ($this) {
            self::USER => 'Customer',
            self::ADMIN => 'Admin',
            self::SUPER_ADMIN => 'Super Admin',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::USER => 'gray',
            self::ADMIN => 'info',
            self::SUPER_ADMIN => 'danger',
        };
    }
}
