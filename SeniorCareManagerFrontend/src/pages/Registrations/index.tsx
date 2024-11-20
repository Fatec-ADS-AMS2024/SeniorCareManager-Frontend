import { FolderPlus } from '@phosphor-icons/react';
import { routes } from "../../routes/routes";
import Card from "../../components/Card";
import SearchBar from "../../components/SearchBar";

const cards = [
  {
    text: 'Religião',
    subText: 'Religiões Cadastradas',
    icon: <FolderPlus className='shrink-0 size-full' />,
    page: routes.RELIGIONREGISTRATION,
  }
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Search Bar Section */}
      <SearchBar placeholder="Digite aqui..." action={console.log} />

      {/* Card Grid */}
      <div className="mt-8 flex flex-wrap items-center gap-8">
        {cards.map(({ text, icon, page, subText }) => (
          <Card
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