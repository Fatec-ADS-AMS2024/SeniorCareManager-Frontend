import { JSX } from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  text: string;
  subText: string;
  icon: JSX.Element;
  page: string;
}

export default function Card({ text, subText, icon, page }: CardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="w-64 h-36 bg-surface rounded-lg shadow-md border border-background cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(page)}
    >
      {/* Ícone */}
      <div className="h-1/4 relative">
        <div className="flex items-center justify-center w-14 h-14 rounded-full mb-2 text-surface p-3 absolute top-3 left-3 bg-[#E0E3E0]">
          {icon}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex items-start justify-start mt-5 h-3/4 border-t p-4">
        <div className="z-10 flex flex-col text-textPrimary">
          <p className="text-lg font-medium text-left">{text}</p>
          <p className="text-sm text-left text-textSecondary">{subText}</p>
        </div>
      </div>
    </div>
  );
}
