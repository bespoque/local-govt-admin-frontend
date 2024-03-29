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
        {/* <img className="w-full h-full " src="/images/herosection.png" alt="svg" /> */}
        {/* <div className="items-center justify-center hidden border-r border-gray-100 dark:border-gray-800 lg:flex lg:flex-col bg-gray-50 dark:bg-gray-800">
        </div> */}
        {/* <div className="flex flex-col items-start justify-center w-full px-10  dark:bg-gray-900 lg:w-1/4 ">
          <div className="flex flex-col w-full mb-4">
            <div className=" text-lg font-light text-gray-500 uppercase">
              WELCOME BACK
            </div>
            <div className="text-sm font-bold">
              Please enter your details to continue
            </div>
          </div>
          <Login />
        </div> */}
      </div>
    </>
  );
};

export default Index;
