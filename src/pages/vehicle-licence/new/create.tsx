import SectionTitle from "components/section-title";
import CreateVehicleLicenceForm from "components/forms/create-vehicle-license-form";

const Index = () => {
  return (
    <>
      <SectionTitle
        title="New Vehicle Licence"
        subtitle="Create New Vehicle Licence"
      />
      <CreateVehicleLicenceForm />
    </>
  );
};

export default Index;
