export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  createdAt: Date;
  role: 'admin' | 'user';
};

export const users: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    image: 'https://avatar.iran.liara.run/public/33',
    createdAt: new Date(),
    role: 'admin',
  },
  {
    id: '2',
    firstName: 'Billy',
    lastName: 'Bob',
    email: 'billy.bob@example.com',
    image: 'https://avatar.iran.liara.run/public/10',
    createdAt: new Date(),
    role: 'user',
  },
  {
    id: '3',
    firstName: 'Matt',
    lastName: 'Smith',
    email: 'matt.smith@example.com',
    image: 'https://avatar.iran.liara.run/public/23',
    createdAt: new Date(),
    role: 'admin',
  },
  {
    id: '4',
    firstName: 'Ben',
    lastName: 'Johnson',
    email: 'ben.johnson@example.com',
    image: 'https://avatar.iran.liara.run/public/13',
    createdAt: new Date(),
    role: 'user',
  },
  {
    id: '5',
    firstName: 'Jim',
    lastName: 'Beam',
    email: 'jim.beam@example.com',
    image: 'https://avatar.iran.liara.run/public/44',
    createdAt: new Date(),
    role: 'user',
  },
];
