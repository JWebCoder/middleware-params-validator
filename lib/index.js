"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validator;

var _validators = _interopRequireDefault(require("./validators"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// middleware that validates parameters on request
function getParameters(params) {
  return [].concat(params);
}

function validateParameter(req, target, parameter, invalid) {
  if (typeof parameter === 'string') {
    let invalidParameter = checkParameter(req, target, parameter);

    if (invalidParameter) {
      invalid.push(invalidParameter);
    }
  } else {
    let parameterName = Object.keys(parameter)[0];
    let invalidParameter = checkParameter(req, target, parameterName);

    if (invalidParameter) {
      invalid.push(invalidParameter);
      return;
    }

    parameter[parameterName].forEach(validator => {
      let invalidParameter = parseValidator(req, target, parameterName, validator);

      if (invalidParameter) {
        invalid.push(invalidParameter);
      }
    });
  }

  return invalid;
}

function checkParameter(req, target, parameterName) {
  if (!req[target][parameterName]) {
    return `Missing parameter ${parameterName}`;
  }
}

function validate(validatorKey, req, target, parameterName, params) {
  if (!_validators.default[validatorKey](req[target][parameterName], params)) {
    return `'${parameterName}' Parameter mismatch rule '${validatorKey}${params ? `: ${params}` : ''}'`;
  }
}

function parseValidator(req, target, parameterName, validator) {
  if (typeof validator === 'string') {
    let invalidParameter = validate(validator, req, target, parameterName);

    if (invalidParameter) {
      return invalidParameter;
    }
  } else {
    const VALIDATOR_KEY = Object.keys(validator)[0];
    let invalidParameter = validate(VALIDATOR_KEY, req, target, parameterName, validator[VALIDATOR_KEY]);

    if (invalidParameter) {
      return invalidParameter;
    }
  }
}

function validator(data) {
  return (req, res, next) => {
    let invalid = [];

    if (data) {
      Object.keys(data).forEach(target => {
        if (!req[target]) {
          invalid.push(`Missing object ${target}`);
          return;
        }

        getParameters(data[target]).forEach(parameter => {
          invalid = validateParameter(req, target, parameter, invalid);
        });
      });
    }

    if (invalid.length !== 0) {
      const err = new Error(invalid.join(' | '));
      err.status = 402;
      next(err);
      return;
    }

    next();
  };
}