<?php

declare(strict_types=1);

namespace Dexodus\TelegramParserBundle\Controller;

use danog\MadelineProto\TL\Types\LoginQrCode;
use Dexodus\TelegramParserBundle\Service\TelegramClient;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

readonly class QrCodeController
{
    public function __construct(
        private TelegramClient $telegramClient,
    ) {
    }

    #[Route('/telegram/accounts/qr-code/{name}/{apiId}/{apiHash}/get')]
    public function getQrCode(Request $request, string $name, int $apiId, string $apiHash): Response
    {
        $loginQrCode = $this->telegramClient->startSession($name, $apiId, $apiHash);

        if ($loginQrCode instanceof LoginQrCode) {
            return new JsonResponse([
                'qrCodeSvg' => $loginQrCode->getQRSvg(
                    $request->query->get('size', 400),
                    $request->query->get('margin', 4),
                ),
            ]);
        }

        throw new Exception();
    }

    #[Route('/telegram/accounts/qr-code/{name}/{apiId}/{apiHash}/is-scanned')]
    public function isScanned(string $name, int $apiId, string $apiHash): Response
    {
        $loginQrCode = $this->telegramClient->startSession($name, $apiId, $apiHash);

        if ($loginQrCode instanceof LoginQrCode) {
            try {
                $isScanned = $loginQrCode->waitForLoginOrQrCodeExpiration() === null;
            } catch (Throwable) {
                return new JsonResponse(false);
            }

            return new JsonResponse($isScanned);
        }

        throw new Exception();
    }
}
