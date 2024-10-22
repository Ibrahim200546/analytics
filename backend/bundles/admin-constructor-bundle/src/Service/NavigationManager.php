<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Service;

use App\Enum\Entity\UserRoleEnum;
use Dexodus\AdminConstructorBundle\Attribute\Icon;
use Dexodus\AdminConstructorBundle\Attribute\IsGranted;
use Dexodus\AdminConstructorBundle\Dto\DummyNavigation;
use Dexodus\AdminConstructorBundle\Dto\NavigationInterface;
use Dexodus\AdminConstructorBundle\Dto\PageInterface;
use Dexodus\AdminConstructorBundle\Dto\RootNavigationInterface;
use Dexodus\AdminConstructorBundle\PageProcessor\PageProcessorInterface;
use Dexodus\TitleBundle\Attribute\Title;
use Dexodus\TranslationApiBundle\Service\TranslateService;
use Dexodus\TranslationApiBundle\Service\TranslationCompleter;
use Exception;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Bundle\SecurityBundle\Security;
use Twig\Environment;

class NavigationManager
{
    protected NavigationInterface $navigation;
    /** @var array<string, PageProcessorInterface> */
    protected array $pageProcessors;

    public function __construct(
        private TranslationCompleter $translationCompleter,
        private TranslateService $translateService,
        private Environment $twig,
        private Security $security,
    ) {
    }

    public function setNavigation(string $navigation): void
    {
        $this->navigation = unserialize($navigation);
    }

    public function setPageProcessors(array $pageProcessors): void
    {
        $this->pageProcessors = $pageProcessors;
    }

    public function getNavigation(): array
    {
        return $this->processNavigation($this->navigation, 'navigation');
    }

    protected function processNavigation(NavigationInterface $navigation, string $context): array
    {
        $user = $this->security->getUser();
        $navigationReflection = new ReflectionClass($navigation);
        $dummyNavigation = ['_icons' => []];

        if ($navigation instanceof RootNavigationInterface) {
            $redirect = $navigation->getRedirectAfterLogin($user);
            $dummyNavigation['rootRedirect'] = $redirect;
        }

        foreach ($navigationReflection->getProperties() as $property) {
            $propertyValue = $property->getValue($navigation);
            $classImplements = class_exists($propertyValue::class) ? class_implements($propertyValue) : [];
            $translationKey = "$context.{$property->getName()}";

            /** @var IsGranted|null $isGrantedAttribute */
            $isGrantedAttribute = $this->getAttribute($property, IsGranted::class);

            if (!is_null($isGrantedAttribute) && (is_null($user) || empty(array_intersect($user->getRoles(), array_map(fn (UserRoleEnum $role) => $role->value, $isGrantedAttribute->roles))))) {
                continue;
            }

            /** @var Title|null $titleAttribute */
            $titleAttribute = $this->getAttribute($property, Title::class);

            $iconAttribute = $this->getAttribute($property, Icon::class);

            if ($iconAttribute instanceof Icon) {
                $dummyNavigation['_icons'][$property->name] = $iconAttribute->name;
            }

            if ($titleAttribute instanceof Title) {
                $titleText = $this->twig->render('@AdminConstructor/string_render.txt.twig', [
                    'string' => $titleAttribute->value,
                    'parentKey' => $context,
                    'parentTitle' => $this->translateService->translate($context, 'ru'),
                ]);
                $this->translationCompleter->complete('ru', [$translationKey => str_replace(PHP_EOL, '', $titleText)]);
            }

            if (in_array(NavigationInterface::class, $classImplements)) {
                $propertyValue = $this->processNavigation($propertyValue, $translationKey);
            }

            if (in_array(PageInterface::class, $classImplements)) {
                if (!is_array($propertyValue) && array_key_exists($propertyValue::class, $this->pageProcessors)) {
                    $propertyValue = $this->pageProcessors[$propertyValue::class]->processPage($propertyValue);
                }
            }

            $dummyNavigation[$property->getName()] = $propertyValue;
        }

        return $dummyNavigation;
    }

    private function getAttribute(ReflectionProperty $property, string $attributeClass): mixed
    {
        $attributes = $property->getAttributes($attributeClass);

        if (count($attributes) > 1) {
            throw new Exception(
                "In property '{$property->class}::{$property->getName()}'} founded more than one attributes, that implement '$attributeClass'",
            );
        }

        if (empty($attributes)) {
            return null;
        }

        return $attributes[0]->newInstance();
    }
}
