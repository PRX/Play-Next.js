# Play Next.js Application

PRX embed audio player and landing pages.

## Getting Started

Make sure you have **node**, **NPM**, and **yarn** installed and/or updated.

- `node` - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- `yarn` - Wrapper CLI for **npm** that streamlines package retrieval and management.

### Install Node and NPM using `asdf`

It is recommended to install and update using _asdf_ (**nvm**). Follow [Installation and Update](https://github.com/PRX/internal/wiki/Guide:-Local-Development-Environment#install-asdf) instructions to get started.

Once asdf has been installed and added to your path, install the Node.js plugin:

```bash
asdf plugin add nodejs
```

## Setup Development Environment

Now we are ready to clone this repo and get its packages installed and initialized. The following will create a `PRX` directory in your home directory and clone the repo into `~/PRX/Play-Next.js`:

```bash
# Change directory to your home directory.
cd ~

# Create a PRX directory.
mkdir PRX

# Change directory to the PRX directory.
cd PRX

# Clone the git repo for this project.
git clone git@github.com:PRX/Play-Next.js.git

# Change to directory created by the git clone.
cd Play-Next.js
```

Now we need to make sure we are using the the version of _node_ need for the app:

```bash
asdf install
```

Next, install Yarn globally:

```bash
npm install --location=global yarn
```

Use Yarn to install all the packages required by the app:

```bash
yarn
```

Finally, lets spin up the development server:

```bash
yarn dev
```

View the app at [localhost:4300](https://localhost:4300). This development version of the app will update automatically as you make changes.

## Developing Along With Other PRX Applications

Though not always the case, sometimes some features will need to be developed to interact with other PRX applications. This is much easier when the locally running app servers have consistent domains. Set up [puma-dev](https://github.com/PRX/internal/wiki/Guide:-Local-Development-Environment#install-puma-dev), then add the `play.prx` domain using port `4300`:

```bash
echo 4300 > ~/.puma-dev/play.prx
```

The app should now be available at [play.prx.test](http://play.prx.test).

> Our other applications should include instructions on setting up their `.test` domains using puma-dev.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Typescript and IDE

Yes, We are using typescript. This will require some extra steps to provide explicit types or interfaces for class components, and function parameters and return values. Types and interfaces specific to a component can be exported from the component file. Types and interfaces used by more than one component should be defined in `./interfaces` and organized into its own module directory. Module directories should include a `index.ts` that exports the exported entities from that modules interface files. An export should also be added to `./index.ts` for the module.

It is highly recommended to use an IDE that either supports typescript or has a plugin for typescript. This project provides [Visual Studio Code](https://code.visualstudio.com/) settings presets for linting and formatting javascript and typescript.

### Importing Module Exports

When importing module exports, do not use relative import paths for exports not local to the importing module. For example, when importing a function from `./lib` in your component in `./components/MyComponent`, use `import myFunction from '@lib/myFunction';` instead of `import myFunction from '../../lib/myFunction';`

#### Available Aliases

- `@components` -> `./components`
- `@contexts` -> `./contexts`
- `@interfaces` -> `./interfaces`
- `@lib` -> `./lib`
- `@svg` -> `./assets/svg`
- `@states` -> `./states`
- `@styles` -> `./styles`

## Contributing

The process around contributing to this codebase and the workflow by which code changes are proposed and accepted into this project are documented [here](./.github/CONTRIBUTING.md).
