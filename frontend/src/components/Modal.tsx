import { ReactNode } from "react";

interface ModelComponentProps {
  children: ReactNode;
}

export const Modal: React.FC<ModelComponentProps> = ({ children }) => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='w-[400px] rounded-lg border border-[#27272a] flex justify-center flex-col items-center gap-4 py-6'>
        {children}
      </div>
    </div>
  );
};
