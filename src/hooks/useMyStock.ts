import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {handleApiError} from "helpers/errors";
import {useEffect, useState} from "react";
import {fetchInventoryItems} from "slices/actions/inventoryItemActions";
import {useAppSelector} from "store";

export const useMyStock = () => {
  const [stockList, setStockList] = useState<IInventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const userData = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const filter = {
          location: userData?.taxOffice?.name,
          locked: false,
          sold: false,
        };
        const inventoryItemsRes = await fetchInventoryItems(filter);
        setStockList(inventoryItemsRes.data);
      } catch (error) {
        handleApiError(error, userData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  return {stockList, loading};
};
