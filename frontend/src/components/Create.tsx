interface CreateProps {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addTodo: (title: string, description: string) => void;
}

export const Create = ({
  title,
  description,
  addTodo,
  setTitle,
  setDescription,
}: CreateProps) => {
  type EventType = React.ChangeEvent<HTMLInputElement>;
  return (
    <div className='flex justify-center items-center gap-4 flex-col mt-[50px]'>
      <div className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Enter Todo Title'
          name='Title'
          value={title}
          onChange={(e: EventType) => setTitle(e.target.value)}
          className='w-[300px] h-10 p-2 rounded-md placeholder-[#707070] outline-none bg-black text-white border border-[#27272a]'
        />
        <input
          type='text'
          placeholder='Enter Todo Description'
          name='Description'
          value={description}
          onChange={(e: EventType) => setDescription(e.target.value)}
          className='p-2 h-10 w-[300px] rounded-md placeholder-[#707070] bg-black outline-none text-white border border-[#27272a]'
        />
      </div>
      <button
        onClick={() => addTodo(title, description)}
        className='bg-white text-black h-9 font-medium py-2 px-4 rounded-md cursor-pointer flex justify-center'>
        Add Todo
      </button>
    </div>
  );
};
