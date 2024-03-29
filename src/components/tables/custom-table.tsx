interface TableProps {
  fields: Array<{
    name: string;
    key: string;
  }>;
  tableData: Array<unknown>;
  showTotal?: boolean;
}

const Table: React.FC<TableProps> = ({fields, tableData, showTotal = true}) => {
  const sumTotal =
    tableData
      ?.map((tb: any) => tb?.totalProcuredPrice)
      .reduce((prev, cur) => prev + cur, 0) || null;
  return (
    <div>
      <table className="w-full text-left table-auto no-border striped">
        <thead>
          <tr>
            {fields.map((field, i) => (
              <th
                key={i}
                className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((dataRow: any, i) => (
            <tr key={i} className="odd:bg-gray-100 dark:odd:bg-gray-800">
              {fields.map((field: any, j) => (
                <td
                  key={j}
                  className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                  <td>
                    <span>
                      {Array.isArray(dataRow[field?.key])
                        ? dataRow[field?.key].join(", ")
                        : dataRow[field?.key]}
                    </span>
                  </td>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sumTotal && showTotal && (
        <div className=" text-right p-2 font-semibold">Total: {sumTotal}</div>
      )}
    </div>
  );
};

export default Table;
