import {
  IVehicle,
  VEHICLE_CATEGORY,
  VL_CATEGORY,
  VL_ITEMS,
} from "components/vehicle-license/interface";
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

export function groupAndCountItems(data) {
  const groupedData = [];

  data.forEach((item) => {
    const storeName = item.location.name;
    const itemType = item.itemTypeId.itemType;

    // Check if the store is already in the groupedData array
    const storeIndex = groupedData.findIndex(
      (group) => group.storeName === storeName
    );

    if (storeIndex === -1) {
      // If the store is not found, add it to the array
      groupedData.push({
        storeName,
        items: [{itemType, count: 1}],
      });
    } else {
      // If the store is found, check if the itemType is already in the items array
      const itemIndex = groupedData[storeIndex].items.findIndex(
        (groupItem) => groupItem.itemType === itemType
      );

      if (itemIndex === -1) {
        // If the itemType is not found, add it to the items array
        groupedData[storeIndex].items.push({itemType, count: 1});
      } else {
        // If the itemType is found, increase the count
        groupedData[storeIndex].items[itemIndex].count += 1;
      }
    }
  });

  return groupedData;
}

export function selectItemsByQuantity(groupItems, ungroupedItems) {
  const requiredQuantities = {};

  for (const item of groupItems) {
    const {itemName, quantity} = item;
    requiredQuantities[itemName] = quantity;
  }

  const filteredItems = [];
  for (const item of ungroupedItems) {
    const id = item.itemTypeId.itemType;
    if (requiredQuantities[id] && requiredQuantities[id] > 0) {
      filteredItems.push(item.id);
      requiredQuantities[id]--;
    }
  }

  return filteredItems;
}

const extractNumberFromString = (str): number => {
  const numberString = str.replace(/\D/g, ""); // Remove all non-digit characters
  return Number(numberString); // Convert the result to a number
};

export const motorVehicleCategory = (
  capacity: number,
  vehiclePurpose: string
): VL_CATEGORY => {
  const commercialPurpose = ["commercial", "government"];
  if (capacity < 1.6) return VL_CATEGORY.VEHICLE_BELOW_1_6CC;
  if (capacity < 2) return VL_CATEGORY.VEHICLE_BELOW_2CC;
  if (capacity < 3) {
    if (commercialPurpose.includes(vehiclePurpose))
      return VL_CATEGORY.VEHICLE_BELOW_3CC_COMMERCIAL;
    return VL_CATEGORY.VEHICLE_BELOW_3CC;
  }
  if (capacity > 3) return VL_CATEGORY.VEHICLE_ABOVE_3CC;
};

export const plateNumberCategory = (vehicle: IVehicle): VL_CATEGORY => {
  const purpose = vehicle.purpose.toLowerCase();
  const governmentPurpose = purpose === "government";

  return governmentPurpose
    ? VL_CATEGORY.GOVERNMENT_STANDARD
    : VL_CATEGORY.PRIVATE_STANDARD;
};

export const getRoadWorthinessCategory = (vehicle) => {
  switch (vehicle.category) {
    case VEHICLE_CATEGORY.MOTORCYCLE:
      return VL_CATEGORY.MOTORCYCLE;
    case VEHICLE_CATEGORY.MOTORVEHICLE:
      return VL_CATEGORY.VEHICLE;
    case VEHICLE_CATEGORY.BUS:
      return VL_CATEGORY.BUSES;
    case VEHICLE_CATEGORY.TIPPER_LORRY:
      return VL_CATEGORY.TIPPER_LORRY;
    case VEHICLE_CATEGORY.ARTICULATED_VEHICLE:
      return VL_CATEGORY.ARTICULATED_VEHICLE;
    default:
      return null;
  }
};

const incrementSubtotalIfExists = (resultArray, itemName, amount) => {
  // console.log({resultArray, itemName, amount});
  const existingItem = resultArray.find((item) => item.itemName === itemName);
  if (existingItem) {
    existingItem.subtotal += amount;
    existingItem.quantity += 1;
  } else {
    resultArray.push({
      itemName,
      quantity: 1,
      subtotal: amount,
    });
  }
};

export function processVehicleData(vehicles: IVehicle[], sellingPrices) {
  const resultArray = [];

  const sellingPricesMap = new Map(
    sellingPrices.map((item) => [`${item.item}-${item.category}`, item.price])
  );

  vehicles.forEach((vehicle) => {
    const engineCapacity = extractNumberFromString(vehicle.engineCapacity);

    const category =
      vehicle.category !== VEHICLE_CATEGORY.MOTORVEHICLE
        ? vehicle.category
        : motorVehicleCategory(engineCapacity, vehicle.purpose);

    const vehicleType = vehicle.type.toLowerCase();
    const {itemsToSend} = vehicle.vehicleLicence;

    itemsToSend.forEach((item) => {
      const defaultPrice = Number(
        sellingPricesMap.get(`${item}-${VL_CATEGORY.DEFAULT}`)
      );
      const categoryPrice = Number(sellingPricesMap.get(`${item}-${category}`));
      const plateNumberCategoryPrice = Number(
        sellingPricesMap.get(`${item}-${plateNumberCategory(vehicle)}`)
      );

      let roadWorthinessCategory;
      let changeOfOwnershipCategory;

      switch (item) {
        case VL_ITEMS.GREEN_BOOK:
        case VL_ITEMS.PROOF_OF_OWNERSHIP:
          incrementSubtotalIfExists(
            resultArray,
            item === VL_ITEMS.PROOF_OF_OWNERSHIP
              ? "Proof of Ownership"
              : "Registration Booklet",
            defaultPrice
          );

          break;
        case VL_ITEMS.VEHICLE_PLATE_NUMBER:
        case VL_ITEMS.MOTORCYCLE_PLATE_NUMBER:
          incrementSubtotalIfExists(
            resultArray,
            "Plate Number",
            plateNumberCategoryPrice
          );

          break;
        case VL_ITEMS.VEHICLE_REGISTRATION:
        case VL_ITEMS.LICENCE:
          incrementSubtotalIfExists(
            resultArray,
            item === VL_ITEMS.VEHICLE_REGISTRATION
              ? "Vehicle Registration"
              : "Vehicle Licence",
            categoryPrice
          );

          break;
        case VL_ITEMS.HACKNEY_PERMIT:
          incrementSubtotalIfExists(
            resultArray,
            "Hackney Permit",
            categoryPrice
          );
          incrementSubtotalIfExists(
            resultArray,
            "Hackney Permit sms",
            Number(sellingPricesMap.get(`${item}-${VL_CATEGORY.SMS}`))
          );
          break;
        case VL_ITEMS.ROAD_WORTHINESS:
          roadWorthinessCategory = getRoadWorthinessCategory(vehicle);

          incrementSubtotalIfExists(
            resultArray,
            "Road Worthiness and Inspection",
            Number(sellingPricesMap.get(`${item}-${roadWorthinessCategory}`))
          );

          break;
        case VL_ITEMS.CHANGE_OF_OWNERSHIP:
          changeOfOwnershipCategory = vehicleType.includes("motorcycle")
            ? VL_CATEGORY.MOTORCYCLE
            : VL_CATEGORY.VEHICLE;

          incrementSubtotalIfExists(
            resultArray,
            "Change of Ownership",
            Number(sellingPricesMap.get(`${item}-${changeOfOwnershipCategory}`))
          );

          break;

        case VL_ITEMS.OTHERS:
          incrementSubtotalIfExists(
            resultArray,
            "Vehicle licence sms",
            Number(sellingPricesMap.get(`${item}-${VL_CATEGORY.SMS}`))
          );
          incrementSubtotalIfExists(
            resultArray,
            "Stamp Duty",
            Number(sellingPricesMap.get(`${item}-${VL_CATEGORY.STAMP_DUTY}`))
          );
          break;
        case VL_ITEMS.INSURANCE:
          incrementSubtotalIfExists(
            resultArray,
            "Insurance",
            Number(sellingPricesMap.get(`${item}-${VL_CATEGORY.INSURANCE}`))
          );

          break;
      }
    });
  });

  return resultArray.map((item) => ({
    ...item,
    itemName: item.itemName,
  }));
}
