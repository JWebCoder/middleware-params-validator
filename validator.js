// middleware that validates parameters on request
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Validators {
  email (param) {
    return EMAIL_REGEX.test(param)
  }

  length (param, rules) {
    const RULE_DATA = rules.split('_')

    if (RULE_DATA[0] === 'min') {
      return param.length >= parseInt(RULE_DATA[1], 10)
    }

    if (RULE_DATA[0] === 'max') {
      return param.length <= parseInt(RULE_DATA[1], 10)
    }

    if (RULE_DATA[0] === 'exact') {
      return param.length === parseInt(RULE_DATA[1], 10)
    }
  }
}

const validators = new Validators()

function getParameters (params) {
  return [].concat(params)
}

function validateParameter (req, target, parameter, invalid) {
  if (typeof parameter === 'string') {
    let invalidParameter = checkParameter(req, target, parameter)
    if (invalidParameter) {
      invalid.push(invalidParameter)
    }
  } else {
    let parameterName = Object.keys(parameter)[0]
    let invalidParameter = checkParameter(req, target, parameterName)
    if (invalidParameter) {
      invalid.push(invalidParameter)
      return
    }
    parameter[parameterName].forEach(
      validator => {
        let invalidParameter = parseValidator(req, target, parameterName, validator)
        if (invalidParameter) {
          invalid.push(invalidParameter)
        }
      }
    )
  }

  return invalid
}

function checkParameter (req, target, parameterName) {
  if (!req[target][parameterName]) {
    return `Missing parameter ${parameterName}`
  }
}

function validate (validatorKey, req, target, parameterName, params) {
  if (!validators[validatorKey](req[target][parameterName], params)) {
    return `'${parameterName}' Parameter mismatch rule '${validatorKey}${params ? `: ${params}` : ''}'`
  }
}

function parseValidator (req, target, parameterName, validator) {
  if (typeof validator === 'string') {
    let invalidParameter = validate(validator, req, target, parameterName)
    if (invalidParameter) {
      return invalidParameter
    }
  } else {
    const VALIDATOR_KEY = Object.keys(validator)[0]
    let invalidParameter = validate(VALIDATOR_KEY, req, target, parameterName, validator[VALIDATOR_KEY])
    if (invalidParameter) {
      return invalidParameter
    }
  }
}

export default function validator (data) {
  return (req, res, next) => {
    let invalid = []
    if (data) {
      Object.keys(data).forEach(
        target => {
          if (!req[target]) {
            invalid.push(`Missing object ${target}`)
            return
          }
          getParameters(data[target]).forEach(
            parameter => {
              invalid = validateParameter(req, target, parameter, invalid)
            }
          )
        }
      )
    }
    if (invalid.length !== 0) {
      const err = new Error(invalid.join(' | '))
      err.status = 402
      next(err)
      return
    }
    next()
  }
}
