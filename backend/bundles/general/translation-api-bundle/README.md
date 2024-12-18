# TranslationApiBundle

[Packagist](https://packagist.org/packages/dexodus/translation-api-bundle)

1. Install bundle
```shell
composer require dexodus/translation-api-bundle:dev-main
```
2. Create migration:
```shell
bin/console doctrine:migrations:diff -n
```
3. Apply migration:
```shell
bin/console doctrine:migrations:migrate -n
```
