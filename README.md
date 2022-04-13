# play.poc.prx.org
PRX audio embed player and landing pages.

## Getting Started

Make sure you have **node**, **NPM**, and **yarn** installed and/or updated.

- `node` - 12.22.0 or later - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- `yarn` - Wrapper CLI for **npm** that streamlines package retrieval and management.

### Install Node and NPM using NVM

It is recommended to install and update using _Node Version Manager_ (**nvm**). Follow [Installation and Update](https://github.com/nvm-sh/nvm/blob/master/README.md#installation-and-update) instructions to get started.

Once **nvm** has been installed, use it to install the latest LTS release of **node** and **npm** by running the following command in your terminal:

```bash
nvm install --lts
```

### Install Yarn

To install **yarn**, follow their [Installation](https://yarnpkg.com/lang/en/docs/install/#mac-stable) instructions for your OS. Install the _Stable_ version.

## Setup Development Environment

Now we are ready to clone this repo and get its packages installed and initialized. The following will create a `PRX` directory in your home directory and clone the repo into `~/PRX/play.poc.prx.org`:

```bash
cd ~
mkdir PRX
cd PRX
git clone git@github.com:PRX/play.poc.prx.org.git
cd play.poc.prx.org
```

Now we need to make sure we are using the the version of _node_ need for the app:

```
nvm use
```

Now lets install all the packages required by the app:

```
yarn
```

Finally, lets spin up the development server:

```
yarn dev
```

Then open the app in your browser at [localhost:3000]().

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
