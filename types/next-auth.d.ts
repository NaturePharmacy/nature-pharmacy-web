import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'buyer' | 'seller' | 'admin';
      avatar?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'buyer' | 'seller' | 'admin';
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'buyer' | 'seller' | 'admin';
    avatar?: string;
  }
}
