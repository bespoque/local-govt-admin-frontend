import SectionTitle from "components/section-title";
import {UnderlinedTabs} from "components/tabs";
import EditUserForm from "components/forms/edit-user-form";
import Widget from "components/social-feed/widget";
import {useRouter} from "next/router";
import InfoBlock from "components/user-profile";
import Modal from "components/modals/modal-1";
import {useEffect, useState} from "react";
import {
  activateUser,
  deactivateUser,
  fetchUser,
  resetUserPassword,
} from "slices/actions/userActions";
import Table from "components/tables/custom-table";
import moment from "moment";
import WarnModal from "components/modals/warn-modal";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {handleApiError} from "helpers/errors";
import {RootState, useAppSelector} from "store";

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openWarnModal, setOpenWarnModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const userSlug = router?.query?.id;
  const userData = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!userSlug || !userData) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const {data} = await fetchUser({userSlug});
        setUser(data);
      } catch (error) {
        handleApiError(error, userData, "Could not retrieve user details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, userSlug]);

  const userInfoPairs = [
    {label: "First Name", value: user?.firstName},
    {label: "Last Name", value: user?.lastName},
    {label: "Email Address", value: user?.email},
    {label: "Phone Number", value: user?.phone},
    {label: "Area Tax Office", value: user?.taxOffice?.value},
  ];

  const tabs = [
    {
      index: 0,
      title: "User Info",
      active: true,
      content: <InfoBlock infoPairs={userInfoPairs} />,
    },
    {
      index: 1,
      title: "Account Info",
      active: false,
      content: (
        <Table
          fields={[
            {name: "role", key: "role"},
            {name: "permissions", key: "permissions"},
          ]}
          tableData={user?.roles.filter((usr) => usr.active)}
        />
      ),
    },
  ];

  const deactivate = async (userSlug) => {
    try {
      await deactivateUser(userSlug);
      toast.success("User deactivated successfully!");
      router.reload();
    } catch (error) {
      handleApiError(error, userData);
    }
  };

  const activate = async (userSlug) => {
    try {
      await activateUser(userSlug);
      toast.success("User activated successfully!");
      router.reload();
    } catch (error) {
      handleApiError(error, userData);
    }
  };

  const resetUserPass = async (userSlug) => {
    try {
      await resetUserPassword(userSlug);
      toast.success("User password reset was successful!");
      router.reload();
    } catch (error) {
      handleApiError(error, userData);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SectionTitle title="User Profile" subtitle="View  User" />
      {loading ? (
        <div className="mt-5">
          <Skeleton count={6} />
        </div>
      ) : (
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
              <p className="text-base font-bold whitespace-nowrap">{`${user?.firstName} ${user?.lastName}`}</p>
              <p className="text-sm text-gray-500 whitespace-nowrap flex items-center">
                Account Status
                {user?.account_status.trim() === "ACTIVE" ? (
                  <p className="ml-4 bg-green-500 text-white border rounded-sm p-1 text-xs">
                    {user?.account_status}
                  </p>
                ) : (
                  <p className="ml-4 bg-red-500 text-white border rounded-sm p-1 text-xs">
                    {user?.account_status}
                  </p>
                )}
              </p>
              <div className="flex flex-row items-center justify-start w-full py-1 space-x-2">
                <p className="text-sm text-gray-500 whitespace-nowrap">
                  {`Last Login: ${moment(user?.last_login).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}`}
                </p>
              </div>
            </div>
            <div className="shrink-0 hidden ml-auto space-x-2 lg:flex">
              <button
                onClick={openModal}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                Edit
              </button>
              <button
                onClick={() => setOpenResetModal(true)}
                className="px-4 py-2 text-xs font-bold text-white uppercase bg-yellow-500 rounded-lg hover:bg-yellow-600">
                Reset Password
              </button>
              {user?.account_status !== "ACTIVE" ? (
                <button
                  onClick={() => activate(user?.userSlug)}
                  className="px-4 py-2 text-xs font-bold text-white uppercase bg-green-500 rounded-lg hover:bg-green-600">
                  Activate
                </button>
              ) : (
                <button
                  onClick={() => setOpenWarnModal(true)}
                  className="px-4 py-2 text-xs font-bold text-white uppercase bg-red-500 rounded-lg hover:bg-red-600">
                  Deactivate
                </button>
              )}
            </div>
          </div>

          <div>
            <WarnModal open={openResetModal} setOpen={setOpenResetModal}>
              <div>
                <p className="text-center">
                  Are you sure you want to reset this user's password?
                </p>
                <div className="mt-4 flex justify-center items-center">
                  <div>
                    <button
                      onClick={() => setOpenResetModal(false)}
                      className="px-4 py-2 text-xs font-bold border border-blue-500 text-blue-500 uppercase rounded-lg mr-5">
                      Cancel
                    </button>

                    <button
                      onClick={() => resetUserPass(user?.userSlug)}
                      className="px-4 py-2 text-xs font-bold text-white uppercase bg-red-500 rounded-lg hover:bg-red-600">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </WarnModal>
          </div>

          <div>
            <WarnModal open={openWarnModal} setOpen={setOpenWarnModal}>
              <div>
                <p className="text-center">
                  Are you sure you want to deactivate this user?
                </p>
                <div className="mt-4 flex justify-center items-center">
                  <div>
                    <button
                      onClick={() => setOpenWarnModal(false)}
                      className="px-4 py-2 text-xs font-bold border border-blue-500 text-blue-500 uppercase rounded-lg mr-5">
                      Cancel
                    </button>

                    <button
                      onClick={() => deactivate(user?.userSlug)}
                      className="px-4 py-2 text-xs font-bold text-white uppercase bg-red-500 rounded-lg hover:bg-red-600">
                      Deactivate
                    </button>
                  </div>
                </div>
              </div>
            </WarnModal>
          </div>

          <div>
            <Modal
              title="Update User"
              isOpen={isModalOpen}
              closeModal={closeModal}>
              <div>
                <EditUserForm user={user} closeModal={closeModal} />
              </div>
            </Modal>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full p-4">
              <UnderlinedTabs tabs={tabs} />
            </div>
          </div>
        </Widget>
      )}
    </>
  );
};

export default Index;
