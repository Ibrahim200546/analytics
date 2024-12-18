# UserSessionHistoryBundle

[Packagist](https://packagist.org/packages/dexodus/user-session-history-bundle)

1. Install bundle
```shell
composer require dexodus/user-session-history-bundle:^1.0.0
```
2. Configure **config/packages/user_session_history.yaml**
```yaml
user_session_history:
    userEntity: 'App\Entity\User'
```
3. Create migration:
```shell
bin/console doctrine:migrations:diff -n
```
4. Apply migration:
```shell
bin/console doctrine:migrations:migrate -n
```
