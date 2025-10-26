import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import useAppRoutes from '@/hooks/useAppRoutes';

export default function AdminOverview() {
  const routes = useAppRoutes();

  return (
    <div>
      <BreadcrumbPageTitle title={routes.ADMIN_OVERVIEW.displayName} />
    </div>
  );
}
