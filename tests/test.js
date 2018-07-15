import validator from '../src'
import validatorsTests from './validator.test.js'
import assert from 'assert'

const testWithStringParameter = validator({
  params: 'id',
})

const testWithObjectParameter = validator({
  params: {
    param: 'email',
    validations: [],
  },
})

const testWithOptional = validator({
  params: [
    'name',
    {
      param: 'count',
      optional: true,
    },
  ],
})

describe('Test validator builder', function () {
  it('if no data is passed, it should just move to the next middleware', function () {
    const noData = validator()

    noData({}, {}, (err) => {
      assert.equal(err, undefined)
    })
  })
})

describe('Test main object', function () {
  it('should return "Missing object ****" message when missing main object', function () {
    testWithObjectParameter({}, {}, (err) => {
      assert.equal(err.message, 'Missing object params')
    })
  })
})

describe('Test with string parameter', function () {
  it('should accept strings as parameters identifiers', function () {
    testWithStringParameter({params: {id: '123'}}, {}, (err) => {
      assert.equal(err, undefined)
    })
  })

  it('should return "Missing parameter ****" message when missing parameter', function () {
    testWithStringParameter({params: {}}, {}, (err) => {
      assert.equal(err.message, 'Missing parameter id')
    })
  })

  it('should not return any error when there are no errors', function () {
    testWithStringParameter({params: {id: 'id'}}, {}, (err) => {
      assert.equal(err, undefined)
    })
  })
})

describe('Test with object parameter', function () {
  it('should accept objects as parameters identifiers', function () {
    testWithObjectParameter({params: {email: '123'}}, {}, (err) => {
      assert.equal(err, undefined)
    })
  })

  it('should return "Missing parameter ****" message when missing parameter', function () {
    testWithObjectParameter({params: {}}, {}, (err) => {
      assert.equal(err.message, 'Missing parameter email')
    })
  })

  it('should not return an error if missing optional parameter', function () {
    testWithOptional(
      {
        params: {
          name: 'joao moura',
        },
      },
      {},
      (err) => {
        assert.equal(err, undefined)
      }
    )
  })

  it('should not return any error when there are no errors', function () {
    testWithObjectParameter({params: {email: '123'}}, {}, (err) => {
      assert.equal(err, undefined)
    })
  })
})

validatorsTests()
