export interface ServerSession {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function getServerSession(): Promise<ServerSession | null> {
  // Placeholder for session reading logic (cookies/JWT)
  return null;
}
