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
  }
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100">

      <BreadcrumbPageTitle title="Cadastros" />
      {/* Search Bar Section */}
      <SearchBar placeholder="Digite aqui..." action={console.log} />

      {/* Card Grid */}
      <div className="mt-8 flex flex-wrap items-center gap-8 px-4">
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
  );
}