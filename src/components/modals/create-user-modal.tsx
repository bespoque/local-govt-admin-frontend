import { localGovernments } from "components/tax-office/tax-office.interface";
import { Role } from "components/user/user.interface";
import { handleApiError } from "helpers/errors";
import React, { useEffect, useState } from "react";
import { fetchLocalGvts } from "slices/actions/userActions";
import { RootState, useAppSelector } from "store";

interface Groups {
  id: string;
  role: string;
  clientid: string;
}

interface LGA {
  id: string;
  name: string;
}

interface UserModalProps {
  usergroups: Groups[];
  handleModalInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddRecord: () => void;
  handleToggleDropdown: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  usergroups,
  handleModalInputChange,
  handleAddRecord,
  handleToggleDropdown
}) => {
  const filteredUserGroups = usergroups.filter(group => group.role !== '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [localGovts, setLGAs] = useState<LGA[]>([]);
  const [filteredLGAs, setFilteredLGAs] = useState<{ id: string; name: string }[]>([]);
  const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });
  const userData = useAppSelector((state: RootState) => state.auth);
  const userRoles = userData.roles
    .map((usr) => usr.role);
  const isSuperAdmin = userRoles.some((userRole) =>
    [
      Role.ADMIN,
    ].includes(userRole)
  )
  
  const filteredLGA = localGovernments.filter((lga) => lga.id === userData?.taxOffice?.id);
  useEffect(() => {
    // setFilteredLGAs(filteredLGA);
    const fetchLGAs = async () => {
      try {
        if (isSuperAdmin) {
          const response = await fetchLocalGvts({ sort: "ALL" });
          setLGAs(response.data.lgas);
        } else {
          setLGAs(filteredLGA)
        }
      } catch (error) {
        handleApiError('Error fetching LGAs:', error);
      }
    }
    fetchLGAs()
  }, [isSuperAdmin, filteredLGA]);

  

  const handleLGASelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lgaId = e.target.value;
    const lgaName = localGovts.find((lga) => lga.id === lgaId)?.name || '';
    setSelectedLGA({ id: lgaId, name: lgaName });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    const phoneNumberError = numericValue.length > 11 ? 'Phone number cannot exceed 11 digits' : '';
    setPhoneNumber(numericValue);
    setPhoneNumberError(phoneNumberError);
    handleModalInputChange(e);
  };



  return (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-2/6">
      <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
        <form>
          <div>
            <h2 className="text-lg font-semibold mb-4">Add User</h2>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              onChange={handleModalInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              onChange={handleModalInputChange}
            />
            <select
              name="groupid"
              id="groupid"
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
              onChange={handleModalInputChange}
            >
              <option value="">Select Group</option>
              {filteredUserGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.role}
                </option>
              ))}
            </select>
            <select
              id="lga"
              name="lga"
              onChange={(e) => {
                handleLGASelection(e);
                handleModalInputChange(e);
              }}
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
            >
              <option value="">Select LGA</option>
              {localGovts.map((lga) => (
                <option key={lga.id} value={lga.id}>
                  {lga.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={phoneNumber}
              className={`border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full ${phoneNumberError ? 'border-red-500' : ''}`}
              onChange={handlePhoneNumberChange}
            />
            {phoneNumberError && <p className="text-red-500">{phoneNumberError}</p>}
            <input
              type="text"
              id="status"
              name="status"
              placeholder="Status"
              value="Active"
              readOnly
              className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full"
            // onChange={handleModalInputChange}
            />
          </div>

        </form>
        <div className="flex justify-evenly mt-4">
          <button onClick={handleAddRecord} className="bg-cyan-900 text-white px-4 py-2 rounded-md">
            Add User
          </button>
          <button onClick={handleToggleDropdown} className=" text-gray-600 hover:bg-blue-100 px-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
};

export default UserModal;
