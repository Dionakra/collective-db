# Collective DB
Little web app that scrapes from time to time the awesome [Collective Series by Codrops](https://tympanus.net/codrops/collective/) and make their content easily searchable.

For those who don't know what this is, Collective is an initiative brought by the same people from [Codrops](https://tympanus.net/codrops/) where twice a week, they curate a list of the latest news and resources from the web design & web development community.


## Task List
* [x] Scrape all the content to a JSON.
* [x] Make the JSON with all the content fully available so whoever wants this information doesn't need to scrape everything again.
* [x] Automatize the extraction with a GitHub action that, every Monday and Thursday (days that Codrops launch a new issue), the content gets scraped and updated.
* [x] Provide some web app that allows any user to search for any content.
* [ ] Provide, for a given keyword, the density of popularity of the given keyword through time, so a "trend system" can be extracted from it.

## Web App
A web app can be found with this repo as well. In the `main` branch you can find the main process, but in the `gh-pages` you will find the source code for the web app.

