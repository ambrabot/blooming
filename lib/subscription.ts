// Helpers da assinatura (camada recorrente — Rafa ilimitada + comunidade).
// Módulos continuam sendo compra vitalícia separada (modelo híbrido).

export type SubscriptionFields = {
  subscriptionStatus: string;
  subscriptionCurrentPeriodEnd: Date | null;
};

/** True se a usuária tem assinatura ativa e dentro do período pago. */
export function hasActiveSubscription(user: SubscriptionFields | null | undefined): boolean {
  if (!user) return false;
  if (user.subscriptionStatus !== "ACTIVE") return false;
  // PAST_DUE ainda pode ter período válido; ACTIVE com período expirado = não.
  if (
    user.subscriptionCurrentPeriodEnd &&
    user.subscriptionCurrentPeriodEnd.getTime() < Date.now()
  ) {
    return false;
  }
  return true;
}

// Não-assinantes têm a Rafa em modo degustação: um teto mensal de mensagens.
// Assinantes = ilimitado. Ajustável.
export const FREE_RAFA_MESSAGES_PER_MONTH = 20;
