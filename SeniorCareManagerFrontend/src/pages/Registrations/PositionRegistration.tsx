import { useEffect, useState } from "react";
import PositionService from "@/services/positionService";
import Position from "@/types/models/Position";
import Table from "@/components/Table";
import { CheckCircle, Pencil, Plus, Trash, XCircle } from "@phosphor-icons/react";
import BreadcrumbPageTitle from "@/components/BreadcrumbPageTitle";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import Modal from "@/components/GenericModal";

const inputs: {
  label: string;
  attribute: keyof Position;
  defaultValue: string;
}[] = [
  {
    label: "Nome do Cargo",
    attribute: "name",
    defaultValue: "",
  },
];

export default function PositionRegistration() {
  const columns = ["Nome"];
  const [data, setData] = useState<Position[]>([]);
  const [originalData, setOriginalData] = useState<Position[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [infoIcon, setInfoIcon] = useState<JSX.Element | undefined>(undefined);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = async () => {
    const positionService = new PositionService();
    const res = await positionService.getAll();
    if (res.code === 200 && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      console.error("Erro ao buscar dados:", res.message);
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
      showInfoModal("Registro não encontrado", "error");
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

  const showInfoModal = (message: string, type: "success" | "error") => {
    setInfoMessage(message);
    setInfoIcon(
      type === "success" ? (
        <CheckCircle size={90} className="text-success" weight="fill" />
      ) : (
        <XCircle size={90} className="text-danger" weight="fill" />
      )
    );
    setModalInfo(true);
  };

  const validatePosition = (model: Position, idToIgnore?: number): string | null => {
    const name = model.name?.trim() || "";

    if (!name || name.length < 2 || name.length > 100)
      return "Nome deve ter entre 2 e 100 caracteres.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name))
      return "Nome deve conter apenas letras e espaços.";
    if (originalData.some((r) => r.id !== idToIgnore && r.name.toLowerCase() === name.toLowerCase()))
      return "Já existe um cargo com esse nome.";

    return null;
  };

  const handleSave = (model: Position) => {
    if (currentId !== null) {
      editPosition(currentId, model);
    } else {
      registerPosition(model);
    }
  };

  const registerPosition = async (model: Position) => {
    const positionService = new PositionService();
    const errorMessage = validatePosition(model);

    if (errorMessage) {
      showInfoModal(errorMessage, "error");
      return;
    }

    const res = await positionService.create(model);
    if (res.code >= 200 && res.code < 300) {
      setModalRegister(false);
      await fetchData();
      showInfoModal(`Cargo "${res.data?.name}" criado com sucesso!`, "success");
    } else {
      showInfoModal(res.message || "Erro inesperado ao criar o cargo.", "error");
    }
  };

  const editPosition = async (id: number, model: Position) => {
    const positionService = new PositionService();
    const errorMessage = validatePosition(model, id);

    if (errorMessage) {
      showInfoModal(errorMessage, "error");
      return;
    }

    const payload = { ...model, id };
    const res = await positionService.update(id, payload);

    if (res.code >= 200 && res.code < 300) {
      setModalEdit(false);
      await fetchData();
      showInfoModal(`Cargo "${res.data?.name}" atualizado com sucesso!`, "success");
    } else {
      showInfoModal(res.message || "Erro inesperado ao atualizar o cargo.", "error");
    }
  };

  const deletePosition = async (id: number) => {
    const positionService = new PositionService();
    try {
      const res = await positionService.delete(id);
      if (res.code >= 200 && res.code < 300) {
        setModalDelete(false);
        setCurrentId(null);
        const itemName = data.find(item => item.id === id)?.name || "";
        await fetchData();
        showInfoModal(`Cargo "${itemName}" excluído com sucesso!`, "success");
      } else {
        showInfoModal(res.message || "Erro inesperado ao excluir o cargo.", "error");
      }
    } catch {
      showInfoModal("Erro inesperado ao excluir o cargo.", "error");
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
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
      <BreadcrumbPageTitle title="Cadastro de Cargo" />
      <div className="bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
        <Modal<Position>
          title="Cadastrar Cargo"
          inputs={inputs}
          action={handleSave}
          statusModal={modalRegister}
          closeModal={() => setModalRegister(false)}
          type="create"
        />
        <Modal<Position>
          type="update"
          title="Editar Cargo"
          inputs={inputs}
          action={handleSave}
          statusModal={modalEdit}
          closeModal={() => openCloseModalEdit()}
        />
        <Modal<Position>
          type="delete"
          title="Deseja realmente excluir esse Cargo?"
          msgInformation="Ao excluir este Cargo, ele será removido permanentemente do sistema."
          action={() => { if (currentId !== null) deletePosition(currentId); }}
          statusModal={modalDelete}
          closeModal={() => openCloseModalDelete()}
        />
        <Modal<Position>
          type="info"
          msgInformation={infoMessage}
          icon={infoIcon}
          statusModal={modalInfo}
          closeModal={openCloseModalInfo}
        />
        <div className="flex items-center justify-between mb-4">
          <SearchBar action={handleSearch} placeholder="Buscar cargo..." />
          <Button
            label="Adicionar"
            icon={<Plus />}
            iconPosition="left"
            color="success"
            size="medium"
            onClick={openCloseModalRegister}
          />
        </div>
        <Table
          columns={columns}
          data={data.map((row) => ({
            id: row.id,
            Nome: row.name,
          }))}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}