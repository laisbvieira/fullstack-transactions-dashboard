import React, { useState } from "react";
import styles from "./styles.module.css";
import { Button } from "../button/Button";
import { FaFilter, FaMinus, FaTrash } from "react-icons/fa";

export interface FilterValues {
  cpf?: string;
  description?: string;
  dateFrom?: string;
  dateTo?: string;
  minValue?: number;
  maxValue?: number;
  status?: string;
}

interface FiltersProps {
  role: "admin" | "user";
  onChange: (filters: FilterValues) => void;
}

export const Filters: React.FC<FiltersProps> = ({ role, onChange }) => {
  const [filters, setFilters] = useState<FilterValues>({});

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value === "" ? undefined : value,
    };
    setFilters(updatedFilters);
  }

  function handleFilterClick() {
    onChange(filters);
  }

  function handleClearFilters() {
    setFilters({});
    onChange({});
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {role === "admin" && (
          <label>
            CPF do usuário
            <input
              type="text"
              name="cpf"
              value={filters.cpf || ""}
              onChange={handleInputChange}
            />
          </label>
        )}
        <label>
          Status
          <select
            name="status"
            value={filters.status || ""}
            onChange={handleInputChange}
          >
            <option value="">Selecione</option>
            <option value="aprovado">Aprovado</option>
            <option value="em avaliacao">Em avaliação</option>
            <option value="reprovado">Reprovado</option>
          </select>
        </label>
        <div className={styles.dateGroup}>
          <label>
            Data inicial
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom || ""}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Data final
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo || ""}
              onChange={handleInputChange}
            />
          </label>
        </div>
        {role === "admin" && (
          <>
            <label>
              Valor mínimo
              <input
                type="number"
                name="minValue"
                value={filters.minValue ?? ""}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Valor máximo
              <input
                type="number"
                name="maxValue"
                placeholder="Valor máximo"
                value={filters.maxValue ?? ""}
                onChange={handleInputChange}
              />
            </label>
          </>
        )}

        <div className={styles.button}>
          <Button
            variant="primary"
            size="small"
            className={styles.iconButton}
            onClick={handleClearFilters}
          >
            <FaTrash />
            <span>Limpar filtros</span>
          </Button>

          <Button variant="success" size="small" onClick={handleFilterClick}>
            <FaFilter />
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  );
};
