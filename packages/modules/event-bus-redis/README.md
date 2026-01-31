<p align="center">
  <a href="https://www.acmekit.com">
    <img alt="AcmeKit" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  @acmekit/event-bus-redis
</h1>

<h4 align="center">
  <a href="https://docs.acmekit.com">Documentation</a> |
  <a href="https://www.acmekit.com">Website</a>
</h4>

<p align="center">
An open source composable commerce engine built for developers.
</p>
<p align="center">
  <a href="https://github.com/acmekit/acmekit/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="AcmeKit is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/acmekit/acmekit">
    <img src="https://circleci.com/gh/acmekit/acmekit.svg?style=shield" alt="Current CircleCI build status." />
  </a>
  <a href="https://github.com/acmekit/acmekit/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/acmekit"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=acmekit">
    <img src="https://img.shields.io/twitter/follow/acmekit.svg?label=Follow%20@acmekit" alt="Follow @acmekit" />
  </a>
</p>

## Overview

Redis Event Bus module for AcmeKit. When installed, the events system of AcmeKit is powered by BullMQ and `io-redis`. BullMQ is responsible for the message queue and worker. `io-redis` is the underlying Redis client, that BullMQ connects to for events storage.

## Getting started

Install the module:

```bash
yarn add @acmekit/event-bus-redis
```

Add the module to your `acmekit-config.js`:

```js
module.exports = {
  // ...
  modules: [
    {
      resolve: "@acmekit/event-bus-redis",
      options: {
        redisUrl: "redis:..",
      },
    },
  ],
  // ...
}
```

## Configuration

The module can be configured with the following options:

| Option         | Type      | Description                                                                                                              | Default         |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ | --------------- |
| `redisUrl`     | `string`  | URL of the Redis instance to connect to.                                                                                 | `events-worker` |
| `queueName`    | `string?` | Name of the BullMQ queue.                                                                                                | `events-queue`  |
| `queueOptions` | `object?` | Options for the BullMQ queue. See BullMQ's [documentation](https://api.docs.bullmq.io/interfaces/QueueOptions.html).     | `{}`            |
| `redisOptions` | `object?` | Options for the Redis instance. See `io-redis`'s [documentation](https://luin.github.io/ioredis/index.html#RedisOptions) | `{}`            |

**Info**: See how the options are applied in the [RedisEventBusService](https://github.com/acmekit/acmekit/blob/0c1d1d590463fa30b083c4312293348bdf6596be/packages/event-bus-redis/src/services/event-bus-redis.ts#L52) and [loader](https://github.com/acmekit/acmekit/blob/0c1d1d590463fa30b083c4312293348bdf6596be/packages/event-bus-redis/src/loaders/index.ts).

If you do not provide a `redisUrl` in the module options, the server will fail to start.
