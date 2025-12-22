import { useSession } from 'next-auth/react';

/**
 * Hook pour vérifier si l'utilisateur actuel est un vendeur
 * @returns true si l'utilisateur est connecté et a le rôle 'seller' ou 'admin'
 */
export function useIsSeller(): boolean {
  const { data: session } = useSession();

  if (!session?.user) {
    return false;
  }

  return session.user.role === 'seller' || session.user.role === 'admin';
}
