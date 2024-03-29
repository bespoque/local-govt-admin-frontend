import SectionTitle from "components/section-title";
import RenewalVehicleLicenceForm from "components/forms/renew-vehicle-licence-form";

const Index = () => {
  return (
    <>
      <SectionTitle
        title="Vehicle Licence Renewal"
        subtitle="Create  Vehicle Licence Renewal"
      />
      <RenewalVehicleLicenceForm />
    </>
  );
};

export default Index;
