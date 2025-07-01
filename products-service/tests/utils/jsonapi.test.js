const { formatJsonApi } = require('../../src/utils/jsonapi');

describe('formatJsonApi', () => {
  test('should format a single object correctly', () => {
    const input = { id: 1, name: 'Product A' };
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
      { id: 1, name: 'Product A' },
      { id: 2, name: 'Product B' },
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
