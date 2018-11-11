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

    return `Rule '${RULE_DATA[0]}' not found`
  }

  words (param, rules) {
    const RULE_DATA = rules.split('_')
    const WORDS_ARRAY_LENGTH = param.split(' ').filter(word => word).length
    switch (RULE_DATA[0]) {
      case 'min':
        return WORDS_ARRAY_LENGTH >= parseInt(RULE_DATA[1], 10)
      case 'max':
        return WORDS_ARRAY_LENGTH <= parseInt(RULE_DATA[1], 10)
      case 'exact':
        return WORDS_ARRAY_LENGTH === parseInt(RULE_DATA[1], 10)
      default:
        return `Rule '${RULE_DATA[0]}' not found`
    }
  }

  number (param) {
    return typeof param === 'number'
  }

  setCustomValidators (customValidators = {}) {
    const customValidatorsKeys = Object.keys(customValidators)
    const alreadyExistingValidator = customValidatorsKeys.find(
      customValidatorKey => this[customValidatorKey]
    )

    if (alreadyExistingValidator) {
      return new Error(`You are trying to set a custom validator with the same name of an already existing validator: ${alreadyExistingValidator}`)
    }

    customValidatorsKeys.forEach(
      customValidatorKey => {
        this[customValidatorKey] = customValidators[customValidatorKey]
      }
    )
  }
}

const validators = new Validators()

export default validators
