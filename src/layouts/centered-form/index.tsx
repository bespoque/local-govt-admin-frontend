export type CenteredFormProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const Index: React.FC<CenteredFormProps> = ({title, subtitle, children}) => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 w-full max-w-xl">
      <div className="flex flex-col w-full mb-4">
        <div
          className="text-xl text-center uppercase font - bold;
">
          {title}
        </div>
        <div className="text-xs  text-center">{subtitle}</div>
      </div>
      {children}
    </div>
  );
};

export default Index;
