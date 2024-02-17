export const Icon = ({
  name,
  stroke,
  strokeWidth,
  width,
  height,
  className,
}: {
  name: "wallet" | "invalid-net";
  stroke?: string;
  strokeWidth?: string;
  width?: string;
  height?: string;
  className?: string | undefined;
}) => {
  
  const icons = {
    wallet: (
      <div className={className || ""}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-wallet"
          width={width || "24"}
          height={height || "24"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth || "1.5"}
          stroke={stroke || "#2c3e50"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
          <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
        </svg>
      </div>
    ),

    "invalid-net": (
      <div className={className || ""}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-world-off"
          width={width || "24"}
          height={height || "24"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth || "1.5"}
          stroke={stroke || "#2c3e50"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5.657 5.615a9 9 0 1 0 12.717 12.739m1.672 -2.322a9 9 0 0 0 -12.066 -12.084" />
          <path d="M3.6 9h5.4m4 0h7.4" />
          <path d="M3.6 15h11.4m4 0h1.4" />
          <path d="M11.5 3a17.001 17.001 0 0 0 -1.493 3.022m-.847 3.145c-.68 4.027 .1 8.244 2.34 11.833" />
          <path d="M12.5 3a16.982 16.982 0 0 1 2.549 8.005m-.207 3.818a16.979 16.979 0 0 1 -2.342 6.177" />
          <path d="M3 3l18 18" />
        </svg>
      </div>
    ),
  };

  return icons[name];
};
