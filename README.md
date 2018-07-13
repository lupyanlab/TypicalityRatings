## Running Locally

You must have nodjs installed: https://nodejs.org. Make sure Python 2 is installed.

```
git clone https://github.com/lupyanlab/TypicalityRatings
cd TypicalityRatings
npm install
npm start
```

When making changes, the html and javascript is in the `dev/` directory. To make sure the `prod/` (production) directory is
updated while editing the `dev/` directory, run the watch command.

```
npm run watch
```

If you just need to build `prod/` , then use this command:

```
npm run prod
```

Then, go to http://localhost:7071
