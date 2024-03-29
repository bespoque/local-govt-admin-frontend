import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {useState} from "react";
import {RootState, useAppSelector} from "store";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";

import {Textarea} from "components/react-hook-form/textarea";
import {auditStockIn} from "slices/actions/stockInActions";
import {IStockIn} from "components/stock-in/stock-in.interfaces";

type FormProps = {
  auditComments: string;
};

interface IAuditStockInFormProps {
  closeModal: () => void;
  stockIn: IStockIn;
  updateStockInState?: (stockIn: IStockIn) => void;
}

const Index: React.FC<IAuditStockInFormProps> = ({
  stockIn,
  closeModal,
  updateStockInState,
}) => {
  const methods = useForm<FormProps>({});
  const [loading, setLoading] = useState(false);
  const userData = useAppSelector((state: RootState) => state.auth);

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const onSubmit = async (payload: FormProps) => {
    try {
      setLoading(true);
      const {data} = await auditStockIn({...payload}, stockIn.stockInOrderId);
      toast.success("Stock In has been Audited successfully!");
      updateStockInState?.(data);
      closeModal();
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error Auditing the Stock In"
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-12"></div>
        </div>
        <InputWrapper outerClassName="sm:col-span-4">
          <Label id="audit-comments">Audit Comments</Label>
          <Textarea id="audit-comments" name="auditComments" />
        </InputWrapper>

        <div className="flex justify-start space-x-2">
          <button
            onClick={() => {
              reset();
              closeModal();
            }}
            type="button"
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button
            type="submit"
            className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "disabled:opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}>
            {loading ? (
              <ThreeDots
                height="30"
                width="30"
                radius="5"
                color="white"
                wrapperClass="button-container-spinner"
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
export default Index;
