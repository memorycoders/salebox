//@ flow
export default (properties, callback) => {
  return (entity, key, prefix, idProperty) => {
    if (!entity) return undefined;
    const id = idProperty || `${prefix}Id`;
    if (entity[key] || entity[id]) {
      if (entity[key]) {
        return entity[key];
      }
      const extractedEntity = {
        uuid: entity[id],
      };
      Object.keys(properties).forEach((property) => {
        extractedEntity[property] = entity[`${prefix}${properties[property]}`];
      });
      if (callback) {
        return callback(entity, extractedEntity, prefix);
      }
      return extractedEntity;
    }
    return undefined;
  };
};
