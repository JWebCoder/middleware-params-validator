# middleware-params-validator

A simple middleware to validate the request object (body, params, querystring, headers, customData, ...) againts a json structure

## Requirements

node >= 6.9

## usage

Simply add the validator middleware to your routes with the desired json structure

```js
{
  /* body: just an object inside the request */
  body: {
    /* parameter of the body */
    email: [    /* array of validations to execute    */
      'email',  /* just checking if its a valid email */
    ],          /*------------------------------------*/
  },
  /* params: another object inside the request */
  params: 'id', /* you can also pass a string instead of an object, this means that it will only check if the parameter exists */
}
```

### extra data on validations

```js
{
  /* custom: just an object inside the request */
  params: [
    /* parameter of the custom object */
    'id',
    /* another parameter of the custom object */
    'date',
    /* and yet another parameter of the custom object */
    {
      name: [
        {
          /* this is an example, on how to pass extra data to a validator */
          length: 'min_5',
        },
      ],
    },
  ]
}
```

### custom data on request

If you have a controller/middleware/... that adds data to the request object, you can also check it

```js
{
  /* custom: just an object inside the request */
  custom: [
    /* parameter of the custom object */
    {
      email: [
        'email',
      ],
    },
    /* another parameter of the custom object */
    'date',
    /* and yet another parameter of the custom object */
    {
      name: [
        {
          /* this is an example, on how to pass extra data to a validator */
          length: 'min_5',
        },
      ],
    },
  ]
}
```

## available validators

- email
- length (supports extra data: min_N, max_N, exact_N)
- number
- words (supports extra data that is the minimum number of words: N )

## example

```js
// controller
import friendController from 'controllers/friend'

// middleware
import validator from 'middleware-params-validator'

const router = Router()

router.post('/:id/addFriend',
  validator({
    body: {
      email: [
        'email',
      ],
    },
    params: 'id',
  }),
  someController.addFriend
)

router.delete('/:id/removeFriend/:email',
  validator({
    params: [
      'id',
      {
        'email': [
          'email',
        ],
      },
    ],
  }),
  friendController.removeFriend
)

router.delete('/:id',
  validator({
    params: 'id',
  }),
  friendController.deleteHoliday
)

router.post('/',
  validator({
    body: {
      email: [
        'email',
      ],
    },
  }),
  friendController.addFriend
)

```
