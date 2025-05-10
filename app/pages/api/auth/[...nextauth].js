import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // TODO: Validate credentials against your database
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          return Promise.resolve({ id: 1, name: 'Test User', email: 'test@example.com', role: 'STUDENT' });
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session(session, token) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
}); 