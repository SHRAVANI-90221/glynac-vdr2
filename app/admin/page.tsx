"use client";

import { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Suspended";
};

type Rule = {
  id: number;
  name: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  active: boolean;
};

const users: User[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@glynac.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@glynac.com",
    role: "Compliance Officer",
    status: "Active",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@glynac.com",
    role: "Reviewer",
    status: "Pending",
  },
  {
    id: 4,
    name: "Robert Wilson",
    email: "robert@glynac.com",
    role: "Reviewer",
    status: "Suspended",
  },
  {
    id: 5,
    name: "Jessica Brown",
    email: "jessica@glynac.com",
    role: "Compliance Officer",
    status: "Active",
  },
];

const initialRules: Rule[] = [
  {
    id: 1,
    name: "FINRA-2210",
    description: "Communications with the public",
    severity: "High",
    active: true,
  },
  {
    id: 2,
    name: "SEC-17a-4",
    description: "Records preservation requirements",
    severity: "Critical",
    active: true,
  },
  {
    id: 3,
    name: "DISC-09",
    description: "Required investment disclosures",
    severity: "Medium",
    active: false,
  },
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [userSearch, setUserSearch] = useState("");
  const [ruleSearch, setRuleSearch] = useState("");
  const [rules, setRules] = useState(initialRules);

  const [flags, setFlags] = useState({
    aiValidation: true,
    piiMasking: true,
    precedentLookup: false,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(ruleSearch.toLowerCase()) ||
      rule.description.toLowerCase().includes(ruleSearch.toLowerCase())
  );

  const toggleRule = (id: number) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? { ...rule, active: !rule.active }
          : rule
      )
    );
  };

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({
      ...prev,
      [flag]: !prev[flag],
    }));
  };

  const menuItems = [
    "Dashboard",
    "Users",
    "Permissions",
    "Compliance Rules",
    "System Health",
    "Audit Logs",
    "Feature Flags",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 flex-col bg-slate-900 text-white md:flex">
          <div className="border-b border-slate-700 p-6">
            <h1 className="text-2xl font-bold">Glynac</h1>
            <p className="mt-1 text-sm text-slate-400">
              Admin Console
            </p>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`mb-2 w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  activeSection === item
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-700 p-5">
            <p className="text-xs text-slate-400">
              Logged in as
            </p>
            <p className="mt-1 font-medium">
              Admin User
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1">

          {/* HEADER */}
          <header className="border-b bg-white px-5 py-5 md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {activeSection}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enterprise compliance administration
                </p>
              </div>

              <div className="hidden rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 sm:block">
                ● System Operational
              </div>
            </div>
          </header>

          <div className="p-5 md:p-8">

            {/* DASHBOARD */}
            {activeSection === "Dashboard" && (
              <div className="space-y-6">

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                  <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                      Documents Reviewed
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      1,284
                    </p>
                    <p className="mt-2 text-sm text-green-600">
                      +12.5% this month
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                      Violations Flagged
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      86
                    </p>
                    <p className="mt-2 text-sm text-red-600">
                      8 critical
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                      Pass Rate
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      93.3%
                    </p>
                    <p className="mt-2 text-sm text-green-600">
                      +2.1% improvement
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                      Average Review Time
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      4.2m
                    </p>
                    <p className="mt-2 text-sm text-green-600">
                      -18% faster
                    </p>
                  </div>

                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                  {/* REVIEW TREND */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">
                      Review Trend
                    </h3>

                    <div className="mt-8 flex h-56 items-end gap-4">
                      {[40, 55, 48, 70, 62, 82, 92].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex flex-1 flex-col items-center gap-2"
                          >
                            <div
                              className="w-full rounded-t-md bg-blue-500"
                              style={{
                                height: `${height}%`,
                              }}
                            />
                            <span className="text-xs text-slate-400">
                              {[
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                              ][index]}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* VIOLATIONS */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">
                      Violation Distribution
                    </h3>

                    <div className="mt-8 space-y-5">

                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>Critical</span>
                          <span>8%</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-200">
                          <div className="h-3 w-[8%] rounded-full bg-red-600" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>High</span>
                          <span>24%</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-200">
                          <div className="h-3 w-[24%] rounded-full bg-orange-500" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>Medium</span>
                          <span>38%</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-200">
                          <div className="h-3 w-[38%] rounded-full bg-yellow-500" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>Low</span>
                          <span>30%</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-200">
                          <div className="h-3 w-[30%] rounded-full bg-green-500" />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* USERS */}
            {activeSection === "Users" && (
              <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      User Management
                    </h3>
                    <p className="text-sm text-slate-500">
                      Manage platform users and roles
                    </p>
                  </div>

                  <input
                    value={userSearch}
                    onChange={(e) =>
                      setUserSearch(e.target.value)
                    }
                    placeholder="Search users..."
                    className="rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-slate-50">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-slate-50"
                        >
                          <td className="p-3 font-medium">
                            {user.name}
                          </td>
                          <td className="p-3 text-slate-500">
                            {user.email}
                          </td>
                          <td className="p-3">
                            {user.role}
                          </td>
                          <td className="p-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : user.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() =>
                                setSelectedUser(user)
                              }
                              className="text-blue-600 hover:underline"
                            >
                              Permissions
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* PERMISSIONS */}
            {activeSection === "Permissions" && (
              <div className="grid gap-6 lg:grid-cols-2">

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">
                    Role Based Access Control
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure permissions by role.
                  </p>

                  <div className="mt-6 space-y-4">

                    {[
                      "Admin",
                      "Compliance Officer",
                      "Reviewer",
                      "Viewer",
                    ].map((role) => (
                      <div
                        key={role}
                        className="rounded-lg border p-4"
                      >
                        <p className="font-semibold">
                          {role}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                          {[
                            "Read",
                            "Write",
                            "Approve",
                            "Admin",
                          ].map((permission) => (
                            <label
                              key={permission}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                defaultChecked={
                                  role === "Admin" ||
                                  permission === "Read"
                                }
                              />
                              {permission}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

              </div>
            )}

            {/* COMPLIANCE RULES */}
            {activeSection === "Compliance Rules" && (
              <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Compliance Rule Manager
                    </h3>
                    <p className="text-sm text-slate-500">
                      Manage regulatory compliance rules
                    </p>
                  </div>

                  <input
                    value={ruleSearch}
                    onChange={(e) =>
                      setRuleSearch(e.target.value)
                    }
                    placeholder="Search rules..."
                    className="rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-4">
                  {filteredRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex flex-col gap-4 rounded-xl border p-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">
                            {rule.name}
                          </h4>

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              rule.severity === "Critical"
                                ? "bg-red-100 text-red-700"
                                : rule.severity === "High"
                                ? "bg-orange-100 text-orange-700"
                                : rule.severity === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {rule.severity}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {rule.description}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                          rule.active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {rule.active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SYSTEM HEALTH */}
            {activeSection === "System Health" && (
              <div className="grid gap-5 md:grid-cols-3">

                {[
                  ["API Latency", "124 ms", "Healthy"],
                  ["Database", "Connected", "Healthy"],
                  ["Error Rate", "0.18%", "Healthy"],
                ].map(([name, value, status]) => (
                  <div
                    key={name}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">
                      {name}
                    </p>

                    <p className="mt-3 text-2xl font-bold">
                      {value}
                    </p>

                    <p className="mt-3 text-sm text-green-600">
                      ● {status}
                    </p>
                  </div>
                ))}

              </div>
            )}

            {/* AUDIT LOGS */}
            {activeSection === "Audit Logs" && (
              <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="text-lg font-semibold">
                  Audit Log
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Recent platform activities
                </p>

                <div className="mt-6 space-y-3">

                  {[
                    "Sarah Johnson updated FINRA-2210 rule",
                    "Michael Chen reviewed Investment Agreement",
                    "Emily Davis requested reviewer access",
                    "Admin changed AI validation feature flag",
                    "Robert Wilson account was suspended",
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4"
                    >
                      <p className="font-medium">
                        {activity}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {index + 1} minutes ago
                      </p>
                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* FEATURE FLAGS */}
            {activeSection === "Feature Flags" && (
              <div className="grid gap-5 md:grid-cols-3">

                {[
                  {
                    key: "aiValidation" as const,
                    title: "AI Substring Validation",
                    description:
                      "Enable AI-powered validation checks.",
                  },
                  {
                    key: "piiMasking" as const,
                    title: "Presidio PII Masking",
                    description:
                      "Mask personally identifiable information.",
                  },
                  {
                    key: "precedentLookup" as const,
                    title: "Precedent Lookup",
                    description:
                      "Enable regulatory precedent search.",
                  },
                ].map((flag) => (
                  <div
                    key={flag.key}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >
                    <h3 className="font-semibold">
                      {flag.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {flag.description}
                    </p>

                    <button
                      onClick={() => toggleFlag(flag.key)}
                      className={`mt-6 rounded-full px-5 py-2 text-sm font-semibold ${
                        flags[flag.key]
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {flags[flag.key] ? "ON" : "OFF"}
                    </button>
                  </div>
                ))}

              </div>
            )}

          </div>
        </section>
      </div>

      {/* PERMISSION MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  User Permissions
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedUser.name}
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="text-xl text-slate-400"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">

              {[
                "Read",
                "Write",
                "Approve",
                "Admin",
              ].map((permission) => (
                <label
                  key={permission}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <span>{permission}</span>
                  <input
                    type="checkbox"
                    defaultChecked={permission === "Read"}
                  />
                </label>
              ))}

            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Save Permissions
            </button>

          </div>
        </div>
      )}

    </main>
  );
}