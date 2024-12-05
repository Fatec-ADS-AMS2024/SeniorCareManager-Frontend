import { useEffect, useState } from "react";
import ReligionService from "../../services/religionService";
import Religion from "../../types/models/Religion";
import Table from "../../components/Table";
import { Pencil, Plus, Trash } from "@phosphor-icons/react";
import BreadcrumbPageTitle from "../../components/BreadcrumbPageTitle";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Modal from "../../components/GenericModal";

const inputs = [
  {
    label: "Nome da religião",
    attribute: "name",
    //defaultValue: 
  },
];

export default function ReligionRegistration() {
  const columns = ["Nome"];
  const [data, setData] = useState<Religion[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const openCloseModalRegister = () => {
    setModalRegister((isOpen) => !isOpen);
  };

  const openCloseModalEdit = () => {
    setModalEdit((isOpen) => !isOpen);
  };

  const openCloseModalDelete = () => {
    setModalDelete((isOpen) => !isOpen)
  };

  const registerReligion = async (model: Religion) => {
    const religionService = new ReligionService();
    const res = await religionService.create(model);
    if (res.code === 200) {
      alert(`Religião ${res.data?.name} criada com sucesso!`);
      setModalRegister(false);
    } else {
      alert(res.message);
    }
  };

  const editReligion = async (id: number, model: Religion) => {
    const religionService = new ReligionService();
    const res = await religionService.update(id, model);
    if (res.code === 200) {
      alert(`Religião ${res.data?.name} atualizada com sucesso!`);
      setModalEdit(false);
    } else {
      alert(res.message);
    }
  };

  const deleteReligion = async (id: number) => {
    const religionService = new ReligionService();
    const res = await religionService.delete(id);
    if (res.code === 200) {
      alert(`Religião atualizada com sucesso!`);
      setModalDelete(false);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const religionService = new ReligionService();
      const res = await religionService.getAll();
      if (res.code === 200 && res.data) setData([...res.data]);
    }

    fetchData();
  }, []);

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={openCloseModalEdit}
        className="text-edit hover:text-hoverEdit"
      >
        <Pencil className="size-6" weight="fill" />
      </button>
      <button
        onClick={openCloseModalDelete}
        className="text-danger hover:text-hoverDanger"
      >
        <Trash className="size-6" weight="fill" />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title="Cadastro de Religião" />
      <div className="bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
        <div className="flex items-center justify-between mb-4">
          <SearchBar />
          <Button
            label="Adicionar"
            icon={<Plus />}
            iconPosition="left"
            color="success"
            size="medium"
            onClick={openCloseModalRegister}
          />
          <Modal
          title="Cadastrar Religião"
          inputs={inputs}
          action={registerReligion}
          statusModal={modalRegister}
          closeModal={openCloseModalRegister}
          type="create" 
          />
          <Modal 
            title="Editar Religião"
            inputs={inputs}
            action={editReligion}
            statusModal={modalEdit}
            closeModal={openCloseModalEdit}
            type="update" 
          />
          <Modal 
            title="Deseja excluir essa religião?"
            msgConfirm="Ao excluir esta religião, ela será removida permanentemente do sistema."
            action={deleteReligion}
            statusModal={modalDelete}
            closeModal={openCloseModalDelete}
            type="delete" 
          />
        </div>
        <Table
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
