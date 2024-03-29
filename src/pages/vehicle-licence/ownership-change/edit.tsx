import SectionTitle from "components/section-title";
import EditChangeofVehicleOwnershipForm from "components/forms/edit-change-of-vehicle-ownership-form";
import {useRouter} from "next/router";
import {useFetchData} from "hooks/useFetcher";
import {IVehicleChangeOfOwnershipRequest} from "components/vehicle-license/interface";
import {Spin} from "antd";

const Index = () => {
  const router = useRouter();
  const vlrId = router?.query.id;

  const {data, isLoading} = useFetchData<IVehicleChangeOfOwnershipRequest>(
    `/change-ownerships/${vlrId}`
  );

  return (
    <>
      <SectionTitle
        title="Change of Vehicle Ownership"
        subtitle="Update Change of Vehicle Ownership"
      />
      <Spin spinning={isLoading} tip="loading...">
        <EditChangeofVehicleOwnershipForm

        // changeOwnership={data}
        />
      </Spin>
    </>
  );
};

export default Index;
