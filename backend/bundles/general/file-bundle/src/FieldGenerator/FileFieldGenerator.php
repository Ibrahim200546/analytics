<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\EntityFormBundle\Service\FieldGenerator\FieldGeneratorInterface;
use Dexodus\FileBundle\Entity\File;
use Symfony\Component\PropertyInfo\Type;
use Symfony\Component\Routing\RouterInterface;

#[Priority(1)]
class FileFieldGenerator implements FieldGeneratorInterface
{
    public function __construct(
        private readonly RouterInterface $router,
    ) {
    }

    public function isSupport(?EntityFormFieldAttribute $propertyAttribute, Type $type): bool
    {
        return $type->getClassName() === File::class;
    }

    public function generate(
        EntityFormField $field,
        ?EntityFormFieldAttribute $entityFormField,
        Type $type,
        string $propertyPath,
        array $groups,
    ): EntityFormField {
        $field->type = EntityFormFieldTypeEnum::FILE;
        $field->component = EntityFormFieldComponentEnum::FILE_DROPZONE_FIELD;

        $field->componentArguments = [
            'uploadUrl' => $this->router->generate('app.upload_file.upload_file'),
        ];

        return $field;
    }
}
