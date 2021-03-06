![https://www.serverless.com](https://s3.amazonaws.com/assets.github.serverless/readme-serverless-mono-2.png)

# mono

&nbsp;

Easily host web frameworks and applications on a single AWS Lambda function using this [Serverless Component](https://www.github.com/serverless/components).

### Features

* Designed to make it easy to host pre-existing web frameworks (e.g. Express.js, Hapi) or any large web application on a single AWS Lambda Function.
* Blazing Fast Uploads via AWS S3 Accelerated Transfer and Multi-Part.
* Dependencies are automatically put in AWS Lambda Layers, reducing cold-start time and further reducing upload time.
* Simple shim for receiving and responding to HTTP requests.

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)

&nbsp;


### 1. Install

```console
$ npm install -g @serverless/components
```

### 2. Create

```console
$ mkdir mono && cd mono
```

The directory should look something like this:


```
|- serverless.yml # required
|- index.js       # required
|- package.json   # optional
|- .env           # your development AWS api keys
|- .env.prod      # your production AWS api keys
```

the `.env` files are not required if you have the aws keys set globally and you want to use a single stage, but they should look like this.

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

The `index.js` file should look something like this.

```js
module.exports = async (e, ctx, cb) => {
  return { statusCode: 200, body: 'mono app deployed.' }
}

// you could also just return an object
// which would return it as body with
// 200 status code by default
// module.exports = () => ({ hello: 'world' })

// or just a string
// module.exports = () => 'success'

// or a status code number
// module.exports = () => 404 // not found!

// you don't even need to export a function!
// module.exports = { hello: 'world' } // great for mocking!
// module.exports = 'success'
// module.exports = 500
```

### 3. Configure

All the following inputs are optional. However, they allow you to configure your Lambda compute instance and pass environment variables.

```yml
# serverless.yml

name: mono
stage: dev

mono:
  component: "@serverless/mono"
  inputs:
    name: my-mono-app
    description: My Mono App
    region: us-east-1
    memory: 128
    timeout: 10
    env:
      TABLE_NAME: my-table
    
    # the directory that contains the index.js file.
    # If not provided, the default is the current working directory
    # code: ./code


```

### 4. Deploy

```console
mono (master)$ components

  Mono › outputs:
  url:  'https://bbhm7tk587.execute-api.us-east-1.amazonaws.com/dev/'


  7s › dev › Mono › done

mono (master)$
```

All requests to this root url will be proxied directly to your lambda function, giving you full control of the http layer.

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
