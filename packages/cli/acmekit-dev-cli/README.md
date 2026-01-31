# acmekit-dev-cli

A command-line tool for local AcmeKit development. When doing development work on
AcmeKit core, this tool allows you to copy the changes to the various
AcmeKit packages to AcmeKit projects.

## Install

`npm install -g acmekit-dev-cli`

## Configuration / First time setup

The acmekit-dev-cli tool needs to know where your cloned AcmeKit repository is
located. You typically only need to configure this once.

`acmekit-dev --set-path-to-repo /path/to/my/cloned/version/acmekit`

## How to use

Navigate to the project you want to link to your forked AcmeKit repository and
run:

`acmekit-dev`

The tool will then scan your project's package.json to find its AcmeKit
dependencies and copy the latest source from your cloned version of AcmeKit into
your project's node_modules folder. A watch task is then created to re-copy any
modules that might change while you're working on the code, so you can leave
this program running.

Typically you'll also want to run `npm run watch` in the AcmeKit repo to set up
watchers to build AcmeKit source code.

## Revert to current packages

If you've recently run `acmekit-dev` your `node_modules` will be out of sync with current published packages. In order to undo this, you can remove the `node_modules` directory or run:

```shell
git checkout package.json; yarn --force
```

or

```shell
git checkout package.json; npm install --force
```

### Other commands

#### `--packages`

You can prevent the automatic dependencies scan and instead specify a list of
packages you want to link by using the `--packages` option:

`acmekit-dev --packages @acmekit/acmekit`

#### `--scan-once`

With this flag, the tool will do an initial scan and copy and then quit. This is
useful for setting up automated testing/builds of AcmeKit projects from the latest
code.

#### `--quiet`

Don't output anything except for a success message when used together with
`--scan-once`.

#### `--copy-all`

Copy all modules/files in the acmekit source repo in packages/

#### `--force-install`

Disables copying files into node_modules and forces usage of local npm repository.
