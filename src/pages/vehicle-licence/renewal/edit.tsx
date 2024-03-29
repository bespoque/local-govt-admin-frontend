import SectionTitle from "components/section-title";
import EditVehicleLicenseRenewalForm from "components/forms/edit-renew-vehicle-licence-request-form";
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
        title="Renewal Vehicle Licence"
        subtitle="Update Renewal Vehicle Licence"
      />
      <Spin spinning={isLoading} tip="loading...">
        <EditVehicleLicenseRenewalForm vlr={data} />
      </Spin>
    </>
  );
};

export default Index;
