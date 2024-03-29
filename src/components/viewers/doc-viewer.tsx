import {IProcurement} from "components/procurement/procurement.interface";
import React, {useEffect, useState} from "react";

import {getUploadedDocument} from "slices/actions/procurementActions";

const Index: React.FC<{po: IProcurement}> = ({po}) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlobData = async () => {
      try {
        const fetchedBlob: any = await getUploadedDocument(
          po?.paymentReceipt?.fileKey
        );
        setBlob(fetchedBlob.data);
        setFileType(fetchedBlob.contentType); // Assuming you can get the content type from the API
      } catch (error) {
        console.error("Error fetching Blob data:", error);
      }
    };
    if (po) {
      fetchBlobData();
    }
  }, [po]);

  if (!blob || blob === undefined) {
    return <div>No file available</div>;
  }

  // For other file types, use the DocViewer to render documents
  return (
    <div>
      <img src={`data:image/jpeg;base64,${blob}`} style={{height: "450px"}} />;
    </div>
  );
};

export default Index;
