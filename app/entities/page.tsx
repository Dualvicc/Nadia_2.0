"use client";

import { useEffect, useState } from "react";
import TableEntities from "@/components/tables/table-entities";
import Dropdown from "@/components/dropdown/dropdown";
import { WebhookComponent } from "@/components/webhook-component/webhook-component";
import { searchDataEntities } from "@/lib/client/utils";
import InputTextSearcher from "@/components/input-components/input-text-searcher";
import { getEntities } from "@/app/entities/helpers";

export default function Entities() {
  const [dataApi, setDataApi] = useState<Array<any>>([]);
  const [dataFiltered, setDataFiltered] = useState<Array<any>>([]);
  const [valueSearch, setValueSearch] = useState<string>("");
  const [sort, setSort] = useState<"ID" | "type" | string>("ID");
  const [sortAscDesc, setSortAscDesc] = useState<
    "ascending" | "descending" | string
  >("ascending");

  useEffect(() => {
    const fetchData = async () => {
      const jsondata = await getEntities();
      setDataApi((Array.isArray(jsondata) ? jsondata : [jsondata]));
    };

    fetchData();
  }, []);

  if (sort === "ID") {
    dataApi.sort((a: any, b: any) => a.id.localeCompare(b.id));
  } else if (sort === "type") {
    dataApi.sort((a, b) => a.type.localeCompare(b.type));
  }

  if (sortAscDesc === "descending") {
    dataApi.reverse();
  }

  function handlerSearcher(str: string) {
    const dataFiltered = searchDataEntities(str, dataApi);
    setDataFiltered(dataFiltered);
  }

  return (
    <main className="py-8 px-8">
      <div className="grid lg:grid-cols-2 mb-4">
        <InputTextSearcher
          id="searcher"
          placeholder="Search..."
          width="full"
          value={valueSearch}
          onChange={(e: any) => {
            setValueSearch(e.target.value);
            handlerSearcher(valueSearch);
          }}
        />
      </div>
      <div className="grid lg:grid-cols-2">
        <WebhookComponent />
      </div>
      <div className="flex gap-8 mb-4">
        <Dropdown
          label={"Order entities by:"}
          options={[
            { value: "ID", label: "ID" },
            { value: "type", label: "type" },
          ]}
          selectedValue={sort}
          onChange={(e) => setSort(e.target.value)}
        />
        <Dropdown
          label={"Order by:"}
          options={[
            { value: "ascending", label: "Ascending" },
            { value: "descending", label: "Descending" },
          ]}
          selectedValue={sortAscDesc}
          onChange={(e) => setSortAscDesc(e.target.value)}
        />
      </div>
      {valueSearch.length === 0 ? (
        <TableEntities
          data={dataApi}
          webhookURL={"https://www.anysolution.org:5050"}
        />
      ) : (
        <TableEntities
          data={dataFiltered}
          webhookURL={"https://www.anysolution.org:5050"}
        />
      )}
    </main>
  );
}
