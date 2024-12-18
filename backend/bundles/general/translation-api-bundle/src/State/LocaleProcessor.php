<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use Dexodus\TranslationApiBundle\Entity\Locale;
use Dexodus\TranslationApiBundle\Entity\Translation;
use Dexodus\TranslationApiBundle\Enum\TranslationCreationTypeEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class LocaleProcessor implements ProcessorInterface
{
    private PersistProcessor $persistProcessor;
    private Security $security;

    public function __construct(
        #[Autowire(service: PersistProcessor::class)] PersistProcessor $persistProcessor,
        #[Autowire(service: Security::class)] Security $security,
    ) {
        $this->persistProcessor = $persistProcessor;
        $this->security = $security;
    }

    /** @param Locale $data */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($operation instanceof Post) {
            $data->translation = new Translation();
            $data->translation->key = $data->locale;
            $data->translation->creator = $this->security->getUser();
            $data->translation->creationType = TranslationCreationTypeEnum::MANUAL;

            $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }
    }
}
