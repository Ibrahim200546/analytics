<?php

declare(strict_types=1);

namespace Dexodus\AdminConstructorBundle\Twig;

use cijic\phpMorphy\Morphy;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class MorphosTwigExtension extends AbstractExtension
{
    public function getFilters()
    {
        return [
            new TwigFilter('morphy', [$this, 'morphy']),
        ];
    }

    public function morphy(?string $text, array $gramInfo)
    {
        $text = $text ?? 'Неизвестно';

        $morphy = new Morphy('ru');
        $words = $morphy->castFormByGramInfo(mb_strtoupper($text), null, $gramInfo, true);

        return mb_strtolower($words[0]);
    }
}
