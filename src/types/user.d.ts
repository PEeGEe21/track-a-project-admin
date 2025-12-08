export interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  avatar?: string;
  emailVerified?: boolean;
  sUsername?: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  phone_code?: string;
  id: string;
  _id: string;
}

export interface UserAvatar {
  id?: string;
  svg?: string;
  text?: string;
}

export interface ChatTokenProps {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}
