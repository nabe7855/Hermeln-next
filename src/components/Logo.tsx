import React from "react";
import Image from "next/image";

const HermelnSmileLogo: React.FC<{ size?: number }> = ({ size = 120 }) => {
  return (
    <Image
      src="/logo2.png"  // public フォルダ直下に配置
      alt="Hermeln Logo"
      width={size}
      height={size}
      priority
    />
  );
};

export default HermelnSmileLogo;
