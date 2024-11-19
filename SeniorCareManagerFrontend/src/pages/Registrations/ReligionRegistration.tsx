import { useEffect, useState } from 'react';
import ReligionService from '../../services/religionService';
import Religion from '../../types/models/Religion';
import Table from '../../components/Table';

export default function ReligionRegistration() {
  const columns = ['', 'Nome', ''];
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

  return (
    <div className="p-4">
      <Table columns={columns} data={data}/>
    </div>
  );
}
