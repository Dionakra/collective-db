# Collective DB
Little web app that scrapes from time to time the awesome [Collective Series by Codrops](https://tympanus.net/codrops/collective/) and make their content easily searchable.

For those who don't know what this is, Collective is an initiative brought by the same people from [Codrops](https://tympanus.net/codrops/) where twice a week, they curate a list of the latest news and resources from the web design & web development community.

## Prerequisites
* NodeJS v14.15.2 LTS (at least).

## Installation
You will only need to download the repo code and the required dependencies.
```sh
$ git clone https://github.com/Dionakra/collective-db.git
$ cd collective-db
$ npm install
```

## Development
As almost any JS project out there, you can start developing by starting the web app with the following command, which has all the expected functionalities like Hot Reloading
```sh
$ npm run dev
```

## Build & Deploy
As the web app is hosted on GitHub Pages, all the content needs to live already built within the repo. To do so, please, prior pushing anything to the repo, run a `npm run extract && npm run build` command so everything is updated once pushed into GitHub Pages.
