# Suntimes
Simple Fitbit Sense/Versa 3 watch face

# Fitbit Gallery
The released and reviewe version is available from Fitbit Gallery
https://gallery.fitbit.com/details/1cbec137-741f-4fd5-ad86-c3dd1e7672f0

# Install
You need Fitbit Developer account and the CLI SDK.

Fitbit SDK guide and documentation:
https://dev.fitbit.com/getting-started/

CLI:
https://dev.fitbit.com/build/guides/command-line-interface/

```
npm install
npx fitbit
bi
```

Fitbit SDK requires NodeJS 8+ but I have tested only the version 12. The SDK cannot
be easily installed with the version 15. At least, for Windows without Windows build tools.

## App UUID
Remember to create your own app uuid and set it into the package.json.
Run the command
```
npx fitbit-build generate-appid
```
and then check your package.json file which should have the new appUUID set:
```
  "fitbit": {
    "appUUID": "Your new app id goes here",
```

## Here API key
The watch face uses HERE geocoding API to get the location coordinates when the location
is given as a name. You need to make your own account and get an apikey from HERE. Create
a file `companion/apikey.ts` with the content:
```
export const apikey = "Your apikey here";
```
HERE documentation: https://developer.here.com/products/geocoding-and-search

