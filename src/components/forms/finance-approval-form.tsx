import React, {useState} from "react";
import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {RootState, useAppSelector} from "store";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";
import {Textarea} from "components/react-hook-form/textarea";
import {IProcurement} from "components/procurement/procurement.interface";
import {
  auditProcurement,
  financeApprove,
  uploadFile,
} from "slices/actions/procurementActions";
import {InboxOutlined} from "@ant-design/icons";
import type {UploadProps} from "antd";
import {message, Upload} from "antd";

const {Dragger} = Upload;

type FormProps = {
  auditComments: string;
};

interface IAuditPOFormProps {
  closeModal: () => void;
  po: IProcurement;
  updatePoState?: (po: IProcurement) => void;
}

const Index: React.FC<IAuditPOFormProps> = ({
  po,
  closeModal,
  updatePoState,
}) => {
  const methods = useForm<FormProps>({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const userData = useAppSelector((state: RootState) => state.auth);

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const onFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const onSubmit = async (payload: FormProps) => {
    try {
      // Check if a file is selected before submitting
      if (!selectedFile) {
        toast.error("Please select a file to upload.");
        setLoading(false);
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "PO_FINANCE");

      const {data} = await uploadFile(formData);
      if (data) {
        const res = await financeApprove({...data}, po.orderId);
        toast.success("Success");
        setLoading(false);
        updatePoState(res.data);
        closeModal();
      }
    } catch (error) {
      handleApiError(
        error,
        userData,
        "There was an error Auditing the purchasing order"
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
          <Label id="audit-comments">Upload proof of payment</Label>
          <Dragger
            maxCount={1}
            name="file"
            multiple={false}
            beforeUpload={() => false} // Prevent automatic upload
            onChange={(info) => {
              const {file, fileList} = info;
              if (file) {
                // Update selectedFile when file is chosen
                onFileChange(file as any);
              }
            }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
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
