import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import AccountSettings from "components/sample-forms/account-settings";
import EmailPreferences from "components/sample-forms/email-preferences";
import SecuritySettings from "components/sample-forms/security-settings";
import Widget from "components/social-feed/widget";
import UserProfile from "components/user-profile";
import Table from "../../components/tables/custom-table";
import {useSelector} from "react-redux";
import {RootState} from "store";
import moment from "moment";

const Index: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  const userInfoPairs = [
    { label: "First Name", value: user?.name },
    {label: "Email Address", value: user?.email},
    {label: "Phone Number", value: user?.phone},
    {label: "Area Tax Office", value: user?.taxOffice?.taxOffice},
  ];

  const tabs = [
    {
      index: 0,
      title: "User Info",
      active: true,
      content: <UserProfile infoPairs={userInfoPairs} />,
    },
    // {
    //   index: 1,
    //   title: "Account Info",
    //   active: false,
    //   content: (
    //     <Table
    //       fields={[
    //         {name: "role", key: "role"},
    //         {name: "permissions", key: "permissions"},
    //       ]}
    //       tableData={user?.roles.filter((usr: any) => usr.active)}
    //     />
    //   ),
    // },
    {
      index: 2,
      title: "Change password",
      content: (
        <div className="w-full py-4 lg:w-1/2">
          <SecuritySettings userSlug={user?.id} />
          {/* <SecuritySettings userSlug={user?.userSlug} /> */}
        </div>
      ),
    },
  ];

  return (
    <>
      <SectionTitle title="Pages" subtitle="User profile" />

      <Widget>
        <div className="flex flex-row items-center justify-start p-4">
          <div className="shrink-0 w-24">
            <img
              src="/images/faces/profile.png"
              alt="media"
              className="w-20 h-20 mb-2 rounded-full shadow ring"
            />
          </div>
          <div className="px-2 py-2">
            <p className="text-base font-bold whitespace-nowrap">{`${user?.name}`}</p>
          </div>
        </div>

        <div className="flex flex-wrap">
          <div className="w-full p-4">
            <UnderlinedTabs tabs={tabs} />
          </div>
        </div>
      </Widget>
    </>
  );
};

export default Index;
