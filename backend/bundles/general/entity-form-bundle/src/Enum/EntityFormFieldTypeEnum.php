<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Enum;

enum EntityFormFieldTypeEnum: string
{
    case TEXT = 'text';
    case NUMBER = 'number';
    case BOOLEAN = 'boolean';
    case COLLECTION = 'collection';
    case SCALAR_COLLECTION = 'scalar_collection';
    case ENUM_COLLECTION = 'enum_collection';
    case OBJECT = 'object';
    case ENUM = 'enum';
    case ASYNC_ENUM_COLLECTION = 'async_enum_collection';
    case ASYNC_ENUM = 'async_enum';
    case DATETIME = 'datetime';
    case DATE = 'date';
    case FILE = 'file';
    case HIDDEN = 'hidden';
    case BUTTON = 'button';
    case NONE = 'none';

    public static function mapBuiltinType(string $builtinType): EntityFormFieldTypeEnum
    {
        return match ($builtinType) {
            'string' => EntityFormFieldTypeEnum::TEXT,
            'int', 'float' => EntityFormFieldTypeEnum::NUMBER,
            'bool' => EntityFormFieldTypeEnum::BOOLEAN,
            'object' => EntityFormFieldTypeEnum::OBJECT,
            'array' => EntityFormFieldTypeEnum::COLLECTION,
        };
    }
}
