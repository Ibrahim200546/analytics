<?php

declare(strict_types=1);

namespace Dexodus\EntityTableBundle\Action;

use App\Entity\User;
use Dexodus\EntityTableBundle\Enum\ActionStyleEnum;
use Dexodus\TitleBundle\Service\WithTitleInterface;

class BackendAction implements ActionInterface, WithTitleInterface
{
    private int $actionId;
    private string $name;
    private ?User $user;

    public function __construct(
        private string $title,
        public ?string $serviceId,
        private string $visibleStatement = 'true',
        private ActionStyleEnum $style = ActionStyleEnum::Default,
        private ?string $confirmMessage = null,
    ) {
    }

    public function configure(array $config): void
    {
        $this->actionId = $config['actionId'];
        $this->name = $config['name'];
        $this->user = $config['user'];
    }

    public function onClick(): string
    {
        if (is_null($this->serviceId)) {
            return '';
        }

        $path = "/entity-table/backend-action/{$this->name}/{$this->actionId}/";

        if (is_null($this->confirmMessage)) {
            return "fetchJson(apiUrl + '$path' + entity.id)";
        }

        return <<<JSEL
result = '';

if (confirm('$this->confirmMessage')) {
    result = fetchJson(apiUrl + '$path' + entity.id);
}

result;
JSEL;
    }

    public function getStyle(): ActionStyleEnum
    {
        return $this->style;
    }

    public function getTitle(): string
    {
        return $this->title;
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
