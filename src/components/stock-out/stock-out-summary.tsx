import {IInventoryItem} from "components/inventory-item/inventory-item.interface";
import {useMemo} from "react";

interface IStockOutSummaryProps {
  inventoryItems: number[];
  stockList: IInventoryItem[];
  isTable?: boolean;
}
const Index: React.FC<IStockOutSummaryProps> = ({
  inventoryItems,
  stockList,
  isTable,
}) => {
  const calculateIdCounts = (inventoryItems, stockList) => {
    return inventoryItems.reduce((idCounts, id) => {
      const itemType = stockList.find((item) => item.id === id)?.itemTypeId
        ?.itemType;
      if (itemType) {
        idCounts[itemType] = (idCounts[itemType] || 0) + 1;
      }
      return idCounts;
    }, {});
  };

  const stockOutSummary = useMemo(() => {
    const idCounts = calculateIdCounts(inventoryItems, stockList);

    if (isTable) {
      return Object.keys(idCounts).map((key) => (
        <tr key={key}>
          <td className="border border-gray-400 py-2 px-4">{key}</td>
          <td className="border border-gray-400 py-2 px-4">{idCounts[key]}</td>
        </tr>
      ));
    }

    return Object.keys(idCounts).map((key) => (
      <div className="flex" key={key}>
        <h3 className="font-medium">{key}:</h3>
        <div className="font-semibold"> {idCounts[key]}</div>
      </div>
    ));
  }, [inventoryItems, isTable, stockList]);

  return <>{stockOutSummary}</>;
};

export default Index;
