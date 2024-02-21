/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Todo } from "./Todo";

interface TodosProps {
  id: number;
  title: string;
  description: string;
  done: boolean;
  userId: number;
}

interface TodosPropsSmall {
  getAllTodos: () => void;
  todos: TodosProps[] | null;
}

export const Todos = ({ getAllTodos, todos }: TodosPropsSmall) => {
  useEffect(() => {
    getAllTodos();
  }, []);

  if (!Array.isArray(todos) || todos === null) {
    return (
      <div className='flex justify-center items-center mx-[80px] mt-10 h-[300px] text-3xl'>
        No Tsodos Created
      </div>
    );
  }

  return (
    <div className='mt-10 mx-[80px] flex flex-wrap gap-5 justify-center'>
      {todos?.map((value, index) => (
        <Todo
          key={index}
          id={value.id}
          title={value.title}
          description={value.description}
          getAllTodos={getAllTodos}
        />
      ))}
    </div>
  );
};
