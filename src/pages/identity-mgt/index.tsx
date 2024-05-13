import React from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { DefaultTabs } from "components/tabs";
import IndividualTaxpayers from "./individual/individual-payer";
import NonIndividualTaxpayers from "./non-individual/non-individual-taxpayer";
import Agents from "./agent/agent";




const Index: React.FC = () => {
    const tabs = [
        {
            index: 0,
            title: "Individual Taxpayers",
            active: true,
            content: <div className="w-full py-4">
                <IndividualTaxpayers />
            </div>,
        },
        {
            index: 2,
            title: "Corporate Taxpayers",
            content: (
                <div className="w-full py-4">
                    <NonIndividualTaxpayers />
                </div>
            ),
        },
        {
            index: 3,
            title: "Agents",
            content: (
                <div className="w-full py-4">
                    <Agents />
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div className="flex justify-between">
                <h3 className="font-mono text-cyan-800 text-xl">Identity Management</h3>
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