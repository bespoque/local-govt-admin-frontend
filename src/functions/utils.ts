
import jwt from "jsonwebtoken";

export const groupAndAggregateItems = (items) => {
  const groupedItems = {};

  items?.forEach((item) => {
    const itemId = item.itemTypeId.id;

    if (!groupedItems[itemId]) {
      groupedItems[itemId] = {
        ...item,
        quantity: 1,
        name: item.itemTypeId.itemType,
        description: item.itemTypeId.description,
        totalProcuredPrice: parseFloat(item.procuredPrice),
      };
    } else {
      groupedItems[itemId].quantity += 1;
      groupedItems[itemId].totalProcuredPrice += parseFloat(item.procuredPrice);
    }
  });
  return Object.values(groupedItems);
};

export const calculateFormSectionSumTotal = (formSectionValues) => {
  return formSectionValues
    .map((prices) => prices?.price)
    .reduce((total, p) => {
      return total + p;
    }, 0);
};

export const deepCompare = (obj1, obj2) => {
  if (obj1 === obj2) return {}; // If the objects are the same, no changes

  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 !== obj2 ? {value: obj1} : {}; // Changed value object
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  const changedValues = {};

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        // Handle array comparison
        const arrayChanges = deepArrayCompare(obj1[key], obj2[key]);
        if (arrayChanges.length > 0) {
          changedValues[key] = arrayChanges;
        }
      } else if (
        typeof obj1[key] === "object" &&
        typeof obj2[key] === "object"
      ) {
        // Handle nested object comparison
        const nestedChanges = deepCompare(obj1[key], obj2[key]);
        if (Object.keys(nestedChanges).length > 0) {
          changedValues[key] = nestedChanges;
        }
      } else {
        changedValues[key] = obj1[key];
      }
    }
  }

  return changedValues;
};

const deepArrayCompare = (arr1, arr2) => {
  const arrayChanges = [];

  for (let i = 0; i < arr1.length; i++) {
    const changes = deepCompare(arr1[i], arr2[i]);
    if (Object.keys(changes).length > 0) {
      arrayChanges.push(changes);
    }
  }

  return arrayChanges;
};

export function decodeJwt(token: string) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    // Handle decoding errors (e.g., token is invalid)
    return null;
  }
}

// Implement parseJwt to decode the JWT token

export function isAuthenticated(): boolean {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    return false;
  }

  try {
    const decodedToken = jwt.decode(accessToken);
    if (!decodedToken || typeof decodedToken.exp !== "number") {
      // The token is invalid or doesn't have an expiration time.
      return false;
    }

    // Get the current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Compare the expiration time with the current timestamp
    return decodedToken.exp >= currentTimestamp;
  } catch (error) {
    // Handle decoding errors (e.g., token is invalid)
    return false;
  }
}

const extractNumberFromString = (str): number => {
  const numberString = str.replace(/\D/g, ""); // Remove all non-digit characters
  return Number(numberString); // Convert the result to a number
};



