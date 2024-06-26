import Widget1 from "components/dashboard/widget-1";
import Section from "components/dashboard/section";
import SectionTitle from "components/dashboard/section-title";
import {FiActivity, FiUsers, FiExternalLink, FiClock} from "react-icons/fi";
import Bar1 from "components/dashboard/bar-chart";
import {Donut1} from "components/dashboard/donut-chart";
import {Line1} from "components/dashboard/line-chart";
import Dropdown1 from "components/widgets/dropdown-1";
import Markets from "components/dashboard/markets";
import {List} from "components/dashboard/list";
import Tasks from "components/tasks";
import {Timeline1} from "components/timelines";
import Notification from "components/dashboard/notification";
import tasks from "constants/tasks.json";

const Index: React.FC = () => {
  return (
    <>
      <SectionTitle title="dashboard" subtitle="Dashboard" />
      {/* <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Users"
            description={588}
            right={
              <FiUsers size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Sessions"
            description={435}
            right={
              <FiActivity size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Bounce rate"
            description="40.5%"
            right={
              <FiExternalLink
                size={24}
                className="text-gray-500 stroke-current"
              />
            }
          />
        </div>
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Session duration"
            description="1m 24s"
            right={
              <FiClock size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
      </div>
      <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-2/3">
          <Section
            title="Conversions"
            description={<span>This year</span>}
            right={<Dropdown1 />}>
            <div className="flex flex-row w-full">
              <Bar1 />
            </div>
          </Section>
        </div>
        <div className="w-full lg:w-1/3">
          <Section
            title="Sessions"
            description={<span>By device</span>}
            right={<Dropdown1 />}>
            <div className="flex flex-row w-full">
              <Donut1 />
            </div>
          </Section>
        </div>
      </div>
      <div className="w-full mb-2 lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <Section
          title="Users"
          description={<span>Most important markets</span>}>
          <div className="flex flex-col w-full">
            <div className="overflow-x-scroll lg:overflow-hidden">
              <Markets />
            </div>
          </div>
        </Section>
      </div>
      <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/2">
          <Section
            title="Project status"
            description={<span>This week</span>}
            right={<Dropdown1 />}>
            <div className="flex flex-row w-full">
              <List />
            </div>
          </Section>
        </div>
        <div className="w-full lg:w-1/2">
          <Section
            title="Sales"
            description={<span>This month</span>}
            right={<Dropdown1 />}>
            <div className="flex flex-row w-full">
              <Line1 />
            </div>
          </Section>
        </div>
      </div>
      <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/3">
          <Section
            title="Activities"
            description={<span>Today</span>}
            right={<Dropdown1 />}>
            <div className="flex flex-row w-full">
              <Timeline1 />
            </div>
          </Section>
        </div>
        <div className="w-full lg:w-2/3">
          <Section
            title="To do"
            description={<span>In progress</span>}
            right={<Dropdown1 />}>
            <div className="flex flex-row w-full">
              <Tasks items={tasks} />
            </div>
          </Section>
        </div>
      </div> */}
    </>
  );
};
export default Index;
