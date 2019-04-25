const path = require('path')
const { Component, utils } = require('@serverless/components')

const generateName = (name = 'mono', stage = 'dev') => {
  const shortId = Math.random()
    .toString(36)
    .substring(6)

  return `${name}-${stage}-${shortId}`
}

class Mono extends Component {
  async default(inputs = {}) {
    inputs.code = inputs.code ? path.resolve(process.cwd(), inputs.code) : process.cwd()

    if (!(await utils.fileExists(path.join(inputs.code, 'index.js')))) {
      throw Error(`no index.js file found in the directory "${inputs.code}"`)
    }

    this.cli.status('Starting Deployment')
    const name = this.state.name || generateName(inputs.name, this.context.stage)

    const bucket = await this.load('@serverless/aws-s3')
    const role = await this.load('@serverless/aws-iam-role')
    const lambda = await this.load('@serverless/aws-lambda')
    const apig = await this.load('@serverless/aws-api-gateway')

    this.cli.status('Deploying Bucket')
    await bucket({ name, region: inputs.region })

    this.cli.status('Deploying Role')
    const roleOutputs = await role({
      name,
      region: inputs.region,
      service: ['lambda.amazonaws.com', 'apigateway.amazonaws.com']
    })

    const lambdaInputs = {
      name,
      description: inputs.description || 'Mono Lambda Powered by Serverless Components',
      memory: inputs.memory || 128,
      timeout: inputs.timeout || 10,
      runtime: 'nodejs8.10',
      code: inputs.code,
      role: roleOutputs,
      handler: 'shim.handler',
      shims: [path.join(__dirname, 'shim.js')],
      env: inputs.env || {},
      bucket: name,
      region: inputs.region
    }

    this.cli.status('Deploying Lambda')
    const lambdaOutputs = await lambda(lambdaInputs)

    // todo remove this once the ANY bug is fixed
    const methods = {}
    const methodList = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']
    methodList.forEach(
      (method) =>
        (methods[method] = {
          function: lambdaOutputs.arn,
          cors: true
        })
    )
    const apigInputs = {
      name: `${name}-apig`,
      role: roleOutputs,
      routes: {
        '{proxy+}': methods,
        '/': methods
      }
    }

    this.cli.status('Deploying API Gateway')
    const apigOutputs = await apig(apigInputs)

    this.state.name = name
    await this.save()

    this.cli.outputs({
      url: apigOutputs.url
    })
    return { url: apigOutputs.url }
  }

  async remove() {
    this.cli.status('Removing')

    const role = await this.load('@serverless/aws-iam-role')
    const bucket = await this.load('@serverless/aws-s3')
    const lambda = await this.load('@serverless/aws-lambda')
    const apig = await this.load('@serverless/aws-api-gateway')

    await role.remove()
    await bucket.remove()
    await lambda.remove()
    await apig.remove()

    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = Mono
