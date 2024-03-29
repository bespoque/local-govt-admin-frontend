import React, {useEffect, useState} from "react";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {RootState, useAppSelector} from "store";
import {toast} from "react-toastify";
import {ThreeDots} from "react-loader-spinner";
import {handleApiError} from "helpers/errors";
import {
  getUploadedDocument,
  uploadFile,
} from "slices/actions/procurementActions";
import {PlusOutlined} from "@ant-design/icons";
import type {UploadFile, UploadProps} from "antd";
import {Modal, Select, Upload} from "antd";
import {IVehicleLicence} from "components/vehicle-license/interface";
import {RcFile} from "antd/es/upload";
import {renewalDocToUpload} from "components/vehicle-license/constants";
import {addVLDocuments} from "slices/actions/vehicleLicense";
import RoundSpinner from "components/spinners/roundSpinner";

const {Option} = Select;

interface IUploadVehicleLicenceDocsForm {
  closeModal: () => void;
  vehicleLicence: IVehicleLicence;
  vlrId: string;
}

const Index: React.FC<IUploadVehicleLicenceDocsForm> = ({
  closeModal,
  vehicleLicence,
  vlrId,
}) => {
  const [docUploading, setDocUploading] = useState(false);
  const [fetchingDoc, setFetchingDoc] = useState(false);
  const userData = useAppSelector((state: RootState) => state.auth);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState(
    vehicleLicence?.documents || []
  );

  const [previewTitle, setPreviewTitle] = useState("");
  const [documentTypeToUpload, setDocumentTypeToUpload] = useState(
    renewalDocToUpload[0].value
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file) return;
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(
      file.name || file.url?.substring(file.url?.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({fileList: newFileList}) => {
    handlePreview(newFileList[0]);
    setFileList(newFileList);
  };

  const handleDocumentChange = (val) => {
    setFileList([]);
    setPreviewImage("");
    setPreviewTitle("");
    setDocumentTypeToUpload(val);
  };

  const uploadHandler = async () => {
    setDocUploading(true);
    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);
    formData.append("type", documentTypeToUpload);

    if (
      documentTypeToUpload &&
      uploadedDocuments?.some(
        (uploadedType) => uploadedType?.fileType === documentTypeToUpload
      )
    ) {
      const documents = uploadedDocuments.filter(
        (doc) => doc.fileType !== documentTypeToUpload
      );
      const {data} = await uploadFile(formData);
      const newId = data.documentId;
      const updatedDocuments = [
        ...documents,
        {id: newId, fileType: documentTypeToUpload},
      ];

      addVLDocuments(
        {documents: updatedDocuments.map((doc) => doc.id)},
        vlrId,
        vehicleLicence.id
      ).then((res) => {
        const docs = res.data.vehicles.filter(
          (veh) => veh?.vehicleLicence?.id === vehicleLicence.id
        );

        setUploadedDocuments(docs[0]?.vehicleLicence?.documents);
        setDocUploading(false);
        toast.success(`${documentTypeToUpload} updated successfully`);
      });
    } else {
      const {data} = await uploadFile(formData);
      const newId = data.documentId;

      const uploaded = [
        ...uploadedDocuments,
        {id: newId, fileType: documentTypeToUpload},
      ];

      addVLDocuments(
        {documents: uploaded.map((up) => up.id)},
        vlrId,
        vehicleLicence.id
      ).then((res) => {
        const docs = res.data.vehicles.filter(
          (veh) => veh?.vehicleLicence?.id === vehicleLicence.id
        );
        setUploadedDocuments(docs[0]?.vehicleLicence?.documents);
        setDocUploading(false);
        toast.success(`${documentTypeToUpload} uploaded successfully`);
      });
    }
  };

  useEffect(() => {
    const file = uploadedDocuments?.filter(
      (vlr) => vlr.fileType === documentTypeToUpload
    );

    if (!file || file?.length === 0) return;
    setFetchingDoc(true);

    getUploadedDocument(file[0]?.fileKey)
      .then((res) => {
        setFetchingDoc(false);
        setPreviewImage(`data:image/jpeg;base64,${res.data}`);
        setPreviewTitle(documentTypeToUpload);
      })
      .catch((err) => {
        setFetchingDoc(false);
        handleApiError(err, userData, "There was an error fetching document");
      });
  }, [documentTypeToUpload]);
  const shouldDisableButton =
    docUploading || fetchingDoc || fileList.length === 0;

  return (
    <>
      <div className="flex  justify-around items-center">
        <InputWrapper outerClassName="">
          <Label id="phone">Select Document</Label>
          <Select
            defaultValue={renewalDocToUpload[0]}
            loading={false}
            onChange={handleDocumentChange}
            style={{width: "300px"}}>
            {renewalDocToUpload.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </InputWrapper>
        {fetchingDoc ? (
          <RoundSpinner />
        ) : previewImage ? (
          <button
            onClick={() => {
              setPreviewOpen(true);
            }}
            className="px-2 py-2 text-xs font-semibold text-green-500 uppercase">
            Preview
          </button>
        ) : (
          "No file to preview"
        )}

        <div>
          <Upload
            listType="picture-card"
            onRemove={() => setPreviewImage("")}
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}>
            {fileList.length >= 1 ? null : <PlusOutlined />}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            onCancel={handleCancel}
            onOk={handleCancel}>
            <img alt="doc" style={{width: "100%"}} src={previewImage} />
          </Modal>
        </div>

        <button
          onClick={uploadHandler}
          type="button"
          className={`inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-green-500 border border-transparent shadow-sm rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            shouldDisableButton ? "disabled:opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={shouldDisableButton}>
          {docUploading ? (
            <ThreeDots
              height="30"
              width="30"
              radius="5"
              color="white"
              wrapperClass="button-container-spinner"
            />
          ) : (
            "Upload"
          )}
        </button>
      </div>

      <div className="flex justify-start space-x-2">
        <button
          onClick={() => {
            closeModal();
          }}
          type="button"
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Close
        </button>
      </div>
    </>
  );
};

export default Index;
