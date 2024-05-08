
import React, { useEffect, useState } from "react";


interface Props {
  isModalUpdateOpen: boolean;
  singleTpayer: any;
  closeUpdateModal: () => void;
  handleUpdateSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

}

const UpdateIndividual: React.FC<Props> = ({
  isModalUpdateOpen,
  singleTpayer,
  closeUpdateModal,
  handleUpdateSubmit

}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);


  if (!isModalUpdateOpen) return null;
  return (
    <div className="fixed z-50 top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-4/6">
      <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
        <form onSubmit={handleUpdateSubmit}>
          <h2 className="text-lg font-semibold mb-4">Update Individual Taxpayer</h2>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto h-96 p-2" style={{ scrollbarWidth: 'thin' }}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
              <select
                id="title"
                name="title"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border  rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.title || ''}
              >
                <option value="">Please select</option>
                <option value="mrs">Mrs</option>
                <option value="mr">Mr</option>
                <option value="mss">Miss</option>
              </select>
            </div>
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Firstname:</label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border-cyan-800 border  rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.firstname || ''}
              />
            </div>
            <div>
              <label htmlFor="middlename" className="block text-sm font-medium text-gray-700">Middlename:</label>
              <input
                id="middlename"
                type="text"
                name="middlename"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.middlename || ''}
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname:</label>
              <input
                id="surname"
                type="text"
                name="surname"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block border w-full shadow-sm sm:text-sm  border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.surname || ''}
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input
                id="dob"
                type="date"
                name="dob"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.dob || ''}
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender:</label>
              <select
                id="gender"
                name="gender"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.gender || ''}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="maritalstatus" className="block text-sm font-medium text-gray-700">Marital status:</label>
              <select
                id="maritalstatus"
                name="maritalstatus"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 "
                defaultValue={singleTpayer.maritalstatus || ''}
              >
                <option value="">Select</option>
                <option value="married">Married</option>
                <option value="single">Single</option>
              </select>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.email || ''}
              />
            </div>
            <div>
              <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Moble Number:</label>
              <input
                id="phonenumber"
                type="text"
                name="phonenumber"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.phonenumber || ''}
              />
            </div>
            <div>
              <label htmlFor="phonenumber2" className="block text-sm font-medium text-gray-700">Home Number:</label>
              <input
                id="phonenumber2"
                type="text"
                name="phonenumber2"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.phonenumber2 || ''}
              />
            </div>
            <div>
              <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">BVN:</label>
              <input
                id="bvn"
                type="text"
                name="bvn"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.bvn || ''}
              />
            </div>
            <div>
              <label htmlFor="mothersname" className="block text-sm font-medium text-gray-700">Mother's Surname:</label>
              <input
                id="mothersname"
                type="text"
                name="mothersname"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.mothersname || ''}
              />
            </div>
            <div>
              <label htmlFor="lga" className="block text-sm font-medium text-gray-700">LGA:</label>
              <select
                id="lga"
                name="lga"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 "
                value={'OMALA'}
              >
                <option value="OMALA">Select</option>

                <option value={singleTpayer.lga}>
                  {singleTpayer.lga}
                </option>

              </select>
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward:</label>
              <select
                id="ward"
                name="ward"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                value={ 'ECHA'}
              >
                <option value="">Select Ward</option>
                <option value={"ECHA"}>
                  {singleTpayer.ward}
                </option>

              </select>
            </div>
            <div>
              <label htmlFor="stateofresidence" className="block text-sm font-medium text-gray-700">State of Residence:</label>
              <input
                id="stateofresidence"
                type="text"
                name="stateofresidence"
                defaultValue={"Kogi"}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label htmlFor="stateoforigin" className="block text-sm font-medium text-gray-700">State of Origin:</label>
              <input
                id="stateoforigin"
                type="text"
                name="stateoforigin"
                defaultValue={"Kogi"}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label htmlFor="birthplace" className="block text-sm font-medium text-gray-700">Birth Place:</label>
              <input
                id="birthplace"
                type="text"
                name="birthplace"
                defaultValue={"Kogi"}

                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation:</label>
              <input
                id="occupation"
                type="text"
                name="occupation"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.occupation || '' }
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">city:</label>
              <input
                id="city"
                type="text"
                name="city"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.city || ''}
              />
            </div>

            <div>
              <label htmlFor="housestreet" className="block text-sm font-medium text-gray-700">housestreet:</label>
              <input
                id="housestreet"
                type="text"
                name="housestreet"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.housestreet || ''}
              />
            </div>
            <div>
              <label htmlFor="houseno" className="block text-sm font-medium text-gray-700">houseno:</label>
              <input
                id="houseno"
                type="text"
                name="houseno"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.houseno || ''}
              />
            </div>
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality:</label>
              <input
                id="nationality"
                type="text"
                name="nationality"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-cyan-800 border rounded-md px-3 py-2 outline-none"
                defaultValue={singleTpayer.nationality || ''}
              />
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

export default UpdateIndividual;
