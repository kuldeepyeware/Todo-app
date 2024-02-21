import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface CreateTodoProps {
  title: string;
  description: string;
  done: boolean;
  userId: number;
}

interface UpdateTodoProps {
  id: number;
  updateTitle?: string;
  updateDescription?: string;
}

export const createUser = async (request: CreateUserProps) => {
  const { firstName, lastName, email, password } = request;
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const findUser = async (email: string, password?: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const validUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const createTodo = async (request: CreateTodoProps) => {
  const { title, description, done, userId } = request;
  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        done,
        userId,
      },
    });
    return todo;
  } catch (error) {
    throw error;
  }
};

export const updateTodo = async (request: UpdateTodoProps) => {
  const { id, updateTitle, updateDescription } = request;

  try {
    const todo = await prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        title: updateTitle,
        description: updateDescription,
      },
    });
    return todo;
  } catch (error) {
    throw error;
  }
};

export const getTodos = async (id: number) => {
  try {
    const user = await prisma.todo.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        done: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = async (id: number) => {
  try {
    const todo = await prisma.todo.delete({
      where: { id: id },
    });
    return todo;
  } catch (error) {
    throw error;
  }
};
