<?php

// Suppress MadelineProto "WARNING: ... slower on windows" noise from response body
ob_start(function (string $buffer): string {
    // Strip lines that start with "WARNING:" (MadelineProto Windows warning)
    return preg_replace('/^WARNING:[^\r\n]*\r?\n?/m', '', $buffer);
});

if (!class_exists('V8Js')) {
    class V8Js {
        public $url;
        public $changeDataInContext;
        public function setModuleLoader($callback) {}
        public function setModuleNormaliser($callback) {}
        public function executeString($js) {}
    }
}

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
