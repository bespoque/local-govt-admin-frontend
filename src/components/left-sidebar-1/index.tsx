import {Fragment, useMemo} from "react";
import {useAppSelector} from "store";
import Title from "components/left-sidebar-1/title";
import Item from "components/left-sidebar-1/item";
import Logo from "components/left-sidebar-1/logo";
import {filterNavigation} from "./filterNavigation";
import {navigationData} from "./navigation";

const LeftSidebar: React.FC = () => {
  const navigation = navigationData(process.env.NODE_ENV === "production");
  const userLocation = useAppSelector((state) => state.auth.taxOffice?.name);
  const userRoles = useAppSelector((state) =>
    state.auth.roles.filter((role) => role.active)
  ).map((userRole) => userRole.role);

  const filteredNavigation = useMemo(() => {
    return filterNavigation(navigation[0].items, userRoles, userLocation);
  }, [navigation, userLocation, userRoles]);

  const filteredNav = [
    {
      title: navigation[0]?.title,
      items: filteredNavigation,
    },
  ];
  return (
    <div className="text-gray-900 bg-white border-r border-gray-100 left-sidebar left-sidebar-1 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
      <Logo />
      {filteredNav?.map((menu, i) => (
        <Fragment key={i}>
          <Title>{menu.title}</Title>
          <ul>
            {menu.items.map((l0, a) => {
              return (
                <li key={a} className="l0">
                  <Item {...l0} />
                  <ul>
                    {l0?.items?.map((l1, b) => (
                      <li key={b} className="l1">
                        <Item {...l1} />
                        <ul>
                          {l1.items?.map((l2, c) => (
                            <li key={c} className="l2">
                              <Item {...l2} />
                              <ul>
                                {l2.items?.map((l3, d) => (
                                  <li key={d} className="l3">
                                    <Item {...l3} />
                                    <ul>
                                      {l3.items?.map((l4, e) => (
                                        <li key={e} className="l4">
                                          <Item {...l4} />
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Fragment>
      ))}
    </div>
  );
};

export default LeftSidebar;
