# Bondify

> Built for the [Nerdearla Challenge](https://www.topcoder.com/challenges/30103942).

A PWA (progressive web app) that shows the buses arriving to the bus stops near you (only works for Buenos Aires).

## Run

> You need node and yarn to run this project

Bondify is built with Gatsby and Netlify functions.

To run it locally first put your client id and client secrets in a `.env` file in the project root (you can copy `.env.sample`).

Then install the dependencies with:

```bash
$ yarn install
```

And run in dev mode with:

```bash
$ yarn start
```

The site should be live at http://localhost:8888/

## Deploy

The PWA can be deployed to Netlify (you need to log in, it's free):

```bash
$ yarn build
$ yarn deploy
```

You'll need to add the client id and secret to the env variables in the Netlify console.
