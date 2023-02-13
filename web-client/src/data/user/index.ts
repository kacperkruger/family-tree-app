export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
}
