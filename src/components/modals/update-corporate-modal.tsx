
import { localGovernments } from "components/tax-office/tax-office.interface";
import { WardsList } from "components/tax-office/wards-interface";
import React, { useEffect, useState } from "react";


interface Props {
  isModalUpdateOpen: boolean;
  singleTpayer: any;
  closeUpdateModal: () => void;
  handleUpdateSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  userData: any;

}

const UpdateCorporate: React.FC<Props> = ({
  isModalUpdateOpen,
  singleTpayer,
  closeUpdateModal,
  handleUpdateSubmit,
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
        <h2 className="text-lg font-semibold mb-4">Update Corporate Taxpayer</h2>
        <form onSubmit={handleUpdateSubmit}>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
            <div>
              <label htmlFor="companyname" className="block text-sm font-medium text-gray-700">company name:</label>
              <input
                type="text"
                id="companyname"
                name="companyname"
                defaultValue={singleTpayer?.companyname || ''}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="registeredname" className="block text-sm font-medium text-gray-700">registered name:</label>
              <input
                id="registeredname"
                type="text"
                name="registeredname"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100  rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.registeredname || ''}
              />
            </div>
            <div>
              <label htmlFor="businesstype" className="block text-sm font-medium text-gray-700">business type:</label>
              <input
                id="businesstype"
                type="text"
                name="businesstype"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.businesstype || ''}
              />
            </div>
            <div>
              <label htmlFor="rc" className="block text-sm font-medium text-gray-700">rc:</label>
              <input
                id="rc"
                type="text"
                name="rc"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block border w-full shadow-sm sm:text-sm  border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.rc || ''}
              />
            </div>
            <div>
              <label htmlFor="regno" className="block text-sm font-medium text-gray-700">Reg no:</label>
              <input
                id="regno"
                type="text"
                name="regno"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.regno || ''}
              />
            </div>
            <div>
              <label htmlFor="companytin" className="block text-sm font-medium text-gray-700">company Tin:</label>
              <input
                id="companytin"
                type="text"
                name="companytin"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.companytin || ''}
              />
            </div>
            <div>
              <label htmlFor="datecommenced" className="block text-sm font-medium text-gray-700">date commenced:</label>
              <input
                type="date"
                id="datecommenced"
                name="datecommenced"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.datecommenced || ''}
              />
            </div>
            <div>
              <label htmlFor="dateincorporated" className="block text-sm font-medium text-gray-700">date incorporated:</label>
              <input
                type="date"
                id="dateincorporated"
                name="dateincorporated"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.dateincorporated || ''}
              />
            </div>
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700">sector:</label>
              <input
                id="sector"
                type="text"
                name="sector"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 "
                defaultValue={singleTpayer?.sector || ''}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Moble Number:</label>
              <input
                id="phone"
                type="text"
                name="phone"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.phone || ''}
              />
            </div>
            <div>
              <label htmlFor="alternatephone" className="block text-sm font-medium text-gray-700">Alternate phone:</label>
              <input
                id="alternatephone"
                type="text"
                name="alternatephone"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.alternatephone || ''}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                id="email"
                type="text"
                name="email"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.email || ''}
              />
            </div>
            <div>
              <label htmlFor="houseno" className="block text-sm font-medium text-gray-700">houseno:</label>
              <input
                id="houseno"
                type="text"
                name="houseno"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.email || ''}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
              <input
                id="city"
                type="text"
                name="city"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer?.city || ''}
              />
            </div>
            <div>
              <label htmlFor="lga" className="block text-sm font-medium text-gray-700">LGA:</label>
              <input
                id="lga"
                name="lga"
                defaultValue={localGov}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward:</label>
              <select
                id="ward"
                name="ward"
                defaultValue={singleTpayer?.ward}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border bg-gray-100 rounded-md px-3 py-2 outline-none"
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

export default UpdateCorporate;
