import validator from '../src'
import assert from 'assert'

const testWithObjectParameterAndValidators = validator({
  params: {
    'email': [
      'email',
      {
        length: 'min_10',
      },
      {
        length: 'max_30',
      },
      {
        length: 'exact_20',
      },
    ],
  },
})

const testWithValidatorCustomError = validator({
  params: {
    'email': [
      {
        length: 'xpto_10',
      },
    ],
  },
})

export default function () {
  describe('Test with object parameter and validators', function () {
    it('should return an error if one of the validators fail', function () {
      testWithObjectParameterAndValidators(
        {
          params: {
            email: 'asd',
          },
        },
        {},
        (err) => {
          assert.notEqual(err, undefined)
        }
      )
    })

    it('should return an error if email validator fails', function () {
      testWithObjectParameterAndValidators(
        {
          params: {
            email: 'asdasdasasasdasdasas',
          },
        },
        {},
        (err) => {
          assert.equal(err.message, "'email' Parameter mismatch rule 'email'")
        }
      )
    })

    it('should return an error if length min validator fails', function () {
      testWithObjectParameterAndValidators(
        {
          params: {
            email: 'as@gml.pt',
          },
        },
        {},
        (err) => {
          assert.equal(err.message.indexOf("'email' Parameter mismatch rule 'length: min_10'"), 0)
        }
      )
    })

    it('should return an error if length max validator fails', function () {
      testWithObjectParameterAndValidators(
        {
          params: {
            email: 'qweasdzxcqqweasdzxcq31@gmail.pt',
          },
        },
        {},
        (err) => {
          assert.equal(err.message.indexOf("'email' Parameter mismatch rule 'length: max_30'"), 0)
        }
      )
    })

    it('should return an error if length exact validator fails', function () {
      testWithObjectParameterAndValidators(
        {
          params: {
            email: 'qweasdzxca21@gmail.pt',
          },
        },
        {},
        (err) => {
          assert.equal(err.message.indexOf("'email' Parameter mismatch rule 'length: exact_20'"), 0)
        }
      )
    })

    it('validator is able to set custom errors', function () {
      testWithValidatorCustomError(
        {
          params: {
            email: 'asdasd@gmail.pt',
          },
        },
        {},
        (err) => {
          assert.equal(err.message.indexOf("Rule 'xpto' not found"), 0)
        }
      )
    })

    it('should not return any error if all validators pass', function () {
      testWithObjectParameterAndValidators(
        {
          params: {
            email: 'qweasdzxc20@gmail.pt',
          },
        },
        {},
        (err) => {
          assert.equal(err, undefined)
        }
      )
    })
  })
}
