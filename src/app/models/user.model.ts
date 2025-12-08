export interface User {
  _id?: string;
  rol: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  avatar?: string;
  state?: number;
  phone?: string;
  birthday?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginResponse {
  USER_FRONTED: {
    token: string;
    user: {
      name: string;
      email: string;
      surname: string;
      avatar: string;
      rol: string;
    };
  };
}