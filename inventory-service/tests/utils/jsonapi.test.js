const formatJsonApi = require('../../src/utils/jsonapi');

describe('formatJsonApi', () => {
  test('should format a single object correctly', () => {
    const input = { id: 1, name: 'Product A', price: 10 };
    const type = 'products';

    const result = formatJsonApi(type, input);

    expect(result).toEqual({
      data: {
        type: 'products',
        id: 1,
        attributes: input,
      },
    });
  });

  test('should format an array of objects correctly', () => {
    const input = [
      { id: 1, name: 'Product A', price: 10 },
      { id: 2, name: 'Product B', price: 20 },
    ];
    const type = 'products';

    const result = formatJsonApi(type, input);

    expect(result).toEqual({
      data: [
        {
          type: 'products',
          id: 1,
          attributes: input[0],
        },
        {
          type: 'products',
          id: 2,
          attributes: input[1],
        },
      ],
    });
  });
});
