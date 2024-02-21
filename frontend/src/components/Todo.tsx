import axios from "axios";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { MdOutlineSave } from "react-icons/md";

interface TodoProps {
  id: number;
  title: string;
  description: string;
  getAllTodos: () => void;
}

export const Todo = ({ id, title, description, getAllTodos }: TodoProps) => {
  const link = import.meta.env.VITE_APP_LINK;

  const [editable, setEditable] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  const handleInputChangeTitle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdateTitle(event.target.value);
  };

  const handleInputChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdateDescription(event.target.value);
  };

  return (
    <div className='w-[400px] h-[200px] p-2 rounded-md border border-[#27272a] '>
      <div className='flex justify-end gap-2 border-b border-[#27272a] pb-2'>
        {!editable && (
          <BiEdit
            className='text-3xl cursor-pointer'
            onClick={() => {
              setEditable(true);
              setUpdateTitle(title);
              setUpdateDescription(description);
            }}
          />
        )}
        {editable && (
          <MdOutlineSave
            className='text-3xl cursor-pointer'
            onClick={async () => {
              await axios.put(
                `${link}api/v1/todo/update`,
                { data: { id, updateTitle, updateDescription } },
                {
                  headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setUpdateTitle("");
              setUpdateDescription("");
              setEditable(false);
              getAllTodos();
            }}
          />
        )}
        <MdDelete
          className='text-3xl cursor-pointer'
          onClick={async () => {
            await axios.delete(`${link}api/v1/todo/delete`, {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              data: { id },
            });
            getAllTodos();
          }}
        />
      </div>
      {editable ? (
        <>
          <input
            value={editable ? updateTitle : title}
            className='text-2xl text-wrap w-full px-2 py-1 text-white outline-none bg-black'
            type='text'
            onChange={handleInputChangeTitle}
          />
          <input
            type='text'
            className='text-lg text-wrap w-full overflow-auto px-2 text-white outline-none bg-black '
            value={editable ? updateDescription : description}
            onChange={handleInputChangeDescription}
          />
        </>
      ) : (
        <>
          <input
            value={title}
            disabled
            className='text-2xl text-wrap w-full px-2 py-1 text-white outline-none bg-black'
            type='text'
          />
          <input
            type='text'
            disabled
            className='text-lg text-wrap w-full overflow-auto px-2 text-white outline-none bg-black '
            value={description}
          />
        </>
      )}
    </div>
  );
};
