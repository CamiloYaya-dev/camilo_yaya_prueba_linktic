function formatJsonApi(type, data) {
  if (Array.isArray(data)) {
    return {
      data: data.map(item => ({
        type,
        id: item.id,
        attributes: item,
      })),
    };
  }

  return {
    data: {
      type,
      id: data.id,
      attributes: data,
    },
  };
}

module.exports = formatJsonApi;
