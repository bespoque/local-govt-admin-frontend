
import React, { useCallback, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { DefaultTabs } from "components/tabs";
import AddRecordButton from "components/forms/add-record-button";
import GroupList from "pages/group-mgt";
import UserList from "./user";

const Index: React.FC = () => {
  const [reloadUserList, setReloadUserList] = useState(false);

  const handleReloadUserList = useCallback(() => {
    setReloadUserList(prev => !prev);
  }, []);
  const tabs = [
    {
      index: 0,
      title: "Users",
      active: true,
      content: <div className="w-full py-4">
        <UserList reload={reloadUserList} />
      </div>,
    },
    {
      index: 2,
      title: "Groups",
      content: (
        <div className="w-full py-4">
          <GroupList reload={reloadUserList} />
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <h3 className="font-mono text-cyan-800 text-xl">User Management</h3>
      </div>
      <div className="flex justify-end p-2">
        <AddRecordButton onUserAdded={handleReloadUserList} />
      </div>
      <div className="flex flex-wrap">
        <div className="w-full p-4">
          <DefaultTabs tabs={tabs} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Index;
