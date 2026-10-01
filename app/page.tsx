"use client";

import { useMemo, useState } from "react";

type Document = {
  name: string;
  type: string;
  permission: string;
  date: string;
  folder: string;
};

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState("All Documents");
  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null);
    const [auditLogs, setAuditLogs] = useState<
  { action: string; document: string; time: string }[]
>([]);
    const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const folders = [
    "All Documents",
    "Agreements",
    "Compliance",
    "Reports",
    "Disclosures",
  ];

  const documents: Document[] = [
    {
      name: "Master Service Agreement.pdf",
      type: "PDF",
      permission: "Confidential",
      date: "Sep 28, 2026",
      folder: "Agreements",
    },
    {
      name: "Compliance Report.pdf",
      type: "PDF",
      permission: "Restricted",
      date: "Sep 26, 2026",
      folder: "Compliance",
    },
    {
      name: "Financial Report.pdf",
      type: "PDF",
      permission: "Internal Only",
      date: "Sep 24, 2026",
      folder: "Reports",
    },
    {
      name: "Company Disclosure.pdf",
      type: "PDF",
      permission: "Public",
      date: "Sep 20, 2026",
      folder: "Disclosures",
},
];

const allDocuments = [...documents, ...uploadedDocuments]

  const filteredDocuments = useMemo(() => {
    let result = allDocuments.filter((document) =>  {
      const folderMatch =
        selectedFolder === "All Documents" ||
        document.folder === selectedFolder;

      const searchMatch = document.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return folderMatch && searchMatch;
    });

    if (sortAsc) {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [selectedFolder, search, sortAsc]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* HEADER */}
      <header className="border-b bg-white px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Glynac Virtual Data Room
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Secure document management & compliance workspace
            </p>
          </div>

          <label className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
  + Upload

  <input
    type="file"
    accept=".pdf"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const newDocument: Document = {
        name: file.name,
        type: "PDF",
        permission: "Internal Only",
        date: "Sep 30, 2026",
        folder: selectedFolder === "All Documents"
          ? "Reports"
          : selectedFolder,
      };

      setUploadedDocuments((prev) => [
        ...prev,
        newDocument,
      ]);

      alert(`${file.name} uploaded successfully!`);
    }}
  />
</label>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex min-h-[calc(100vh-100px)] flex-col md:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full border-b bg-white p-5 md:w-64 md:border-b-0 md:border-r">

          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Folders
          </p>

          <div className="space-y-2">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  selectedFolder === folder
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                📁 {folder}
              </button>
            ))}
          </div>

          {/* STORAGE */}
          <div className="mt-10 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              STORAGE
            </p>

            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div className="h-2 w-[42%] rounded-full bg-blue-600" />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              4.2 GB of 10 GB used
            </p>
          </div>
        </aside>

        {/* DOCUMENT AREA */}
        <section className="min-w-0 flex-1 p-4 md:p-7">

          {/* BREADCRUMB */}
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <span>VDR</span>
            <span>/</span>
            <span className="font-semibold text-slate-900">
              {selectedFolder}
            </span>
          </div>

          {/* SEARCH + SORT */}
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {selectedFolder}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredDocuments.length} documents
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />

              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
              >
                Sort {sortAsc ? "A-Z" : "↕"}
              </button>

            </div>
          </div>

          {/* DOCUMENT LIST */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

            {filteredDocuments.length === 0 ? (

              <div className="p-12 text-center">
                <div className="text-4xl">📂</div>

                <h3 className="mt-3 font-semibold">
                  No documents found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try another search or folder.
                </p>
              </div>

            ) : (

              filteredDocuments.map((document, index) => (

                <div
                  key={document.name}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-slate-50 ${
                    index !== filteredDocuments.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-xl">
                      📄
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        {document.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {document.type} • Updated {document.date}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-5">

                    <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    document.permission === "Confidential"
      ? "bg-red-50 text-red-700"
      : document.permission === "Restricted"
      ? "bg-orange-50 text-orange-700"
      : document.permission === "Internal Only"
      ? "bg-blue-50 text-blue-700"
      : "bg-green-50 text-green-700"
  }`}
>
  {document.permission}
</span>

                    <button
                      onClick={() =>
                        setSelectedDocument(document)
                      }
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Preview →
                    </button>

                  </div>

                </div>

              ))
            )}

          </div>
        </section>

        {/* PREVIEW PANEL */}
        {selectedDocument && (
          <aside className="w-full border-t bg-white p-6 shadow-lg md:w-96 md:border-l md:border-t-0">
            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold">
                Document Preview
              </h2>

              <button
                onClick={() => setSelectedDocument(null)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>

            </div>

            <div className="mt-8 rounded-xl bg-slate-50 p-6 text-center">

              <div className="text-6xl">📄</div>

              <h3 className="mt-4 break-words font-semibold">
                {selectedDocument.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                PDF Document
              </p>

            </div>

            <div className="mt-6 space-y-4">

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Permission
                </p>

                <p className="mt-1 font-medium">
                  {selectedDocument.permission}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Folder
                </p>

                <p className="mt-1 font-medium">
                  {selectedDocument.folder}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Last Updated
                </p>

                <p className="mt-1 font-medium">
                  {selectedDocument.date}
                </p>
              </div>

            </div>

            <button
              onClick={() => alert("Download feature coming next")}
              className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Download Document
            </button>

          </aside>
        )}

      </div>
    </main>
  );
}