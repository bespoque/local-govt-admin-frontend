import Widget1 from "components/dashboard/widget-1";
import SectionTitle from "components/dashboard/section-title";
import {FiShoppingCart} from "react-icons/fi";
import {useEffect, useState} from "react";
import {fetchInventoryItems} from "slices/actions/inventoryItemActions";
import {groupAndCountItems} from "functions/utils";
import {useAppDispatch, useAppSelector} from "store";
import {loadStocks} from "slices/stock";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {handleApiError} from "helpers/errors";

const Index: React.FC = () => {
  const stock = useAppSelector((state) => state.stock);
  const userData = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchInventoryItems({
      locked: false,
      sold: false,
    })
      .then((res) => {
        setLoading(false);
        dispatch(loadStocks(groupAndCountItems(res.data)));
      })
      .catch((error) => {
        setLoading(false);
        handleApiError(error, userData);
      });
  }, []);

  return (
    <>
      <SectionTitle title="Overview" subtitle="STOCK" />
      {loading ? (
        <div className="mt-5">
          <Skeleton count={10} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-4 lg:mb-4">
          {!loading && stock.length > 0 ? (
            stock.map((st, index) => (
              <Link
                href={`/stock/${st.storeName}`}
                className="lg:col-span-1  hover:cursor-pointer"
                key={index}>
                <Widget1
                  title={st?.storeName}
                  description={st?.items?.length}
                  right={
                    <FiShoppingCart
                      size={24}
                      className="text-gray-500 stroke-current"
                    />
                  }
                />
              </Link>
            ))
          ) : (
            <p>No items in stock at the moment</p>
          )}
        </div>
      )}
    </>
  );
};
export default Index;
