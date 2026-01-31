<p align="center">
  <a href="https://www.acmekit.com">
    <img alt="AcmeKit" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  @acmekit/event-bus-local
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

Local Event Bus module for AcmeKit. When installed, the events system of AcmeKit is powered by the Node EventEmitter. This module installed by default in new (> v1.8.0) AcmeKit projects.

The Node EventEmitter is limited to a single process environment. We generally recommend using the `@acmekit/event-bus-redis` module in a production environment.

## Getting started

Install the module:

```bash
yarn add @acmekit/event-bus-local
```

You don't need to add the module to your project configuration as it is the default one. AcmeKit will try to use it, if no other event buses are installed.

```js
module.exports = {
  // ...
  modules: [ ... ],
  // ...
}
```

## Configuration

The module comes with no configuration options.
