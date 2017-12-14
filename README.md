# Alexa skeleton

Start dev
```
HOST=localhost PORT=3000 npm run dev
```

Expose dev environment with ngrok
```
HOST=localhost PORT=3000 npm run dev:expose
```

Run tests
```
NODE_ENV=test npm test
```

Build the application for production
```
docker run -v "$(pwd)":/var/task lambci/lambda:build-nodejs6.10 npm i && npm run prod:build
```
