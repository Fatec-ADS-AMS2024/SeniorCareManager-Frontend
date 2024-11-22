import { useEffect, useState } from 'react';
import ReligionService from '../../services/religionService';
import Religion from '../../types/models/Religion';
import Table from '../../components/Table';
import { Pencil, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '../../components/BreadcrumbPageTitle';

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
      <button className="text-[#5DB6DC] hover:text-[#42a2cc]">
        <Pencil size={24} weight="fill" />
      </button>
      <button className="text-red-500 hover:text-red-700">
        <Trash size={24} weight="fill" />
      </button>
    </>
  )

  return (
    <div>
      <BreadcrumbPageTitle title="Cadastro de Religião" />
      <div className="px-4">
        <Table columns={columns} data={data} actions={<Actions />} />
      </div>
    </div>
  );
}
