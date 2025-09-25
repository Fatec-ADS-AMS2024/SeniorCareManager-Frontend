import Breadcrumb from '../Breadcrumb';
import PageTitle from '../PageTitle';

interface BreadcrumbPageTitleProps {
  title: string;
}

export default function Breadcrumb_PageTitle({
  title,
}: BreadcrumbPageTitleProps) {
  return (
    <div className='bg-neutral p-5'>
      <PageTitle title={title} />
      <Breadcrumb />
    </div>
  );
}
