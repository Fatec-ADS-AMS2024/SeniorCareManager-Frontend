import { Cross, FirstAid, Briefcase } from '@phosphor-icons/react';
import Card from '@/components/Card';
import SearchBar from '@/components/SearchBar';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import useAppRoutes from '@/hooks/useAppRoutes';

export default function Registrations() {
  const routes = useAppRoutes();

  const cards = [
    {
      text: 'Religião',
      subText: 'Religiões Cadastradas',
      icon: <Cross weight='bold' className='shrink-0 size-full' />,
      page: routes.RELIGION.path,
    },
    {
      text: 'Plano de Saúde',
      subText: 'Planos de Saúde Cadastrados',
      icon: <FirstAid weight='bold' className='shrink-0 size-full' />,
      page: routes.HEALTH_INSURANCE_PLAN.path,
    },
    {
      text: 'Cargo',
      subText: 'Cargos Cadastrados',
      icon: <Briefcase weight='bold' className='shrink-0 size-full' />,
      page: routes.POSITION.path,
    },
     {
      text: 'Empresa',
      subText: 'Empresas Cadastradas',
      icon: <Cross weight='bold' className='shrink-0 size-full' />,
      page: routes.COMPANY.path,
    },
  ];

  return (
    <div className='min-h bg-neutralLighter'>
      <BreadcrumbPageTitle title='Cadastros' />

      <div className='py-8 px-4 flex flex-col flex-wrap items-start gap-8'>
        {/* Search Bar Section */}
        <div className='w-96'>
          <SearchBar placeholder='Digite aqui...' action={console.log} />
        </div>

        <div className='flex flex-wrap gap-8 justify-center'>
          {/* Card Grid */}
          {cards.map(({ text, icon, page, subText }) => (
            <Card
              key={text}
              subText={subText}
              text={text}
              icon={icon}
              page={page}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
