
import { localGovernments } from "components/tax-office/tax-office.interface";
import { WardsList } from "components/tax-office/wards-interface";
import React, { useEffect, useState } from "react";


interface Props {
  isModalUpdateOpen: boolean;
  singleTpayer: any;
  closeUpdateModal: () => void;
  handleUpdateAgent: (event: React.FormEvent<HTMLFormElement>) => void;
  userData: any;
}

const UpdateAgentModal: React.FC<Props> = ({
  isModalUpdateOpen,
  singleTpayer,
  closeUpdateModal,
  handleUpdateAgent,
  userData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localGov, setLocalGov] = useState('');
  const [filteredWards, setFilteredWards] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {

    const wardsForUserLga = WardsList.filter((ward) => ward.lga_id === userData?.taxOffice?.id);

    const getLGANameById = (id: string): string | undefined => {
      const lga = localGovernments.find((lga) => lga.id === id);
      return lga ? lga.name : undefined;
    };
    const lgaName = getLGANameById(singleTpayer?.client);
    setLocalGov(lgaName)
    setFilteredWards(wardsForUserLga);
  }, [userData?.taxOffice?.id, singleTpayer?.client]);




  if (!isModalUpdateOpen) return null;
  return (
    <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-4/6">
      <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
        <h2 className="text-lg font-semibold mb-4">Update Agent</h2>
        <form onSubmit={handleUpdateAgent}>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">first name:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                defaultValue={singleTpayer?.firstname || ''}
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">last name:</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                defaultValue={singleTpayer?.lastname || ''}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">email:</label>
              <input
                id="email"
                type="text"
                name="email"
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                defaultValue={singleTpayer?.email || ''}
              />
            </div>
            <div>
              <label htmlFor="bank" className="block text-sm font-medium text-gray-700">bank:</label>
              <input
                id="bank"
                type="text"
                name="bank"
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                defaultValue={singleTpayer?.bank || ''}
              />
            </div>
            <div>
              <label htmlFor="account_no" className="block text-sm font-medium text-gray-700">account no:</label>
              <input
                id="account_no"
                type="text"
                name="account_no"
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                defaultValue={singleTpayer?.account_no || ''}
              />
            </div>
            <div>
              <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">bvn:</label>
              <input
                id="bvn"
                type="text"
                name="bvn"
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                defaultValue={singleTpayer?.bvn || ''}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                defaultValue={singleTpayer?.phone || ''}
              />
            </div>
            <div>
              <label htmlFor="lga" className="block text-sm font-medium text-gray-700">LGA:</label>
              <input
                id="lga"
                name="lga"
                defaultValue={localGov}
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward:</label>
              <select
                id="ward"
                name="ward"
                defaultValue={singleTpayer?.ward}
                className="px-4 py-2 border border-cyan-900 rounded-md w-full shadow-md focus:outline-none focus:border-blue-500"
              >
                <option value={singleTpayer?.ward}>Select Ward</option>
                {filteredWards.map((ward) => (
                  <option key={ward.id} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-cyan-800 text-white rounded-md shadow-md focus:outline-none hover:bg-cyan-700">
              {isSubmitting ? 'Submitting...' : 'Update'}
            </button>
            <button onClick={closeUpdateModal} className="ml-2 px-4 py-2 border border-cyan-800 rounded-md shadow-md focus:outline-none hover:bg-gray-100">Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAgentModal;
