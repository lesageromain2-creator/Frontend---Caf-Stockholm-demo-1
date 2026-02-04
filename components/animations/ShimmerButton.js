'use client';

import Link from 'next/link';

/**
 * Bouton style Uiverse (Voxybuns) – effet 3D pull-up.
 * Utilise les classes globales .btn-uiverse et .button_top (voir globals.css).
 */
export default function ShimmerButton({
  children,
  href,
  className = '',
  secondary = false,
  size = 'md', // 'md' | 'sm'
  type = 'button',
  onClick,
}) {
  const variantClass = secondary ? 'btn-uiverse--secondary' : 'btn-uiverse--primary';
  const sizeClass = size === 'sm' ? 'btn-uiverse--sm' : '';
  const classes = `btn-uiverse ${variantClass} ${sizeClass} ${className}`.trim();

  const content = <span className="button_top">{children}</span>;

  if (href) {
    return (
      <Link href={href} className={classes} prefetch={false}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
