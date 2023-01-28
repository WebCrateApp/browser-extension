# How to build the extension

## Versions used

Versions used to build:

OS:
- ProductName:    macOS
- ProductVersion: 12.2.1
- BuildVersion:   21D62
- Kernel Version: Darwin 21.3.0 arm64

Environment:
- Node: v14.18.2
- NPM: 8.4.1

## Building

Install exact dependencies using `package-lock.json` file:

```
npm ci
```

Build extension:

```
npm run build
```

This will build the extension to the `dist` directory and create a final ZIP file in the `dist-zip` directory.