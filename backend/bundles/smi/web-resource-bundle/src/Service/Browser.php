<?php

declare(strict_types=1);

namespace Dexodus\WebResourceBundle\Service;

use V8Js;
use Throwable;
use Psr\Log\LoggerInterface;

class Browser
{
    private V8Js $v8Js;
    private string $baseModulePath;
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger, string $baseModulePath = '')
    {
        $this->logger = $logger;
        $this->baseModulePath = $baseModulePath ?: __DIR__ . '/../Resources/js';

        try {
            $this->v8Js = new V8Js();
            $this->v8Js->changeDataInContext = $this->changeDataInContext(...);
            $this->v8Js->setModuleLoader($this->moduleLoad(...));
            $this->v8Js->setModuleNormaliser($this->moduleNormalize(...));
        } catch (Throwable $e) {
            $this->logger->error("Failed to initialize V8Js: {$e->getMessage()}", ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function exec(string $url): void
    {
        $this->v8Js->url = $url;

        try {
            $this->v8Js->executeString(<<<'JS'
const puppeteer = require("bundle");
(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        await page.goto('https://tengrinews.kz/kazakhstan_news/pogibli-uchitelya-stali-izvestnyi-podrobnosti-strashnoy-557162/', { waitUntil: 'networkidle0' });
    
        const content = await page.content();
    
        PHP.changeDataInContext(content);
    
        await browser.close();
    } catch (error) {
        PHP.changeDataInContext(JSON.stringify(error));
    }
})();       
            
            
JS
);
        } catch (Throwable $e) {
            $this->logger->error("Failed to execute JavaScript: {$e->getMessage()}", ['error' => $e->getMessage()]);
        }
    }

    private function moduleNormalize(string $base, string $moduleName): array
    {
        if (empty($base)) {
            $base = $this->baseModulePath;
        }

        $filepath = realpath($base . '/' . $moduleName . '.js');

        if ($filepath === false) {
            $this->logger->error("Module not found", ['moduleName' => $moduleName, 'basePath' => $base]);
            throw new \RuntimeException("Module $moduleName not found in $base");
        }

        $path = str_replace('./', '', $filepath);
        $parts = explode('/', $path);

        return [
            implode('/', array_slice($parts, 0, -1)),
            $parts[count($parts) - 1],
        ];
    }

    private function moduleLoad(string $path): string
    {
        if (!file_exists($path)) {
            $this->logger->error("File not found", ['path' => $path]);
            throw new \RuntimeException("File $path not found");
        }

        return file_get_contents($path);
    }

    private function changeDataInContext($data): void
    {
        // Вы можете расширить этот метод, например, передавая данные в другой сервис.
        $this->logger->info('Received data from Puppeteer', ['data' => $data]);
        var_dump($data);
    }

    public function logError(string $message): void
    {
        $this->logger->error($message);
    }
}
