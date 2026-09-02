interface DonationAccount {
  label: string;
  value: string;
  icon: string;
}

const ACCOUNTS: DonationAccount[] = [
  { label: 'Banco Nacional — IBAN Colones', value: 'CR71015107220010375383', icon: 'account_balance' },
  { label: 'Banco Nacional — IBAN Dólares', value: 'CR40015107220020068860', icon: 'account_balance' },
  { label: 'BAC — IBAN Colones', value: 'CR29010200009702811351', icon: 'account_balance' },
  { label: 'BAC — IBAN Dólares', value: 'CR33010200009702811279', icon: 'account_balance' },
  { label: 'SINPE Móvil', value: '7057-5463', icon: 'smartphone' },
];

interface DonationInfoProps {
  border?: 'primary' | 'secondary';
}

export default function DonationInfo({ border = 'primary' }: DonationInfoProps) {
  return (
    <div className={`card card--border-${border}`}>
      <h2 className="fieldset-title" style={{ fontSize: 24, marginBottom: 'var(--space-md)' }}>Cómo donar</h2>
      <p className="section-subtitle" style={{ fontSize: 15, marginBottom: 'var(--space-md)' }}>
        Tu aporte hace la diferencia. Podés donar directamente a cualquiera de estas cuentas.
      </p>
      <div className="info-list">
        {ACCOUNTS.map((account) => (
          <div className="info-item" key={account.label}>
            <div className="icon-circle" style={{ width: 40, height: 40, margin: 0, background: 'var(--color-secondary-container)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>{account.icon}</span>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700 }}>{account.label}</h3>
              <p className="section-subtitle" style={{ fontSize: 15 }}>{account.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
