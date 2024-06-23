export const Tag = ({ label, value }: { label?: string; value?: string | number | null }) =>
  !value ? (
    <></>
  ) : (
    <div className="inline-flex text-xs bg-slate-500 text-white py-1 px-2 rounded-md">{`${!label ? "" : `${label}: `}${value}`}</div>
  );
