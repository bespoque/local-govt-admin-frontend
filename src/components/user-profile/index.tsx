interface InfoPair {
  label?: string;
  value?: string;
  isSeparator?: boolean;
}

interface IdPair {
  label?: string;
  value?: string;
}


interface InfoBlockProps {
  infoPairs: InfoPair[];
  datasource?: IdPair[];
}

const InfoBlock: React.FC<InfoBlockProps> = ({infoPairs, datasource}) => (
  <div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {infoPairs?.map((pair, index) => {
      if (pair.isSeparator) {
        return (
          <hr
          key={`separator-${index}`}
          className="col-span-3 border-t-1 border-gray-300 my-2"
          />
          );
        }
        
        return (
          <div key={index} className="flex flex-wrap items-start">
          <span className="font-normal w-auto mr-3">{pair.label}:</span>
          <span className="w-auto">{pair.value}</span>
        </div>
      );
    })}
  </div>

  <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
  {datasource?.map((pair, index) => {
          return (
            <div key={index} className="flex flex-wrap items-start">
              <span className="font-normal w-auto mr-3">{pair.label}:</span>
              <span className="w-auto">{pair.value}</span>
            </div>
          );
        })}
      </div>
    </div>
);

export default InfoBlock;
