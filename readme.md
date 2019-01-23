# Music::Backend

The backend to a music player app

## Getting Started

1) To get the latest build, clone this repository.

2) Assuming you have docker installed (if not you should install it), run the following command

```
docker build -t hunterhdolan/music-app-backend .
```

3) Run it by running the following command:

```
docker run -p 3001:3001 \
  -e S3_BUCKET=[BUCKET] \
  -e AWS_ACCESS_KEY_ID=[ID] \
  -e AWS_SECRET_ACCESS_KEY=[SECRET] \
  -e LASTFM_API_KEY=[KEY] \
  -d hunterhdolan/music-app-backend:latest
```

If you need an AWS key head over to Amazon AWS (https://aws.amazon.com/) and sign up.
If you need a lastfm key you can get it at https://last.fm/api.
If you are here because it was your job to review this piece of code, you should already have my keys.

## Data Store Structure

Upon startup, this app scans the S3 bucket that you give it. It expects the following directory format

`/tracks/[ARTIST]/[SONG NAME].mp3`

This is relatively rigid so make sure you follow it. Artist and tracks, can be upper case or lower case, and have spaces or underscores.

## Caching

Upon start, after getting the list of tracks, it then resolves the track information using the LastFM api. Because this can take a while,
we use a caching system.

The lastfm cache is located at `./cache/lastfm_cache.json`

By default docker doesn't ignore this file, and it shouldn't need to get track meta data unless there are tracks that haven't been seen before.

In order to keep the cache in sync, before deployment, you should run the app locally.

## Building from source

Since this app is written in TypeScript it needs to be compiled before node will run it. To do that simply run

```
yarn build
```

## Tests

This application contains unit tests, to run them run

```
yarn test
```
