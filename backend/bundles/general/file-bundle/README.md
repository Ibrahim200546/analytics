# FileBundle

[Packagist](https://packagist.org/packages/dexodus/file-bundle)

1. Install bundle
```shell
composer require dexodus/file:1.0.0
```
2. Create migration:
```shell
bin/console doctrine:migrations:diff -n
```
3. Apply migration:
```shell
bin/console doctrine:migrations:migrate -n
```
