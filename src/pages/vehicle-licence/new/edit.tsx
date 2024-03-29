import SectionTitle from "components/section-title";
import EditVehicleLicenseForm from "components/forms/edit-vehicle-license-form";
import {useRouter} from "next/router";
import {useFetchData} from "hooks/useFetcher";
import {IVehicleLicenceRequest} from "components/vehicle-license/interface";
import {Spin} from "antd";

const Index = () => {
  const router = useRouter();
  const vlrId = router?.query.id;

  const {data, isLoading} = useFetchData<IVehicleLicenceRequest>(
    `/vehicle-licence-requests/${vlrId}`
  );

  return (
    <>
      <SectionTitle
        title="New Vehicle Licence"
        subtitle="Update New Vehicle Licence"
      />
      <Spin spinning={isLoading} tip="loading...">
        <EditVehicleLicenseForm vlr={data} />
      </Spin>
    </>
  );
};

export default Index;
