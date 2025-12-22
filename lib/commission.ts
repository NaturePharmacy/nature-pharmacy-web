/**
 * Utilitaires pour gérer les commissions
 */

const DEFAULT_COMMISSION_RATE = 10; // 10% par défaut

/**
 * Calcule le prix final avec commission
 * @param basePrice Prix de base du vendeur
 * @param commissionRate Taux de commission en pourcentage (défaut: 10)
 * @returns Object contenant le prix final et le montant de la commission
 */
export function calculatePriceWithCommission(
  basePrice: number,
  commissionRate: number = DEFAULT_COMMISSION_RATE
): { price: number; commission: number } {
  const commission = Math.round(basePrice * (commissionRate / 100));
  const price = basePrice + commission;

  return { price, commission };
}

/**
 * Calcule le prix de base à partir du prix final
 * @param finalPrice Prix final (avec commission)
 * @param commissionRate Taux de commission en pourcentage (défaut: 10)
 * @returns Prix de base
 */
export function calculateBasePriceFromFinal(
  finalPrice: number,
  commissionRate: number = DEFAULT_COMMISSION_RATE
): number {
  return Math.round(finalPrice / (1 + commissionRate / 100));
}

/**
 * Obtient le taux de commission actuel depuis les paramètres
 * Pour l'instant retourne la valeur par défaut
 * TODO: Récupérer depuis la DB (Settings model)
 */
export async function getCommissionRate(): Promise<number> {
  // Pour l'instant on retourne la valeur par défaut
  // Plus tard, on pourra récupérer depuis Settings model
  return DEFAULT_COMMISSION_RATE;
}
