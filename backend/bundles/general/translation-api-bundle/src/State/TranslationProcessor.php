<?php

declare(strict_types=1);

namespace Dexodus\TranslationApiBundle\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use Dexodus\TranslationApiBundle\Entity\Translation;
use Dexodus\TranslationApiBundle\Enum\TranslationCreationTypeEnum;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class TranslationProcessor implements ProcessorInterface
{
    private PersistProcessor $persistProcessor;
    private Security $security;

    public function __construct(
        #[Autowire(service: PersistProcessor::class)] PersistProcessor $persistProcessor,
        #[Autowire(service: Security::class)] Security $security,
    )
    {
        $this->persistProcessor = $persistProcessor;
        $this->security = $security;
    }

    /** @param Translation $data */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($operation instanceof Post) {
            $data->creationType = TranslationCreationTypeEnum::MANUAL;
            $data->creator = $this->security->getUser();
            $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }
    }
}
