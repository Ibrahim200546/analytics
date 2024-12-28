<?php

declare(strict_types=1);

namespace Dexodus\FileBundle\Controller;

use Dexodus\FileBundle\Entity\File;
use Dexodus\FileBundle\Exception\NotFoundEntityException;
use Dexodus\FileBundle\Repository\FileRepository;
use Dexodus\FileBundle\Service\FileReader;
use Dexodus\FileBundle\Service\FileSigner;
use Dexodus\FileBundle\Service\UploadFileService;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class FileController extends AbstractController
{
    public function __construct(
        private SerializerInterface $serializer,
        private FileRepository $fileRepository,
        private FileSigner $fileSigner,
        private FileReader $fileReader,
    ) {
    }

    #[Route('/files/upload', name: 'app.upload_file.upload_file')]
    public function uploadFile(Request $request, UploadFileService $service): Response
    {
        $file = $service->uploadFile($request->files->get('file'));
        $responseBody = $this->serializer->serialize($file, 'json');

        return new Response($responseBody, 200, ['content-type' => 'application/json']);
    }

    #[Route('/files/multiple-upload', name: 'app.upload_file.upload_multiple_files')]
    public function uploadMultipleFile(Request $request, UploadFileService $service): Response
    {
        $files = $request->files->all();
        $response = [];
        foreach ($files as $key => $file) {
            $file = $service->uploadFile($file);
            $response[$key] = $file;
        }

        $responseBody = $this->serializer->serialize($response, 'json');

        return new Response($responseBody, 200, ['content-type' => 'application/json']);
    }

    #[Route('/files/{id}/base64', name: 'app.file.base64', methods: ['GET'])]
    public function base64(int $id): Response
    {
        $file = $this->fileRepository->find($id);

        if (is_null($file)) {
            throw new NotFoundEntityException(File::class, $id);
        }

        return new JsonResponse(['base64' => $this->fileReader->getBase64($file)]);
    }

    #[Route('/files/{id}/sign', name: 'app.file.sign', methods: ['POST'])]
    public function signFile(Request $request, int $id): Response
    {
        $file = $this->fileRepository->find($id);

        if (!$file instanceof File) {
            throw new NotFoundEntityException(File::class, $id);
        }

        $this->fileSigner->sign($file, $request->getContent());

        return new Response();
    }

    #[Route('/files/{id}/get-temporary-url', name: 'app.file.get_temporary_url')]
    public function getTemporaryUrl(int $id): Response
    {
        $file = $this->fileRepository->find($id);

        if (!$file instanceof File) {
            throw new NotFoundEntityException(File::class, $id);
        }

        return new JsonResponse($this->fileReader->getTemporaryUrl($file));
    }

    #[Route('/files/{id}/download')]
    public function downloadFile(#[MapEntity] File $file): Response
    {
        $filepath = $this->fileReader->saveFileTemporaryOnMachine($file);

        return new BinaryFileResponse($filepath);
    }
}
