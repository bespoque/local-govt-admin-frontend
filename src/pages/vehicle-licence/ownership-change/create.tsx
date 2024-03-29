import SectionTitle from "components/section-title";
import CreateChangeOfVehicleOwnershipForm from "components/forms/create-change-of-vehicle-ownership-form";

const Index = () => {
  return (
    <>
      <SectionTitle
        title="Change of Vehicle Ownership"
        subtitle="Create Change of Vehicle Ownership"
      />
      <CreateChangeOfVehicleOwnershipForm />
    </>
  );
};

export default Index;
