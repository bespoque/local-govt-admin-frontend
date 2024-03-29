import {FiPlus} from "react-icons/fi";

export type SectionTitleProps = {
  title: string;
  subtitle: string;
};
const SectionTitle: React.FC<SectionTitleProps> = ({title, subtitle}) => {
  return (
    <div className="w-full mb-6 pt-3">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="text-xs font-light text-gray-500 uppercase">
            {title}
          </div>
          <div className="text-xl font-bold">{subtitle}</div>
        </div>
      </div>
    </div>
  );
};

export default SectionTitle;
