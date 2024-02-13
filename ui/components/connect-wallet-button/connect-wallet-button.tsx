import { Icons } from "../utils/utility";

export const ConnectWalletButton = ({
  text,
  onClickHandler
}: {
  text: string;
  onClickHandler: () => void;
}) => {
  return (
    <button
      onClick={onClickHandler}
      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
    >
      <Icons.Wallet stroke="rgba(255, 255, 255, 0.5)" />
      <span className="hidden xs:block ml-2">{text}</span>
    </button>
  );
};