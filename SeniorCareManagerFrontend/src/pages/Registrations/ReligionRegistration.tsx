import { useEffect, useState } from "react";
import ReligionService from "../../services/religionService";
import ResidentService from "../../services/residentService";
import Religion from "../../types/models/Religion";
import Resident from "../../types/models/Resident";
import Table from "../../components/Table";
import { CheckCircle, Pencil, Plus, Trash } from "@phosphor-icons/react";
import BreadcrumbPageTitle from "../../components/BreadcrumbPageTitle";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Modal from "../../components/GenericModal";

const inputs = [
  {
    label: "Id",
    attribute: "id",
    defaultValue: "",
    locked: true,
  },
  {
    label: "Nome da religião",
    attribute: "name",
    defaultValue: "",
  },
];

export default function ReligionRegistration() {
  const columns = ["Nome"];
  const [data, setData] = useState<Religion[]>([]);
  const [originalData, setOriginalData] = useState<Religion[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);

  const fetchData = async () => {
    const religionService = new ReligionService();
    const res = await religionService.getAll();
    if (res.code === 200 && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]); // Salva os dados originais
    } else {
      console.error("Erro ao buscar dados:", res.message);
    }
  };

  // Pega os dados ja cadastrados para mostrar na tabela
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData); // Restaura os dados originais
      return;
    }

    const filteredData = originalData.filter((religion) =>
      religion.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  // Pega os valores de uma linha baseado em seu id
  const getRowValues = (id: number) => {
    const existingRow = data.find((row) => row.id === id);
    return existingRow;
  };

  const openCloseModalRegister = () => {
    setModalRegister((isOpen) => !isOpen);
  };

  // Abre a modal para edição pegando os dados da linha
  const openCloseModalEdit = (id?: number) => {
    if (!id) {
      setModalEdit((isOpen) => !isOpen);
      return;
    }

    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = rowValues[input.attribute]
      }); 
    } else {
      alert("Registro não encontrado");
      return;
    }

    setModalEdit((isOpen) => !isOpen);
  };

  // Abre a modal para deleção pegando os dados da linha
  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete((isOpen) => !isOpen);
      return;
    }

    // Necessário para funcionar
    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = rowValues[input.attribute]
      }); 
    } else {
      alert("Registro não encontrado");
      return;
    }

    setModalDelete((isOpen) => !isOpen);
  };

  const openCloseModalInfo = () => {
    setModalInfo((isOpen) => !isOpen);
  };

  const registerReligion = async (model: Religion) => {
    const religionService = new ReligionService();
    
    if (!model.name || model.name.trim().length < 3 || model.name.trim().length > 100) {
      alert("Nome deve ter entre 3 e 100 caracteres.");
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(model.name)) {
      alert("Nome deve conter apenas letras e espaços.");
      return;
    }
    const nameExists = originalData.some(
      (pg) => pg.name.toLowerCase() === model.name.trim().toLowerCase()
    );
    if (nameExists) {
      alert("Já existe uma Religião com esse nome.");
      return;
    }
    
    const res = await religionService.create({
      ...model,
      id: Number(model.id),
    });
    if (res.code === 200) {
      alert(`Religião ${res.data?.name} criada com sucesso!`);
      setModalRegister(false);
      await fetchData();
    } else if (res.code === 500 && res.message) {
      alert(res.message);
    } else {
      alert(res.message || "Erro inesperado ao criar a Religião.");
    }
  };

  const editReligion = async (id: number, model: Religion) => {
    const religionService = new ReligionService();
    
    if (!model.name || model.name.trim().length < 3 || model.name.trim().length > 100) {
      alert("Nome deve ter entre 3 e 100 caracteres.");
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(model.name)) {
      alert("Nome deve conter apenas letras e espaços.");
      return;
    }
    const nameExists = originalData.some(
      (pg) => pg.id !== id && pg.name.toLowerCase() === model.name.trim().toLowerCase()
    );
    if (nameExists) {
      alert("Já existe uma Religião com esse nome.");
      return;
    }
    
    const res = await religionService.update(id, model);
    if (res.code === 200) {
      alert(`Religião ${res.data?.name} atualizada com sucesso!`);
      setModalEdit(false);
      await fetchData();
    } else if (res.code === 500 && res.message) {
      alert(res.message); 
    } else {
      alert(res.message || "Erro inesperado ao atualizar a Religião.");
    }
  };

  const deleteReligion = async (id: number) => {
    const religionService = new ReligionService();
    const residentService = new ResidentService();

  try {
    // Buscar todos os residents
    const residentRes = await residentService.getAll();
    if (residentRes.code === 200 && residentRes.data) {
      const hasLinkedResidentTypes = residentRes.data.some(pt => pt.residentReligionId === id);
      if (hasLinkedResidentTypes) {
        alert("Não é possível excluir essa Religião pois está vinculada a algum Residente.");
        return;
      }
    } else {
      alert("Erro ao verificar vínculos de Residentes.");
      return;
    }
    const res = await religionService.delete(id);
    if (res.code === 200) {
      setModalDelete(false);
      setModalInfo(true)
      await fetchData();
    } else if (res.code === 400 && res.message?.includes("vinculado")) {
      alert("Não é possível excluir esta Religião pois está vinculada a um Residente.");
    } else if (res.code === 500 && res.message) {
      alert(res.message);
    } else {
      alert(res.message || "Erro inesperado ao excluir a Religião.");
    }
  } catch (error) {
    console.error("Erro ao tentar excluir a Religião:", error);
    alert("Erro inesperado ao excluir a Religião.");
  }
};

  // Essa função cria botões que tem acesso ao id da linha onde eles aparecem
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openCloseModalEdit(id)}
        className="text-edit hover:text-hoverEdit"
      >
        <Pencil className="size-6" weight="fill" />
      </button>
      <button
        onClick={() => openCloseModalDelete(id)}
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
          <SearchBar action={handleSearch} placeholder="Buscar religião..." />
          <Button
            label="Adicionar"
            icon={<Plus />}
            iconPosition="left"
            color="success"
            size="medium"
            onClick={openCloseModalRegister}
          />
          <Modal<Religion>
            title="Cadastrar Religião"
            inputs={inputs}
            action={registerReligion}
            statusModal={modalRegister}
            closeModal={openCloseModalRegister}
            type="create"
          />
          <Modal<Religion>
            type="update"
            title="Editar Religião"
            inputs={inputs}
            action={(religion) => editReligion(religion.id, religion)}
            statusModal={modalEdit}
            closeModal={() => openCloseModalEdit()}
          />
          <Modal<Religion>
            type="delete"
            title="Deseja realmente excluir essa religião?"
            msgInformation="Ao excluir esta religião, ela será removida permanentemente do sistema."
            action={(religion) => deleteReligion(religion.id)}
            statusModal={modalDelete}
            closeModal={() => openCloseModalDelete()}
            inputs={inputs}
          />
          <Modal<Religion>
            type="info"
            msgInformation="Religião excluida com sucesso!"
            icon={<CheckCircle size={90} className="text-success" weight="fill" />}
            statusModal={modalInfo}
            closeModal={openCloseModalInfo}
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
