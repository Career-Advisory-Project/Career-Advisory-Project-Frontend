import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/layout/Navbar";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PinoLog {
  level: number;
  time: number;
  pid?: number;
  hostname?: string;
  cmuitaccount?: string;
  method?: string;
  url?: string;
  status?: number;
  msg?: string;
  date?: string;
  [key: string]: unknown;
}

interface ParsedLog {
  raw: string;
  parsed: PinoLog | null;
  timestamp: Date | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LEVEL_MAP: Record<number, string> = {
  10: "TRACE",
  20: "DEBUG",
  30: "INFO",
  40: "WARN",
  50: "ERROR",
  60: "FATAL",
};

const levelBadge = (level: number) => {
  const label = LEVEL_MAP[level] ?? `LVL${level}`;
  const colors: Record<string, string> = {
    TRACE: "bg-gray-200 text-gray-700",
    DEBUG: "bg-blue-100 text-blue-700",
    INFO: "bg-green-100 text-green-700",
    WARN: "bg-yellow-100 text-yellow-800",
    ERROR: "bg-red-100 text-red-700",
    FATAL: "bg-red-600 text-white",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
        colors[label] ?? "bg-gray-200 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};

const statusBadge = (status: number) => {
  let color = "bg-green-100 text-green-700";
  if (status >= 400 && status < 500) color = "bg-yellow-100 text-yellow-800";
  if (status >= 500) color = "bg-red-100 text-red-700";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${color}`}
    >
      {status}
    </span>
  );
};

const methodBadge = (method: string) => {
  const colors: Record<string, string> = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-orange-500",
    PATCH: "bg-yellow-500",
    DELETE: "bg-red-500",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white ${
        colors[method] ?? "bg-gray-500"
      }`}
    >
      {method}
    </span>
  );
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

/* ------------------------------------------------------------------ */
/*  Docker log line parser                                             */
/*  Docker multiplexed stream: first 8 bytes are a header              */
/*  We strip non-printable characters and parse JSON lines             */
/* ------------------------------------------------------------------ */

function parseDockerLogs(text: string): ParsedLog[] {
  // Docker logs API returns lines with an 8-byte header prepended
  // Strip non-printable characters (except newlines/tabs)
  const cleaned = text.replace(/[^\x20-\x7E\n\r\t\u0080-\uFFFF]/g, "");
  const lines = cleaned.split("\n").filter((l) => l.trim().length > 0);

  return lines.map((raw) => {
    // Try to find JSON object in the line
    const jsonStart = raw.indexOf("{");
    if (jsonStart === -1) return { raw, parsed: null, timestamp: null };

    try {
      const json = JSON.parse(raw.slice(jsonStart)) as PinoLog;
      const timestamp = json.time ? new Date(json.time) : null;
      return { raw: raw.slice(jsonStart), parsed: json, timestamp };
    } catch {
      return { raw, parsed: null, timestamp: null };
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const LogPage = () => {
  const [logs, setLogs] = useState<ParsedLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerId, setContainerId] = useState<string | null>(null);
  const [containerName, setContainerName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tailCount, setTailCount] = useState(200);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [sortDesc] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- Find backend container ---- */
  const findBackendContainer = useCallback(async () => {
    try {
      const res = await fetch("/docker-api/containers/json");
      if (!res.ok) throw new Error(`Docker API error: ${res.status}`);
      const containers = (await res.json()) as Array<{
        Id: string;
        Names: string[];
        State: string;
      }>;

      const backend = containers.find((c) =>
        c.Names.some((n) => n.toLowerCase().includes("backend"))
      );

      if (!backend) throw new Error("Backend container not found");

      setContainerId(backend.Id);
      setContainerName(backend.Names[0]?.replace(/^\//, "") ?? backend.Id.slice(0, 12));
      return backend.Id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find backend container");
      return null;
    }
  }, []);

  /* ---- Fetch logs ---- */
  const fetchLogs = useCallback(
    async (cid?: string | null) => {
      const id = cid ?? containerId;
      if (!id) return;

      try {
        const res = await fetch(
          `/docker-api/containers/${id}/logs?stdout=1&stderr=1&tail=${tailCount}&timestamps=0`
        );
        if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`);

        const text = await res.text();
        const parsed = parseDockerLogs(text);
        setLogs(parsed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch logs");
      } finally {
        setIsLoading(false);
      }
    },
    [containerId, tailCount]
  );

  /* ---- Init: find container + first fetch ---- */
  useEffect(() => {
    (async () => {
      const id = await findBackendContainer();
      if (id) await fetchLogs(id);
    })();
  }, [findBackendContainer, fetchLogs]);

  /* ---- Auto-refresh ---- */
  useEffect(() => {
    if (autoRefresh && containerId) {
      intervalRef.current = setInterval(() => fetchLogs(), 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, containerId, fetchLogs]);

  /* ---- Filter logs ---- */
  const filteredLogs = logs
  .filter((log) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    if (log.parsed) {
      const { method, url, status, msg, cmuitaccount, date } = log.parsed;
      return (
        (method?.toLowerCase().includes(s) ?? false) ||
        (url?.toLowerCase().includes(s) ?? false) ||
        (status?.toString().includes(s) ?? false) ||
        (msg?.toLowerCase().includes(s) ?? false) ||
        (cmuitaccount?.toLowerCase().includes(s) ?? false) ||
        (date?.toLowerCase().includes(s) ?? false) ||
        log.raw.toLowerCase().includes(s)
      );
    }
    return log.raw.toLowerCase().includes(s);
  })
  .sort((a, b) => {
    const ta = a.timestamp?.getTime() ?? 0;
    const tb = b.timestamp?.getTime() ?? 0;
    return sortDesc ? tb - ta : ta - tb;
  });

  /* ---- Render ---- */
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex justify-center py-[35px] flex-1">
        <div className="bg-white flex flex-col w-full max-w-[1240px] h-[calc(100vh-180px)] rounded-lg px-4 py-6 sm:px-[50px] sm:py-8 shadow-[0px_4px_4px_0px_#00000040]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#5D4685]">
                Logs
              </h1>
              {containerName && (
                <p className="text-sm text-gray-500 mt-1">
                  Container:{" "}
                  <span className="font-mono text-gray-700">
                    {containerName}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Tail count */}
              <select
                value={tailCount}
                onChange={(e) => setTailCount(Number(e.target.value))}
                className="bg-[#EFEFEF] rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#5D4685] cursor-pointer"
              >
                <option value={50}>Last 50</option>
                <option value={100}>Last 100</option>
                <option value={200}>Last 200</option>
                <option value={500}>Last 500</option>
              </select>

              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
                  autoRefresh
                    ? "bg-[#5D4685] text-white"
                    : "bg-[#EFEFEF] text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    autoRefresh ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                />
                {autoRefresh ? "Live" : "Paused"}
              </button>

              {/* Manual refresh */}
              <button
                onClick={() => fetchLogs()}
                className="bg-[#5D4685] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#4a386a] transition-colors cursor-pointer"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search logs by method, URL, status, or message..."
              className="w-full bg-[#EFEFEF] border-none rounded-sm px-4 py-2 italic text-gray-500 outline-none focus:ring-1 focus:ring-[#5D4685]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Log viewer */}
          <div className="flex flex-col flex-1 overflow-hidden rounded border border-[#B9B9B9] bg-white">
            {/* Table header */}
            <div className="flex bg-[#EFEFEF] px-4 py-2 text-sm font-semibold text-gray-700 shrink-0">
              <div className="w-[85px]">Date</div>
              <div className="w-[85px]">Time</div>
              <div className="w-[65px]">Level</div>
              <div className="w-[70px]">Method</div>
              <div className="flex-1 min-w-0">URL</div>
              <div className="w-[180px] shrink-0">Caller</div>
              <div className="w-[65px] text-center">Status</div>
            </div>

            {/* Log entries */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto font-mono text-sm"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-full text-gray-500 py-10">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#5D4685] border-t-transparent rounded-full animate-spin" />
                    Loading logs...
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center h-full text-red-500 py-10 px-4 gap-3">
                  <p className="text-center font-sans text-base">{error}</p>
                  <p className="text-center font-sans text-sm text-gray-500">
                    Make sure you're running via{" "}
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded">
                      docker compose up
                    </code>
                  </p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500 py-10 font-sans">
                  No logs found.
                </div>
              ) : (
                filteredLogs.map((log, idx) => {
                  const p = log.parsed;
                  const isExpanded = expandedIdx === idx;

                  if (!p) {
                    // Raw unparsed line
                    return (
                      <div
                        key={idx}
                        className="px-4 py-2 border-b border-gray-100 text-gray-600 text-xs break-all hover:bg-gray-50"
                      >
                        {log.raw}
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="border-b border-gray-100">
                      <div
                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-[#f9f7fc] transition-colors"
                        onClick={() =>
                          setExpandedIdx(isExpanded ? null : idx)
                        }
                      >
                        <div className="w-[85px] text-gray-500 text-xs shrink-0">
                          {p.date ?? (log.timestamp ? formatDate(log.timestamp) : "—")}
                        </div>
                        <div className="w-[85px] text-gray-500 text-xs shrink-0">
                          {log.timestamp ? formatTime(log.timestamp) : "—"}
                        </div>
                        <div className="w-[65px] shrink-0">
                          {levelBadge(p.level)}
                        </div>
                        <div className="w-[70px] shrink-0">
                          {p.method ? methodBadge(p.method) : "—"}
                        </div>
                        <div className="flex-1 min-w-0 truncate text-gray-800 text-xs px-1">
                          {p.url ?? p.msg ?? "—"}
                        </div>
                        <div className="w-[180px] shrink-0 text-xs text-gray-500 truncate px-2">
                          {p.cmuitaccount ?? "—"}
                        </div>
                        <div className="w-[65px] text-center shrink-0">
                          {p.status ? statusBadge(p.status) : "—"}
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="px-4 py-3 bg-[#faf9fc] border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2 font-sans">
                            {log.timestamp && (
                              <span>
                                {formatDate(log.timestamp)}{" "}
                                {formatTime(log.timestamp)}
                              </span>
                            )}
                            {p.pid != null && <span>PID: {String(p.pid)}</span>}
                            {p.hostname && (
                              <span>Host: {String(p.hostname)}</span>
                            )}
                          </div>
                          <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded overflow-x-auto max-h-[300px] overflow-y-auto">
                            {JSON.stringify(p, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between bg-[#EFEFEF] px-4 py-1.5 text-xs text-gray-500 shrink-0 font-sans">
              <span>
                {filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""}
                {searchTerm && ` (filtered from ${logs.length})`}
              </span>
              <span>
                {autoRefresh && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Auto-refreshing every 5s
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogPage;
