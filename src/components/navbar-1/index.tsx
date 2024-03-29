import {useAppSelector, useAppDispatch} from "store";
import {FiMenu} from "react-icons/fi";
import Dropdown5 from "components/navbar-1/dropdown-5";
import {setConfig} from "slices/config";

const Navbar: React.FC = () => {
  const config = useAppSelector((state) => state.config);
  const {rightSidebar, collapsed} = config;
  const dispatch = useAppDispatch();
  return (
    <div className="bg-cyan-950 dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-start w-full">
        <button
          onClick={() =>
            dispatch(
              setConfig({
                collapsed: !collapsed,
              })
            )
          }
          className="mx-4 navbar-button">
          <FiMenu size={25} color={'#fff'}/>
        </button>

        <span className="ml-auto "></span>
        <div className="px-10 py-3">
          <Dropdown5 />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
