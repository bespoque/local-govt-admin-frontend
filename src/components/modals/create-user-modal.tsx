import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { localGovernments } from "components/tax-office/tax-office.interface";
import { Role } from "components/user/user.interface";
import { handleApiError } from "helpers/errors";
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
  handleModalInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddRecord: () => void;
  handleToggleDropdown: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  usergroups,
  handleModalInputChange,
  handleAddRecord,
  handleToggleDropdown
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [localGovts, setLGAs] = useState<LGA[]>([]);
  const [selectedLGA, setSelectedLGA] = useState<{ id: string; name: string }>({ id: '', name: '' });

  const userData = useAppSelector((state: RootState) => state.auth);
  const userRoles = useMemo(() => userData.roles.map((usr) => usr.role), [userData.roles]);
  const isSuperAdmin = useMemo(() => userRoles.includes(Role.SUPERADMIN), [userRoles]);

  useEffect(() => {
    const fetchLGAs = async () => {
      try {
        const response = isSuperAdmin
          ? await fetchLocalGvts({ sort: "ALL" })
          : { data: { lgas: localGovernments.filter(lga => lga.id === userData?.taxOffice?.id) } };

        setLGAs(response.data.lgas);
      } catch (error) {
        handleApiError('Error fetching LGAs:', error);
      }
    };

    fetchLGAs();
  }, [isSuperAdmin, userData.taxOffice?.id]);

  const handleLGASelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const lgaId = e.target.value;
    const lgaName = localGovts.find((lga) => lga.id === lgaId)?.name || '';
    setSelectedLGA({ id: lgaId, name: lgaName });
    handleModalInputChange(e);
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setPhoneNumber(numericValue);
    setPhoneNumberError(numericValue.length > 11 ? 'Phone number cannot exceed 11 digits' : '');
    handleModalInputChange(e);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 flex flex-col items-end justify-start h-screen w-2/6">
      <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-center">
        <form>
          <h2 className="text-lg font-semibold mb-4">Add User</h2>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full shadow-md focus:border-blue-500"
            onChange={handleModalInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full shadow-md focus:border-blue-500"
            onChange={handleModalInputChange}
          />
          <select
            name="groupid"
            className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full shadow-md focus:border-blue-500 "
            onChange={handleModalInputChange}
          >
            <option value="">Select Group</option>
            {usergroups
              .filter(group => group.role !== '')
              .map(group => (
                <option key={group.id} value={group.id}>
                  {group.role}
                </option>
              ))}
          </select>
          <select
            name="lga"
            className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full shadow-md focus:border-blue-500"
            onChange={handleLGASelection}
          >
            <option value="">Select LGA</option>
            {localGovts.map(lga => (
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
            className={`border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full shadow-md focus:border-blue-500 ${phoneNumberError ? 'border-red-500' : ''}`}
            onChange={handlePhoneNumberChange}
          />
          {phoneNumberError && <p className="text-red-500">{phoneNumberError}</p>}
          <input
            type="text"
            name="status"
            value="Active"
            readOnly
            className="border rounded-md px-2 py-3 bg-gray-100 mb-2 w-full shadow-md focus:border-blue-500"
          />
        </form>
        <div className="flex justify-evenly mt-4">
          <button onClick={handleAddRecord} className="bg-cyan-900 text-white px-4 py-2 rounded-md">
            Add User
          </button>
          <button onClick={handleToggleDropdown} className="text-gray-600 hover:bg-blue-100 px-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
