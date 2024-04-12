import Layout from "layouts/centered";
import CenteredForm from "layouts/centered-form";
import Login from "components/sample-forms/login";

const Index: React.FC = () => {
  return (
    <>
      <div className="bg-cover bg-center flex items-center justify-center h-screen bg-[url('/images/herosection.png')]">
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md max-w-md w-full">
          <Login />
        </div>
      </div>
    </>
  );
};

export default Index;
