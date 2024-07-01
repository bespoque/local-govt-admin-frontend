
import React, { useCallback, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { DefaultTabs } from "components/tabs";
import AllRevHead from "./revenue-head-mapping/allrevhead";
import WardCat from "./revenue-head-mapping/ward-cat";
import RevHeadModal from "components/modals/create-rev-head-modal";
import AddRevCatModal from "components/modals/create-cat-modal";
import AddItemModal from "components/modals/create-item-modal";

type AddRecordType = "head" | "cat" | "item";

const Index: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<AddRecordType | null>(null);
    const tabs = [
        {
            index: 0,
            title: "All Revenue Heads",
            active: true,
            content: <div className="w-full py-4">
                <AllRevHead />
            </div>,
        },
        {
            index: 2,
            title: "Wards Categorization",
            content: (
                <div className="w-full py-4">
                    <WardCat />
                </div>
            ),
        },
    ];

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
        setSelectedType(null);

    };

    const handleSelectType = (type: AddRecordType) => {
        setSelectedType(type);
        setIsOpen(false);
    };

    return (
        <React.Fragment>
            <div className="flex justify-between">
                <h3 className="font-mono text-cyan-800 text-xl">Revenue Chart</h3>
                <div>
                    <button
                        onClick={handleToggleDropdown}
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-xs text-white rounded bg-cyan-900 focus:outline-none"
                        id="options-menu"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                    >
                        Add Record
                    </button>
                </div>
            </div>

            <div className=" inline-block text-left">

                {isOpen && (
                    <div
                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <div className="py-1" role="none">
                            <button
                                onClick={() => handleSelectType("head")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                role="menuitem"
                            >
                                Add Revenue Head
                            </button>
                            <button
                                onClick={() => handleSelectType("cat")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                role="menuitem"
                            >
                                Add Revenue Categories
                            </button>
                            <button
                                onClick={() => handleSelectType("item")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                role="menuitem"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                )}

                {selectedType === "head" && <RevHeadModal
                    handleToggleDropdown={handleToggleDropdown}
                />}
                {selectedType === "cat" && <AddRevCatModal
                    handleToggleDropdown={handleToggleDropdown}
                />}
                {selectedType === "item" && <AddItemModal
                    handleToggleDropdown={handleToggleDropdown}
                />}
            </div>

            <div className="flex flex-wrap">
                <div className="w-full p-4">
                    <DefaultTabs tabs={tabs} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Index;
