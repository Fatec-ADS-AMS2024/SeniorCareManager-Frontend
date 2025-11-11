import Breadcrumb from '../Breadcrumb';
import PageTitle from '../PageTitle';

interface BreadcrumbPageTitleProps {
  title: string;
}

export default function BreadcrumbPageTitle({
  title,
}: BreadcrumbPageTitleProps) {
  return (
    <div className='p-5 bg-neutral'>
      <PageTitle title={title} />
      <Breadcrumb />
    </div>
  );
}
