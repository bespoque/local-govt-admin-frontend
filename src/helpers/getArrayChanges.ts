import _ from "lodash";

export const getArrayChanges = (originalArray, newArray) => {
  const addItems = _.difference(newArray, originalArray);
  const removeItems = _.difference(originalArray, newArray);

  return {
    addItems,
    removeItems,
  };
};
