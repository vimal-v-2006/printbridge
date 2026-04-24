import { DragEvent, useEffect, useMemo, useState } from "react";

type Agent = {
  id: string;
  name: string;
  host: string;
  ipAddress: string;
  status: "online" | "offline";
  lastSeenAt: string;
};

type Printer = {
  id: string;
  agentId: string;
  name: string;
  isDefault: boolean;
  status: "idle" | "busy" | "offline";
};

type Job = {
  id: string;
  status: string;
  fileName: string;
  printerName: string;
  error?: string;
  updatedAt: string;
};

type UploadResponse = {
  fileName?: string;
  fileUrl?: string;
  mimeType?: string;
  error?: string;
};

const BACKEND_HOST = window.location.hostname === "localhost" ? "192.168.0.148" : window.location.hostname || "localhost";
const API_BASE = `http://${BACKEND_HOST}:4000`;
const LIVE_WINDOW_MS = 2 * 60 * 1000;

export function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedPrinterId, setSelectedPrinterId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copies, setCopies] = useState(1);
  const [message, setMessage] = useState("Ready");

  const liveAgents = useMemo(() => {
    const cutoff = Date.now() - LIVE_WINDOW_MS;
    return agents.filter((agent) => Date.parse(agent.lastSeenAt) >= cutoff);
  }, [agents]);

  const selectedPrinter = useMemo(
    () => printers.find((printer) => printer.id === selectedPrinterId),
    [printers, selectedPrinterId],
  );

  const activeAgents = liveAgents.filter((agent) => agent.status === "online").length;

  useEffect(() => {
    void refreshAgents();
    void refreshJobs();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshAgents();
      void refreshJobs();
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedAgentId) {
      setPrinters([]);
      setSelectedPrinterId("");
      return;
    }
    void refreshPrinters(selectedAgentId);
  }, [selectedAgentId]);

  useEffect(() => {
    if (!liveAgents.some((agent) => agent.id === selectedAgentId)) {
      setSelectedAgentId(liveAgents[0]?.id || "");
    }
  }, [liveAgents, selectedAgentId]);

  async function refreshAgents() {
    const response = await fetch(`${API_BASE}/agents`);
    const data = (await response.json()) as Agent[];
    setAgents(data);
  }

  async function refreshPrinters(agentId: string) {
    const response = await fetch(`${API_BASE}/agents/${agentId}/printers`);
    const data = (await response.json()) as Printer[];
    setPrinters(data);
    setSelectedPrinterId((current) => {
      if (data.some((printer) => printer.id === current)) return current;
      return data[0]?.id || "";
    });
  }

  async function refreshJobs() {
    const response = await fetch(`${API_BASE}/jobs`);
    const data = (await response.json()) as Job[];
    setJobs(data);
  }

  function handleFilePicked(nextFile: File | null) {
    if (!nextFile) return;
    if (nextFile.type && nextFile.type !== "application/pdf") {
      setMessage("Please choose a PDF file.");
      return;
    }
    setFile(nextFile);
    setMessage(`Ready to print ${nextFile.name}`);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragActive(false);
    handleFilePicked(event.dataTransfer.files?.[0] || null);
  }

  async function handlePrint() {
    if (!file || !selectedAgentId || !selectedPrinter) {
      setMessage("Pick a printer and a PDF first.");
      return;
    }

    setBusy(true);
    setMessage("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(`${API_BASE}/jobs/upload`, {
        method: "POST",
        body: formData,
      });

      const upload = (await uploadResponse.json()) as UploadResponse;
      if (!uploadResponse.ok) {
        throw new Error(upload.error || "Upload failed");
      }
      if (!upload.fileUrl || !upload.fileName || !upload.mimeType) {
        throw new Error("Upload response was incomplete");
      }

      const normalizedFileUrl = new URL(upload.fileUrl, API_BASE);
      normalizedFileUrl.hostname = BACKEND_HOST;
      const resolvedFileUrl = normalizedFileUrl.toString();

      setMessage("Creating print job...");

      const jobResponse = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          printerId: selectedPrinter.id,
          printerName: selectedPrinter.name,
          agentId: selectedAgentId,
          fileName: upload.fileName,
          fileUrl: resolvedFileUrl,
          mimeType: upload.mimeType,
          settings: {
            copies,
            colorMode: "color",
            orientation: "portrait",
            duplex: "none",
            paperSize: "A4",
          },
        }),
      });

      if (!jobResponse.ok) {
        throw new Error("Failed to create print job");
      }

      setMessage(`Queued ${file.name} for ${selectedPrinter.name}`);
      setFile(null);
      const input = document.getElementById("file-input") as HTMLInputElement | null;
      if (input) input.value = "";
      await refreshJobs();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="card hero">
        <div>
          <p className="eyebrow">PrintBridge</p>
          <h1>Minimal network printing</h1>
          <p className="subtle">Pick a discovered printer, drop in a PDF, and send it.</p>
        </div>
        <div className="hero-meta">
          <div className="hero-stat">
            <strong>{activeAgents}</strong>
            <span>active agents</span>
          </div>
          <div className="hero-stat">
            <strong>{printers.length}</strong>
            <span>printers ready</span>
          </div>
        </div>
      </div>

      <div className="inline-status" aria-live="polite">
        <span className="inline-status-label">Status</span>
        <span>{message}</span>
      </div>

      <section className="card upload-card stack">
        <div className="upload-header">
          <p className="eyebrow">Upload</p>
          <h2>Drop your PDF here</h2>
          <p className="subtle">Basic default printing. Pick a printer, upload a PDF, done.</p>
        </div>

        <label
          className={dragActive ? "upload-dropzone drag-active" : "upload-dropzone"}
          htmlFor="file-input"
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            id="file-input"
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFilePicked(e.target.files?.[0] || null)}
          />
          <span className="upload-title">{file ? file.name : "Drop PDF or click to browse"}</span>
          <span className="upload-subtle">Standard print flow only</span>
        </label>

        <button className="primary upload-action" disabled={busy || !file || !selectedPrinterId || !selectedAgentId} onClick={handlePrint}>
          {busy ? "Working..." : "Print PDF"}
        </button>
      </section>

      <div className="grid">
        <section className="card stack">
          <h2>Printer</h2>

          <label className="field">
            <span>Agent</span>
            <select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)}>
              {liveAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} · {agent.host}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Printer</span>
            <select value={selectedPrinterId} onChange={(e) => setSelectedPrinterId(e.target.value)}>
              {printers.map((printer) => (
                <option key={printer.id} value={printer.id}>
                  {printer.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Copies</span>
            <input
              className="text-input"
              type="number"
              min={1}
              max={99}
              value={copies}
              onChange={(e) => setCopies(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
            />
          </label>

          <p className="subtle small-note">Page selection is not shown yet because the current default-print engine can’t enforce custom ranges reliably across different PDF handlers.</p>
        </section>

        <section className="card stack">
          <h2>Recent jobs</h2>
          <div className="jobs">
            {jobs.length === 0 ? <p className="subtle">No jobs yet.</p> : null}
            {jobs.map((job) => (
              <div key={job.id} className="job-row">
                <div className="job-main">
                  <strong>{job.fileName}</strong>
                  <p>{job.printerName}</p>
                </div>
                <div className="job-side">
                  <div className={`job-badge status-${job.status}`}>{job.status}</div>
                  {job.error ? <div className="job-error">{job.error}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
