<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Enum;

enum EntityFormFieldComponentEnum: string
{
    case TEXT_FIELD = 'TextField';
    case NUMBER_FIELD = 'NumberField';
    case SWITCHER_FIELD = 'SwitcherField';
    case OBJECT_FIELD = 'ObjectField';
    case COLLECTION_FIELD = 'CollectionField';
    case SCALAR_COLLECTION_FIELD = 'ScalarCollectionField';
    case DROPDOWN_FIELD = 'DropdownField';
    case MULTIPLE_DROPDOWN_FIELD = 'MultipleDropdownField';
    case ASYNC_DROPDOWN_FIELD = 'AsyncDropdownField';
    case ASYNC_MULTIPLE_DROPDOWN_FIELD = 'AsyncMultipleDropdownField';
    case DATETIME_PICKER_FIELD = 'DateTimePickerField';
    case DATE_FIELD = 'DateField';
    case FILE_DROPZONE_FIELD = 'FileDropzoneField';

    case HIDDEN_FIELD = 'HiddenField';

    case CKEDITOR_FIELD = 'CKEditorField';

    case BUTTON_FIELD = 'ButtonField';

    case CHECKBOX_FIELD = 'CheckboxField';

    case LABEL_FIELD = 'LabelField';

    case COLOR_PICKER_FIELD = 'ColorPickerField';

    case PHONE_FIELD = 'PhoneField';

    public static function getDefaultFieldByType(EntityFormFieldTypeEnum $type): EntityFormFieldComponentEnum
    {
        return match ($type) {
            EntityFormFieldTypeEnum::TEXT => self::TEXT_FIELD,
            EntityFormFieldTypeEnum::NUMBER => self::NUMBER_FIELD,
            EntityFormFieldTypeEnum::BOOLEAN => self::CHECKBOX_FIELD,
            EntityFormFieldTypeEnum::OBJECT => self::OBJECT_FIELD,
            EntityFormFieldTypeEnum::COLLECTION => self::COLLECTION_FIELD,
            EntityFormFieldTypeEnum::SCALAR_COLLECTION => self::SCALAR_COLLECTION_FIELD,
            EntityFormFieldTypeEnum::ENUM_COLLECTION => self::MULTIPLE_DROPDOWN_FIELD,
            EntityFormFieldTypeEnum::ENUM => self::DROPDOWN_FIELD,
            EntityFormFieldTypeEnum::ASYNC_ENUM_COLLECTION => self::ASYNC_MULTIPLE_DROPDOWN_FIELD,
            EntityFormFieldTypeEnum::ASYNC_ENUM => self::ASYNC_DROPDOWN_FIELD,
            EntityFormFieldTypeEnum::DATETIME => self::DATETIME_PICKER_FIELD,
            EntityFormFieldTypeEnum::FILE => self::FILE_DROPZONE_FIELD,
            EntityFormFieldTypeEnum::HIDDEN => self::HIDDEN_FIELD,
            EntityFormFieldTypeEnum::BUTTON => self::BUTTON_FIELD,
        };
    }
}
