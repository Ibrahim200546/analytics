<?php

declare(strict_types=1);

namespace Dexodus\EntityFormBundle\Service\FieldGenerator;

use Dexodus\EntityFormBundle\Attribute\EntityFormField as EntityFormFieldAttribute;
use Dexodus\EntityFormBundle\Attribute\Priority;
use Dexodus\EntityFormBundle\Dto\EntityFormField;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldComponentEnum;
use Dexodus\EntityFormBundle\Enum\EntityFormFieldTypeEnum;
use Dexodus\FileBundle\Entity\File;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PropertyInfo\Type;
use Symfony\Component\Routing\RouterInterface;

#[Priority(1)]
class FileFieldGenerator implements FieldGeneratorInterface
{
    public function __construct(
        private readonly RouterInterface $router,
        #[Autowire('%env(BACKEND_URL)%')]
        private readonly string $backendUrl,
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
            'uploadUrl' => $this->backendUrl . $this->router->generate('app.upload_file.upload_file'),
        ];

        return $field;
    }
}
