import {FiBox} from "react-icons/fi";
import {useAppSelector} from "store";
import Link from "next/link";

const Logo: React.FC = () => {
  const config = useAppSelector((state) => state.config);
  const {name} = config;
  return (
    <div className="uppercase font-bold text-base tracking-wider flex flex-row items-center justify-start w-full whitespace-nowrap text-white">
      <Link legacyBehavior href="/">
        <a className="flex flex-row items-center justify-start space-x-2">
          <FiBox size={28} />
          <span>{name}</span>
        </a>
      </Link>
    </div>
  );
};

export default Logo;
