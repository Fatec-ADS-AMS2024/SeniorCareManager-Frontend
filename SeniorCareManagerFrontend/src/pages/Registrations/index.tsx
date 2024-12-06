import { FolderPlus } from '@phosphor-icons/react';
import { routes } from "../../routes/routes";
import Card from "../../components/Card";
import SearchBar from "../../components/SearchBar";
import BreadcrumbPageTitle from '../../components/BreadcrumbPageTitle';

const cards = [
  {
    text: 'Religião',
    subText: 'Religiões Cadastradas',
    icon: <FolderPlus weight='bold' className='shrink-0 size-full' />,
    page: routes.RELIGIONREGISTRATION,
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h bg-neutralLighter">
      <BreadcrumbPageTitle title="Cadastros" />
    
      <div className="py-8 px-4 flex flex-col flex-wrap items-start gap-8">
        {/* Search Bar Section */}
        <div className='w-96'>
          <SearchBar placeholder="Digite aqui..." action={console.log} />
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