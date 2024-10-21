"use client";

import { useEffect, useState } from "react";
import TableSubscriptions from "@/components/tables/table-subscriptions";
import Dropdown from "@/components/dropdown/dropdown";
import InputTextSearcher from "@/components/input-components/input-text-searcher";
import { searchDataSubscriptions } from "@/lib/client/utils";
import { getSubscriptions } from "@/app/subscriptions/helpers";

export default function Subscriptions() {
  const [dataApi, setDataApi] = useState<Array<any>>([]);
  const [dataFiltered, setDataFiltered] = useState<Array<any>>([]);
  const [valueSearch, setValueSearch] = useState<string>("");
  const [sort, setSort] = useState<
    "ID" | "description" | "URL" | "last notification" | string
  >("ID");
  const [sortAscDesc, setSortAscDesc] = useState<
    "ascending" | "descending" | string
  >("ascending");

  useEffect(() => {
    const fetchData = async () => {
      const jsondata = await getSubscriptions();
      setDataApi((Array.isArray(jsondata) ? jsondata : [jsondata]));
    };

    fetchData();
  }, []);

  if (sort === "ID") {
    dataApi.sort((a: any, b: any) => a.id.localeCompare(b.id));
  } else if (sort === "description") {
    dataApi.sort((a, b) => a.description.localeCompare(b.description));
  } else if (sort === "URL") {
    dataApi.sort((a, b) =>
      a.notification.http.url.localeCompare(b.notification.http.url)
    );
  } else if (sort === "last notification") {
    dataApi.sort((a, b) =>
      a.notification.lastNotification.localeCompare(
        b.notification.lastNotification
      )
    );
  }

  if (sortAscDesc === "descending") {
    dataApi.reverse();
  }

  function handlerSearcher(str: string) {
    const dataFiltered = searchDataSubscriptions(str, dataApi);
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
      <div className="flex gap-8 mb-4">
        <Dropdown
          label="Order subscriptions by: "
          options={[
            { value: "ID", label: "ID" },
            { value: "description", label: "Description" },
            { value: "URL", label: "URL" },
            { value: "last notification", label: "Last Notification" },
          ]}
          selectedValue={sort}
          onChange={(e) => setSort(e.target.value)}
        />
        <Dropdown
          label="Order by: "
          options={[
            { value: "ascending", label: "Ascending" },
            { value: "descending", label: "Descending" },
          ]}
          selectedValue={sortAscDesc}
          onChange={(e) => setSortAscDesc(e.target.value)}
        />
      </div>
      {valueSearch.length === 0 ? (
        <TableSubscriptions data={dataApi} />
      ) : (
        <TableSubscriptions data={dataFiltered} />
      )}
    </main>
  );
}
