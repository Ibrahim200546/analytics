<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Serializer\Normalizer;

use ApiPlatform\Metadata\ResourceClassResolverInterface;
use ApiPlatform\Metadata\IriConverterInterface;
use ApiPlatform\Metadata\Property\Factory\PropertyMetadataFactoryInterface;
use ApiPlatform\Metadata\Property\Factory\PropertyNameCollectionFactoryInterface;
use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use ApiPlatform\Serializer\ItemNormalizer;
use ApiPlatform\JsonLd\Serializer\ItemNormalizer as ItemNormalizerJsonld;
use ApiPlatform\Symfony\Security\ResourceAccessCheckerInterface;
use Dexodus\FileBundle\Entity\File;
use Dexodus\FileBundle\Service\FileReader;
use ArrayObject;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactoryInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

class FileNormalizer extends ItemNormalizer
{
    private FileReader $fileReader;

    public function __construct(
        #[Autowire(service: 'api_platform.jsonld.normalizer.item')]
        private ItemNormalizerJsonld $itemNormalizer,
        PropertyNameCollectionFactoryInterface $propertyNameCollectionFactory,
        PropertyMetadataFactoryInterface $propertyMetadataFactory,
        IriConverterInterface $iriConverter,
        ResourceClassResolverInterface $resourceClassResolver,
        FileReader $fileReader,
        PropertyAccessorInterface $propertyAccessor = null,
        NameConverterInterface $nameConverter = null,
        ClassMetadataFactoryInterface $classMetadataFactory = null,
        LoggerInterface $logger = null,
        ResourceMetadataCollectionFactoryInterface $resourceMetadataFactory = null,
        ResourceAccessCheckerInterface $resourceAccessChecker = null,
        array $defaultContext = []
    ) {
        $this->fileReader = $fileReader;

        parent::__construct($propertyNameCollectionFactory, $propertyMetadataFactory, $iriConverter, $resourceClassResolver, $propertyAccessor, $nameConverter, $classMetadataFactory, $logger, $resourceMetadataFactory, $resourceAccessChecker, $defaultContext);
    }

    /** @param File $object */
    public function normalize(mixed $object, string $format = null, array $context = []): float|array|ArrayObject|bool|int|string|null
    {
        $data = $this->itemNormalizer->normalize($object, $format, $context);

        // Добавление временного URL
        if ($object instanceof File) {
            $temporaryUrl = $this->fileReader->getTemporaryUrl($object);
            if ($temporaryUrl) {
                $data['temporaryUrl'] = $temporaryUrl;
            }
        }

        return $data;
    }

    public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
    {
        return $data instanceof File;
    }
}
