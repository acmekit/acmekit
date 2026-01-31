# AcmeKit Cache Redis

Use Redis as a AcmeKit cache store.

## Installation

```
yarn add @acmekit/cache-redis
```

## Options

```
   {
      ttl?: number                // Time to keep data in cache (in seconds)

      redisUrl?: string           // Redis instance connection string

      redisOptions?: RedisOptions // Redis client options

      namespace?: string          // Prefix for event keys (the default is `acmekit:`)
  }
```

### Other caching modules

- [AcmeKit Cache In-Memory](../cache-inmemory/README.md)
