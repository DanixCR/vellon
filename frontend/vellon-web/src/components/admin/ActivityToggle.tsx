import { useState } from 'react';
import { activityService } from '../../services/activityService';

interface ActivityToggleProps {
  id: number;
  isActive: boolean;
  onChange?: (id: number, newValue: boolean) => void;
}

export default function ActivityToggle({ id, isActive, onChange }: ActivityToggleProps) {
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const updated = await activityService.toggle(id);
      setActive(updated.isActive);
      onChange?.(id, updated.isActive);
    } catch {
      // revert on error — no action needed since state didn't change
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={active ? 'Visible en sitio público' : 'Oculta del sitio público'}
      style={{
        background: active ? 'var(--success)' : '#e5e7eb',
        border: 'none',
        borderRadius: '9999px',
        width: '40px',
        height: '22px',
        position: 'relative',
        cursor: loading ? 'default' : 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: active ? '20px' : '3px',
        width: '16px',
        height: '16px',
        background: 'white',
        borderRadius: '50%',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}
