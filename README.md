# Mono

&nbsp;

Deploy a mono lambda microservice to AWS in seconds using [Serverless Components](https://github.com/serverless/components).

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
|- serverless.yml
|- .env         # your development AWS api keys
|- .env.prod    # your production AWS api keys
|- code
  |- index.js
  |- package.json # optional
```

the `.env` files are not required if you have the aws keys set globally and you want to use a single stage, but they should look like this.

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

The `index.js` file should look something like this.

```js
module.exports = async (req, context) => {
  
  return { statusCode: 200, body: 'Mono Serverless Component.' }
}
```

### 3. Configure

All the following inputs are optional. However, they allow you to configure your Lambda compute instance and pass environment variables.

```yml
# serverless.yml

name: mono
stage: dev

Mono:
  component: "@serverless/mono"
  inputs:
    name: my-mono-microservice
    description: My Mono Microservice
    region: us-east-1
    memory: 128
    timeout: 10
    env:
      TABLE_NAME: my-table
    
    # the directory that contains the index.js file.
    # If not provided, the default is the current working directory
    code: ./code


```

### 4. Deploy

```console
mono (master)$ components

  Mono › outputs:
  name:  'my-mono-microservice'
  description:  'My Mono Microservice'
  memory:  128
  timeout:  10
  bucket:  undefined
  shims:  []
  handler:  'shim.handler'
  runtime:  'nodejs8.10'
  env: 
    TABLE_NAME:  'my-table'
  role: 
    name:  'my-mono-microservice'
    arn:  'arn:aws:iam::552760238299:role/my-mono-microservice'
    service:  'lambda.amazonaws.com'
    policy:  { arn: 'arn:aws:iam::aws:policy/AdministratorAccess' }
  arn:  'arn:aws:lambda:us-east-1:552760238299:function:my-mono-microservice'


  50s › dev › mono › done

mono (master)$
```

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
