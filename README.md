# Work In Progress
Simple Fitbit Sense/Versa 3 watch face

# Install
You need Fitbit CLI:
https://dev.fitbit.com/build/guides/command-line-interface/

```
npm install
npx fitbit
bi
```

Fitbit SDK requires NodeJS 8+ but I have tested only the version 12. The SDK cannot
be easily installed with the version 15. At least, for Windows without Windows build tools.

## App UUID
Remember to create your own app uuid and set it to package.json.
```
npx uuid
```


# Not yet suitable for general use
This watch face will drain your battery pretty quickly
 