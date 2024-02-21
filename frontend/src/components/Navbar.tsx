import { useNavigate } from "react-router-dom";

interface UserProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface NavbarProps {
  user: UserProps | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <div className='flex justify-between h-16 px-4 items-center border-b border-[#27272a] '>
      <div className='text-2xl'>Todo App</div>
      <div className='flex gap-3'>
        <div className='text-lg flex justify-center items-center'>
          Hello {user?.firstName}
        </div>
        <div className='rounded-full bg-white text-black h-10 w-10 text-center flex justify-center items-center'>
          <div
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
            }}
            className='flex justify-center items-center cursor-pointer text-lg'>
            {user?.firstName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
