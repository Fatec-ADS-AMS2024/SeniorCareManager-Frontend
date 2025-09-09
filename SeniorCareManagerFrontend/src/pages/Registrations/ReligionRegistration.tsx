import { useEffect, useState } from "react";
import ReligionService from "../../services/religionService";
import ResidentService from "../../services/residentService";
import Religion from "../../types/models/Religion";
import Resident from "../../types/models/Resident";
import Table from "../../components/Table";
import { CheckCircle, Pencil, Plus, Trash, ClipboardText } from "@phosphor-icons/react";
import BreadcrumbPageTitle from "../../components/BreadcrumbPageTitle";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Modal from "../../components/GenericModal";

type InputType = {
  label: string;
  attribute: keyof Religion;
  defaultValue: string;
};

const inputs: InputType[] = [
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
  const [infoMessage, setInfoMessage] = useState("");
  const [residentsModal, setResidentsModal] = useState(false);
  const [residentsList, setResidentsList] = useState<Resident[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = async () => {
    const religionService = new ReligionService();
    const res = await religionService.getAll();
    if (res.code >= 200 && res.code < 300 && Array.isArray(res.data.data)) {
      setData([...res.data.data]);
      setOriginalData([...res.data.data]);
    } else {
      console.error("Erro ao buscar religiões:", res.message || res);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const getRowValues = (id: number) => data.find((row) => row.id === id);

  const openCloseModalRegister = () => {
    setCurrentId(null);
    inputs.forEach((input) => (input.defaultValue = ""));
    setModalRegister(true);
  };

  const openCloseModalEdit = (id?: number) => {
    if (!id) {
      setModalEdit(false);
      setCurrentId(null);
      return;
    }
    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(rowValues[input.attribute]);
      });
      setCurrentId(id);
      setModalEdit(true);
    } else {
      alert("Registro não encontrado");
    }
  };

  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete(false);
      setCurrentId(null);
      return;
    }
    setCurrentId(id);
    setModalDelete(true);
  };

  const openCloseModalInfo = () => setModalInfo(false);

  const handleSave = (model: Religion) => {
    if (currentId !== null) {
      editReligion(currentId, model);
    } else {
      registerReligion(model);
    }
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
    if (originalData.some((r) => r.name.toLowerCase() === model.name.trim().toLowerCase())) {
      alert("Já existe uma religião com esse nome.");
      return;
    }

    const res = await religionService.create(model);
    if (res.code >= 200 && res.code < 300) {
      setModalRegister(false);
      await fetchData();
      setInfoMessage(`Religião ${res.data?.data?.name} criada com sucesso!`);
      setModalInfo(true);
    } else {
      alert(res.message || "Erro inesperado ao criar a religião.");
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
  if (originalData.some((r) => r.id !== id && r.name.toLowerCase() === model.name.trim().toLowerCase())) {
    alert("Já existe uma religião com esse nome.");
    return;
  }

  const payload = { ...model, id: id };
  const res = await religionService.update(id, payload);

  if (res.code >= 200 && res.code < 300) {
    setModalEdit(false);
    await fetchData();
    setInfoMessage(`Religião ${res.data?.data?.name} atualizada com sucesso!`);
    setModalInfo(true);
  } else {
    alert(res.message || "Erro inesperado ao atualizar a religião.");
  }
};

  const deleteReligion = async (id: number) => {
    const religionService = new ReligionService();
    const residentService = new ResidentService();

    try {
      const residentRes = await residentService.getAll();
      if (residentRes.code === 200 && residentRes.data) {
        if (residentRes.data.some(pt => pt.residentReligionId === id)) {
          alert("Não é possível excluir esse Plano de Saúde pois está vinculado a algum Residente.");
          return;
        }
      } else {
        alert("Erro ao verificar vínculos de Residentes.");
        return;
      }
      const res = await religionService.delete(id);
      if (res.code >= 200 && res.code < 300) {
        setModalDelete(false);
        setCurrentId(null);
        await fetchData();
        setInfoMessage("Religião excluída com sucesso!");
        setModalInfo(true);
      } else {
        alert(res.message || "Erro inesperado ao excluir a Religião.");
      }
    } catch {
      alert("Erro inesperado ao excluir a Religião.");
    }
  };

  const viewResidents = async (religionId: number) => {
    const residentService = new ResidentService();
    const res = await residentService.getAll();
    if (res.code >= 200 && res.data) {
      setResidentsList(res.data.filter((r: Resident) => r.residentReligionId === religionId));
      setResidentsModal(true);
    } else {
      alert("Erro ao buscar residentes.");
    }
  };

  const residentInputs = [
    {
      label: "",
      attribute: "table",
      defaultValue: "",
      render: () => (
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nome</th>
              <th className="border p-2">CPF</th>
            </tr>
          </thead>
          <tbody>
            {residentsList.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.name}</td>
                <td className="border p-2">{r.cpf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
  ];

  const Actions = ({ id }: { id: number }) => (
    <>
      <button onClick={() => viewResidents(id)} className="text-info hover:text-hoverInfo">
        <ClipboardText size={20} weight="fill" />
      </button>
      <button onClick={() => openCloseModalEdit(id)} className="text-edit hover:text-hoverEdit">
        <Pencil className="size-6" weight="fill" />
      </button>
      <button onClick={() => openCloseModalDelete(id)} className="text-danger hover:text-hoverDanger">
        <Trash className="size-6" weight="fill" />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title="Cadastro de Religião" />
      <div className="bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
        <Modal<Religion>
          title="Cadastrar Religião"
          inputs={inputs}
          action={handleSave}
          statusModal={modalRegister}
          closeModal={() => setModalRegister(false)}
          type="create"
        />
        <Modal<Religion>
          type="update"
          title="Editar Religião"
          inputs={inputs}
          action={handleSave}
          statusModal={modalEdit}
          closeModal={() => setModalEdit(false)}
        />
        <Modal<Religion>
          type="delete"
          title="Deseja realmente excluir essa Religião?"
          msgInformation="Ao excluir esta Religião, ela será removida permanentemente do sistema."
          action={() => { if (currentId !== null) deleteReligion(currentId); }}
          statusModal={modalDelete}
          closeModal={() => setModalDelete(false)}
          inputs={inputs}
        />
        <Modal<Religion>
          type="info"
          msgInformation={infoMessage}
          icon={<CheckCircle size={90} className="text-success" weight="fill" />}
          statusModal={modalInfo}
          closeModal={openCloseModalInfo}
        />
        <Modal<Resident>
          type="info"
          title="Residentes vinculados"
          statusModal={residentsModal}
          closeModal={() => setResidentsModal(false)}
          inputs={residentInputs}
        />
        <div className="flex items-center justify-between mb-4">
          <SearchBar action={handleSearch} placeholder="Buscar religião..." />
          <Button label="Adicionar" icon={<Plus />} iconPosition="left" color="success" size="medium" onClick={openCloseModalRegister} />
        </div>
        <Table columns={columns} data={data} actions={(id) => <Actions id={id} />} />
      </div>
    </div>
  );
}