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

  words (param, count) {
    return param.split(' ').length >= count
  }

  number (param) {
    return typeof param === 'number'
  }
}

const validators = new Validators()

export default validators
