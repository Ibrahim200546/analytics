# DqlFunctionsBundle

1. Install bundle
```shell
composer require dexodus/dql-functions-bundle:1.0.0
```

### Functions Registration
```yaml
# config/packages/doctrine.yaml
doctrine:
    orm:
        dql:
          string_functions:
            JSON_CONTAINS: Dexodus\DqlFunctionsBundle\Dql\JsonContains
            JSON_TO_TEXT: Dexodus\DqlFunctionsBundle\Dql\JsonText
            TO_INT: Dexodus\DqlFunctionsBundle\Dql\CastToInt
            GENDER_FROM_IIN: Dexodus\DqlFunctionsBundle\Dql\GenderFromIin
            YEAR: Dexodus\DqlFunctionsBundle\Dql\Year
            MONTH: Dexodus\DqlFunctionsBundle\Dql\Month
            DAY: Dexodus\DqlFunctionsBundle\Dql\Day
```
