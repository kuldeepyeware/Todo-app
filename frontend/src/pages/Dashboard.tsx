/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Create } from "../components/Create";
import { Navbar } from "../components/Navbar";
import { Todos } from "../components/Todos";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface TodosProps {
  id: number;
  title: string;
  description: string;
  done: boolean;
  userId: number;
}

interface UserProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const Dashboard = () => {
  const link = import.meta.env.VITE_APP_LINK;
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [todos, setTodos] = useState<TodosProps[] | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);

  const validUser = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("token")}`;
      if (!token) {
        navigate("/signin");
      }
      const response = await axios.post(
        `${link}api/v1/user/me`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data.validUser);
      !response.data.validUser && navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (title: string, description: string) => {
    await axios.post(
      `${link}api/v1/todo/create`,
      {
        title,
        description,
        done: false,
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setTitle("");
    setDescription("");
    getAllTodos();
  };

  const getAllTodos = async () => {
    const response = await axios.get(`${link}api/v1/todo/gettodos`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setTodos(response.data.todos);
  };

  const getUser = async () => {
    const response = await axios.get(`${link}api/v1/user/details`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUser(response.data.user);
  };

  useEffect(() => {
    validUser();
    getUser();
  }, []);

  return (
    <div>
      <Navbar user={user} />
      <Create
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
        addTodo={addTodo}
      />
      <Todos todos={todos} getAllTodos={getAllTodos} />
    </div>
  );
};
