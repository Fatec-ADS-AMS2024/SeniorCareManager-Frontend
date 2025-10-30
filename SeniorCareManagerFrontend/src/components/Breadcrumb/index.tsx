import { Link } from 'react-router-dom';
import { CaretRight } from '@phosphor-icons/react';
import useBreadcrumbs from '@/hooks/useBreadcrumbs';

export default function Breadcrumb() {
  const breadcrumbs = useBreadcrumbs();

  return (
    // 1. O 'aria-label' na <nav> já está perfeito.
    <nav
      className='flex items-center space-x-2 capitalize'
      aria-label='Breadcrumb'
    >
      {/* Mudar para <ol> para melhor semântica de ordem */}
      <ol className='flex items-center space-x-1'>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const hasPath = !!crumb.path;
          const item =
            hasPath && !isLast && crumb.hasPage ? (
              <Link
                className='text-secondary hover:text-primary font-medium'
                to={crumb.path}
              >
                {crumb.name}
              </Link>
            ) : (
              <span
                className='text-textSecondary font-medium'
                aria-current={isLast ? 'page' : undefined}
              >
                {crumb.name}
              </span>
            );

          const separator = !isLast && (
            <CaretRight
              className='text-textSecondary h-5 w-5 mx-1'
              aria-hidden="true"
            />
          );

          return (
            <li key={crumb.path} className='flex items-center'>
              {item}
              {separator}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
