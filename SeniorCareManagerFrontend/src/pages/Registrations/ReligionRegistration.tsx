import { useEffect, useState } from 'react';
import ReligionService from '../../services/religionService';
import Religion from '../../types/models/Religion';
import Table from '../../components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '../../components/BreadcrumbPageTitle';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';

export default function ReligionRegistration() {
  const columns = ['Nome'];
  const [data, setData] = useState<Religion[]>([]);

  useEffect(() => {
    async function fetchData() {
      const religionService = new ReligionService();
      const res = await religionService.getAll();
      if (res.code === 200 && res.data)
        setData([...res.data]);
    }

    fetchData();
  }, [])

  const Actions = () => (
    <>
      <button className="text-edit hover:text-hoverEdit">
        <Pencil size={24} weight="fill" />
      </button>
      <button className="text-danger hover:text-hoverDanger">
        <Trash size={24} weight="fill" />
      </button>
    </>
  )

  return (
    <div>
    <BreadcrumbPageTitle title="Cadastro de Religião" />
    <div className="bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
      <div className="flex items-center justify-between mb-4">
        <SearchBar />
        <Button label="Adicionar" icon={<Plus />} iconPosition="left" color="success" size="medium" />
      </div>
      <Table columns={columns} data={data} actions={<Actions />} />
    </div>
  </div>
  );
}
