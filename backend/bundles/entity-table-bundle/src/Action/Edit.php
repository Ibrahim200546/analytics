<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Action;

use App\Entity\User;
use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\TitleBundle\Attribute\Title;

#[Title('Редактировать')]
readonly class Edit implements ActionInterface
{
    private ?User $user;

    public function __construct(
        private ActionStyleEnum $style = ActionStyleEnum::Violet,
        private string $idColumn = 'id',
        private string $editPath = 'create',
        private string $visibleStatement = 'true',
    ) {
    }

    public function configure(array $config): void
    {
        $this->user = $config['user'];
    }

    public function onClick(): string
    {
        return "routerPush('$this->editPath?id=' + entity.$this->idColumn + '&idColumn=$this->idColumn')";
    }

    public function getStyle(): ActionStyleEnum
    {
        return $this->style;
    }

    public function isVisible(): string
    {
        return $this->insertParams($this->visibleStatement);
    }

    private function insertParams(string $statement): string
    {
        $params = [
            'userId' => $this->user?->getId() ?? '',
            'userRoles' => json_encode($this->user?->getRoles()),
        ];

        foreach ($params as $paramName => $paramValue) {
            $statement = str_replace('{' . $paramName . '}', (string) $paramValue, $statement);
        }

        return $statement;
    }
}
